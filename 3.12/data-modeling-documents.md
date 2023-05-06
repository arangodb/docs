---
layout: default
description: >-
  Documents are self-contained units of information, each typically representing
  a single record or instance of an entity
redirect_from:
  - data-modeling-documents-document-address.html # 3.10 -> 3.10
  - data-modeling-naming-conventions-document-keys.html # 3.10 -> 3.10
  - data-modeling-naming-conventions-attribute-names.html # 3.10 -> 3.10
---
# Documents

{{ page.description }}
{:class="lead"}

Documents in ArangoDB are JSON objects that contain structured or semi-structured
data. They are stored in [collections](data-modeling-collections.html).

Each document has an immutable key that identifies it within a collection, and
an identifier derived from the key that uniquely identifies it within a
[database](data-modeling-databases.html).

<!-- TODO: better explain what they are used for and how
Documents can be stored, updated, and retrieved using various database management techniques, such as indexing, querying, and aggregation. They provide a flexible and scalable way to organize and manage data, particularly for applications that deal with unstructured or semi-structured data, such as content management systems, social media platforms, and e-commerce websites.
-->

## Data types

Documents can store primitive values, lists of values, and nested objects
(to any depth). JSON and thus ArangoDB supports the following data types:

- `null` to represent the absence of a value, also known as _nil_ or _none_ type.
- `true` and `false`, the Boolean values, to represent _yes_ and
  _no_, _on_ and _off_, etc.
- **numbers** to store integer and floating-point values.
- **strings** to store character sequences for text, encoded as UTF-8.
- **arrays** to store lists that can contain any of the supported data types
  as elements, including nested arrays and objects.
- **objects** to map keys to values like a dictionary, also known as
  associative arrays or hash maps. The keys are strings and the values can be
  any of the supported data types, including arrays and nested objects.

Example document:

```json
{
  "_id" : "myusers/3456789",
  "_key" : "3456789",
  "_rev" : "14253647",
  "firstName" : "John",
  "lastName" : "Doe",
  "address" : {
    "street" : "Road To Nowhere 1",
    "city" : "Gotham"
  },
  "hobbies" : [
    { "name": "swimming", "howFavorite": 10 },
    { "name": "biking", "howFavorite": 6 },
    { "name": "programming", "howFavorite": 4 }
  ]
}
```

## System attributes

All documents contain special attributes at the top-level that start with an 
underscore, known as **system attributes**:

- The **document identifier** is stored as a string in the `_id` attribute.
- The **document key** is stored as a string in the `_key` attribute.
- The **document revision** is stored as a string in the `_rev` attribute.

You can specify a value for the `_key` attribute when creating a document.
The `_id` and `_key` values are immutable once the document has been created.
The `_rev` value is maintained by ArangoDB automatically.

Edge documents in edge collections have two additional system attributes:
- The document identifier of the source vertex stored in the `_from` attribute.
- The document identifier of the target vertex stored in the `_to` attribute.

More system attributes may get added in the future without notice. Therefore,
you should avoid using own attribute names starting with an underscore.

### Document keys

Each document has a unique **document key** (or _primary key_) which identifies
it within its collection.

A document key uniquely identifies a document in the collection it is
stored in. It can and should be used by clients when specific documents
are queried. The document key is stored in the `_key` attribute of
each document. The key values are automatically indexed by ArangoDB in
a collection's primary index. Thus looking up a document by its
key is a fast operation. The `_key` value of a document is
immutable once the document has been created, which means it cannot be changed.

Keys are case-sensitive, i.e. `myKey` and `MyKEY` are considered to be
different keys.

By default, ArangoDB generates a document key automatically if no `_key`
attribute is specified. Otherwise, it uses the `_key` you provide.
This behavior can be changed on a per-collection level by creating
collections with the `keyOptions` attribute. Using `keyOptions`, it is possible
to disallow user-specified keys completely, or to force a specific regime for
auto-generating the `_key` values.

#### User-specified keys

If you allow user-specified keys, you can pick the key values as required,
provided that the values conform to the following restrictions:

- The key must be a string value. Numeric keys are not allowed, but any numeric
  value can be put into a string and can then be used as document key.
- The key must be at least 1 byte and at most 254 bytes long. Empty keys are 
  disallowed when specified (though it may be valid to completely omit the
  `_key` attribute from a document).
- It must consist of the letters `A` to `Z` (lower- and uppercase), the digits
  `0` to `9`, or any of the following punctuation characters:
  `_` `-` `:` `.` `@` `(` `)` `+` `,` `=` `;` `$` `!` `*` `'` `%`
- Any other characters, especially multi-byte UTF-8 sequences, whitespace, or 
  punctuation characters not listed above cannot be used inside key values.
- The key must be unique within the collection it is used in.

