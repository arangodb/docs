---
layout: default
---
# Working with AQL

Learn more about the query language in the [AQL documentation](../aql/).

## Run an AQL Query

You can run an AQL query using the `PostCursorAsync()` method and create a
cursor that returns objects from ArangoDB:

```csharp
// Run AQL query (create a query cursor)
var response = await adb.Cursor.PostCursorAsync<MyClassDocument>(
    @"FOR doc IN MyCollection 
      FILTER doc.ItemNumber == 123456 
      RETURN doc");
MyClassDocument item = response.Result.First();
```
