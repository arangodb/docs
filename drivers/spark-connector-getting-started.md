---
layout: default
description: Scala
---
# ArangoDB Spark Connector - Getting Started

## Maven

### Spark 3.X + 2.4.1 and above
```XML
<dependencies>
  <dependency>
    <groupId>com.arangodb</groupId>
    <artifactId>arangodb-spark-connector_2.12</artifactId>
    <version>1.1.0</version>
  </dependency>
	....
</dependencies>
```

### Spark 2.4.0 and below
```XML
<dependencies>
  <dependency>
    <groupId>com.arangodb</groupId>
    <artifactId>arangodb-spark-connector_2.11</artifactId>
    <version>1.1.0</version>
  </dependency>
	....
</dependencies>
```

## SBT

### Spark 3.X + 2.4.1 and above
```Json
libraryDependencies += "com.arangodb" % "arangodb-spark-connector_2.12" % "1.1.0"
```

### Spark 2.4.0 and below
```Json
libraryDependencies += "com.arangodb" % "arangodb-spark-connector_2.11" % "1.1.0"
```

## Configuration

| property-key                   | description                            | default value  |
| ------------------------------ | -------------------------------------- | -------------- |
| arangodb.hosts                 | comma separated list of ArangoDB hosts | 127.0.0.1:8529 |
| arangodb.user                  | basic authentication user              | root           |
| arangodb.password              | basic authentication password          |                |
| arangodb.protocol              | network protocol                       | VST            |
| arangodb.useSsl                | use SSL connection                     | false          |
| arangodb.ssl.keyStoreFile      | SSL certificate keystore file          |                |
| arangodb.ssl.passPhrase        | SSL pass phrase                        |                |
| arangodb.ssl.protocol          | SSL protocol                           | TLS            |
| arangodb.maxConnections        | max number of connections per host     | 1              |
| arangodb.acquireHostList       | auto acquire list of available hosts   | false          |
| arangodb.loadBalancingStrategy | load balancing strategy to be used     | NONE           |

## Setup SparkContext

**Scala**

```Scala
val conf = new SparkConf()
    .set("arangodb.hosts", "127.0.0.1:8529")
    .set("arangodb.user", "myUser")
    .set("arangodb.password", "myPassword")
    ...

val sc = new SparkContext(conf)
```

**Java**

```Java
SparkConf conf = new SparkConf()
    .set("arangodb.hosts", "127.0.0.1:8529")
    .set("arangodb.user", "myUser")
    .set("arangodb.password", "myPassword");
    ...

JavaSparkContext sc = new JavaSparkContext(conf);
```