{% hint 'info' %}
When working with named graphs, their names are used as document keys in the
`_graphs` system collection. Therefore, the same document key restrictions apply.
{% endhint %}

#### Automatically generated keys

There are no guarantees about the format and pattern of auto-generated document
keys other than the above restrictions. Clients should therefore treat
auto-generated document keys as opaque values and not rely on their format.

The default format for generated keys is a string containing numeric digits.
The numeric values reflect chronological time in the sense that `_key` values
generated later contain higher numbers than `_key` values generated earlier.
However, the exact value that is generated by the server is not predictable.
Note that if you sort on the `_key` attribute, string comparison is used,
which means `"100"` is less than `"99"` etc.

### Document identifiers

A document identifier (or _document handle_) uniquely identifies a document
across all collections within the same database. It consists of the collection's
name and the document key (the value of the `_key` attribute), separated by a
forward slash (`/`), like `collection-name/document-key`.

See [Collection names](data-modeling-collections.html#collection-names) and
[Document keys](#document-keys) for information about the allowed characters.

### Document revisions

Every document in ArangoDB has a revision, stored in the system attribute
`_rev`. It is fully managed by the server and read-only for the user.

Its value should be treated as opaque, no guarantees regarding its format
and properties are given except that it will be different after a
document update. More specifically, `_rev` values are unique across all
documents and all collections in a single server setup. In a cluster setup,
within one shard it is guaranteed that two different document revisions
have a different `_rev` string, even if they are written in the same
millisecond.

The `_rev` attribute can be used as a pre-condition for queries, to avoid
_lost update_ situations. That is, if a client fetches a document from the server,
modifies it locally (but with the `_rev` attribute untouched) and sends it back
to the server to update the document, but meanwhile the document has been changed by
another operation, then the revisions do not match anymore and the operation
is cancelled by the server. Without this mechanism, the client would
accidentally overwrite changes made to the document without knowing about it.

When an existing document is updated or replaced, ArangoDB writes a new
version of this document to the write-ahead logfile (regardless of the
storage engine). When the new version of the document has been written, the
old version(s) is still present, at least on disk. The same is true when
an existing document (version) gets removed: the old version of the document
plus the removal operation are on disk for some time.

On disk, it is therefore possible that multiple revisions of the same document
(as identified by the same `_key` value) exist at the same time. However,
stale revisions **are not accessible**. Once a document has been updated or removed
successfully, no query or other data retrieval operation done by the user
is able to see it any more. Every transaction only ever sees a single revision
of a document. Furthermore, after some time, old revisions
are removed internally. This is to avoid ever-growing disk usage.

{% hint 'warning' %}
From a **user perspective**, there is just **one single document revision
present per different `_key`** at every point in time. There is no built-in
system to automatically keep a history of all changes done to a document
and old versions of a document cannot be restored via the `_rev` value.
{% endhint %}

## Attribute names

You can pick attribute names for document attributes as desired, provided the
following naming constraints are not violated:

- Attribute names starting with an underscore are considered to be system
  attributes for ArangoDB's internal use. You should avoid using own
  attribute names starting with an underscore.

- Theoretically, attribute names can include punctuation and special characters
  as desired, provided the name is a valid UTF-8 string. For maximum
  portability, special characters should be avoided, however.
  
  For example, attribute names may contain the dot character (`.`), but it has a
  special meaning in JavaScript and also in AQL. When using such attribute names
  in one of these languages, the attribute name needs to be quoted.

  Overall, it is recommended to use attribute names which don't require any
  quoting or escaping in all languages used. This includes languages used by
  clients, such as Ruby and PHP, if the attributes are automatically mapped to
  object members.

- Attribute names starting with an at sign (`@`) need to be enclosed in
  backticks or forward ticks when used in AQL queries to tell them apart from
  bind variables. Similarly, characters like `+`, `-`, `*`, `/`, and `%` are
  operators in AQL and require the use of backticks or forward ticks, too.
  This does not apply if you use the bracket notation with the attribute name as
  a string.

- The dot character (`.`) and the character sequence `[*]` are special in
  ArangoDB index definitions, preventing you from creating indexes over
  attributes that include them in their names.

- ArangoDB does not enforce a length limit for attribute names. However, long
  attribute names may use more memory in result sets etc. Therefore the use
  of long attribute names is discouraged.

- Attribute names are case-sensitive.

- Attributes with empty names (an empty string) are disallowed.

## Documents API

The following descriptions cover the JavaScript interface for documents that
you can use to handle documents from the _arangosh_ command-line tool, as
well as in server-side JavaScript code like Foxx microservices.
For other languages see the corresponding language API.

- [Collection Methods](data-modeling-documents-document-methods.html)
- [Database Methods](data-modeling-documents-database-methods.html)
