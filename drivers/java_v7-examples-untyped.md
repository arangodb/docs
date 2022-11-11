---
layout: default
description: If you use a NoSQL database it's common to retrieve documents with an unknown attribute structure
---
How to retrieve documents from ArangoDB without knowing the structure?
======================================================================

Problem
-------

If you use a NoSQL database it's common to retrieve documents with an unknown
attribute structure. Furthermore, the amount and types of attributes may differ
in documents resulting from a single query. Another problem is that you want to
add one or more attributes to a document.


Solution: BaseDocument
----------------------

`BaseDocument` class can be used to read and write database documents as well as to map AQL bind variables and query results.

It implements the following API:

```
public final class BaseDocument {

    // metadata getters
    public String getId();
    public String getKey();
    public String getRevision();

    // metadata setters
    public void setId(final String id);
    public void setKey(final String key);
    public void setRevision(final String rev);

    // attributes accessors
    public Map<String, Object> getProperties();
    public Object getAttribute(final String key);

    // attributes mutators
    public void setProperties(final Map<String, Object> props);
    public void addAttribute(final String key, final Object value);
    public void updateAttribute(final String key, final Object value);
    public void removeAttribute(final String key);
}
```

**Note**: `BaseDocument` attributes are serialized and deserialized using the driver's internal serde, which is
based on Jackson Databind. Attributes serialization and deserialization cannot be customized.

To create a document from `BaseDocument`:
```
BaseDocument doc = new BaseDocument("myKey");
doc.addAttribute("a", "Foo");
doc.addAttribute("b", 42);
collection.insertDocument(doc);
```

To read a document as `BaseDocument`:

```
BaseDocument readDocument = collection.getDocument(key, BaseDocument.class);
System.out.println("Key: " + readDocument.getKey());
System.out.println("Attribute a: " + readDocument.getAttribute("a"));
System.out.println("Attribute b: " + readDocument.getAttribute("b"));
```


Solution: Jackson JsonNode
--------------------------

The driver internal serde is based on Jackson Databind, therefore the `JsonNode` class can be used to read and write
database documents as well as to map AQL bind variables and query results.

To create a document from Jackson `JsonNode`:
```
JsonNode jsonNode = JsonNodeFactory.instance.objectNode()
        .put("_key", "myKey")
        .put("a", "Bar")
        .put("b", 53);
collection.insertDocument(jsonNode);
```

To read a document as Jackson `JsonNode`:

```
JsonNode readJsonNode = collection.getDocument("myKey", JsonNode.class);
System.out.println("Key: " + readJsonNode.get("_key").textValue());
System.out.println("Attribute a: " + readJsonNode.get("a").textValue());
System.out.println("Attribute b: " + readJsonNode.get("b").intValue());
```


Solution: JSON string
---------------------

The `RawJson` class can be used to read and write database documents as well as to map AQL bind variables and query
results.

To create a document from `RawJson`:
```
RawJson json = RawJson.of("""
        {"_key": "myKey", "a": "Baz", "b": 64}
        """);
collection.insertDocument(json);``
```

To read a document as `RawJson`:
```
RawJson readJson = collection.getDocument(keyJson, RawJson.class);
System.out.println(readJson.getValue());
```
