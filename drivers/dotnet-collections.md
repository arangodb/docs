---
layout: default
---
# Working with Collections

## Retrieving a List of Collections

To retrieve a list of collections in a database, connect to the database and
call `GetCollectionsAsync()`.

```csharp
using (var transport = HttpApiTransport.UsingBasicAuth(new Uri(url), dbName, username, password))
{
    using (var db = new ArangoDBClient(transport))
    {
        // Retrieve a list of collections
        var response = await db.Collection.GetCollectionsAsync();
    }
}
```

## Creating a Collection

To create a new collection, connect to the database and call `PostCollectionAsync()`.

```csharp
using (var transport = HttpApiTransport.UsingBasicAuth(new Uri(url), dbName, username, password))
{
    using (var db = new ArangoDBClient(transport))
    {
        // Set collection properties
        var body = new CollectionApi.Models.PostCollectionBody()
        {
            Type = CollectionApi.Models.CollectionType.Document,
            Name = "MyCollection"
        };
        // Create the new collection
        var response = await db.Collection.PostCollectionAsync(body, null);
    }
}
```

## Deleting a Collection

To delete a collection, connect to the database and call `DeleteCollectionAsync()`,
passing the name of the collection to be deleted as a parameter. Make sure to
specify the correct collection name when you delete collections.

```csharp
using (var transport = HttpApiTransport.UsingBasicAuth(new Uri(url), dbName, username, password))
{
    using (var db = new ArangoDBClient(transport))
    {
        // Delete the collection
        var response = await db.Collection.DeleteCollectionAsync("MyCollection");
    }
}
```
