---
layout: default
description: ArangoDB Spark Datasource allows batch reading and writing Spark DataFrame data
---
arangodb-spark-datasource
=========================

## Overview

ArangoDB Spark Datasource allows batch reading and writing Spark DataFrame data from and to ArangoDB, by implementing the Spark Data Source V2 API.

Reading tasks are parallelized according to the number of shards of the related ArangoDB collection, and the writing ones depending on the source Dataframe partitions. The network traffic is heavenly load balanced across the available DB coordinators.

Filter predicates and column selections are pushed down to the DB by dynamically generating AQL queries which will fetch only the strictly required data, thus saving network and computational resources both on the Spark and the DB side.

The connector is usable from all the Spark supported client languages, namely Scala, Python, Java, and R.

This library works with all the non-EOLed ArangoDB versions,
see [link](https://www.arangodb.com/subscriptions/end-of-life-notice/).


## Supported versions

There are 3 variants of this library, each one compatible with different Spark and Scala versions:

- `com.arangodb:arangodb-spark-datasource-2.4_2.11` (Spark 2.4, Scala 2.11)
- `com.arangodb:arangodb-spark-datasource-2.4_2.12` (Spark 2.4, Scala 2.12)
- `com.arangodb:arangodb-spark-datasource-3.1_2.12` (Spark 3.1, Scala 2.12)

In the following sections the placeholders `${sparkVersion}` and `${scalaVersion}` refer to the Spark and Scala versions.


## Setup

To import ArangoDB Spark Datasource in a maven project:

```xml
  <dependencies>
    <dependency>
      <groupId>com.arangodb</groupId>
      <artifactId>arangodb-spark-datasource-${sparkVersion}_${scalaVersion}</artifactId>
      <version>1.0.0</version>
    </dependency>
  </dependencies>
```

To use in external Spark cluster, submit your application with the following parameter:

```shell
    --packages="com.arangodb:arangodb-spark-datasource-${sparkVersion}_${scalaVersion}:1.0.0"
```


## General Configuration

- `user`: db user, default `root`
- `password`: db password
- `endpoints`: list of coordinators, eg. `c1:8529,c2:8529` (required)
- `acquireHostList`: acquire the list of all known hosts in the cluster (`true` or `false`), default `false`
- `protocol`: communication protocol (`vst` or `http`), default `http`
- `contentType`: content type for driver communication (`json` or `vpack`), default `json`
- `ssl.enabled`: ssl secured driver connection (`true` or `false`), default `false`
- `ssl.cert.value`: base64 encoded certificate
- `ssl.cert.type`: certificate type, default `X.509`
- `ssl.cert.alias`: certificate alias name, default `arangodb`
- `ssl.algorithm`: trust manager algorithm, default `SunX509`
- `ssl.keystore.type`: keystore type, default `jks`
- `ssl.protocol`: SSLContext protocol, default `TLS`

### SSL

To use TLS secured connections to ArangoDB, set `ssl.enabled` to `true` and either:
- provide base64 encoded certificate as `ssl.cert.value` configuration entry and optionally set `ssl.*`, or
- start Spark driver and workers with properly configured JVM default TrustStore, see 
  [link](https://spark.apache.org/docs/latest/security.html#ssl-configuration)

### Supported deployment topologies

The connector can work with single server, cluster and active failover deployments of ArangoDB.


## Batch Read

The connector implements support to batch reading from ArangoDB collection. 

```scala
val df: DataFrame = spark.read
  .format("com.arangodb.spark")
  .options(options) // Map[String, String]
  .schema(schema) // StructType
  .load()
```

The connector can read data either from:
- a collection
- an AQL cursor (query specified by the user)

When reading data from a **collection**, the reading job is split into many Spark tasks, one for each shard in the ArangoDB source collection. The resulting Spark dataframe has the same number of partitions as the number of shards in the ArangoDB collection, each one containing the data of the respective collection shard. The reading tasks are load balanced across all the available ArangoDB coordinators and each task will hit only one db server, the one holding the related shard. The data is read through an AQL query, submitted supplying the related shard id in the `shardIds` option, so that it will be executed locally in the dbserver holding the shard and will return only data from that shard.

When reading data from an **AQL cursor**, the reading job cannot be neither partitioned nor parallelized, so it will be less scalable. This mode can be used for reading data coming from different tables, i.e. resulting from an AQL traversal query.

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

- `database`: database name, default `_system`
- `table`: datasource ArangoDB collection name, ignored if `query` is specified. Either `table` or `query` is required.
- `query`: custom AQL read query. If set, `table` will be ignored. Either `table` or `query` is required.
- `batchSize`: reading batch size, default `10000`
- `sampleSize`: sample size prefetched for schema inference, only used if read schema is not provided, default `1000`
- `fillBlockCache`: whether the query should store the data it reads in the RocksDB block cache (`true` or `false`), default `false`
- `stream`: whether the query should be executed lazily, default `true`
- `mode`: allows a mode for dealing with corrupt records during parsing:
  - `PERMISSIVE` : when it meets a corrupted record, puts the malformed string into a field configured by 
    `columnNameOfCorruptRecord`, and sets malformed fields to null. To keep corrupt records, a user can set a string 
    type field named `columnNameOfCorruptRecord` in a user-defined schema. If a schema does not have the field, it drops 
    corrupt records during parsing. When inferring a schema, it implicitly adds a `columnNameOfCorruptRecord` field in
    an output schema
  - `DROPMALFORMED`: ignores the whole corrupted records
  - `FAILFAST`: throws an exception when it meets corrupted records
- `columnNameOfCorruptRecord`: allows renaming the new field having malformed string created by `PERMISSIVE` mode

### Predicate and Projection Pushdown

The connector can convert some Spark SQL filters predicates into AQL predicates and push their execution down to the data source. In this way, ArangoDB can apply the filters and return only the matching documents.

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

Furthermore, the connector will push down also the subset of columns required by the Spark query, so that only the relevant documents fields will be returned.

Predicate and projection pushdowns are only performed while reading an ArangoDB collection (set by `table` configuration parameter). In case of batch read from a custom query (set by `query` configuration parameter), no pushdown optimizations are performed.

### Read Resiliency

The data of each partition is read using an AQL cursor. If any error occurs the read task of the related partition will fail. Depending on the Spark configuration, the task could be retried.


## Batch Write

The connector implements support to batch writing to ArangoDB collection.

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

Write tasks are load balanced across the available ArangoDB coordinators. The data saved into the ArangoDB is sharded according to the related target collection definition and is different from the Spark dataframe partitioning.

### Write Configuration

- `table`: target ArangoDB collection name (required)
- `batchSize`: writing batch size, default `10000`
- `table.shards`: number of shards of the created collection (in case of SaveMode `Append` or `Overwrite`)
- `table.type`: type (`document` or `edge`) of the created collection (in case of SaveMode `Append` or `Overwrite`), default `document`
- `waitForSync`: whether to wait until the documents have been synced to disk (`true` or `false`), default `false`
- `confirmTruncate`: confirm to truncate table when using save mode `Overwrite` mode, default `false`
- `overwriteMode`: configures the behavior in case a document with the specified `_key` value exists already
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
  - `true` (default): `null` values are saved within the document (default)
  - `false`: `null` values are used to delete corresponding existing attributes

### SaveMode

On writing, `org.apache.spark.sql.SaveMode` is used to specify the expected behavior in case the target collection already exists.  

Spark 2.4 implementation supports all save modes with the following semantics:
- `Append`: the target collection is created if it does not exist
- `Overwrite`: the target collection is created if it does not exist, it is truncated otherwise. Use in combination with 
  `confirmTruncate` write configuration parameter.
- `ErrorIfExists`: the target collection is created if it does not exist, an `AnalysisException` is thrown otherwise 
- `Ignore`: the target collection is created if it does not exist, no write is performed otherwise

Spark 3.1 implementation supports:
- `Append`: the target collection is created if it does not exist
- `Overwrite`: the target collection is created if it does not exist, it is truncated otherwise. Use in combination with
  `confirmTruncate` write configuration parameter.

In Spark 3.1, save modes `ErrorIfExists` and `Ignore` behave the same as `Append`.

Use `overwriteMode` write configuration parameter to specify the documents overwrite behavior (in case a document with the same `_key` already exists).

### Write Resiliency

The data of each partition is saved in batches using ArangoDB API for inserting multiple documents
([create multiple documents](https://www.arangodb.com/docs/stable/http/document-working-with-documents.html#create-multiple-documents)).
This operation is not atomic, therefore some documents could be successfully written to the database, while others could fail. To make the job more resilient to temporary errors (i.e. connectivity problems), in case of failure the request will be retried (with another coordinator) if the configured `overwriteMode` allows for idempotent requests, namely: 
- `replace`
- `ignore`
- `update` with `keep.null=true`

These configurations of `overwriteMode` would also be compatible with speculative execution of tasks.

A failing batch-saving request is retried at most once for every coordinator. After that, if still failing, the write task for the related partition is aborted. According to the Spark configuration, the task could be retried and rescheduled on a different executor, if the `overwriteMode` allows for idempotent requests (as above).

If a task ultimately fails and is aborted, the entire write job will be aborted as well. Depending on the `SaveMode` configuration, the following cleanup operations will be performed:
- `Append`: no cleanup is performed and the underlying data source may require manual cleanup. 
  `DataWriteAbortException` is thrown.
- `Overwrite`: the target collection will be truncated
- `ErrorIfExists`: the target collection will be dropped
- `Ignore`: if the collection did not exist before it will be dropped, nothing otherwise

### Write Limitations

- Batch writes are not performed atomically, so in some cases (i.e. in case of `overwrite.mode: conflict`) some documents in the batch may be written and some others may return an exception (i.e. due to conflicting key). 
- Writing records with `_key` attribute is only allowed on collections sharded by `_key`. 
- In case of save mode `Append`, failed jobs cannot be rolled back and the underlying data source may require manual cleanup.
- Speculative execution of tasks would only work for idempotent `overwriteMode` configurations 
  (see [Write Resiliency](#write-resiliency)).


## Supported Spark data types

The following Spark SQL data types (subtypes of `org.apache.spark.sql.types.Filter`) are supported for reading, writing and filter pushdown:
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

To connect to SSL secured deployments using X.509 base64 encoded CA certificate (Oasis):

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

- for `content-type=vpack`, implicit deserialization casts don't work well, i.e. reading a document having a field with   a numeric value whereas the related read schema requires a string value for such field
- dates and timestamps fields are interpreted to be in UTC time zone
- In Spark 2.4, on corrupted records in batch reading, partial results are not supported. All fields other than the field configured by `columnNameOfCorruptRecord` are set to `null` (SPARK-26303)
- in read jobs using `stream=true` (default), possible AQL warnings are only logged at the end of each read task (BTS-671)


