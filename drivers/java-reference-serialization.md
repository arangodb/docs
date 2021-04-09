---
layout: default description: Serialization
---

# Serialization

While older versions of the driver used mapping features provided by the `velocypack` library, nowadays it is
recommended to use [jackson-dataformat-velocypack](https://github.com/arangodb/jackson-dataformat-velocypack), which is
a [Jackson](https://github.com/FasterXML/jackson) extension component for reading and writing VelocyPack and JSON using
the [Jackson Databind API](https://github.com/FasterXML/jackson-databind).

## Import in maven

To add it to your maven project, add the following to `pom.xml`:

```XML

<dependencies>
    <dependency>
        <groupId>com.arangodb</groupId>
        <artifactId>jackson-dataformat-velocypack</artifactId>
        <version>...</version>
    </dependency>
</dependencies>
```

## Usage

Just create an instance of `ArangoJack` and pass it to the driver
through `ArangoDB.Builder.serializer(ArangoSerialization)`.

```java
ArangoDB arango=new ArangoDB.Builder().serializer(new ArangoJack()).build();
```

## Configure

Under the hood `jackson-dataformat-velocypack` extends Jackson `ObjectMapper`, which can be configured in the following
way:

```java
ArangoJack arangoJack=new ArangoJack();
        arangoJack.configure((mapper)->{
        // your configuration here
        });
        ArangoDB arango=new ArangoDB.Builder().serializer(arangoJack).build();
```

where the lambda argument `mapper` is an instance of `VPackMapper`, subclass of `ObjectMapper`.

## Mapping API
TODO

## Custom serializer
TODO

## Jackson datatype and language modules

The `VPackMapper` can be configured
with [Jackson datatype modules](https://github.com/FasterXML/jackson#third-party-datatype-modules)
as well as [Jackson JVM Language modules](https://github.com/FasterXML/jackson#jvm-language-modules).

### Kotlin

[Kotlin language module](https://github.com/FasterXML/jackson-module-kotlin) enables support for Kotlin native types and
can be registered in the following way:

```kotlin
val arangoDB = ArangoDB.Builder()
    .serializer(ArangoJack().apply {
        configure { it.registerModule(KotlinModule()) }
    })
    .build()
```

### Scala

[Scala language module](https://github.com/FasterXML/jackson-module-scala) enables support for Scala native types and
can be registered in the following way:

```scala
val arangoJack = new ArangoJack()
arangoJack.configure(mapper => mapper.registerModule(DefaultScalaModule))

val arangoDB = new ArangoDB.Builder()
  .serializer(arangoJack)
  .build()
```

### Java 8 types

Support for Java 8 features is offered by [jackson-modules-java8](https://github.com/FasterXML/jackson-modules-java8).

### Joda-Time

Support for Joda data types, such as DateTime, is offered
by [jackson-datatype-joda](https://github.com/FasterXML/jackson-datatype-joda).

## Internal fields

To map Arango metadata fields (like `_id`, `_key`, `_rev`, `_from`, `_to`) in your entities, use the
annotation `DocumentField`.

```Java
public class MyObject {

  @DocumentField(Type.KEY)
  private String key;
  
  // ...

}
```

## Manual serialization

To de-/serialize from and to VelocyPack before or after a database call, use the
`ArangoUtil` from the method `util()` in `ArangoDB`, `ArangoDatabase`,
`ArangoCollection`, `ArangoGraph`, `ArangoEdgeCollection`or `ArangoVertexCollection`.

```Java
ArangoDB arangoDB = new ArangoDB.Builder();
VPackSlice vpack = arangoDB.util().serialize(myObj);
```

```Java
ArangoDB arangoDB = new ArangoDB.Builder();
MyObject myObj = arangoDB.util().deserialize(vpack, MyObject.class);
```
