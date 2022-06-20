---
layout: default
---
# Working with Documents

## Create a document
To create a new document, connect to the database and call PostDocumentAsync(). Specify the collection name and the object/document to create in ArangoDB.
```csharp
    // Create document in the MyCollection collection using anonymous type
    await db.Document.PostDocumentAsync(
        "MyCollection",
        new
        {
            MyProperty = "Value"
        });

    // Create document in the MyCollection collection using strong type
    await db.Document.PostDocumentAsync(
        "MyCollection",
        new MyClass
        {
            ItemNumber = 123456,
            Description = "Some item"
        });
```
The document object must not have any value against a property named `_key`, if you expect ArangoDB to generate the document key for you.
The default serializer options specify that null values will be ignored, so if your class has a `_key` property, you can leave it as `null` when creating a new document.
If you change the serializer options so that `IgnoreNullValues` is `false`, then you cannot create a new document using a class that specifies a property named `_key`, because the ArangoDB API will reject the request.

## Patch a document
To patch or partially update a document, connect to the database and call PatchDocumentAsync(). Specify the collection name, the document key, and an object with properties to patch in the ArangoDB document. 
```csharp

    // Partially update document
    await db.Document.PatchDocumentAsync<object, object>(
        "MyCollection",
        item._key,
        new { Description = "More description" });
```

## Replace a document
To replace or fully update a document, connect to the database and call PutDocumentAsync(). Specify the collection name, the document key, and the object which will fully update/replace the document in ArangoDB. 
```csharp
    // Fully update document
    item.Description = "Some item with some more description";
    await db.Document.PutDocumentAsync(
        $"MyCollection/{item._key}",
        item);
```

## Delete a document
To delete a document, connect to the database and call DeleteDocumentAsync(), passing the ID of the document.
```csharp
    // Deletes a document
    await db.Document.DeleteDocumentAsync($"MyCollection/{item._key}");
```