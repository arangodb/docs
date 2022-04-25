---
layout: default
---
# Getting Started

Install the latest release of [ArangoDBNetStandard on Nuget](https://www.nuget.org/packages/ArangoDBNetStandard).

## First steps

### Create a database

```csharp
// You must use the _system database to create databases
using (var systemDbTransport = HttpApiTransport.UsingBasicAuth(
    new Uri("http://localhost:8529/"),
    "_system",
    "root",
    "root"))
{
    var systemDb = new DatabaseApiClient(systemDbTransport);
    // Create a new database with one user.
    await systemDb.PostDatabaseAsync(
        new PostDatabaseBody
        {
            Name = "arangodb-net-standard",
            Users = new List<DatabaseUser>
            {
                new DatabaseUser
                {
                    Username = "jlennon",
                    Passwd = "yoko123"
                }
            }
        });
}
```

Since the system database is only used once to create another separate database, `systemDbTransport` is wrapped in a `using` block.

In general, if you connect to the same database a lot, you don't want to dispose `HttpApiTransport` until the end of your application's life.

### Create a collection

```csharp
// Use your new database with basic auth credentials for the user jlennon.
var transport = HttpApiTransport.UsingBasicAuth(
    new Uri("http://localhost:8529"),
    "arangodb-net-standard",
    "jlennon",
    "yoko123");
var adb = new ArangoDBClient(transport);
// Create a collection in the database
await adb.Collection.PostCollectionAsync(
    new PostCollectionBody
    {
        Name = "MyCollection"
        // A whole heap of other options exist to define key options, 
        // sharding options, etc
    });
```

### Create documents

```csharp
// Create document in the collection using anonymous type
await adb.Document.PostDocumentAsync(
    "MyCollection",
    new
    {
        MyProperty = "Value"
    });
// Create document in the collection using strong type
await adb.Document.PostDocumentAsync(
    "MyCollection",
    new MyClass
    {
        ItemNumber = 123456,
        Description = "Some item"
    });
```
{% hint 'note' %}
The document object must not have any value against a property named `_key`, if you expect ArangoDB to generate the document key for you.
The default serializer options specify that null values will be ignored, so if your class has a `_key` property, you can leave it as `null` when creating a new document.
If you change the serializer options so that `IgnoreNullValues` is `false`, then you cannot create a new document using a class that specifies a property named `_key`, because the ArangoDB API will reject the request.
{% endhint %}


### Run an AQL query

```csharp
// Run AQL query (create a query cursor)
var response = await adb.Cursor.PostCursorAsync<MyClassDocument>(
    @"FOR doc IN MyCollection 
      FILTER doc.ItemNumber == 123456 
      RETURN doc");
MyClassDocument item = response.Result.First();
```

### Patch a document

```csharp
// Partially update document
await adb.Document.PatchDocumentAsync<object, object>(
    "MyCollection",
    item._key,
    new { Description = "More description" });
```

### Replace a document

```csharp
// Fully update document
item.Description = "Some item with some more description";
await adb.Document.PutDocumentAsync(
    $"MyCollection/{item._key}",
    item);
```
