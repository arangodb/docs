---
layout: default
description: ArangoDB Datasource for Apache Spark allows batch reading and writing Spark DataFrame data
---
# ArangoDB Datasource for Apache Spark

ArangoDB Datasource for Apache Spark allows batch reading and writing Spark DataFrame data from and to ArangoDB, by implementing the Spark Data Source V2 API.

Reading tasks are parallelized according to the number of shards of the related ArangoDB collection, and the writing ones - depending on the source DataFrame partitions. The network traffic is load balanced across the available DB Coordinators.

Filter predicates and column selections are pushed down to the DB by dynamically generating AQL queries, which will fetch only the strictly required data, thus saving network and computational resources both on the Spark and the DB side.

The connector is usable from all the Spark supported client languages: Scala, Python, Java, and R.

This library works with all the non-EOLed [ArangoDB versions](https://www.arangodb.com/subscriptions/end-of-life-notice/).


## Supported versions

There are three variants of this library, each one compatible with different Spark and Scala versions:

- `com.arangodb:arangodb-spark-datasource-2.4_2.11` (Spark 2.4, Scala 2.11)
- `com.arangodb:arangodb-spark-datasource-2.4_2.12` (Spark 2.4, Scala 2.12)
- `com.arangodb:arangodb-spark-datasource-3.1_2.12` (Spark 3.1, Scala 2.12)

In the following sections the `${sparkVersion}` and `${scalaVersion}` placeholders refer to the Spark and Scala versions.


## Setup

To import ArangoDB Datasource for Apache Spark in a maven project:

```xml
  <dependencies>
    <dependency>
      <groupId>com.arangodb</groupId>
      <artifactId>arangodb-spark-datasource-${sparkVersion}_${scalaVersion}</artifactId>
      <version>1.1.0</version>
    </dependency>
  </dependencies>
```

To use in an external Spark cluster, submit your application with the following parameter:

```shell
    --packages="com.arangodb:arangodb-spark-datasource-${sparkVersion}_${scalaVersion}:1.1.0"
```


## General Configuration

- `user`: db user, `root` by default
- `password`: db password
- `endpoints`: list of Coordinators, e.g. `c1:8529,c2:8529` (required)
- `acquireHostList`: acquire the list of all known hosts in the cluster (`true` or `false`), `false` by default
- `protocol`: communication protocol (`vst` or `http`), `http` by default
- `contentType`: content type for driver communication (`json` or `vpack`), `json` by default
- `timeout`: driver connect and request timeout in ms, `60000` by default
- `ssl.enabled`: ssl secured driver connection (`true` or `false`), `false` by default
- `ssl.cert.value`: Base64 encoded certificate
- `ssl.cert.type`: certificate type, `X.509` by default
- `ssl.cert.alias`: certificate alias name, `arangodb` by default
- `ssl.algorithm`: trust manager algorithm, `SunX509` by default
- `ssl.keystore.type`: keystore type, `jks` by default
- `ssl.protocol`: SSLContext protocol, `TLS` by default

### SSL

To use TLS secured connections to ArangoDB, set `ssl.enabled` to `true` and either:
- provide a Base64 encoded certificate as the `ssl.cert.value` configuration entry and optionally set `ssl.*` or
- start the Spark driver and workers with a properly configured [JVM default TrustStore](https://spark.apache.org/docs/latest/security.html#ssl-configuration)

### Supported deployment topologies

The connector can work with a single server, a cluster and active failover deployments of ArangoDB.


## Batch Read

The connector implements support for batch reading from an ArangoDB collection. 

```scala
val df: DataFrame = spark.read
  .format("com.arangodb.spark")
  .options(options) // Map[String, String]
  .schema(schema) // StructType
  .load()
```

The connector can read data from:
- a collection
- an AQL cursor (query specified by the user)

When reading data from a **collection**, the reading job is split into many Spark tasks, one for each shard in the ArangoDB source collection. The resulting Spark DataFrame has the same number of partitions as the number of shards in the ArangoDB collection, each one containing data from the respective collection shard. The reading tasks consist of AQL queries that are load balanced across all the available ArangoDB Coordinators. Each query is related to only one shard, therefore it will be executed locally in the DB-Server holding the related shard.

When reading data from an **AQL cursor**, the reading job cannot be partitioned or parallelized, so it will be less scalable. This mode can be used for reading data coming from different tables, i.e. resulting from an AQL traversal query.

**Example**

```scala
val spark: SparkSession = SparkSession.builder()
  .appName("ArangoDBSparkDemo")
  .master("local[*]")
  .config("spark.driver.host", "127.0.0.1")
  .getOrCreate()

val df: DataFrame = spark.read
  .format("com.arangodb.spark")
  .options(Map(
    "password" -> "test",
    "endpoints" -> "c1:8529,c2:8529,c3:8529",
    "table" -> "users"
  ))
  .schema(new StructType(
    Array(
      StructField("likes", ArrayType(StringType, containsNull = false)),
      StructField("birthday", DateType, nullable = true),
      StructField("gender", StringType, nullable = false),
      StructField("name", StructType(
        Array(
          StructField("first", StringType, nullable = true),
          StructField("last", StringType, nullable = false)
        )
      ), nullable = true)
    )
  ))
  .load()

usersDF.filter(col("birthday") === "1982-12-15").show()
```

### Read Configuration

- `database`: database name, `_system` by default
- `table`: datasource ArangoDB collection name, ignored if `query` is specified. Either `table` or `query` is required.
- `query`: custom AQL read query. If set, `table` will be ignored. Either `table` or `query` is required.
- `batchSize`: reading batch size, `10000` by default
- `sampleSize`: sample size prefetched for schema inference, only used if read schema is not provided, `1000` by default
- `fillBlockCache`: specifies whether the query should store the data it reads in the RocksDB block cache (`true` or `false`), `false` by default
- `stream`: specifies whether the query should be executed lazily, `true` by default
- `mode`: allows setting a mode for dealing with corrupt records during parsing:
  - `PERMISSIVE` : win case of a corrupted record, the malformed string is put into a field configured by 
    `columnNameOfCorruptRecord`, and sets malformed fields to null. To keep corrupt records, a user can set a string 
    type field named `columnNameOfCorruptRecord` in a user-defined schema. If a schema does not have the field, it drops 
    corrupt records during parsing. When inferring a schema, it implicitly adds the `columnNameOfCorruptRecord` field in
    an output schema
  - `DROPMALFORMED`: ignores the whole corrupted records
  - `FAILFAST`: throws an exception in case of corrupted records
- `columnNameOfCorruptRecord`: allows renaming the new field having malformed string created by the `PERMISSIVE` mode

### Predicate and Projection Pushdown

The connector can convert some Spark SQL filter predicates into AQL predicates and push their execution down to the data source. In this way, ArangoDB can apply the filters and return only the matching documents.

The following filter predicates (implementations of `org.apache.spark.sql.sources.Filter`) are pushed down:
- `And`
- `Or`
- `Not`
- `EqualTo`
- `EqualNullSafe`
- `IsNull`
- `IsNotNull`
- `GreaterThan`
- `GreaterThanOrEqualFilter`
- `LessThan`
- `LessThanOrEqualFilter`
- `StringStartsWithFilter`
- `StringEndsWithFilter`
- `StringContainsFilter`
- `InFilter`

Furthermore, the connector will push down the subset of columns required by the Spark query, so that only the relevant documents fields will be returned.

Predicate and projection pushdowns are only performed while reading an ArangoDB collection (set by the `table` configuration parameter). In case of a batch read from a custom query (set by the `query` configuration parameter), no pushdown optimizations are performed.

### Read Resiliency

The data of each partition is read using an AQL cursor. If any error occurs, the read task of the related partition will fail. Depending on the Spark configuration, the task could be retried.


## Batch Write

The connector implements support for batch writing to ArangoDB collection.

```scala
import org.apache.spark.sql.DataFrame

val df: DataFrame = //...
df.write
  .format("com.arangodb.spark")
  .mode(SaveMode.Append)
  .options(Map(
    "password" -> "test",
    "endpoints" -> "c1:8529,c2:8529,c3:8529",
    "table" -> "users"
  ))
  .save()
```

Write tasks are load balanced across the available ArangoDB Coordinators. The data saved into the ArangoDB is sharded according to the related target collection definition and is different from the Spark DataFrame partitioning.

### Write Configuration

- `table`: target ArangoDB collection name (required)
- `batchSize`: writing batch size, `10000` by default
- `table.shards`: number of shards of the created collection (in case of the `Append` or `Overwrite` SaveMode)
- `table.type`: type (`document` or `edge`) of the created collection (in case of the `Append` or `Overwrite` SaveMode), `document` by default
- `waitForSync`: specifies whether to wait until the documents have been synced to disk (`true` or `false`), `false` by default
- `confirmTruncate`: confirms to truncate table when using the `Overwrite` SaveMode, `false` by default
- `overwriteMode`: configures the behavior in case a document with the specified `_key` value already exists
  - `ignore`: it will not be written
  - `replace`: it will be overwritten with the specified document value
  - `update`: it will be patched (partially updated) with the specified document value. The overwrite mode can be 
    further controlled via the `keepNull` and `mergeObjects` parameter. `keepNull` will also be automatically set to
    `true`, so that null values are kept in the saved documents and not used to remove existing document fields (as for
    default ArangoDB upsert behavior).
  - `conflict` (default): return a unique constraint violation error so that the insert operation fails
- `mergeObjects`: in case `overwriteMode` is set to `update`, controls whether objects (not arrays) will be merged.
  - `true` (default): objects will be merged
  - `false`: existing document fields will be overwritten
- `keepNull`: in case `overwriteMode` is set to `update`
  - `true` (default): `null` values are saved within the document (by default)
  - `false`: `null` values are used to delete the corresponding existing attributes

### SaveMode

On writing, `org.apache.spark.sql.SaveMode` is used to specify the expected behavior in case the target collection already exists.  

Spark 2.4 implementation supports all save modes with the following semantics:
- `Append`: the target collection is created if it does not exist.
- `Overwrite`: the target collection is created if it does not exist, otherwise it is truncated. Use it in combination with the
  `confirmTruncate` write configuration parameter.
- `ErrorIfExists`: the target collection is created if it does not exist, otherwise an `AnalysisException` is thrown.
- `Ignore`: the target collection is created if it does not exist, otherwise no write is performed.

Spark 3.1 implementation supports:
- `Append`: the target collection is created if it does not exist.
- `Overwrite`: the target collection is created if it does not exist, otherwise it is truncated. Use it in combination with the
  `confirmTruncate` write configuration parameter.

In Spark 3.1, save modes `ErrorIfExists` and `Ignore` behave the same as `Append`.

Use the `overwriteMode` write configuration parameter to specify the documents overwrite behavior (in case a document with the same `_key` already exists).

### Write Resiliency

The data of each partition is saved in batches using the ArangoDB API for [inserting multiple documents]
(../http/document-working-with-documents.html#create-multiple-documents).
This operation is not atomic, therefore some documents could be successfully written to the database, while others could fail. To make the job more resilient to temporary errors (i.e. connectivity problems), in case of failure the request will be retried (with another coordinator) if the configured `overwriteMode` allows idempotent requests, namely: 
- `replace`
- `ignore`
- `update` with `keep.null=true`

These configurations of `overwriteMode` are also compatible with speculative execution of tasks.

A failing batch-saving request is retried once for every Coordinator. After that, if still failing, the write task for the related partition is aborted. According to the Spark configuration, the task can be retried and rescheduled on a different executor, if the `overwriteMode` allows idempotent requests (as described above).

If a task ultimately fails and is aborted, the entire write job will be aborted as well. Depending on the `SaveMode` configuration, the following cleanup operations will be performed:
- `Append`: no cleanup is performed and the underlying data source may require manual cleanup. 
  `DataWriteAbortException` is thrown.
- `Overwrite`: the target collection will be truncated.
- `ErrorIfExists`: the target collection will be dropped.
- `Ignore`: if the collection did not exist before, it will be dropped; otherwise, nothing will be done.

### Write Limitations

- Batch writes are not performed atomically, so sometimes (i.e. in case of `overwrite.mode: conflict`) several documents in the batch may be written and others may return an exception (i.e. due to a conflicting key). 
- Writing records with the `_key` attribute is only allowed on collections sharded by `_key`. 
- In case of the `Append` save mode, failed jobs cannot be rolled back and the underlying data source may require manual cleanup.
- Speculative execution of tasks would only work for idempotent `overwriteMode` configurations. See [Write Resiliency](#write-resiliency) for more details.


## Supported Spark data types

The following Spark SQL data types (subtypes of `org.apache.spark.sql.types.Filter`) are supported for reading, writing and filter pushdown.

- Numeric types:
  - `ByteType`
  - `ShortType`
  - `IntegerType`
  - `LongType`
  - `FloatType`
  - `DoubleType`

- String types:
  - `StringType`

- Boolean types:
  - `BooleanType`

- Datetime types:
  - `TimestampType`
  - `DateType`

- Complex types:
  - `ArrayType`
  - `MapType` (only with key type `StringType`)
  - `StructType`


## Connect to ArangoDB Oasis

To connect to SSL secured deployments using X.509 Base64 encoded CA certificate (Oasis):

```scala
  val options = Map(
  "database" -> "<dbname>",
  "user" -> "<username>",
  "password" -> "<passwd>",
  "endpoints" -> "<endpoint>:<port>",
  "ssl.cert.value" -> "<base64 encoded CA certificate>",
  "ssl.enabled" -> "true",
  "table" -> "<table>"
)

// read
val myDF = spark.read
        .format("com.arangodb.spark")
        .options(options)
        .load()

// write
import org.apache.spark.sql.DataFrame
val df: DataFrame = //...
df.write
          .format("com.arangodb.spark")
          .options(options)
          .save()
```


## Current limitations

- For `contentType=vpack`, implicit deserialization casts don't work well, i.e. reading a document having a field with a numeric value whereas the related read schema requires a string value for such a field.
- Dates and timestamps fields are interpreted to be in a UTC time zone.
- In Spark 2.4, for corrupted records in batch reading, partial results are not supported. All fields other than the field configured by `columnNameOfCorruptRecord` are set to `null` (SPARK-26303).
- In read jobs using `stream=true` (default), possible AQL warnings are only logged at the end of each read task (BTS-671).
- Spark SQL `DecimalType` fields are not supported in write jobs when using `contentType=json`.
- Spark SQL `DecimalType` values are written to the database as strings.

## Demo

Check out our [demo](https://github.com/arangodb/arangodb-spark-datasource/tree/main/demo) to learn more about ArangoDB Datasource for Apache Spark.

