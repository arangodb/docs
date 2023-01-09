---
fileID: spring-data-getting-started
title: 
weight: 3975
description: 
layout: default
---
## Supported versions

Spring Data ArangoDB is compatible with all supported stable versions of ArangoDB server, see 
[Product Support End-of-life Announcements](https://www.arangodb.com/eol-notice).

## Maven

To use Spring Data ArangoDB in your project, your build automation tool needs to
be configured to include and use the Spring Data ArangoDB dependency.
Example with Maven (substitute `x.x.x` with the latest Spring Data ArangoDB version):

{{< tabs >}}
{{% tab name="xml" %}}
```xml
<dependency>
  <groupId>com.arangodb</groupId>
  <artifactId>arangodb-spring-data</artifactId>
  <version>x.x.x</version>
</dependency>
```
{{% /tab %}}
{{< /tabs >}}

There is a [demonstration app](https://github.com/arangodb/spring-data-demo), which contains common use cases and examples of how to use Spring Data ArangoDB's functionality.

## Configuration

You can use Java to configure your Spring Data environment as show below. Setting up the underlying driver (`ArangoDB.Builder`) with default configuration automatically loads a properties file `arangodb.properties`, if it exists in the classpath.

{{< tabs >}}
{{% tab name="java" %}}
```java
@Configuration
@EnableArangoRepositories(basePackages = { "com.company.mypackage" })
public class MyConfiguration implements ArangoConfiguration {

  @Override
  public ArangoDB.Builder arango() {
    return new ArangoDB.Builder();
  }

  @Override
  public String database() {
    // Name of the database to be used
    return "example-database";
  }

}
```
{{% /tab %}}
{{< /tabs >}}

The driver is configured with some default values:

| property-key      | description                         | default value |
| ----------------- | ----------------------------------- | ------------- |
| arangodb.host     | ArangoDB host                       | 127.0.0.1     |
| arangodb.port     | ArangoDB port                       | 8529          |
| arangodb.timeout  | socket connect timeout(millisecond) | 0             |
| arangodb.user     | Basic Authentication User           |
| arangodb.password | Basic Authentication Password       |
| arangodb.useSsl   | use SSL connection                  | false         |

To customize the configuration, the parameters can be changed in the Java code.

{{< tabs >}}
{{% tab name="java" %}}
```java
@Override
public ArangoDB.Builder arango() {
  ArangoDB.Builder arango = new ArangoDB.Builder()
    .host("127.0.0.1")
    .port(8529)
    .user("root");
  return arango;
}
```
{{% /tab %}}
{{< /tabs >}}

In addition you can use the _arangodb.properties_ or a custom properties file to supply credentials to the driver.

_Properties file_

{{< tabs >}}
{{% tab name="" %}}
```
arangodb.hosts=127.0.0.1:8529
arangodb.user=root
arangodb.password=
```
{{% /tab %}}
{{< /tabs >}}

_Custom properties file_

{{< tabs >}}
{{% tab name="java" %}}
```java
@Override
public ArangoDB.Builder arango() {
  InputStream in = MyClass.class.getResourceAsStream("my.properties");
  ArangoDB.Builder arango = new ArangoDB.Builder()
    .loadProperties(in);
  return arango;
}
```
{{% /tab %}}
{{< /tabs >}}
