---
layout: default
title: Spring Data ArangoDB - Auditing
---
# Auditing

Since version 3.0.0 Spring Data ArangoDB provides basic auditing functionality where you can track who made changes on your data and when.

To enable auditing you have to add the annotation `@EnableArangoAuditing` to your configuration class.

```java
@Configuration
@EnableArangoAuditing
public class MyConfiguration implements ArangoConfiguration {
```

We can now add fields to our model classes and annotate them with `@CreateDate`, `@CreatedBy`, `@LastModifiedDate` and `@LastModifiedBy` to store the auditing information. All annotation names should be self-explanatory.

```java
@Document
public class MyEntity {

  @CreatedDate
  private Instant created;

  @CreatedBy
  private User createdBy;

  @LastModifiedDate
  private Instant modified;

  @LastModifiedBy
  private User modifiedBy;

}
```

The annotations `@CreateDate` and `@LastModifiedDate` are working with fields of any kind of Date/Timestamp type which is supported by Spring Data. (i.e. `java.util.Date`, `java.time.Instant`, `java.time.LocalDateTime`).

For `@CreatedBy` and `@LastModifiedBy` we need to provide Spring Data the information of the current auditor (i.e. `User` in our case). We can do so by implementing the `AuditorAware` interface

```java
public class AuditorProvider implements AuditorAware<User> {
  @Override
  public Optional<User> getCurrentAuditor() {
    // return current user
  }
}
```

and add the implementation as a bean to our Spring context.

```java
@Configuration
@EnableArangoAuditing(auditorAwareRef = "auditorProvider")
public class MyConfiguration implements ArangoConfiguration {

  @Bean
  public AuditorAware<User> auditorProvider() {
    return new AuditorProvider();
  }

}
```

If you use a type in your `AuditorAware` implementation, which will be also persisted in your database and you only want to save a reference in your entity, just add the [@Ref annotation](spring-data-reference-mapping-reference.html) to the fields annotated with `@CreatedBy` and `@LastModifiedBy`. Keep in mind that you have to save the `User` in your database first to get a valid reference.

```java
@Document
public class MyEntity {

  @Ref
  @CreatedBy
  private User createdBy;

  @Ref
  @LastModifiedBy
  private User modifiedBy;

}
```
