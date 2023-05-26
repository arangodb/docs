---
layout: default
description: Collection Methods
---
Collection Methods
==================


toArray
-------

`collection.toArray()`

Converts the collection into an array of documents. Never use this call
in a production environment as it will basically create a copy of your
collection in RAM which will use resources depending on the number and size
of the documents in your collection.


Insert / Save
-------------



Replace
-------

`collection.replace(selector, data)`

Replaces an existing document described by the `selector`, which must
be an object containing the `_id` or `_key` attribute. There must be
a document with that `_id` or `_key` in the current collection. This
document is then replaced with the `data` given as second argument.
Any attribute `_id`, `_key` or `_rev` in `data` is ignored.

The method returns a document with the attributes `_id`, `_key`, `_rev`
and `_oldRev`. The attribute `_id` contains the document identifier of the
updated document, the attribute `_rev` contains the document revision of
the updated document, the attribute `_oldRev` contains the revision of
the old (now replaced) document.

If the selector contains a `_rev` attribute, the method first checks
that the specified revision is the current revision of that document.
If not, there is a conflict, and an error is thrown.

---

`collection.replace(selector, data, options)`

As before, but `options` must be an object that can contain the following
boolean attributes:

  - `waitForSync`: One can force
    synchronization of the document creation operation to disk even in
    case that the `waitForSync` flag is been disabled for the entire
    collection. Thus, the `waitForSync` option can be used to force
    synchronization of just specific operations. To use this, set the
    `waitForSync` parameter to `true`. If the `waitForSync` parameter
    is not specified or set to `false`, then the collection's default
    `waitForSync` behavior is applied. The `waitForSync` parameter
    cannot be used to disable synchronization for collections that have
    a default `waitForSync` value of `true`.
  - `overwrite`: If this flag is set to `true`, a `_rev` attribute in
    the selector is ignored.
  - `returnNew`: If this flag is set to `true`, the complete new document
    is returned in the output under the attribute `new`.
  - `returnOld`: If this flag is set to `true`, the complete previous
    revision of the document is returned in the output under the
    attribute `old`.
  - `silent`: If this flag is set to `true`, no output is returned.

---

`collection.replace(document-identifier, data)`

`collection.replace(document-identifier, data, options)`

As before. Instead of `selector` a `document-identifier` can be passed as
first argument. No revision precondition is tested.

---

`collection.replace(document-key, data)`

`collection.replace(document-key, data, options)`

As before. Instead of `selector` a `document-key` can be passed as
first argument. No revision precondition is tested.

---

`collection.replace(selector-array, data-array)`

`collection.replace(selector-array, data-array, options)`

These two variants allow to perform the operation on a whole array of
selector/data pairs. The two arrays given as `selector-array` and `data-array`
must have the same length. The behavior is exactly as if `replace()` would have
been called on all respective members of the two arrays and all results are
returned in an array. If an error occurs with any of the documents, no
exception is risen! Instead of a document an error object is returned in the
result array. The options behave exactly as before.
 
**Examples**

Create and update a document:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionReplace1
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionReplace1}
    ~ db._create("example");
      a1 = db.example.insert({ a : 1 });
      a2 = db.example.replace(a1, { a : 2 });
      a3 = db.example.replace(a1, { a : 3 }); // xpError(ERROR_ARANGO_CONFLICT);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionReplace1
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use a document identifier:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollectionReplaceHandle
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollectionReplaceHandle}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "3903044"});
      a1 = db.example.insert({ a : 1 });
      a2 = db.example.replace("example/3903044", { a : 2 });
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollectionReplaceHandle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Update
------

`collection.update(selector, data)`

Updates an existing document described by the `selector`, which must
be an object containing the `_id` or `_key` attribute. There must be
a document with that `_id` or `_key` in the current collection. This
document is then patched with the `data` given as second argument.
Any attribute `_id`, `_key` or `_rev` in `data` is ignored.

The method returns a document with the attributes `_id`, `_key`, `_rev`
and `_oldRev`. The attribute `_id` contains the document identifier of the
updated document, the attribute `_rev` contains the document revision of
the updated document, the attribute `_oldRev` contains the revision of
the old (now updated) document.

If the selector contains a `_rev` attribute, the method first checks
that the specified revision is the current revision of that document.
If not, there is a conflict, and an error is thrown.

