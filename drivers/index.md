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
[Go driver](go.html) | Go | [github.com/arangodb/go-driver](https://github.com/arangodb/go-driver){:target="_blank"} | [Changelog](https://github.com/arangodb/go-driver/blob/master/CHANGELOG.md#readme){:target="_blank" class="no-wrap"}
[C#/.NET driver](dotnet.html) | C# | [github.com/ArangoDB-Community/arangodb-net-standard](https://github.com/ArangoDB-Community/arangodb-net-standard){:target="_blank"} | [Changelog](https://github.com/ArangoDB-Community/arangodb-net-standard/blob/master/ChangeLog.md){:target="_blank" class="no-wrap"}

## Integrations

Name | Language | Repository | &nbsp;
:----|:---------|:-----------|:------
[Spring Data](spring-data.html) | Java | [github.com/arangodb/spring-data](https://github.com/arangodb/spring-data){:target="_blank"} | [Changelog](https://github.com/arangodb/spring-data/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}
[ArangoDB Datasource for Apache Spark](spark-connector-new.html) | Scala, Java, Python, R | [github.com/arangodb/arangodb-spark-datasource](https://github.com/arangodb/arangodb-spark-datasource){:target="_blank" class="no-wrap"} | [Changelog](https://github.com/arangodb/arangodb-spark-datasource/blob/main/ChangeLog.md){:target="_blank" class="no-wrap"}
[ArangoDB-Spark-Connector](spark-connector.html) | Scala, Java | [github.com/arangodb/arangodb-spark-connector](https://github.com/arangodb/arangodb-spark-connector){:target="_blank"} | [Changelog](https://github.com/arangodb/arangodb-spark-connector/blob/master/ChangeLog.md#readme){:target="_blank" class="no-wrap"}

## Community drivers

Please note that this list is not exhaustive.

Name | Language | Repository
:----|:---------|:----------
Arangoex | Elixir | [github.com/austinsmorris/arangoex](https://github.com/austinsmorris/arangoex){:target="_blank"}
Arangox | Elixir | [github.com/ArangoDB-Community/arangox](https://github.com/ArangoDB-Community/arangox){:target="_blank"}
aranGO | Go | [github.com/diegogub/aranGO](https://github.com/diegogub/aranGO){:target="_blank"}
aranGoDriver | Go | [github.com/TobiEiss/aranGoDriver](https://github.com/TobiEiss/aranGoDriver){:target="_blank"}
arangolite | Go | [github.com/solher/arangolite](https://github.com/solher/arangolite){:target="_blank"}
pyArango | Python | [github.com/ArangoDB-Community/pyArango](https://github.com/ArangoDB-Community/pyArango){:target="_blank"}
python-arango | Python | [github.com/ArangoDB-Community/python-arango](https://github.com/ArangoDB-Community/python-arango){:target="_blank"}
aioarango | Python | [github.com/mirrorrim/aioarango](https://github.com/mirrorrim/aioarango){:target="_blank"}
aioarangodb | Python | [github.com/getflaps/aioarangodb](https://github.com/getflaps/aioarangodb){:target="_blank"}
Proteus | Scala | [github.com/CharlesAHunt/proteus](https://github.com/CharlesAHunt/proteus){:target="_blank"}
avokka | Scala | [github.com/avokka/avokka](https://github.com/avokka/avokka){:target="_blank"}
arangodb-scala-driver | Scala | [github.com/acme-software/arangodb-scala-driver](https://github.com/acme-software/arangodb-scala-driver){:target="_blank"}
Scarango | Scala | [github.com/outr/scarango](https://github.com/outr/scarango){:target="_blank"}
aRango-Driver | R | [gitlab.com/krpack/arango-driver](https://gitlab.com/krpack/arango-driver){:target="_blank"}
ArangoDB PHP ODM | PHP | [github.com/lucassouzavieira/arangodb-php-odm](https://github.com/lucassouzavieira/arangodb-php-odm){:target="_blank"}
arangodb-php-client | PHP | [github.com/LaravelFreelancerNL/arangodb-php-client](https://github.com/LaravelFreelancerNL/arangodb-php-client){:target="_blank"}
dotnet-arangodb | C# / .NET | [github.com/coronabytes/dotnet-arangodb](https://github.com/coronabytes/dotnet-arangodb){:target="_blank"}
arangoclient.net | C# / .NET | [github.com/ra0o0f/arangoclient.net](https://github.com/ra0o0f/arangoclient.net){:target="_blank"}
dotnet-arangodb | C# / .NET | [github.com/coronabytes/dotnet-arangodb](https://github.com/coronabytes/dotnet-arangodb){:target="_blank"}
arango-driver _(fork of ArangoRB)_ | Ruby | [github.com/isomorfeus/arango-driver](https://github.com/isomorfeus/arango-driver){:target="_blank"}
Perl5 Arango-Tango | Ruby | [gitlab.com/ambs/perl5-arango-tango](https://gitlab.com/ambs/perl5-arango-tango){:target="_blank"}
arangors | Rust | [github.com/fMeow/arangors](https://github.com/fMeow/arangors){:target="_blank"}
Tash | C++ | [gitlab.com/neel.basu/tash](https://gitlab.com/neel.basu/tash){:target="_blank"}
erlArango | Erlang | [github.com/ErlGameWorld/erlArango](https://github.com/ErlGameWorld/erlArango){:target="_blank"}
eArango | Erlang | [github.com/ErlGameWorld/eArango](https://github.com/ErlGameWorld/eArango){:target="_blank"}
darango | Dart | [github.com/BastienFerbu/darango](https://github.com/BastienFerbu/darango){:target="_blank"}
arango-dart | Dart | [github.com/xtyxtyx/arango-dart](https://github.com/xtyxtyx/arango-dart){:target="_blank"}

## Community integrations and libraries

Please note that this list is not exhaustive.

Name | Environment | Language | Repository
:----|:------------|:---------|:----------
Eclipse JNoSQL | Jakarta NoSQL | Java | [github.com/eclipse/jnosql-diana-driver/tree/master/arangodb-driver](https://github.com/eclipse/jnosql-diana-driver/tree/master/arangodb-driver){:target="_blank"}
arangodb-tinkerpop-provider | Gremlin | Java | [github.com/ArangoDB-Community/arangodb-tinkerpop-provider](https://github.com/ArangoDB-Community/arangodb-tinkerpop-provider){:target="_blank"}
arangodb-graphql-java | GraphQL | Java | [github.com/ArangoDB-Community/arangodb-graphql-java](https://github.com/ArangoDB-Community/arangodb-graphql-java){:target="_blank"}
Kafka Connect ArangoDB | Kafka | Java | [github.com/jaredpetersen/kafka-connect-arangodb](https://github.com/jaredpetersen/kafka-connect-arangodb){:target="_blank"}
ArangoDb Camel | Camel | Java | [camel.apache.org/components/latest/arangodb-component.html](https://camel.apache.org/components/latest/arangodb-component.html){:target="_blank"}
Micronaut ArangoDB | Mirconaut | Java | [github.com/GoodforGod/micronaut-arangodb](https://github.com/GoodforGod/micronaut-arangodb){:target="_blank"}
ArangoDB TestContainers | Testcontainers | Java | [github.com/GoodforGod/arangodb-testcontainers](https://github.com/GoodforGod/arangodb-testcontainers){:target="_blank"}
Write-Ahead-Log Client in Java |  | Java | [github.com/stackmagic/arangodb-wal-client](https://github.com/stackmagic/arangodb-wal-client){:target="_blank"}
ArangoBee data migration tool |  | Java | [github.com/cmoine/arangobee](https://github.com/cmoine/arangobee){:target=_blank"}
cruddl | GraphQL | JavaScript | [github.com/AEB-labs/cruddl](https://github.com/AEB-labs/cruddl){:target="_blank"}
feathers-arangodb | Feathers | JavaScript | [github.com/AnatidaeProject/feathers-arangodb](https://github.com/AnatidaeProject/feathers-arangodb){:target="_blank"}
orango | Node.js, Foxx, browser | JavaScript | [github.com/roboncode/orango](https://github.com/roboncode/orango){:target="_blank"}
Hemera-arango-store | Hemera | JavaScript | [github.com/hemerajs/hemera-arango-store](https://github.com/hemerajs/hemera-arango-store){:target="_blank"}
ArangoDB.Ecto | Ecto | Elixir | [github.com/ArangoDB-Community/arangodb_ecto](https://github.com/ArangoDB-Community/arangodb_ecto){:target="_blank"}
Python ORM Layer for ArangoDB |  | Python | [github.com/threatify/arango-orm](https://github.com/threatify/arango-orm){:target="_blank"}
Arangodantic | Pydantic | Python | [github.com/digitalliving/arangodantic](https://github.com/digitalliving/arangodantic){:target="_blank"}
arangodol |  | Python | [github.com/i2mint/arangodol](https://github.com/i2mint/arangodol){:target="_blank"}
Aranguent | Laravel | PHP | [github.com/LaravelFreelancerNL/laravel-arangodb](https://github.com/LaravelFreelancerNL/laravel-arangodb){:target="_blank"}
MopArangoDbBundle | Symfony2 | PHP | [github.com/m0ppers/MopArangoDbBundle](https://github.com/m0ppers/MopArangoDbBundle){:target="_blank"}
arangoq: a query builder layer |  | Rust | [github.com/element114/arangoq](https://github.com/element114/arangoq){:target="_blank"}
Aragog: A fully featured ODM and OGM library for ArangoDB |  | Rust | [aragog.rs](https://aragog.rs/){:target="_blank"}
GORM Arango Driver | GORM | Go | [github.com/joselitofilho/gorm-arango](https://github.com/joselitofilho/gorm-arango){:target="_blank"}
Apache Spline: Data lineage tracking solution that uses ArangoDB for storage | Apache Spark | Scala | [github.com/AbsaOSS/spline](https://github.com/AbsaOSS/spline){:target="_blank"}

## Community projects

Please note that this list is not exhaustive.

Name | Environment | Language | Repository
:----|:------------|:---------|:----------
Fasty: CMS based on OpenResty / Lapis & ArangoDB | NodeJS | JavaScript | [github.com/solisoft/fasty](https://github.com/solisoft/fasty){:target="_blank"}
foxxy: Create your app with ArangoDB Foxx RiotJS UIKIT3 Brunch Yarn | Foxx | JavaScript | [github.com/solisoft/foxxy](https://github.com/solisoft/foxxy){:target="_blank"}
RecallGraph: A versioning data store for time-variant graph data | Foxx | JavaScript | [github.com/RecallGraph/RecallGraph](https://github.com/RecallGraph/RecallGraph){:target="_blank"}
ArangoDb.Net.Identity: .NET Core Identity library for ArangoDB | .NET | C# | [github.com/endpointsystems/ArangoDB.Net.Identity](https://github.com/endpointsystems/ArangoDB.Net.Identity){:target="_blank"}
Docker Swarm example configuration | Docker Swarm |  | [github.com/dumstruck/arango-swarm](https://github.com/dumstruck/arango-swarm){:target="_blank"}
Intellij plugin for AQL, ArangoDB language support | Intellij | Java | [github.com/ArangoDB-Community/aql-intellij-plugin](https://github.com/ArangoDB-Community/aql-intellij-plugin){:target="_blank"}
