---
layout: default
redirect_from:
  - spring-data-getting-started.html # 3.10 -> 3.10
---
# Spring Data ArangoDB

This integration is a library for accessing data stored in ArangoDB in
Spring-based Java application. Spring Data provides a consistent interface for
accessing various types of data sources. Spring Data ArangoDB implements this
for ArangoDB and provides mapping of Java objects to ArangoDB documents (ODM).

- [Spring Data Tutorial](https://university.arangodb.com/courses/spring-data-tutorial){:target="_blank"}
- [Reference](spring-data-reference.html)
- [Migration](spring-data-migration.html)

## Supported versions

Spring Data ArangoDB is compatible with:
- all the still supported Spring Boot (3.x and 2.x) [versions](https://spring.io/projects/spring-boot#support){:target="_blank"}
  and related Spring Framework versions
- all the still supported ArangoDB [versions](https://www.arangodb.com/eol-notice){:target="_blank"}

## Maven

To use Spring Data ArangoDB in your project, your build automation tool needs to
be configured to include and use the Spring Data ArangoDB dependency.
Example with Maven (substitute `x.x.x` with the latest Spring Data ArangoDB version):

```xml
<dependency>
  <groupId>com.arangodb</groupId>
  <artifactId>arangodb-spring-data</artifactId>
  <version>x.x.x</version>
</dependency>
```

There is a [demonstration app](https://github.com/arangodb/spring-data-demo){:target="_blank"}, which contains common
use cases and examples of how to use Spring Data ArangoDB's functionality.

## Configuration

You can use Java to configure your Spring Data environment as show below. Setting up the underlying
driver (`ArangoDB.Builder`) with default configuration automatically loads a properties file `arangodb.properties`, if
it exists in the classpath.

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

The driver configuration can be customized by implementing `ArangoConfiguration#arango()`: 

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

## Spring Boot

Spring Boot support is offered by [Spring Boot Starter ArangoDB](https://github.com/arangodb/spring-boot-starter).

## Learn more

- [Demo](https://github.com/arangodb/spring-data-demo){:target="_blank"}
- [JavaDoc](https://www.javadoc.io/doc/com.arangodb/arangodb-spring-data/latest){:target="_blank"}
- [Changelog](https://github.com/arangodb/spring-data/blob/master/ChangeLog.md#changelog){:target="_blank"}