---

`collection.update(selector, data, options)`

As before, but `options` must be an object that can contain the following
boolean attributes:

  - `waitForSync`: One can force
    synchronization of the document creation operation to disk even in
    case that the `waitForSync` flag is been disabled for the entire
    collection. Thus, the `waitForSync` option can be used to force
    synchronization of just specific operations. To use this, set the
    `waitForSync` parameter to `true`. If the `waitForSync` parameter
    is not specified or set to `false`, then the collection's default
    `waitForSync` behavior is applied. The `waitForSync` parameter
    cannot be used to disable synchronization for collections that have
    a default `waitForSync` value of `true`.
  - `overwrite`: If this flag is set to `true`, a `_rev` attribute in
    the selector is ignored.
  - `returnNew`: If this flag is set to `true`, the complete new document
    is returned in the output under the attribute `new`.
  - `returnOld`: If this flag is set to `true`, the complete previous
    revision of the document is returned in the output under the
    attribute `old`.
  - `silent`: If this flag is set to `true`, no output is returned.
  - `keepNull`: The optional `keepNull` parameter can be used to modify
    the behavior when handling `null` values. Normally, `null` values
    are stored in the database. By setting the `keepNull` parameter to
    `false`, this behavior can be changed so that all attributes in
    `data` with `null` values will be removed from the target document.
  - `mergeObjects`: Controls whether objects (not arrays) will be
    merged if present in both the existing and the patch document. If
    set to `false`, the value in the patch document will overwrite the
    existing document's value. If set to `true`, objects will be merged.
    The default is `true`.

---

`collection.update(document-identifier, data)`

`collection.update(document-identifier, data, options)`

As before. Instead of a `selector`, a `document-identifier` can be passed as the
first argument. No revision precondition is tested.

---

`collection.update(document-key, data)`

`collection.update(document-key, data, options)`

---

As before. Instead of a `selector`, a `document-key` can be passed as the
first argument. No revision precondition is tested.

`collection.update(selector-array, data-array)`

`collection.update(selector-array, data-array, options)`

These two variants allow to perform the operation on a whole array of
selector/data pairs. The two arrays given as `selector-array` and `data-array`
must have the same length. The behavior is exactly as if `update()` would have
been called on all respective members of the two arrays and all results are
returned in an array. If an error occurs with any of the documents, no
exception is risen! Instead of a document an error object is returned in the
result array. The options behave exactly as before.

**Examples**

Create and update a document:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateDocument
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateDocument}
    ~ db._create("example");
      a1 = db.example.insert({"a" : 1});
      a2 = db.example.update(a1, {"b" : 2, "c" : 3});
      a3 = db.example.update(a1, {"d" : 4}); // xpError(ERROR_ARANGO_CONFLICT);
      a4 = db.example.update(a2, {"e" : 5, "f" : 6 });
      db.example.document(a4);
      a5 = db.example.update(a4, {"a" : 1, c : 9, e : 42 });
      db.example.document(a5);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateDocument
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use a document identifier:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateHandleSingle
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateHandleSingle}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "18612115"});
      a1 = db.example.insert({"a" : 1});
      a2 = db.example.update("example/18612115", { "x" : 1, "y" : 2 });
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateHandleSingle
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Use the keepNull parameter to remove attributes with null values:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateHandleKeepNull
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateHandleKeepNull}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "19988371"});
      db.example.insert({"a" : 1});
    |db.example.update("example/19988371",
                       { "b" : null, "c" : null, "d" : 3 });
      db.example.document("example/19988371");
      db.example.update("example/19988371", { "a" : null }, false, false);
      db.example.document("example/19988371");
    | db.example.update("example/19988371",
                        { "b" : null, "c": null, "d" : null }, false, false);
      db.example.document("example/19988371");
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateHandleKeepNull
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Patching array values:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline documentsCollection_UpdateHandleArray
    @EXAMPLE_ARANGOSH_OUTPUT{documentsCollection_UpdateHandleArray}
    ~ db._create("example");
    ~ var myid = db.example.insert({_key: "20774803"});
    |  db.example.insert({"a" : { "one" : 1, "two" : 2, "three" : 3 },
                          "b" : { }});
    | db.example.update("example/20774803", {"a" : { "four" : 4 },
                                             "b" : { "b1" : 1 }});
      db.example.document("example/20774803");
    | db.example.update("example/20774803", { "a" : { "one" : null },
    |                                         "b" : null },
                        false, false);
      db.example.document("example/20774803");
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock documentsCollection_UpdateHandleArray
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}



