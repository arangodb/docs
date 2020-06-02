---
layout: default
description: Getting started with the ArangoDB Java Driver
---
# ArangoDB Java Driver - Getting Started

## Supported versions

Only the latest version of this driver is maintained to support the most recent
ArangoDB server features. It is compatible with the latest 3 minor releases of
the ArangoDB server (versions 3.3, 3.4 and 3.5).

The minimum required Java version is 1.8+ (since driver version 6.x.x).

## Maven

To add the driver to your project with maven, add the following code to your
pom.xml (substitute `x.x.x` with the latest driver version):

```XML
<dependencies>
  <dependency>
    <groupId>com.arangodb</groupId>
    <artifactId>arangodb-java-driver</artifactId>
    <version>x.x.x</version>
  </dependency>
</dependencies>
```

## Compile the Java Driver

```
mvn clean install -DskipTests=true -Dgpg.skip=true -Dmaven.javadoc.skip=true -B
```
