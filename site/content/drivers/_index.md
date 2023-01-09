---
fileID: index
title: ArangoDB  Drivers Documentation
weight: 3835
description: 
layout: default
---
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
[ArangoDB Java driver](java-driver/) | Java | [github.com/arangodb/arangodb-java-driver](https://github.com/arangodb/arangodb-java-driver) | [Changelog](https://github.com/arangodb/arangodb-java-driver/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}
[ArangoJS](arangojs-javascript-driver/) | JavaScript | [github.com/arangodb/arangojs](https://github.com/arangodb/arangojs) | [Changelog](https://github.com/arangodb/arangojs/blob/main/CHANGELOG.md#readme){:target="_blank" class="no-wrap"}
[ArangoDB PHP](arangodb-php/) | PHP | [github.com/arangodb/arangodb-php](https://github.com/arangodb/arangodb-php) | [Changelog](https://github.com/arangodb/arangodb-php/blob/devel/CHANGELOG.md#readme){:target="_blank" class="no-wrap"}
[Go driver](arangodb-go-driver/) | Go | [github.com/arangodb/go-driver](https://github.com/arangodb/go-driver) | [Changelog](https://github.com/arangodb/go-driver/blob/master/CHANGELOG.md#readme){:target="_blank" class="no-wrap"}
[C#/.NET driver](arangodb-csharpdotnet-driver/) | C# | [github.com/ArangoDB-Community/arangodb-net-standard](https://github.com/ArangoDB-Community/arangodb-net-standard) | [Changelog](https://github.com/ArangoDB-Community/arangodb-net-standard/blob/master/ChangeLog.md){:target="_blank" class="no-wrap"}

## Integrations

Name | Language | Repository | &nbsp;
:----|:---------|:-----------|:------
[Spring Data](spring-data-arangodb/) | Java | [github.com/arangodb/spring-data](https://github.com/arangodb/spring-data) | [Changelog](https://github.com/arangodb/spring-data/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}
[ArangoDB Datasource for Apache Spark](spark-connector-new) | Scala, Java, Python, R | [github.com/arangodb/arangodb-spark-datasource](https://github.com/arangodb/arangodb-spark-datasource){:target="_blank" class="no-wrap"} | [Changelog](https://github.com/arangodb/arangodb-spark-datasource/blob/main/ChangeLog.md){:target="_blank" class="no-wrap"}
[ArangoDB-Spark-Connector](arangodb-spark-connector/) | Scala, Java | [github.com/arangodb/arangodb-spark-connector](https://github.com/arangodb/arangodb-spark-connector) | [Changelog](https://github.com/arangodb/arangodb-spark-connector/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}

## Community drivers

Please note that this list is not exhaustive.

Name | Language | Repository
:----|:---------|:----------
Arangoex | Elixir | [github.com/austinsmorris/arangoex](https://github.com/austinsmorris/arangoex)
Arangox | Elixir | [github.com/ArangoDB-Community/arangox](https://github.com/ArangoDB-Community/arangox)
aranGO | Go | [github.com/diegogub/aranGO](https://github.com/diegogub/aranGO)
aranGoDriver | Go | [github.com/TobiEiss/aranGoDriver](https://github.com/TobiEiss/aranGoDriver)
arangolite | Go | [github.com/solher/arangolite](https://github.com/solher/arangolite)
pyArango | Python | [github.com/ArangoDB-Community/pyArango](https://github.com/ArangoDB-Community/pyArango)
python-arango | Python | [github.com/ArangoDB-Community/python-arango](https://github.com/ArangoDB-Community/python-arango)
aioarango | Python | [github.com/mirrorrim/aioarango](https://github.com/mirrorrim/aioarango)
aioarangodb | Python | [github.com/getflaps/aioarangodb](https://github.com/getflaps/aioarangodb)
Proteus | Scala | [github.com/CharlesAHunt/proteus](https://github.com/CharlesAHunt/proteus)
avokka | Scala | [github.com/avokka/avokka](https://github.com/avokka/avokka)
arangodb-scala-driver | Scala | [github.com/acme-software/arangodb-scala-driver](https://github.com/acme-software/arangodb-scala-driver)
Scarango | Scala | [github.com/outr/scarango](https://github.com/outr/scarango)
aRango-Driver | R | [gitlab.com/krpack/arango-driver](https://gitlab.com/krpack/arango-driver)
ArangoDB PHP ODM | PHP | [github.com/lucassouzavieira/arangodb-php-odm](https://github.com/lucassouzavieira/arangodb-php-odm)
arangodb-php-client | PHP | [github.com/LaravelFreelancerNL/arangodb-php-client](https://github.com/LaravelFreelancerNL/arangodb-php-client)
dotnet-arangodb | C# / .NET | [github.com/coronabytes/dotnet-arangodb](https://github.com/coronabytes/dotnet-arangodb)
arangoclient.net | C# / .NET | [github.com/ra0o0f/arangoclient.net](https://github.com/ra0o0f/arangoclient.net)
dotnet-arangodb | C# / .NET | [github.com/coronabytes/dotnet-arangodb](https://github.com/coronabytes/dotnet-arangodb)
arango-driver _(fork of ArangoRB)_ | Ruby | [github.com/isomorfeus/arango-driver](https://github.com/isomorfeus/arango-driver)
Perl5 Arango-Tango | Ruby | [gitlab.com/ambs/perl5-arango-tango](https://gitlab.com/ambs/perl5-arango-tango)
arangors | Rust | [github.com/fMeow/arangors](https://github.com/fMeow/arangors)
Tash | C++ | [gitlab.com/neel.basu/tash](https://gitlab.com/neel.basu/tash)
erlArango | Erlang | [github.com/ErlGameWorld/erlArango](https://github.com/ErlGameWorld/erlArango)
eArango | Erlang | [github.com/ErlGameWorld/eArango](https://github.com/ErlGameWorld/eArango)
darango | Dart | [github.com/BastienFerbu/darango](https://github.com/BastienFerbu/darango)
arango-dart | Dart | [github.com/xtyxtyx/arango-dart](https://github.com/xtyxtyx/arango-dart)

## Community integrations and libraries

Please note that this list is not exhaustive.

Name | Environment | Language | Repository
:----|:------------|:---------|:----------
Eclipse JNoSQL | Jakarta NoSQL | Java | [github.com/eclipse/jnosql-diana-driver/tree/master/arangodb-driver](https://github.com/eclipse/jnosql-diana-driver/tree/master/arangodb-driver)
arangodb-tinkerpop-provider | Gremlin | Java | [github.com/ArangoDB-Community/arangodb-tinkerpop-provider](https://github.com/ArangoDB-Community/arangodb-tinkerpop-provider)
arangodb-graphql-java | GraphQL | Java | [github.com/ArangoDB-Community/arangodb-graphql-java](https://github.com/ArangoDB-Community/arangodb-graphql-java)
Kafka Connect ArangoDB | Kafka | Java | [github.com/jaredpetersen/kafka-connect-arangodb](https://github.com/jaredpetersen/kafka-connect-arangodb)
ArangoDb Camel | Camel | Java | [camel.apache.org/components/latest/arangodb-component.html](https://camel.apache.org/components/latest/arangodb-component.html)
Micronaut ArangoDB | Mirconaut | Java | [github.com/GoodforGod/micronaut-arangodb](https://github.com/GoodforGod/micronaut-arangodb)
ArangoDB TestContainers | Testcontainers | Java | [github.com/GoodforGod/arangodb-testcontainers](https://github.com/GoodforGod/arangodb-testcontainers)
Write-Ahead-Log Client in Java |  | Java | [github.com/stackmagic/arangodb-wal-client](https://github.com/stackmagic/arangodb-wal-client)
ArangoBee data migration tool |  | Java | [github.com/cmoine/arangobee](https://github.com/cmoine/arangobee){:target=_blank"}
cruddl | GraphQL | JavaScript | [github.com/AEB-labs/cruddl](https://github.com/AEB-labs/cruddl)
feathers-arangodb | Feathers | JavaScript | [github.com/AnatidaeProject/feathers-arangodb](https://github.com/AnatidaeProject/feathers-arangodb)
orango | Node.js, Foxx, browser | JavaScript | [github.com/roboncode/orango](https://github.com/roboncode/orango)
Hemera-arango-store | Hemera | JavaScript | [github.com/hemerajs/hemera-arango-store](https://github.com/hemerajs/hemera-arango-store)
ArangoDB.Ecto | Ecto | Elixir | [github.com/ArangoDB-Community/arangodb_ecto](https://github.com/ArangoDB-Community/arangodb_ecto)
Python ORM Layer for ArangoDB |  | Python | [github.com/threatify/arango-orm](https://github.com/threatify/arango-orm)
Arangodantic | Pydantic | Python | [github.com/digitalliving/arangodantic](https://github.com/digitalliving/arangodantic)
arangodol |  | Python | [github.com/i2mint/arangodol](https://github.com/i2mint/arangodol)
Aranguent | Laravel | PHP | [github.com/LaravelFreelancerNL/laravel-arangodb](https://github.com/LaravelFreelancerNL/laravel-arangodb)
MopArangoDbBundle | Symfony2 | PHP | [github.com/m0ppers/MopArangoDbBundle](https://github.com/m0ppers/MopArangoDbBundle)
arangoq: a query builder layer |  | Rust | [github.com/element114/arangoq](https://github.com/element114/arangoq)
Aragog: A fully featured ODM and OGM library for ArangoDB |  | Rust | [aragog.rs](https://aragog.rs/)
GORM Arango Driver | GORM | Go | [github.com/joselitofilho/gorm-arango](https://github.com/joselitofilho/gorm-arango)
Apache Spline: Data lineage tracking solution that uses ArangoDB for storage | Apache Spark | Scala | [github.com/AbsaOSS/spline](https://github.com/AbsaOSS/spline)

## Community projects

Please note that this list is not exhaustive.

Name | Environment | Language | Repository
:----|:------------|:---------|:----------
Fasty: CMS based on OpenResty / Lapis & ArangoDB | NodeJS | JavaScript | [github.com/solisoft/fasty](https://github.com/solisoft/fasty)
foxxy: Create your app with ArangoDB Foxx RiotJS UIKIT3 Brunch Yarn | Foxx | JavaScript | [github.com/solisoft/foxxy](https://github.com/solisoft/foxxy)
RecallGraph: A versioning data store for time-variant graph data | Foxx | JavaScript | [github.com/RecallGraph/RecallGraph](https://github.com/RecallGraph/RecallGraph)
ArangoDb.Net.Identity: .NET Core Identity library for ArangoDB | .NET | C# | [github.com/endpointsystems/ArangoDB.Net.Identity](https://github.com/endpointsystems/ArangoDB.Net.Identity)
Docker Swarm example configuration | Docker Swarm |  | [github.com/dumstruck/arango-swarm](https://github.com/dumstruck/arango-swarm)
Intellij plugin for AQL, ArangoDB language support | Intellij | Java | [github.com/ArangoDB-Community/aql-intellij-plugin](https://github.com/ArangoDB-Community/aql-intellij-plugin)
