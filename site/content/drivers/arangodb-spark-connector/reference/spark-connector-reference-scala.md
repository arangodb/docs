---
fileID: spark-connector-reference-scala
title: ArangoDB Spark Connector - Scala Reference
weight: 4185
description: 
layout: default
---
{{% hints/info %}}
This library has been deprecated in favor of the new [ArangoDB Datasource for Apache Spark](../../spark-connector-new).
{{% /hints/info %}}

## ArangoSpark.save

{{< tabs >}}
{{% tab name="" %}}
```
ArangoSpark.save[T](rdd: RDD[T], collection: String, options: WriteOptions)
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="" %}}
```
ArangoSpark.save[T](dataset: Dataset[T], collection: String, options: WriteOptions)
```
{{% /tab %}}
{{< /tabs >}}

Save data from rdd or dataset into ArangoDB

**Arguments**

- **rdd** / **dataset**: `RDD[T]` or `Dataset[T]`

  The rdd or dataset with the data to save

- **collection**: `String`

  The collection to save in

- **options**: `WriteOptions`

  - **database**: `String`

    Database to write into

  - **hosts**: `String`

    Alternative hosts to context property `arangodb.hosts`

  - **user**: `String`

    Alternative user to context property `arangodb.user`

  - **password**: `String`

    Alternative password to context property `arangodb.password`

  - **useSsl**: `Boolean`

    Alternative useSsl to context property `arangodb.useSsl`

  - **sslKeyStoreFile**: `String`

    Alternative sslKeyStoreFile to context property `arangodb.ssl.keyStoreFile`

  - **sslPassPhrase**: `String`

    Alternative sslPassPhrase to context property `arangodb.ssl.passPhrase`

  - **sslProtocol**: `String`

    Alternative sslProtocol to context property `arangodb.ssl.protocol`

  - **method**: `WriteOptions.Method`

    Write method to use, it can be one of: 
    - `WriteOptions.INSERT`
    - `WriteOptions.UPDATE`
    - `WriteOptions.REPLACE`

**Examples**

{{< tabs >}}
{{% tab name="Scala" %}}
```Scala
val sc: SparkContext = ...
val documents = sc.parallelize((1 to 100).map { i => MyBean(i) })
ArangoSpark.save(documents, "myCollection", WriteOptions("myDB"))
```
{{% /tab %}}
{{< /tabs >}}

## ArangoSpark.saveDF

{{< tabs >}}
{{% tab name="" %}}
```
ArangoSpark.saveDF(dataframe: DataFrame, collection: String, options: WriteOptions)
```
{{% /tab %}}
{{< /tabs >}}

Save data from dataframe into ArangoDB

**Arguments**

- **dataframe**: DataFrame`

  The dataFrame with the data to save

- **collection**: `String`

  The collection to save in

- **options**: `WriteOptions`

  - **database**: `String`

    Database to write into

  - **hosts**: `String`

    Alternative hosts to context property `arangodb.hosts`

  - **user**: `String`

    Alternative user to context property `arangodb.user`

  - **password**: `String`

    Alternative password to context property `arangodb.password`

  - **useSsl**: `Boolean`

    Alternative useSsl to context property `arangodb.useSsl`

  - **sslKeyStoreFile**: `String`

    Alternative sslKeyStoreFile to context property `arangodb.ssl.keyStoreFile`

  - **sslPassPhrase**: `String`

    Alternative sslPassPhrase to context property `arangodb.ssl.passPhrase`

  - **sslProtocol**: `String`

    Alternative sslProtocol to context property `arangodb.ssl.protocol`

  - **method**: `WriteOptions.Method`

    Write method to use, it can be one of: 
    - `WriteOptions.INSERT`
    - `WriteOptions.UPDATE`
    - `WriteOptions.REPLACE`

**Examples**

{{< tabs >}}
{{% tab name="Scala" %}}
```Scala
val sc: SparkContext = ...
val documents = sc.parallelize((1 to 100).map { i => MyBean(i) })
val sql: SQLContext = SQLContext.getOrCreate(sc);
val df = sql.createDataFrame(documents, classOf[MyBean])
ArangoSpark.saveDF(df, "myCollection", WriteOptions("myDB"))
```
{{% /tab %}}
{{< /tabs >}}

## ArangoSpark.load

{{< tabs >}}
{{% tab name="" %}}
```
ArangoSpark.load[T: ClassTag](sparkContext: SparkContext, collection: String, options: ReadOptions): ArangoRDD[T]
```
{{% /tab %}}
{{< /tabs >}}

Load data from ArangoDB into rdd

**Arguments**

- **sparkContext**: `SparkContext`

  The sparkContext containing the ArangoDB configuration

- **collection**: `String`

  The collection to load data from

- **options**: `ReadOptions`

  - **database**: `String`

    Database to write into

  - **hosts**: `String`

    Alternative hosts to context property `arangodb.hosts`

  - **user**: `String`

    Alternative user to context property `arangodb.user`

  - **password**: `String`

    Alternative password to context property `arangodb.password`

  - **useSsl**: `Boolean`

    Alternative useSsl to context property `arangodb.useSsl`

  - **sslKeyStoreFile**: `String`

    Alternative sslKeyStoreFile to context property `arangodb.ssl.keyStoreFile`

  - **sslPassPhrase**: `String`

    Alternative sslPassPhrase to context property `arangodb.ssl.passPhrase`

  - **sslProtocol**: `String`

    Alternative sslProtocol to context property `arangodb.ssl.protocol`

**Examples**

{{< tabs >}}
{{% tab name="Scala" %}}
```Scala
val sc: SparkContext = ...
val rdd = ArangoSpark.load[MyBean](sc, "myCollection", ReadOptions("myDB"))
```
{{% /tab %}}
{{< /tabs >}}

## ArangoRDD.filter

{{< tabs >}}
{{% tab name="" %}}
```
ArangoRDD.filter(condition: String): ArangoRDD[T]
```
{{% /tab %}}
{{< /tabs >}}

Adds a filter condition. If used multiple times, the conditions will be combined with a logical AND.

**Arguments**

- **condition**: `String`

  The condition for the filter statement. Use `doc` inside to reference the document. e.g. `"doc.name == 'John'"`

**Examples**

{{< tabs >}}
{{% tab name="Scala" %}}
```Scala
val sc: SparkContext = ...
val rdd = ArangoSpark.load[MyBean](sc, "myCollection").filter("doc.name == 'John'")
```
{{% /tab %}}
{{< /tabs >}}

## Spark Streaming Integration

RDDs can also be saved to ArangoDB from Spark Streaming using
[ArangoSpark.save()](#arangosparksave).

**Example**

{{< tabs >}}
{{% tab name="Scala" %}}
```Scala
dStream.foreachRDD(rdd =>
  ArangoSpark.save(rdd, COLLECTION, new WriteOptions().database(DB)))
```
{{% /tab %}}
{{< /tabs >}}
