---
fileID: spring-data-reference-mapping-document
title: Document
weight: 4105
description: 
layout: default
---
## Annotation @Document

The annotations `@Document` applied to a class marks this class as a candidate for mapping to the database. The most relevant parameter is `value` to specify the collection name in the database. The annotation `@Document` specifies the collection type to `DOCUMENT`.

{{< tabs >}}
{{% tab name="java" %}}
```java
@Document(value="persons")
public class Person {
  ...
}
```
{{% /tab %}}
{{< /tabs >}}

## Spring Expression support

Spring Data ArangoDB supports the use of SpEL expressions within `@Document#value`. This feature lets you define a dynamic collection name which can be used to implement multi tenancy applications.

{{< tabs >}}
{{% tab name="Java" %}}
```Java
@Component
public class TenantProvider {

	public String getId() {
		// threadlocal lookup
	}

}
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="java" %}}
```java
@Document("#{tenantProvider.getId()}_persons")
public class Person {
  ...
}
```
{{% /tab %}}
{{< /tabs >}}

## Annotation @From and @To

With the annotations `@From` and `@To` applied on a collection or array field in a class annotated with `@Document` the nested edge objects are fetched from the database. Each of the nested edge objects has to be stored as separate edge document in the edge collection described in the `@Edge` annotation of the nested object class with the _\_id_ of the parent document as field _\_from_ or _\_to_.

{{< tabs >}}
{{% tab name="java" %}}
```java
@Document("persons")
public class Person {
  @From
  private List<Relation> relations;
}

@Edge(name="relations")
public class Relation {
  ...
}
```
{{% /tab %}}
{{< /tabs >}}

The database representation of `Person` in collection _persons_ looks as follow:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "_key" : "123",
  "_id" : "persons/123"
}
```
{{% /tab %}}
{{< /tabs >}}

and the representation of `Relation` in collection _relations_:

{{< tabs >}}
{{% tab name="" %}}
```
{
  "_key" : "456",
  "_id" : "relations/456",
  "_from" : "persons/123"
  "_to" : ".../..."
}
{
  "_key" : "789",
  "_id" : "relations/456",
  "_from" : "persons/123"
  "_to" : ".../..."
}
...
```
{{% /tab %}}
{{< /tabs >}}

**Note**: Since arangodb-spring-data 3.0.0 the annotations `@From` and `@To` also work on non-collection/non-array fields. If multiple edges are linked with the entity, it is not guaranteed that the same edge is returned every time. Use at your own risk.
