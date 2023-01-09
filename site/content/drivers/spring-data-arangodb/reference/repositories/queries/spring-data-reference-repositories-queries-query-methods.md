---
fileID: spring-data-reference-repositories-queries-query-methods
title: Query methods
weight: 4005
description: 
layout: default
---
Queries using [ArangoDB Query Language (AQL)](../../../../../about-arangodb/)
can be supplied with the `@Query` annotation on methods.

## Passing collection name

Instead of writing the collection name statically into the query string, the placeholder `#collection` can be specified.

{{< tabs >}}
{{% tab name="java" %}}
```java
public interface MyRepository extends ArangoRepository<Customer, String>{

  // FOR c IN customer RETURN c
  @Query("FOR c IN #collection RETURN c")
  ArangoCursor<Customer> query();

}
```
{{% /tab %}}
{{< /tabs >}}

## Passing bind parameters

There are three ways of passing bind parameters to the query in the query annotation.

### Number matching

Using number matching, arguments will be substituted into the query in the order they are passed to the query method.

{{< tabs >}}
{{% tab name="java" %}}
```java
public interface MyRepository extends ArangoRepository<Customer, String>{

  @Query("FOR c IN #collection FILTER c.name == @0 AND c.surname == @1 RETURN c")
  ArangoCursor<Customer> query(String name, String surname);

}
```
{{% /tab %}}
{{< /tabs >}}

### @Param

With the `@Param` annotation, the argument will be placed in the query at the place corresponding to the value passed to the `@Param` annotation.

{{< tabs >}}
{{% tab name="java" %}}
```java
public interface MyRepository extends ArangoRepository<Customer, String>{

  @Query("FOR c IN #collection FILTER c.name == @name AND c.surname == @surname RETURN c")
  ArangoCursor<Customer> query(@Param("name") String name, @Param("surname") String surname);

}
```
{{% /tab %}}
{{< /tabs >}}

### @BindVars

In addition you can use a method parameter of type `Map<String, Object>` annotated with `@BindVars` as your bind parameters. You can then fill the map with any parameter used in the query (also see [AQL Bind Parameters](../../../../../aql/aql-fundamentals/fundamentals-bind-parameters#bind-parameters)).

{{< tabs >}}
{{% tab name="java" %}}
```java
public interface MyRepository extends ArangoRepository<Customer, String>{

  @Query("FOR c IN #collection FILTER c.name == @name AND c.surname = @surname RETURN c")
  ArangoCursor<Customer> query(@BindVars Map<String, Object> bindVars);

}
```
{{% /tab %}}
{{< /tabs >}}

A mixture of any of these methods can be used. Parameters with the same name from an `@Param` annotation will override those in the `bindVars`.

{{< tabs >}}
{{% tab name="java" %}}
```java
public interface MyRepository extends ArangoRepository<Customer, String>{

  @Query("FOR c IN #collection FILTER c.name == @name AND c.surname = @surname RETURN c")
  ArangoCursor<Customer> query(@BindVars Map<String, Object> bindVars, @Param("name") String name);

}
```
{{% /tab %}}
{{< /tabs >}}

## Query options

`AqlQueryOptions` can also be passed to the driver, as an argument anywhere in the method signature.

{{< tabs >}}
{{% tab name="java" %}}
```java
public interface MyRepository extends ArangoRepository<Customer, String>{

  @Query("FOR c IN #collection FILTER c.name == @name AND c.surname == @surname RETURN c")
  ArangoCursor<Customer> query(@Param("name") String name, @Param("surname") String surname, AqlQueryOptions options);

}
```
{{% /tab %}}
{{< /tabs >}}

## Spring Expression support

Since version 3.6.0, SpEL expressions can be embedded in the query string to
dynamically customize it depending on the invocation parameters and/or invoking
methods on Spring Beans. In particular:
- SpEL expressions must be wrapped within `#{}`
- SpEL variables can be set annotating method parameters with
  `@SpelParam("varName")` and referenced with `#varName`
- Spring Beans can be referenced with `@myBean` (factory beans with `&myBean`)
- the SpEL variable `#collection` is automatically set

{{< tabs >}}
{{% tab name="java" %}}
```java
public interface MyRepository extends ArangoRepository<Customer, String> {

    @Query("FOR c IN #{#collection} FILTER #{@filterGenerator.allEqual('c', #kv)} RETURN c")
    List<Customer> findByAllEqual(@SpelParam("kv") Map<String, Object> kv);

}

@Component("filterGenerator")
public class FilterGenerator {

    public String allEqual(String col, Map<String, Object> kv) {
        return kv.entrySet().stream()
                .map(it -> col + "." + it.getKey() + " == " + escape(it.getValue()))
                .collect(Collectors.joining(" AND "));
    }

    private Object escape(Object o) {
        if (o instanceof String) return "\"" + o + "\"";
        else return o;
    }

}
```
{{% /tab %}}
{{< /tabs >}}
