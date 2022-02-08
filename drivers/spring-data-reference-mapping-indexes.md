---
layout: default
description: Indexes
---
# Indexes

Indexes can be ensured using the following annotations. For reference see the
[indexing](../indexing.html) documentation
{%- assign ver = "3.5" | version: "!=" %}{% if ver %}
and specific aspects that apply to
[indexes on shards](../architecture-deployment-modes-cluster-sharding.html#indexes-on-shards)
{%- endif -%}.

## Annotation @\<IndexType\>Indexed

With the `@<IndexType>Indexed` annotations user defined indexes can be created at a collection level by annotating single fields of a class.

Possible `@<IndexType>Indexed` annotations are:

- `@PersistentIndexed`
- `@GeoIndexed`
- `@FulltextIndexed`

The following example creates a persistent index on the field `name` and a separate persistent index on the field `age`:

```java
public class Person {
  @PersistentIndexed
  private String name;

  @PersistentIndexed
  private int age;
}
```

With the `@<IndexType>Indexed` annotations different indexes can be created on the same field.

The following example creates a TTL index and also a persistent index on the field `name`:

```java
public class Person {
  @TtlIndexed
  @PersistentIndexed
  private String name;
}
```

## Annotation @\<IndexType\>Index

If the index should include multiple fields the `@<IndexType>Index` annotations can be used on the type instead.

Possible `@<IndexType>Index` annotations are:

- `@PersistentIndex`
- `@GeoIndex`
- `@FulltextIndex`

The following example creates a single persistent index on the fields `name` and `age`, note that if a field is renamed in the database with @Field, the new field name must be used in the index declaration:

```java
@PersistentIndex(fields = {"fullname", "age"})
public class Person {
  @Field("fullname")
  private String name;

  private int age;
}
```

The `@<IndexType>Index` annotations can also be used to create an index on a nested field.

The following example creates a single persistent index on the fields `name` and `address.country`:

```java
@PersistentIndex(fields = {"name", "address.country"})
public class Person {
  private String name;

  private Address address;
}
```

The `@<IndexType>Index` annotations and the `@<IndexType>Indexed` annotations can be used at the same time in one class.

The following example creates a persistent index on the fields `name` and `age` and a separate persistent index on the field `age`:

```java
@PersistentIndex(fields = {"name", "age"})
public class Person {
  private String name;

  @PersistentIndexed
  private int age;
}
```

The `@<IndexType>Index` annotations can be used multiple times to create more than one index in this way.

The following example creates a persistent index on the fields `name` and `age` and a separate persistent index on the fields `name` and `gender`:

```java
@PersistentIndex(fields = {"name", "age"})
@PersistentIndex(fields = {"name", "gender"})
public class Person {
  private String name;

  private int age;

  private Gender gender;
}
```
