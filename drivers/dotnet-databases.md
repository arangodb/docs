---
layout: default
---
# Working with Databases

## Connect to a Database

To connect to a database, create an instance of `ArangoDBClient` supplying an
instance of `IApiClientTransport`.

```csharp
var dbName = "_system";
var username = "-----";
var password = "-----";
var url = "http://localhost:8529/";

// Initiate the transport
using (var transport = HttpApiTransport.UsingBasicAuth(new Uri(url), dbName, username, password))
{
    // Initiate ArangoDBClient using the transport
    using (var db = new ArangoDBClient(transport))
    {
        var response = await db.Database.GetCurrentDatabaseInfoAsync();
        var dbInfo = response.Result; // Provides information about the current database
    }
}
```

## Retrieve a List of All Databases

To retrieve the list of all databases on an ArangoDB server, connect to the
`_system` database and call `GetDatabasesAsync()`.

```csharp
// Initiate the transport. The value of dbName must be "_system"
using (var transport = HttpApiTransport.UsingBasicAuth(new Uri(url), dbName, username, password))
{
    // Initiate ArangoDBClient using the transport
    using (var db = new ArangoDBClient(transport))
    {
        // Retrieve the list of databases
        var response = await db.Database.GetDatabasesAsync();
    }
}
```

## Create a Database

To create a new database, connect to the `_system` database and call
`PostDatabaseAsync()`.

```csharp
// Initiate the transport. The value of dbName must be "_system"
using (var transport = HttpApiTransport.UsingBasicAuth(new Uri(url), dbName, username, password))
{
    // Initiate ArangoDBClient using the transport
    using (var db = new ArangoDBClient(transport))
    {
        // Define the new database and its users
        var body = new DatabaseApi.Models.PostDatabaseBody()
        {
            Name = "newdb1",
            Users = new List<DatabaseApi.Models.DatabaseUser>()
            {
                new DatabaseApi.Models.DatabaseUser()
                {
                    Username="usr1",
                    Passwd ="pwd1",
                    Active=true
                }
            }
        };
        // Create the new database
        var response = await db.Database.PostDatabaseAsync(body);
    }
}
```

## Delete a Database

To delete an existing database, connect to the `_system` database and call
`DeleteDatabaseAsync()` passing the name of the database to be deleted as a
parameter. The `_system` database cannot be deleted. Be careful that you specify
the correct database name when you are deleting databases.

```csharp
using (var transport = HttpApiTransport.UsingBasicAuth(new Uri(url), dbName, username, password))
{
    using (var db = new ArangoDBClient(transport))
    {
        // Delete the database
        var response = await db.Database.DeleteDatabaseAsync("newdb1");
    }
}
```
