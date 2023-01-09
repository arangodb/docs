---
fileID: dotnet-usage
title: Using the driver
weight: 3965
description: 
layout: default
---
## Serialization

ArangoDB C#/.NET driver allows for alternative serializer implementations to be used by implementing the `IApiClientSerialization` interface or `ApiClientSerialization` abstract class. The abstract class provides an additional property for default serialization options to use as fallback when none are provided by the caller. See the [Serialization Options](.#serialization-options) section below.

By default, all API clients use the provided `JsonNetApiClientSerialization`, which uses the Json.NET library. To use an alternative serialization implementation, pass an instance of `IApiClientSerialization` when instantiating any API client class or the `ArangoDBClient` class.

In many cases it's relied on the behavior of Json.NET to automatically map JSON properties using `camelCase` to C# properties defined using `PascalCase` when deserializing. Any alternative serializer will need to mimic that behavior to deserialize some ArangoDB JSON objects to their C# types.  For example, if using `System.Text.Json`, the option `PropertyNameCaseInsensitive = true` should be used.

### Serialization Options

All API methods that support passing objects of user-specified data types have an optional method argument to pass in custom serialization options. These options can be used to control the behavior of the underlying serializer implementation.

The options are passed as an instance of the `ApiClientSerializationOptions` class, which contains options for:

- `boolean UseCamelCasePropertyNames`
- `boolean IgnoreNullValues`

In addition, the default options can be updated, which affect all subsequent operations that use these options. To set default options, set them on the serializer implementation itself.  For example, if using the supplied `JsonNetApiClientSerialization`:

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
var serializer = new JsonNetApiClientSerialization();
serializer.DefaultOptions.IgnoreNullValues = false;
```
{{% /tab %}}
{{< /tabs >}}

## HTTP Request Headers

APIs that support specifying HTTP request headers have an optional method argument to pass in header values.

For example, to specify a Stream Transaction ID when creating a document:


{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
await adb.Document.PostDocumentAsync(
    "MyCollection",
    new MyClass
    {
        ItemNumber = 123456,
        Description = "Some item"
    },
    new DocumentHeaderProperties()
    {
        TransactionId = "0123456789"
    });
```
{{% /tab %}}
{{< /tabs >}}

## API Errors

Any time an endpoint responds with an HTTP status code which is not a "success" code, an `ApiErrorException` is thrown.  You may want to wrap your API calls in a try/catch block, and catch `ApiErrorException` in certain circumstances.

The `ApiErrorException` object contains the `ApiError` property, which holds an instance of `ApiErrorResponse` with the following structure. ArangoDB has descriptions for the different [`ErrorNum` values](../../appendix/appendix-error-codes).

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
/// <summary>
/// ArangoDB API error model
/// </summary>
public class ApiErrorResponse
{
    /// <summary>
    /// Whether this is an error response (always true).
    /// </summary>
    public bool Error { get; set; }
    /// <summary>
    /// Error message.
    /// </summary>
    public string ErrorMessage { get; set; }
    /// <summary>
    /// ArangoDB error number.
    /// See https://www.arangodb.com/docs/stable/appendix-error-codes.html for error numbers and descriptions.
    /// </summary>
    public int ErrorNum { get; set; }
    /// <summary>
    /// HTTP status code.
    /// </summary>
    public HttpStatusCode Code { get; set; }
}
```
{{% /tab %}}
{{< /tabs >}}
## Project Conventions

The intention of this driver is to expose the ArangoDB REST API as faithfully as possible with a minimal amount of abstraction on top. However:

- C# property naming conventions are used (with `PascalCase`) when representing ArangoDB objects.
- Template methods with type parameters are provided to support convenient (de)serialization of user data such as ArangoDB documents and edge documents.
- All methods representing REST API calls are declared `async`.

### Overall project structure

- The library is split into individual classes for each REST API entity. For example, `DocumentApiClient`, `CollectionApiClient`, etc.  
- Each API client class can be instantiated by passing an instance of `IApiClientTransport`. A concrete implementation of this interface is provided (`HttpApiTransport`). You may also plug in your own implementation.
- The `ArangoDBClient` wrapper class is instantiated in the same way as the client classes and provides instances of each client class in its properties.
- Each ArangoDB REST endpoint is exposed as a method on the appropriate API client class.

### API Client Method Signatures

A typical method signature is as follows:

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
// This is illustrative, not actually a method in the API
apiClient.PostEntity(string pathParam, PostEntityBody body, PostEntityQuery query = null);
```
{{% /tab %}}
{{< /tabs >}}
- Path parameters are always exposed as string arguments and come first in the argument list. e.g. `pathParam` in the example above.
- Where an endpoint expects some body content, an API model class is used. An instance of the API model is expected as an argument to the method. This comes after any path arguments. e.g. `PostEntityBody` instance in the example above.
- Optional parameters are exposed as nullable properties. In cases where the body content is an ArangoDB-specific object, properties with `null` value are ignored and not sent in the request to ArangoDB. In cases where the body content is a user-specified object (e.g. a document or edge document), `null` values are not ignored.
- Where query parameters can be used, a class is used to capture all possible query parameters. e.g. `PostEntityQuery` instance in the example above.
- The query argument is left optional with a default value `null`. If no query argument is provided, no query string is included in the request to ArangoDB.
- Properties of the query class are nullable and properties of the query class with null values are not included in the request to ArangoDB.

