---
fileID: spark-connector-reference-java
title: ArangoDB Spark Connector - Java Reference
weight: 4095
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
ArangoSpark.save[T](rdd: JavaRDD[T], collection: String, options: WriteOptions)
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

Save data from rdd into ArangoDB

**Arguments**

- **rdd**: `JavaRDD[T]`

  The rdd with the data to save

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
    - `WriteOptions.INSERT$.MODULE$`
    - `WriteOptions.UPDATE$.MODULE$`
    - `WriteOptions.REPLACE$.MODULE$`


**Examples**

{{< tabs >}}
{{% tab name="java" %}}
```java
JavaSparkContext sc = ...
List<MyBean> docs = ...
JavaRDD<MyBean> documents = sc.parallelize(docs);
ArangoSpark.save(documents, "myCollection", new WriteOptions().database("myDB"));
```
{{% /tab %}}
{{< /tabs >}}

**Very Large Datasets**

To prevent errors on very large datasets (over one million objects) use "repartition" for smaller chunks:

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoSpark.save(allEdges.toJSON.repartition(20000), collection = "mio_edges", options = writeOptions)
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
    - `WriteOptions.INSERT$.MODULE$`
    - `WriteOptions.UPDATE$.MODULE$`
    - `WriteOptions.REPLACE$.MODULE$`

**Examples**

{{< tabs >}}
{{% tab name="java" %}}
```java
JavaSparkContext sc = ...
List<MyBean> docs = ...
JavaRDD<MyBean> documents = sc.parallelize(docs);
SQLContext sql = SQLContext.getOrCreate(sc);
DataFrame df = sql.createDataFrame(documents, MyBean.class);
ArangoSpark.saveDF(documents, "myCollection", new WriteOptions().database("myDB"));
```
{{% /tab %}}
{{< /tabs >}}

## ArangoSpark.load

{{< tabs >}}
{{% tab name="" %}}
```
ArangoSparkload[T](sparkContext: JavaSparkContext, collection: String, options: ReadOptions, clazz: Class[T]): ArangoJavaRDD[T]
```
{{% /tab %}}
{{< /tabs >}}

Load data from ArangoDB into rdd

**Arguments**

- **sparkContext**: `JavaSparkContext`

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

- **clazz**: `Class[T]`

  The type of the document

**Examples**

{{< tabs >}}
{{% tab name="java" %}}
```java
JavaSparkContext sc = ...
ArangoJavaRDD<MyBean> rdd = ArangoSpark.load(sc, "myCollection", new ReadOptions().database("myDB"), MyBean.class);
```
{{% /tab %}}
{{< /tabs >}}

## ArangoRDD.filter

{{< tabs >}}
{{% tab name="" %}}
```
ArangoJavaRDD.filter(condition: String): ArangoJavaRDD[T]
```
{{% /tab %}}
{{< /tabs >}}

Adds a filter condition. If used multiple times, the conditions will be combined with a logical AND.

**Arguments**

- **condition**: `String`

  The condition for the filter statement. Use `doc` inside to reference the document. e.g. `"doc.name == 'John'"`

**Examples**

{{< tabs >}}
{{% tab name="java" %}}
```java
JavaSparkContext sc = ...
ArangoJavaRDD<MyBean> rdd = ArangoSpark.load(sc, "myCollection", new ReadOptions().database("myDB"), MyBean.class);
ArangoJavaRDD<MyBean> rddFiltered = rdd.filter("doc.test <= 50");
```
{{% /tab %}}
{{< /tabs >}}

## Spark Streaming Integration

RDDs can also be saved to ArangoDB from Spark Streaming using
[ArangoSpark.save()](#arangosparksave).

**Example**

{{< tabs >}}
{{% tab name="java" %}}
```java
javaDStream.foreachRDD(rdd -> 
    ArangoSpark.save(rdd, COLLECTION, new WriteOptions().database(DB)));
```
{{% /tab %}}
{{< /tabs >}}