Replace By Example
------------------

`collection.replaceByExample(example, newValue)`

Replaces all documents matching an example with a new document body.
The entire document body of each document matching the `example` will be
replaced with `newValue`. The document meta-attributes `_id`, `_key` and
`_rev` will not be replaced.

---

`collection.replaceByExample(document, newValue, waitForSync)`

The optional `waitForSync` parameter can be used to force synchronization
of the document replacement operation to disk even in case that the
`waitForSync` flag had been disabled for the entire collection. Thus,
the `waitForSync` parameter can be used to force synchronization of just
specific operations. To use this, set the `waitForSync` parameter to
`true`. If the `waitForSync` parameter is not specified or set to
`false`, then the collection's default `waitForSync` behavior is
applied. The `waitForSync` parameter cannot be used to disable
synchronization for collections that have a default `waitForSync` value
of `true`.

---

`collection.replaceByExample(document, newValue, waitForSync, limit)`

The optional `limit` parameter can be used to restrict the number of
replacements to the specified value. If `limit` is specified but less than
the number of documents in the collection, it is undefined which documents are
replaced.

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 011_documentsCollectionReplaceByExample
    @EXAMPLE_ARANGOSH_OUTPUT{011_documentsCollectionReplaceByExample}
    ~ db._create("example");
      db.example.insert({ Hello : "world" });
      db.example.replaceByExample({ Hello: "world" }, {Hello: "mars"}, false, 5);
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 011_documentsCollectionReplaceByExample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Update By Example
-----------------

`collection.updateByExample(example, newValue)`

Partially updates all documents matching an example with a new document body.
Specific attributes in the document body of each document matching the
`example` will be updated with the values from `newValue`.
The document meta-attributes `_id`, `_key` and `_rev` cannot be updated.

Partial update could also be used to append new fields,
if there were no old field with same name.

---

`collection.updateByExample(document, newValue, keepNull, waitForSync)`

The optional `keepNull` parameter can be used to modify the behavior when
handling `null` values. Normally, `null` values are stored in the
database. By setting the `keepNull` parameter to `false`, this behavior
can be changed so that all attributes in `data` with `null` values will
be removed from the target document.

The optional `waitForSync` parameter can be used to force synchronization
of the document replacement operation to disk even in case that the
`waitForSync` flag had been disabled for the entire collection. Thus,
the `waitForSync` parameter can be used to force synchronization of just
specific operations. To use this, set the `waitForSync` parameter to
`true`. If the `waitForSync` parameter is not specified or set to
`false`, then the collection's default `waitForSync` behavior is
applied. The `waitForSync` parameter cannot be used to disable
synchronization for collections that have a default `waitForSync` value
of `true`.

---

`collection.updateByExample(document, newValue, keepNull, waitForSync, limit)`

The optional `limit` parameter can be used to restrict the number of
updates to the specified value. If `limit` is specified but less than
the number of documents in the collection, it is undefined which documents are
updated.

---

`collection.updateByExample(document, newValue, options)`

Using this variant, the options for the operation can be passed using
an object with the following sub-attributes:

  - `keepNull`
  - `waitForSync`
  - `limit`
  - `mergeObjects`

**Examples**

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 012_documentsCollectionUpdateByExample
    @EXAMPLE_ARANGOSH_OUTPUT{012_documentsCollectionUpdateByExample}
    ~ db._create("example");
      db.example.insert({ Hello : "world", foo : "bar" });
      db.example.updateByExample({ Hello: "world" }, { Hello: "foo", World: "bar" }, false);
      db.example.byExample({ Hello: "foo" }).toArray()
    ~ db._drop("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 012_documentsCollectionUpdateByExample
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}


Convert a document key to a document id
---------------------------------------

`collection.documentId(documentKey)`

Qualifies the given document key with this collection's name to derive a
valid document id.

Throws if the document key is invalid. Note that this method does not
check whether the document already exists in this collection.
