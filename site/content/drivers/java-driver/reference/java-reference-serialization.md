---
fileID: java-reference-serialization
title: Serialization
weight: 3970
description: 
layout: default
---
While older versions of the driver used mapping features provided by the
`velocypack` library, nowadays it is recommended to use
[jackson-dataformat-velocypack](https://github.com/arangodb/jackson-dataformat-velocypack),
which is a VelocyPack dataformat backend for [Jackson](https://github.com/FasterXML/jackson),
supporting the Streaming, Data Binding and Tree Model API styles.

## Import in maven

To add it to your maven project, add the following to `pom.xml`:

{{< tabs >}}
{{% tab name="XML" %}}
```XML
<dependencies>
    <dependency>
        <groupId>com.arangodb</groupId>
        <artifactId>jackson-dataformat-velocypack</artifactId>
        <version>...</version>
    </dependency>
</dependencies>
```
{{% /tab %}}
{{< /tabs >}}

The package also depends on `jackson-core`, `jackson-databind` and
`jackson-annotations` packages, but when using build tools like Maven or
Gradle, dependencies are automatically included. You may however want to
use [jackson-bom](https://github.com/FasterXML/jackson-bom)
to ensure dependency convergence across the entire project, for example in case
there are in your project other libraries depending on different versions of
the same Jackson packages.

{{< tabs >}}
{{% tab name="XML" %}}
```XML
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.fasterxml.jackson</groupId>
            <artifactId>jackson-bom</artifactId>
            <version>...</version>
            <scope>import</scope>
            <type>pom</type>
        </dependency>
    </dependencies>
</dependencyManagement>
```
{{% /tab %}}
{{< /tabs >}}

`jackson-dataformat-velocypack` is compatible with Jackson 2.10, 2.11, 2.12, and 2.13.

## Configure

Create an instance of `ArangoJack`, optionally configure the underlying
`ObjectMapper` and pass it to the driver through
`ArangoDB.Builder.serializer(ArangoSerialization)`:

{{< tabs >}}
{{% tab name="Java" %}}
```Java
ArangoJack arangoJack = new ArangoJack();
arangoJack.configure((mapper) -> {
    // your configuration here
});
ArangoDB arango = new ArangoDB.Builder()
    .serializer(arangoJack)
    // ...
    .build();
```
{{% /tab %}}
{{< /tabs >}}

where the lambda argument `mapper` is an instance of `VPackMapper`, subclass
of `ObjectMapper`. See
[Jackson Databind](https://github.com/FasterXML/jackson-databind/wiki/JacksonFeatures)
configurable features.

## Mapping API

The library is fully compatible with [Jackson Databind](https://github.com/FasterXML/jackson-databind)
API. To customize the serialization and deserialization behavior using the
Jackson Data Binding API, entities can be annotated with
[Jackson Annotations](https://github.com/FasterXML/jackson-annotations).
For more advanced customizations refer to [Custom serializer](#custom-serializer) section.

### Renaming Properties

To use a different serialized name for a field, use the annotation
`@JsonProperty`.

{{< tabs >}}
{{% tab name="Java" %}}
```Java
public class MyObject {

    @JsonProperty("title")
    private String name;

    // ...
}
```
{{% /tab %}}
{{< /tabs >}}

### Ignoring properties

To ignore fields use the annotation `@JsonIgnore`.

{{< tabs >}}
{{% tab name="Java" %}}
```Java
public class Value {
    @JsonIgnore
    public int internalValue;
}
```
{{% /tab %}}
{{< /tabs >}}

## Custom serializer

The serialization and deserialization can be customized using the lower level
Streaming API or the Tree Model API, creating and registering respectively
`JsonSerializer<T>` and `JsonDeserializer<T>`, as specified by the Jackson API
for [CustomSerializers](https://github.com/FasterXML/jackson-docs/wiki/JacksonHowToCustomSerializers).

{{< tabs >}}
{{% tab name="Java" %}}
```Java
static class PersonSerializer extends JsonSerializer<Person> {
    @Override
    public void serialize(Person value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        // example using the Streaming API
        gen.writeStartObject();
        gen.writeFieldName("name");
        gen.writeString(value.name);
        gen.writeEndObject();
    }
}

static class PersonDeserializer extends JsonDeserializer<Person> {
    @Override
    public Person deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException {
        // example using the Tree Model API
        Person person = new Person();
        JsonNode rootNode = parser.getCodec().readTree(parser);
        JsonNode nameNode = rootNode.get("name");
        if (nameNode != null && nameNode.isTextual()) {
            person.name = nameNode.asText();
        }
        return person;
    }
}

// registering using annotation
@JsonSerialize(using = PersonSerializer.class)
public static class Person {
    public String name;
}

// ...

// registering programmatically
ArangoJack arangoJack = new ArangoJack();
arangoJack.configure((mapper) -> {
    SimpleModule module = new SimpleModule("PersonModule");
    module.addDeserializer(Person.class, new PersonDeserializer());
    mapper.registerModule(module);
});
ArangoDB arangoDB = new ArangoDB.Builder().serializer(arangoJack).build();
```
{{% /tab %}}
{{< /tabs >}}

## Jackson datatype and language modules

The `VPackMapper` can be configured
with [Jackson datatype modules](https://github.com/FasterXML/jackson#third-party-datatype-modules)
as well as [Jackson JVM Language modules](https://github.com/FasterXML/jackson#jvm-language-modules).

### Kotlin

[Kotlin language module](https://github.com/FasterXML/jackson-module-kotlin)
enables support for Kotlin native types and can be registered in the following way:

{{< tabs >}}
{{% tab name="kotlin" %}}
```kotlin
val arangoDB = ArangoDB.Builder()
    .serializer(ArangoJack().apply {
        configure { it.registerModule(KotlinModule()) }
    })
    .build()
```
{{% /tab %}}
{{< /tabs >}}

### Scala

[Scala language module](https://github.com/FasterXML/jackson-module-scala)
enables support for Scala native types and can be registered in the following way:

{{< tabs >}}
{{% tab name="scala" %}}
```scala
val arangoJack = new ArangoJack()
arangoJack.configure(mapper => mapper.registerModule(DefaultScalaModule))

val arangoDB = new ArangoDB.Builder()
  .serializer(arangoJack)
  .build()
```
{{% /tab %}}
{{< /tabs >}}

### Java 8 types

Support for Java 8 features is offered by
[jackson-modules-java8](https://github.com/FasterXML/jackson-modules-java8).

### Joda types

Support for Joda data types, such as DateTime, is offered by
[jackson-datatype-joda](https://github.com/FasterXML/jackson-datatype-joda).

## Metadata fields

To map Arango metadata fields (like `_id`, `_key`, `_rev`, `_from`, `_to`) in
your entities, use the annotation `DocumentField`.

{{< tabs >}}
{{% tab name="Java" %}}
```Java
public class MyObject {

  @DocumentField(Type.KEY)
  private String key;
  
  // ...
}
```
{{% /tab %}}
{{< /tabs >}}

## Manual serialization

To de-/serialize from and to VelocyPack before or after a database call, use the
`ArangoUtil` from the method `util()` in `ArangoDB`, `ArangoDatabase`,
`ArangoCollection`, `ArangoGraph`, `ArangoEdgeCollection`or `ArangoVertexCollection`.

{{< tabs >}}
{{% tab name="Java" %}}
```Java
ArangoDB arangoDB=new ArangoDB.Builder();
        VPackSlice vpack=arangoDB.util(CUSTOM).serialize(myObj);
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="Java" %}}
```Java
ArangoDB arangoDB=new ArangoDB.Builder();
        MyObject myObj=arangoDB.util(CUSTOM).deserialize(vpack,MyObject.class);
```
{{% /tab %}}
{{< /tabs >}}