## Transport

ArangoDB C#/.NET driver uses the `IApiClientTransport` interface to allow providing your own transport implementation. You might want to provide a customized transport to implement features such as:

- automated retries for failed requests
- automated failover to a backup ArangoDB instance
- load-balancing requests to multiple ArangoDB instances

### `HttpApiTransport`

The `HttpApiTransport` class implements `IApiClientTransport` and is the standard HTTP transport provided by the driver. It supports the Basic Auth and JWT Authentication schemes.


#### Basic Auth

To create `HttpApiTransport` using Basic Auth, supply the appropriate base path and credentials to the static `UsingBasicAuth` method as follows:

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
var transport = HttpApiTransport.UsingBasicAuth(
    new Uri("http://localhost:8529/"),
    dbName,
    "username",
    "password");
```
{{% /tab %}}
{{< /tabs >}}

#### JSON Web Token (JWT)

To create `HttpApiTransport` using JWT tokens, supply the appropriate base path and JWT token to the static `UsingJWTAuth` method as follows:

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
var transport = HttpApiTransport.UsingJwtAuth(
    new Uri("http://localhost:8529/"),
    dbName,
    jwtTokenString);
```
{{% /tab %}}
{{< /tabs >}}

This assumes you already have a JWT token. If you need to get a token from ArangoDB, you need to first setup an `HttpApiTransport` without any credentials, submit a request to ArangoDB to get a JWT token, then call `SetJwtToken` on the transport. e.g.:

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
// Create HttpApiTransport with no authentication set
var transport = HttpApiTransport.UsingNoAuth(
  new Uri(arangodbBaseUrl),
  databaseName);
  
// Create AuthApiClient using the no-auth transport
var authClient = new AuthApiClient(transport);
// Get JWT token by submitting credentials
var jwtTokenResponse = await authClient.GetJwtTokenAsync("username", "password");
// Set token in current transport
transport.SetJwtToken(jwtTokenResponse.Jwt);
// Use the transport, which will now be authenticated using the JWT token. e.g.:
var databaseApi = new DatabaseApiClient(transport);
var userDatabasesResponse = await databaseApi.GetUserDatabasesAsync();
```
{{% /tab %}}
{{< /tabs >}}

Depending on your application's needs, you might want to securely store the token somewhere so you can use it again later. ArangoDB's tokens are valid for a one month duration, so you will need to get a new token at some point. You must handle fetching new tokens and setting them on the transport instance as part of your application.

## ArangoDBClient

`ArangoDBClient` is a wrapper around all of the individual API client classes. By instantiating `ArangoDBClient` once, you have access to instances of each API client class.  With an instance of `IApiClientTransport`, create `ArangoDBClient` as follows:

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
var adb = new ArangoDBClient(transport);
```
{{% /tab %}}
{{< /tabs >}}

Now you can access instances of the individual client classes as properties, e.g.:

{{< tabs >}}
{{% tab name="csharp" %}}
```csharp
// Create a new collection named "TestCollection"
var postCollectionResponse = await adb.Collection.PostCollectionAsync(
  new PostCollectionBody {
    Name = "TestCollection"
  });
// Add a document to "TestCollection"
var docResponse = await adb.Document.PostDocumentAsync(
  "TestCollection", 
  new { TestKey = "TestValue" });
```
{{% /tab %}}
{{< /tabs >}}