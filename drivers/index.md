---
layout: default
description: >-
  ArangoDB drivers and integrations allow you to use ArangoDB as a database
  system for your applications
---
# ArangoDB Drivers Documentation

{{ page.description }}
{:class="lead"}

## Drivers

Database drivers, also called connectors, adapters, or client libraries, let you
access and manage database systems. ArangoDB drivers are interfaces between
programming languages and ArangoDB, which enable software developers to connect
to and manipulate ArangoDB deployments from within compiled programs or using
scripting languages.

From a language perspective, documents and database structures can be integrated
with data types and their methods. The precise mapping of concepts and methods
depends on the capabilities and practices of each language.

Programming is a powerful way of automating interactions and control of the
database, as well as to integrate database operations into your own software.
The drivers listed below are officially maintained and supported by ArangoDB.
If your programming language or environment is not listed, 

### Java driver

The [**ArangoDB Java driver**](java.html) lets you work with ArangoDB in the
Java programming language.

- Online course: [Java Driver v6 Tutorial](https://university.arangodb.com/courses/java-driver-tutorial-v6/){:target="_blank"}
- Repository: [github.com/arangodb/arangodb-java-driver](https://github.com/arangodb/arangodb-java-driver){:target="_blank"}
- [Changelog](https://github.com/arangodb/arangodb-java-driver/blob/master/ChangeLog.md#readme){:target="_blank"}

### Go driver

The [**Go driver**](go.html) lets you work with ArangoDB in the Go programming
language.

- Tutorial: [Go Driver Tutorial](https://university.arangodb.com/courses/go-driver-tutorial/){:target="_blank"}
- Repository: [github.com/arangodb/go-driver](https://github.com/arangodb/go-driver){:target="_blank"}
- [Changelog](https://github.com/arangodb/go-driver/blob/master/CHANGELOG.md#readme){:target="_blank"}

### C#/.NET driver

The [**arangodb-net-standard driver**](dotnet.html) lets you work with ArangoDB
using the C# programming language and the .NET ecosystem.

- Online course: [C#/.NET Driver Tutorial](https://university.arangodb.com/courses/csharp-dotnet-driver-tutorial/){:target="_blank"}
- Repository: [github.com/ArangoDB-Community/arangodb-net-standard](https://github.com/ArangoDB-Community/arangodb-net-standard){:target="_blank"}
- [Changelog](https://github.com/ArangoDB-Community/arangodb-net-standard/blob/master/ChangeLog.md){:target="_blank"}

### Node.js driver

The [**ArangoJS driver**](js.html) lets you work with ArangoDB in Node.js, using
the JavaScript scripting language. You can also use it in web browsers.

- Repository: [github.com/arangodb/arangojs](https://github.com/arangodb/arangojs){:target="_blank"}
- [Changelog](https://github.com/arangodb/arangojs/blob/main/CHANGELOG.md#readme){:target="_blank"}

### Python driver

The [**Python-Arango**](python.html) driver lets you work with ArangoDB in the
Python scripting language.

- Online course: [Python Driver Tutorial](https://www.arangodb.com/tutorials/tutorial-python/){:target="_blank"}
- Repository: [github.com/ArangoDB-Community/python-arango](https://github.com/ArangoDB-Community/python-arango){:target="_blank"}
- [Releases](https://github.com/ArangoDB-Community/python-arango/releases){:target="_blank"}

## Integrations

Database integrations allow applications to work with different database systems
using a common interface. They are higher-level than database drivers because
they abstract away the details of specific database systems, especially the
low-level network communication.

### Spring Data

The [**Spring Data integration**](spring-data.html) for ArangoDB lets you use
ArangoDB as a database system in Spring-based Java applications.

- Online course: [Spring Data Tutorial](https://university.arangodb.com/courses/spring-data-tutorial){:target="_blank"}
- Repository: [github.com/arangodb/spring-data](https://github.com/arangodb/spring-data){:target="_blank"}
- [Changelog](https://github.com/arangodb/spring-data/blob/master/ChangeLog.md#readme){:target="_blank"}

### Apache Spark

The [**ArangoDB Datasource for Apache Spark**](spark-connector-new.html) is a
library that lets you use Apache Spark with ArangoDB for data processing.
Apache Spark has first-party support for the Scala, Java, Python, and R language.

- Repository: [github.com/arangodb/arangodb-spark-datasource](https://github.com/arangodb/arangodb-spark-datasource){:target="_blank"}
- [Changelog](https://github.com/arangodb/arangodb-spark-datasource/blob/main/ChangeLog.md){:target="_blank"}

The [**ArangoDB-Spark-Connector**](spark-connector.html) is the predecessor of
the ArangoDB Datasource library for the Scala and Java programming languages,
but it is recommended to use the new library instead.

 - Repository: [github.com/arangodb/arangodb-spark-connector](https://github.com/arangodb/arangodb-spark-connector){:target="_blank"}
 - [Changelog](https://github.com/arangodb/arangodb-spark-connector/blob/master/ChangeLog.md#readme){:target="_blank"}
