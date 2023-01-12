---
layout: default
description: Together with the ArangoDB community we provide drivers for many languages. Our official language drivers are Java, JavaScript, PHP and GO.
title: Install Official Drivers, Integrations and Community Drivers
page-toc:
  disable: true
---
# ArangoDB {{ site.data.versions[page.version.name] }} Drivers Documentation

ArangoDB drivers are interfaces between programming languages and ArangoDB,
which enable programmers to connect to and manipulate ArangoDB deployments from
within native language programs. From a language perspective, documents and
database structures can be integrated with data types and their methods.
The precise mapping of concepts and methods depends on the capabilities and
practices of each language.

Programming is a powerful way of automating interactions and control of the
database, as well as to integrate database operations into your own software.
The status of the drivers below varies from supported to community contributions.

## Official drivers

Name | Language | Repository | &nbsp;
:----|:---------|:-----------|:------
[ArangoDB Java driver](java.html) | Java | [github.com/arangodb/arangodb-java-driver](https://github.com/arangodb/arangodb-java-driver){:target="_blank"} | [Changelog](https://github.com/arangodb/arangodb-java-driver/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}
[ArangoJS](js.html) | JavaScript | [github.com/arangodb/arangojs](https://github.com/arangodb/arangojs){:target="_blank"} | [Changelog](https://github.com/arangodb/arangojs/blob/main/CHANGELOG.md#readme){:target="_blank" class="no-wrap"}
[ArangoDB PHP](php.html) | PHP | [github.com/arangodb/arangodb-php](https://github.com/arangodb/arangodb-php){:target="_blank"} | [Changelog](https://github.com/arangodb/arangodb-php/blob/devel/CHANGELOG.md#readme){:target="_blank" class="no-wrap"}
[Go driver](go.html) | Go | [github.com/arangodb/go-driver](https://github.com/arangodb/go-driver){:target="_blank"} | [Changelog](https://github.com/arangodb/go-driver/blob/master/CHANGELOG.md#readme){:target="_blank" class="no-wrap"}
[C#/.NET driver](dotnet.html) | C# | [github.com/ArangoDB-Community/arangodb-net-standard](https://github.com/ArangoDB-Community/arangodb-net-standard){:target="_blank"} | [Changelog](https://github.com/ArangoDB-Community/arangodb-net-standard/blob/master/ChangeLog.md){:target="_blank" class="no-wrap"}
Python-Arango | Python | [github.com/ArangoDB-Community/python-arango](https://github.com/ArangoDB-Community/python-arango){:target="_blank"} | [Releases](https://github.com/ArangoDB-Community/python-arango/releases){:target="_blank" class="no-wrap"}

## Integrations

Name | Language | Repository | &nbsp;
:----|:---------|:-----------|:------
[Spring Data](spring-data.html) | Java | [github.com/arangodb/spring-data](https://github.com/arangodb/spring-data){:target="_blank"} | [Changelog](https://github.com/arangodb/spring-data/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}
[ArangoDB Datasource for Apache Spark](spark-connector-new.html) | Scala, Java, Python, R | [github.com/arangodb/arangodb-spark-datasource](https://github.com/arangodb/arangodb-spark-datasource){:target="_blank" class="no-wrap"} | [Changelog](https://github.com/arangodb/arangodb-spark-datasource/blob/main/ChangeLog.md){:target="_blank" class="no-wrap"}
[ArangoDB-Spark-Connector](spark-connector.html) | Scala, Java | [github.com/arangodb/arangodb-spark-connector](https://github.com/arangodb/arangodb-spark-connector){:target="_blank"} | [Changelog](https://github.com/arangodb/arangodb-spark-connector/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}
