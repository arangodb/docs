---
fileID: java-getting-started
title: ArangoDB Java Driver - Getting Started
weight: 3930
description: 
layout: default
---
## Supported versions

Only the latest version of this driver is maintained to support the most recent
ArangoDB server features. 
It is compatible with all supported stable versions of ArangoDB server, see 
[Product Support End-of-life Announcements](https://www.arangodb.com/eol-notice).

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

## GraalVM Native Image

The driver supports GraalVM Native Image generation since version `6.6.1`.
The related configuration can be found here:

- [native-image](https://github.com/arangodb/arangodb-java-driver/tree/master/src/main/resources/META-INF/native-image)

### Quarkus and Helidon support

The driver can be used from Quarkus and Helidon applications and does not
require any additional configuration for GraalVM native image generation.
Examples can be found here:

- [arango-quarkus-native-example](https://github.com/arangodb-helper/arango-quarkus-native-example)
- [arango-helidon-native-example](https://github.com/arangodb-helper/arango-helidon-native-example)
