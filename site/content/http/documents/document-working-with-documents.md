---
fileID: document-working-with-documents
title: Working with a Document
weight: 2250
description: 
layout: default
---
<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}/{key}:
    get:
      description: |2+
        Returns the document identified by *document-id*. The returned
        document contains three special attributes: *_id* containing the document
        identifier, *_key* containing key which uniquely identifies a document
        in a given collection and *_rev* containing the revision.
      operationId: readDocument
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* from which the document is to be read.
        in: path
      - name: key
        schema:
          type: string
        required: true
        description: |+
          The document key.
        in: path
      - name: If-None-Match
        schema:
          type: string
        required: false
        description: |+
          If the "If-None-Match" header is given, then it must contain exactly one
          Etag. The document is returned, if it has a different revision than the
          given Etag. Otherwise an *HTTP 304* is returned.
        in: header
      - name: If-Match
        schema:
          type: string
        required: false
        description: |+
          If the "If-Match" header is given, then it must contain exactly one
          Etag. The document is returned, if it has the same revision as the
          given Etag. Otherwise a *HTTP 412* is returned.
        in: header
      - name: x-arango-allow-dirty-read
        schema:
          type: boolean
        required: false
        description: |+
          Set this header to `true` to allow the Coordinator to ask any shard replica for
          the data, not only the shard leader. This may result in "dirty reads".
          The header is ignored if this operation is part of a Stream Transaction
          (`x-arango-trx-id` header). The header set when creating the transaction decides
          about dirty reads for the entire transaction, not the individual read operations.
        in: header
      - name: x-arango-trx-id
        schema:
          type: string
        required: false
        description: |+
          To make this operation a part of a Stream Transaction, set this header to the
          transaction ID returned by the `POST /_api/transaction/begin` call.
        in: header
      responses:
        '200':
          description: |2+
            is returned if the document was found
        '304':
          description: |2+
            is returned if the "If-None-Match" header is given and the document has
            the same version
        '404':
          description: |2+
            is returned if the document or collection was not found
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerReadDocument
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"hello":"world"});
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input
name: RestDocumentHandlerReadDocumentIfNoneMatch
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"hello":"world"});
    var url = "/_api/document/" + document._id;
    var headers = {"If-None-Match": "\"" + document._rev + "\""};
    var response = logCurlRequest('GET', url, "", headers);
    assert(response.code === 304);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerReadDocumentUnknownHandle
release: stable
version: '3.10'
---
    var url = "/_api/document/products/unknown-identifier";
    var response = logCurlRequest('GET', url);
    assert(response.code === 404);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}/{key}:
    head:
      description: |2+
        Like *GET*, but only returns the header fields and not the body. You
        can use this call to get the current revision of a document or check if
        the document was deleted.
      operationId: checkDocument
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* from which the document is to be read.
        in: path
      - name: key
        schema:
          type: string
        required: true
        description: |+
          The document key.
        in: path
      - name: If-None-Match
        schema:
          type: string
        required: false
        description: |+
          If the "If-None-Match" header is given, then it must contain exactly one
          Etag. If the current document revision is not equal to the specified Etag,
          an *HTTP 200* response is returned. If the current document revision is
          identical to the specified Etag, then an *HTTP 304* is returned.
        in: header
      - name: If-Match
        schema:
          type: string
        required: false
        description: |+
          If the "If-Match" header is given, then it must contain exactly one
          Etag. The document is returned, if it has the same revision as the
          given Etag. Otherwise a *HTTP 412* is returned.
        in: header
      - name: x-arango-allow-dirty-read
        schema:
          type: boolean
        required: false
        description: |+
          Set this header to `true` to allow the Coordinator to ask any shard replica for
          the data, not only the shard leader. This may result in "dirty reads".
          The header is ignored if this operation is part of a Stream Transaction
          (`x-arango-trx-id` header). The header set when creating the transaction decides
          about dirty reads for the entire transaction, not the individual read operations.
        in: header
      - name: x-arango-trx-id
        schema:
          type: string
        required: false
        description: |+
          To make this operation a part of a Stream Transaction, set this header to the
          transaction ID returned by the `POST /_api/transaction/begin` call.
        in: header
      responses:
        '200':
          description: |2+
            is returned if the document was found
        '304':
          description: |2+
            is returned if the "If-None-Match" header is given and the document has
            the same version
        '404':
          description: |2+
            is returned if the document or collection was not found
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input
name: RestDocumentHandlerReadDocumentHead
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"hello":"world"});
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest('HEAD', url);
    assert(response.code === 200);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}:
    post:
      description: |2+
        Creates a new document from the document given in the body, unless there
        is already a document with the *_key* given. If no *_key* is given, a new
        unique *_key* is generated automatically.
        Possibly given *_id* and *_rev* attributes in the body are always ignored,
        the URL part or the query parameter collection respectively counts.
        If the document was created successfully, then the *Location* header
        contains the path to the newly created document. The *Etag* header field
        contains the revision of the document. Both are only set in the single
        document case.
        If *silent* is not set to *true*, the body of the response contains a
        JSON object with the following attributes:
          - *_id* contains the document identifier of the newly created document
          - *_key* contains the document key
          - *_rev* contains the document revision
        If the collection parameter *waitForSync* is *false*, then the call
        returns as soon as the document has been accepted. It will not wait
        until the documents have been synced to disk.
        Optionally, the query parameter *waitForSync* can be used to force
        synchronization of the document creation operation to disk even in
        case that the *waitForSync* flag had been disabled for the entire
        collection. Thus, the *waitForSync* query parameter can be used to
        force synchronization of just this specific operations. To use this,
        set the *waitForSync* parameter to *true*. If the *waitForSync*
        parameter is not specified or set to *false*, then the collection's
        default *waitForSync* behavior is applied. The *waitForSync* query
        parameter cannot be used to disable synchronization for collections
        that have a default *waitForSync* value of *true*.
        If the query parameter *returnNew* is *true*, then, for each
        generated document, the complete new document is returned under
        the *new* attribute in the result.
      operationId: insertDocument
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* in which the document is to be created.
        in: path
      - name: collection
        schema:
          type: string
        required: false
        description: |+
          The name of the collection. This is only for backward compatibility.
          In ArangoDB versions < 3.0, the URL path was */_api/document* and
          this query parameter was required. This combination still works, but
          the recommended way is to specify the collection in the URL path.
        in: query
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until document has been synced to disk.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Additionally return the complete new document under the attribute *new*
          in the result.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Additionally return the complete old document under the attribute *old*
          in the result. Only available if the overwrite option is used.
        in: query
      - name: silent
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, an empty object will be returned as response. No meta-data
          will be returned for the created document. This option can be used to
          save some network traffic.
        in: query
      - name: overwrite
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, the insert becomes a replace-insert. If a document with the
          same *_key* already exists the new document is not rejected with unique
          constraint violated but will replace the old document. Note that operations
          with `overwrite` parameter require a `_key` attribute in the request payload,
          therefore they can only be performed on collections sharded by `_key`.
        in: query
      - name: overwriteMode
        schema:
          type: string
        required: false
        description: |+
          This option supersedes *overwrite* and offers the following modes
          - `"ignore"` if a document with the specified *_key* value exists already,
            nothing will be done and no write operation will be carried out. The
            insert operation will return success in this case. This mode does not
            support returning the old document version using `RETURN OLD`. When using
            `RETURN NEW`, *null* will be returned in case the document already existed.
          - `"replace"` if a document with the specified *_key* value exists already,
            it will be overwritten with the specified document value. This mode will
            also be used when no overwrite mode is specified but the *overwrite*
            flag is set to *true*.
          - `"update"` if a document with the specified *_key* value exists already,
            it will be patched (partially updated) with the specified document value.
            The overwrite mode can be further controlled via the *keepNull* and
            *mergeObjects* parameters.
          - `"conflict"` if a document with the specified *_key* value exists already,
            return a unique constraint violation error so that the insert operation
            fails. This is also the default behavior in case the overwrite mode is
            not set, and the *overwrite* flag is *false* or not set either.
        in: query
      - name: keepNull
        schema:
          type: boolean
        required: false
        description: |+
          If the intention is to delete existing attributes with the update-insert
          command, the URL query parameter *keepNull* can be used with a value of
          *false*. This will modify the behavior of the patch command to remove any
          attributes from the existing document that are contained in the patch document
          with an attribute value of *null*.
          This option controls the update-insert behavior only.
        in: query
      - name: mergeObjects
        schema:
          type: boolean
        required: false
        description: |+
          Controls whether objects (not arrays) will be merged if present in both the
          existing and the update-insert document. If set to *false*, the value in the
          patch document will overwrite the existing document's value. If set to *true*,
          objects will be merged. The default is *true*.
          This option controls the update-insert behavior only.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  description: |+
                    A JSON representation of a single document.
              required:
              - data
      responses:
        '201':
          description: |2+
            is returned if the documents were created successfully and
            *waitForSync* was *true*.
        '202':
          description: |2+
            is returned if the documents were created successfully and
            *waitForSync* was *false*.
        '400':
          description: |2+
            is returned if the body does not contain a valid JSON representation
            of one document. The response body contains
            an error document in this case.
        '404':
          description: |2+
            is returned if the collection specified by *collection* is unknown.
            The response body contains an error document in this case.
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostCreate1
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var url = "/_api/document/" + cn;
    var body = '{ "Hello": "World" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostAccept1
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: false });
    var url = "/_api/document/" + cn;
    var body = '{ "Hello": "World" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 202);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostWait1
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: false });
    var url = "/_api/document/" + cn + "?waitForSync=true";
    var body = '{ "Hello": "World" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostUnknownCollection1
release: stable
version: '3.10'
---
    var cn = "products";
    var url = "/_api/document/" + cn;
    var body = '{ "Hello": "World" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 404);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostBadJson1
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/document/" + cn;
    var body = '{ 1: "World" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 400);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostReturnNew
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/document/" + cn + "?returnNew=true";
    var body = '{"Hello":"World"}';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 202);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostOverwrite
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var url = "/_api/document/" + cn;
    var body = '{ "Hello": "World", "_key" : "lock" }';
    var response = logCurlRequest('POST', url, body);
    // insert
    assert(response.code === 201);
    logJsonResponse(response);
    body = '{ "Hello": "Universe", "_key" : "lock" }';
    url = "/_api/document/" + cn + "?overwrite=true";
    response = logCurlRequest('POST', url, body);
    // insert same key
    assert(response.code === 201);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}/{key}:
    put:
      description: |2+
        Replaces the specified document with the one in the body, provided there is
        such a document and no precondition is violated.
        The value of the `_key` attribute as well as attributes
        used as sharding keys may not be changed.
        If the *If-Match* header is specified and the revision of the
        document in the database is unequal to the given revision, the
        precondition is violated.
        If *If-Match* is not given and *ignoreRevs* is *false* and there
        is a *_rev* attribute in the body and its value does not match
        the revision of the document in the database, the precondition is
        violated.
        If a precondition is violated, an *HTTP 412* is returned.
        If the document exists and can be updated, then an *HTTP 201* or
        an *HTTP 202* is returned (depending on *waitForSync*, see below),
        the *Etag* header field contains the new revision of the document
        and the *Location* header contains a complete URL under which the
        document can be queried.
        Cluster only: The replace documents _may_ contain
        values for the collection's pre-defined shard keys. Values for the shard keys
        are treated as hints to improve performance. Should the shard keys
        values be incorrect ArangoDB may answer with a *not found* error.
        Optionally, the query parameter *waitForSync* can be used to force
        synchronization of the document replacement operation to disk even in case
        that the *waitForSync* flag had been disabled for the entire collection.
        Thus, the *waitForSync* query parameter can be used to force synchronization
        of just specific operations. To use this, set the *waitForSync* parameter
        to *true*. If the *waitForSync* parameter is not specified or set to
        *false*, then the collection's default *waitForSync* behavior is
        applied. The *waitForSync* query parameter cannot be used to disable
        synchronization for collections that have a default *waitForSync* value
        of *true*.
        If *silent* is not set to *true*, the body of the response contains a JSON
        object with the information about the identifier and the revision. The attribute
        *_id* contains the known *document-id* of the updated document, *_key*
        contains the key which uniquely identifies a document in a given collection,
        and the attribute *_rev* contains the new document revision.
        If the query parameter *returnOld* is *true*, then
        the complete previous revision of the document
        is returned under the *old* attribute in the result.
        If the query parameter *returnNew* is *true*, then
        the complete new document is returned under
        the *new* attribute in the result.
        If the document does not exist, then a *HTTP 404* is returned and the
        body of the response contains an error document.
      operationId: replaceDocument
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                document:
                  type: object
                  description: |+
                    A JSON representation of a single document.
              required:
              - document
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* in which the document is to be replaced.
        in: path
      - name: key
        schema:
          type: string
        required: true
        description: |+
          The document key.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until document has been synced to disk.
        in: query
      - name: ignoreRevs
        schema:
          type: boolean
        required: false
        description: |+
          By default, or if this is set to *true*, the *_rev* attributes in
          the given document is ignored. If this is set to *false*, then
          the *_rev* attribute given in the body document is taken as a
          precondition. The document is only replaced if the current revision
          is the one specified.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete previous revision of the changed
          document under the attribute *old* in the result.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete new document under the attribute *new*
          in the result.
        in: query
      - name: silent
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, an empty object will be returned as response. No meta-data
          will be returned for the replaced document. This option can be used to
          save some network traffic.
        in: query
      - name: If-Match
        schema:
          type: string
        required: false
        description: |+
          You can conditionally replace a document based on a target revision id by
          using the *if-match* HTTP header.
        in: header
      responses:
        '201':
          description: |2+
            is returned if the document was replaced successfully and
            *waitForSync* was *true*.
        '202':
          description: |2+
            is returned if the document was replaced successfully and
            *waitForSync* was *false*.
        '400':
          description: |2+
            is returned if the body does not contain a valid JSON representation
            of a document. The response body contains
            an error document in this case.
        '404':
          description: |2+
            is returned if the collection or the document was not found.
        '409':
          description: "\nis returned if the replace causes a unique constraint violation\
            \ in \na secondary index.\n\n"
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerUpdateDocument
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"hello":"world"});
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest('PUT', url, '{"Hello": "you"}');
    assert(response.code === 202);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerUpdateDocumentUnknownHandle
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"hello":"world"});
    db.products.remove(document._id);
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest('PUT', url, "{}");
    assert(response.code === 404);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerUpdateDocumentIfMatchOther
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"hello":"world"});
    var document2 = db.products.save({"hello2":"world"});
    var url = "/_api/document/" + document._id;
    var headers = {"If-Match":  "\"" + document2._rev + "\""};
    var response = logCurlRequest('PUT', url, '{"other":"content"}', headers);
    assert(response.code === 412);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}/{key}:
    patch:
      description: |2+
        Partially updates the document identified by *document-id*.
        The body of the request must contain a JSON document with the
        attributes to patch (the patch document). All attributes from the
        patch document will be added to the existing document if they do not
        yet exist, and overwritten in the existing document if they do exist
        there.
        The value of the `_key` attribute as well as attributes
        used as sharding keys may not be changed.
        Setting an attribute value to *null* in the patch document will cause a
        value of *null* to be saved for the attribute by default.
        If the *If-Match* header is specified and the revision of the
        document in the database is unequal to the given revision, the
        precondition is violated.
        If *If-Match* is not given and *ignoreRevs* is *false* and there
        is a *_rev* attribute in the body and its value does not match
        the revision of the document in the database, the precondition is
        violated.
        If a precondition is violated, an *HTTP 412* is returned.
        If the document exists and can be updated, then an *HTTP 201* or
        an *HTTP 202* is returned (depending on *waitForSync*, see below),
        the *Etag* header field contains the new revision of the document
        (in double quotes) and the *Location* header contains a complete URL
        under which the document can be queried.
        Cluster only: The patch document _may_ contain
        values for the collection's pre-defined shard keys. Values for the shard keys
        are treated as hints to improve performance. Should the shard keys
        values be incorrect ArangoDB may answer with a *not found* error
        Optionally, the query parameter *waitForSync* can be used to force
        synchronization of the updated document operation to disk even in case
        that the *waitForSync* flag had been disabled for the entire collection.
        Thus, the *waitForSync* query parameter can be used to force synchronization
        of just specific operations. To use this, set the *waitForSync* parameter
        to *true*. If the *waitForSync* parameter is not specified or set to
        *false*, then the collection's default *waitForSync* behavior is
        applied. The *waitForSync* query parameter cannot be used to disable
        synchronization for collections that have a default *waitForSync* value
        of *true*.
        If *silent* is not set to *true*, the body of the response contains a JSON
        object with the information about the identifier and the revision. The attribute
        *_id* contains the known *document-id* of the updated document, *_key*
        contains the key which uniquely identifies a document in a given collection,
        and the attribute *_rev* contains the new document revision.
        If the query parameter *returnOld* is *true*, then
        the complete previous revision of the document
        is returned under the *old* attribute in the result.
        If the query parameter *returnNew* is *true*, then
        the complete new document is returned under
        the *new* attribute in the result.
        If the document does not exist, then a *HTTP 404* is returned and the
        body of the response contains an error document.
      operationId: updateDocument
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                document:
                  type: object
                  description: |+
                    A JSON representation of a document update as an object.
              required:
              - document
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* in which the document is to be updated.
        in: path
      - name: key
        schema:
          type: string
        required: true
        description: |+
          The document key.
        in: path
      - name: keepNull
        schema:
          type: boolean
        required: false
        description: |+
          If the intention is to delete existing attributes with the patch
          command, the URL query parameter *keepNull* can be used with a value
          of *false*. This will modify the behavior of the patch command to
          remove any attributes from the existing document that are contained
          in the patch document with an attribute value of *null*.
        in: query
      - name: mergeObjects
        schema:
          type: boolean
        required: false
        description: |+
          Controls whether objects (not arrays) will be merged if present in
          both the existing and the patch document. If set to *false*, the
          value in the patch document will overwrite the existing document's
          value. If set to *true*, objects will be merged. The default is
          *true*.
        in: query
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until document has been synced to disk.
        in: query
      - name: ignoreRevs
        schema:
          type: boolean
        required: false
        description: |+
          By default, or if this is set to *true*, the *_rev* attributes in
          the given document is ignored. If this is set to *false*, then
          the *_rev* attribute given in the body document is taken as a
          precondition. The document is only updated if the current revision
          is the one specified.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete previous revision of the changed
          document under the attribute *old* in the result.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete new document under the attribute *new*
          in the result.
        in: query
      - name: silent
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, an empty object will be returned as response. No meta-data
          will be returned for the updated document. This option can be used to
          save some network traffic.
        in: query
      - name: If-Match
        schema:
          type: string
        required: false
        description: |+
          You can conditionally update a document based on a target revision id by
          using the *if-match* HTTP header.
        in: header
      responses:
        '201':
          description: |2+
            is returned if the document was updated successfully and
            *waitForSync* was *true*.
        '202':
          description: |2+
            is returned if the document was updated successfully and
            *waitForSync* was *false*.
        '400':
          description: |2+
            is returned if the body does not contain a valid JSON representation
            of a document. The response body contains
            an error document in this case.
        '404':
          description: |2+
            is returned if the collection or the document was not found.
        '409':
          description: "\nis returned if the update causes a unique constraint violation\
            \ in \na secondary index.\n\n"
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPatchDocument
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"one":"world"});
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest("PATCH", url, { "hello": "world" });
    assert(response.code === 202);
    logJsonResponse(response);
    var response2 = logCurlRequest("PATCH", url, { "numbers": { "one": 1, "two": 2, "three": 3, "empty": null } });
    assert(response2.code === 202);
    logJsonResponse(response2);
    var response3 = logCurlRequest("GET", url);
    assert(response3.code === 200);
    logJsonResponse(response3);
    var response4 = logCurlRequest("PATCH", url + "?keepNull=false", { "hello": null, "numbers": { "four": 4 } });
    assert(response4.code === 202);
    logJsonResponse(response4);
    var response5 = logCurlRequest("GET", url);
    assert(response5.code === 200);
    logJsonResponse(response5);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPatchDocumentMerge
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"inhabitants":{"china":1366980000,"india":1263590000,"usa":319220000}});
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest("GET", url);
    assert(response.code === 200);
    logJsonResponse(response);
    var response = logCurlRequest("PATCH", url + "?mergeObjects=true", { "inhabitants": {"indonesia":252164800,"brazil":203553000 }});
    assert(response.code === 202);
    var response2 = logCurlRequest("GET", url);
    assert(response2.code === 200);
    logJsonResponse(response2);
    var response3 = logCurlRequest("PATCH", url + "?mergeObjects=false", { "inhabitants": { "pakistan":188346000 }});
    assert(response3.code === 202);
    logJsonResponse(response3);
    var response4 = logCurlRequest("GET", url);
    assert(response4.code === 200);
    logJsonResponse(response4);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}/{key}:
    delete:
      description: |2+
        If *silent* is not set to *true*, the body of the response contains a JSON
        object with the information about the identifier and the revision. The attribute
        *_id* contains the known *document-id* of the removed document, *_key*
        contains the key which uniquely identifies a document in a given collection,
        and the attribute *_rev* contains the document revision.
        If the *waitForSync* parameter is not specified or set to *false*,
        then the collection's default *waitForSync* behavior is applied.
        The *waitForSync* query parameter cannot be used to disable
        synchronization for collections that have a default *waitForSync*
        value of *true*.
        If the query parameter *returnOld* is *true*, then
        the complete previous revision of the document
        is returned under the *old* attribute in the result.
      operationId: removeDocument
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* in which the document is to be deleted.
        in: path
      - name: key
        schema:
          type: string
        required: true
        description: |+
          The document key.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until deletion operation has been synced to disk.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete previous revision of the changed
          document under the attribute *old* in the result.
        in: query
      - name: silent
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, an empty object will be returned as response. No meta-data
          will be returned for the removed document. This option can be used to
          save some network traffic.
        in: query
      - name: If-Match
        schema:
          type: string
        required: false
        description: |+
          You can conditionally remove a document based on a target revision id by
          using the *if-match* HTTP header.
        in: header
      responses:
        '200':
          description: |2+
            is returned if the document was removed successfully and
            *waitForSync* was *true*.
        '202':
          description: |2+
            is returned if the document was removed successfully and
            *waitForSync* was *false*.
        '404':
          description: |2+
            is returned if the collection or the document was not found.
            The response body contains an error document in this case.
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocument
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var document = db.products.save({"hello":"world"});
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest('DELETE', url);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentUnknownHandle
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var document = db.products.save({"hello":"world"});
    db.products.remove(document._id);
    var url = "/_api/document/" + document._id;
    var response = logCurlRequest('DELETE', url);
    assert(response.code === 404);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentIfMatchOther
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var document = db.products.save({"hello":"world"});
    var document2 = db.products.save({"hello2":"world"});
    var url = "/_api/document/" + document._id;
    var headers = {"If-Match":  "\"" + document2._rev + "\""};
    var response = logCurlRequest('DELETE', url, "", headers);
    assert(response.code === 412);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}




ArangoDB supports working with document in bulk. Bulk operations affect a
*single* collection. Using this API variant allows clients to amortize the
overhead of single requests over an entire batch of documents. Bulk operations
are **not guaranteed** to be executed serially, ArangoDB _may_ execute the
operations in parallel. This can translate into large performance improvements
especially in a cluster deployment.

ArangoDB will continue to process the remaining operations should an error
occur during the processing of one operation. Errors are returned _inline_ in
the response body as an error document (see below for more details).
Additionally the _X-Arango-Error-Codes_ header will contains a map of the
error codes that occurred together with their multiplicities, like
`1205:10,1210:17` which means that in 10 cases the error 1205
*illegal document handle* and in 17 cases the error 1210
*unique constraint violated* has happened.

Generally the bulk operations expect an input array and the result body will
contain a JSON array of the same length.

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}#get:
    put:
      description: |2+
        Returns the documents identified by their *_key* in the body objects.
        The body of the request _must_ contain a JSON array of either
        strings (the *_key* values to lookup) or search documents.
        A search document _must_ contain at least a value for the *_key* field.
        A value for `_rev` _may_ be specified to verify whether the document
        has the same revision value, unless _ignoreRevs_ is set to false.
        Cluster only: The search document _may_ contain
        values for the collection's pre-defined shard keys. Values for the shard keys
        are treated as hints to improve performance. Should the shard keys
        values be incorrect ArangoDB may answer with a *not found* error.
        The returned array of documents contain three special attributes: *_id* containing the document
        identifier, *_key* containing key which uniquely identifies a document
        in a given collection and *_rev* containing the revision.
      operationId: readDocuments
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* from which the documents are to be read.
        in: path
      - name: onlyget
        schema:
          type: boolean
        required: true
        description: |+
          This parameter is required to be **true**, otherwise a replace
          operation is executed!
        in: query
      - name: ignoreRevs
        schema:
          type: string
        required: false
        description: |+
          Should the value be *true* (the default)
          If a search document contains a value for the *_rev* field,
          then the document is only returned if it has the same revision value.
          Otherwise a precondition failed error is returned.
        in: query
      - name: x-arango-allow-dirty-read
        schema:
          type: boolean
        required: false
        description: |+
          Set this header to `true` to allow the Coordinator to ask any shard replica for
          the data, not only the shard leader. This may result in "dirty reads".
          The header is ignored if this operation is part of a Stream Transaction
          (`x-arango-trx-id` header). The header set when creating the transaction decides
          about dirty reads for the entire transaction, not the individual read operations.
        in: header
      - name: x-arango-trx-id
        schema:
          type: string
        required: false
        description: |+
          To make this operation a part of a Stream Transaction, set this header to the
          transaction ID returned by the `POST /_api/transaction/begin` call.
        in: header
      responses:
        '200':
          description: |2+
            is returned if no error happened
        '400':
          description: |2+
            is returned if the body does not contain a valid JSON representation
            of an array of documents. The response body contains
            an error document in this case.
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerReadMultiDocument
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.save({"_key":"doc1", "hello":"world"});
    db.products.save({"_key":"doc2", "say":"hi to mom"});
    var url = "/_api/document/products?onlyget=true";
    var body = '["doc1", {"_key":"doc2"}]';
    var response = logCurlRequest('PUT', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}#multiple:
    post:
      description: |2+
        Creates new documents from the documents given in the body, unless there
        is already a document with the *_key* given. If no *_key* is given, a new
        unique *_key* is generated automatically.
        The result body will contain a JSON array of the
        same length as the input array, and each entry contains the result
        of the operation for the corresponding input. In case of an error
        the entry is a document with attributes *error* set to *true* and
        errorCode set to the error code that has happened.
        Possibly given *_id* and *_rev* attributes in the body are always ignored,
        the URL part or the query parameter collection respectively counts.
        If *silent* is not set to *true*, the body of the response contains an
        array of JSON objects with the following attributes:
          - *_id* contains the document identifier of the newly created document
          - *_key* contains the document key
          - *_rev* contains the document revision
        If the collection parameter *waitForSync* is *false*, then the call
        returns as soon as the documents have been accepted. It will not wait
        until the documents have been synced to disk.
        Optionally, the query parameter *waitForSync* can be used to force
        synchronization of the document creation operation to disk even in
        case that the *waitForSync* flag had been disabled for the entire
        collection. Thus, the *waitForSync* query parameter can be used to
        force synchronization of just this specific operations. To use this,
        set the *waitForSync* parameter to *true*. If the *waitForSync*
        parameter is not specified or set to *false*, then the collection's
        default *waitForSync* behavior is applied. The *waitForSync* query
        parameter cannot be used to disable synchronization for collections
        that have a default *waitForSync* value of *true*.
        If the query parameter *returnNew* is *true*, then, for each
        generated document, the complete new document is returned under
        the *new* attribute in the result.
        Should an error have occurred with some of the documents
        the additional HTTP header *X-Arango-Error-Codes* is set, which
        contains a map of the error codes that occurred together with their
        multiplicities, as in: *1205:10,1210:17* which means that in 10
        cases the error 1205 "illegal document handle" and in 17 cases the
        error 1210 "unique constraint violated" has happened.
      operationId: insertDocuments
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* in which the documents are to be created.
        in: path
      - name: collection
        schema:
          type: string
        required: false
        description: |+
          The name of the collection. This is only for backward compatibility.
          In ArangoDB versions < 3.0, the URL path was */_api/document* and
          this query parameter was required. This combination still works, but
          the recommended way is to specify the collection in the URL path.
        in: query
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until document has been synced to disk.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Additionally return the complete new document under the attribute *new*
          in the result.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Additionally return the complete old document under the attribute *old*
          in the result. Only available if the overwrite option is used.
        in: query
      - name: silent
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, an empty object will be returned as response. No meta-data
          will be returned for the created document. This option can be used to
          save some network traffic.
        in: query
      - name: overwrite
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, the insert becomes a replace-insert. If a document with the
          same *_key* already exists the new document is not rejected with unique
          constraint violated but will replace the old document. Note that operations
          with `overwrite` parameter require a `_key` attribute in the request payload,
          therefore they can only be performed on collections sharded by `_key`.
        in: query
      - name: overwriteMode
        schema:
          type: string
        required: false
        description: |+
          This option supersedes *overwrite* and offers the following modes
          - `"ignore"` if a document with the specified *_key* value exists already,
            nothing will be done and no write operation will be carried out. The
            insert operation will return success in this case. This mode does not
            support returning the old document version using `RETURN OLD`. When using
            `RETURN NEW`, *null* will be returned in case the document already existed.
          - `"replace"` if a document with the specified *_key* value exists already,
            it will be overwritten with the specified document value. This mode will
            also be used when no overwrite mode is specified but the *overwrite*
            flag is set to *true*.
          - `"update"` if a document with the specified *_key* value exists already,
            it will be patched (partially updated) with the specified document value.
            The overwrite mode can be further controlled via the *keepNull* and
            *mergeObjects* parameters.
          - `"conflict"` if a document with the specified *_key* value exists already,
            return a unique constraint violation error so that the insert operation
            fails. This is also the default behavior in case the overwrite mode is
            not set, and the *overwrite* flag is *false* or not set either.
        in: query
      - name: keepNull
        schema:
          type: boolean
        required: false
        description: |+
          If the intention is to delete existing attributes with the update-insert
          command, the URL query parameter *keepNull* can be used with a value of
          *false*. This will modify the behavior of the patch command to remove any
          attributes from the existing document that are contained in the patch document
          with an attribute value of *null*.
          This option controls the update-insert behavior only.
        in: query
      - name: mergeObjects
        schema:
          type: boolean
        required: false
        description: |+
          Controls whether objects (not arrays) will be merged if present in both the
          existing and the update-insert document. If set to *false*, the value in the
          patch document will overwrite the existing document's value. If set to *true*,
          objects will be merged. The default is *true*.
          This option controls the update-insert behavior only.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  description: |+
                    An array of documents to create.
              required:
              - data
      responses:
        '201':
          description: |2+
            is returned if *waitForSync* was *true* and operations were processed.
        '202':
          description: |2+
            is returned if *waitForSync* was *false* and operations were processed.
        '400':
          description: |2+
            is returned if the body does not contain a valid JSON representation
            of an array of documents. The response body contains
            an error document in this case.
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostMulti1
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/document/" + cn;
    var body = '[{"Hello":"Earth"}, {"Hello":"Venus"}, {"Hello":"Mars"}]';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 202);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostMulti2
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/document/" + cn + "?returnNew=true";
    var body = '[{"Hello":"Earth"}, {"Hello":"Venus"}, {"Hello":"Mars"}]';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 202);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerPostBadJsonMulti
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/document/" + cn;
    var body = '[{ "_key": 111 }, {"_key":"abc"}]';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 202);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}:
    put:
      description: |2+
        Replaces multiple documents in the specified collection with the
        ones in the body, the replaced documents are specified by the *_key*
        attributes in the body documents.
        The value of the `_key` attribute as well as attributes
        used as sharding keys may not be changed.
        If *ignoreRevs* is *false* and there is a *_rev* attribute in a
        document in the body and its value does not match the revision of
        the corresponding document in the database, the precondition is
        violated.
        Cluster only: The replace documents _may_ contain
        values for the collection's pre-defined shard keys. Values for the shard keys
        are treated as hints to improve performance. Should the shard keys
        values be incorrect ArangoDB may answer with a *not found* error.
        Optionally, the query parameter *waitForSync* can be used to force
        synchronization of the document replacement operation to disk even in case
        that the *waitForSync* flag had been disabled for the entire collection.
        Thus, the *waitForSync* query parameter can be used to force synchronization
        of just specific operations. To use this, set the *waitForSync* parameter
        to *true*. If the *waitForSync* parameter is not specified or set to
        *false*, then the collection's default *waitForSync* behavior is
        applied. The *waitForSync* query parameter cannot be used to disable
        synchronization for collections that have a default *waitForSync* value
        of *true*.
        The body of the response contains a JSON array of the same length
        as the input array with the information about the identifier and the
        revision of the replaced documents. In each entry, the attribute
        *_id* contains the known *document-id* of each updated document,
        *_key* contains the key which uniquely identifies a document in a
        given collection, and the attribute *_rev* contains the new document
        revision. In case of an error or violated precondition, an error
        object with the attribute *error* set to *true* and the attribute
        *errorCode* set to the error code is built.
        If the query parameter *returnOld* is *true*, then, for each
        generated document, the complete previous revision of the document
        is returned under the *old* attribute in the result.
        If the query parameter *returnNew* is *true*, then, for each
        generated document, the complete new document is returned under
        the *new* attribute in the result.
        Note that if any precondition is violated or an error occurred with
        some of the documents, the return code is still 201 or 202, but
        the additional HTTP header *X-Arango-Error-Codes* is set, which
        contains a map of the error codes that occurred together with their
        multiplicities, as in: *1200:17,1205:10* which means that in 17
        cases the error 1200 "revision conflict" and in 10 cases the error
        1205 "illegal document handle" has happened.
      operationId: replaceDocuments
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                documents:
                  type: object
                  description: |+
                    A JSON representation of an array of documents.
              required:
              - documents
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          This URL parameter is the name of the collection in which the
          documents are replaced.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until the new documents have been synced to disk.
        in: query
      - name: ignoreRevs
        schema:
          type: boolean
        required: false
        description: |+
          By default, or if this is set to *true*, the *_rev* attributes in
          the given documents are ignored. If this is set to *false*, then
          any *_rev* attribute given in a body document is taken as a
          precondition. The document is only replaced if the current revision
          is the one specified.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete previous revision of the changed
          documents under the attribute *old* in the result.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete new documents under the attribute *new*
          in the result.
        in: query
      responses:
        '201':
          description: |2+
            is returned if *waitForSync* was *true* and operations were processed.
        '202':
          description: |2+
            is returned if *waitForSync* was *false* and operations were processed.
        '400':
          description: |2+
            is returned if the body does not contain a valid JSON representation
            of an array of documents. The response body contains
            an error document in this case.
      tags:
      - Documents
```



<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}:
    patch:
      description: |2+
        Partially updates documents, the documents to update are specified
        by the *_key* attributes in the body objects. The body of the
        request must contain a JSON array of document updates with the
        attributes to patch (the patch documents). All attributes from the
        patch documents will be added to the existing documents if they do
        not yet exist, and overwritten in the existing documents if they do
        exist there.
        The value of the `_key` attribute as well as attributes
        used as sharding keys may not be changed.
        Setting an attribute value to *null* in the patch documents will cause a
        value of *null* to be saved for the attribute by default.
        If *ignoreRevs* is *false* and there is a *_rev* attribute in a
        document in the body and its value does not match the revision of
        the corresponding document in the database, the precondition is
        violated.
        Cluster only: The patch document _may_ contain
        values for the collection's pre-defined shard keys. Values for the shard keys
        are treated as hints to improve performance. Should the shard keys
        values be incorrect ArangoDB may answer with a *not found* error
        Optionally, the query parameter *waitForSync* can be used to force
        synchronization of the document replacement operation to disk even in case
        that the *waitForSync* flag had been disabled for the entire collection.
        Thus, the *waitForSync* query parameter can be used to force synchronization
        of just specific operations. To use this, set the *waitForSync* parameter
        to *true*. If the *waitForSync* parameter is not specified or set to
        *false*, then the collection's default *waitForSync* behavior is
        applied. The *waitForSync* query parameter cannot be used to disable
        synchronization for collections that have a default *waitForSync* value
        of *true*.
        The body of the response contains a JSON array of the same length
        as the input array with the information about the identifier and the
        revision of the updated documents. In each entry, the attribute
        *_id* contains the known *document-id* of each updated document,
        *_key* contains the key which uniquely identifies a document in a
        given collection, and the attribute *_rev* contains the new document
        revision. In case of an error or violated precondition, an error
        object with the attribute *error* set to *true* and the attribute
        *errorCode* set to the error code is built.
        If the query parameter *returnOld* is *true*, then, for each
        generated document, the complete previous revision of the document
        is returned under the *old* attribute in the result.
        If the query parameter *returnNew* is *true*, then, for each
        generated document, the complete new document is returned under
        the *new* attribute in the result.
        Note that if any precondition is violated or an error occurred with
        some of the documents, the return code is still 201 or 202, but
        the additional HTTP header *X-Arango-Error-Codes* is set, which
        contains a map of the error codes that occurred together with their
        multiplicities, as in: *1200:17,1205:10* which means that in 17
        cases the error 1200 "revision conflict" and in 10 cases the error
        1205 "illegal document handle" has happened.
      operationId: updateDocuments
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                documents:
                  type: object
                  description: |+
                    A JSON representation of an array of document updates as objects.
              required:
              - documents
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Name of the *collection* in which the documents are to be updated.
        in: path
      - name: keepNull
        schema:
          type: boolean
        required: false
        description: |+
          If the intention is to delete existing attributes with the patch
          command, the URL query parameter *keepNull* can be used with a value
          of *false*. This will modify the behavior of the patch command to
          remove any attributes from the existing document that are contained
          in the patch document with an attribute value of *null*.
        in: query
      - name: mergeObjects
        schema:
          type: boolean
        required: false
        description: |+
          Controls whether objects (not arrays) will be merged if present in
          both the existing and the patch document. If set to *false*, the
          value in the patch document will overwrite the existing document's
          value. If set to *true*, objects will be merged. The default is
          *true*.
        in: query
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until the new documents have been synced to disk.
        in: query
      - name: ignoreRevs
        schema:
          type: boolean
        required: false
        description: |+
          By default, or if this is set to *true*, the *_rev* attributes in
          the given documents are ignored. If this is set to *false*, then
          any *_rev* attribute given in a body document is taken as a
          precondition. The document is only updated if the current revision
          is the one specified.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete previous revision of the changed
          documents under the attribute *old* in the result.
        in: query
      - name: returnNew
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete new documents under the attribute *new*
          in the result.
        in: query
      responses:
        '201':
          description: |2+
            is returned if *waitForSync* was *true* and operations were processed.
        '202':
          description: |2+
            is returned if *waitForSync* was *false* and operations were processed.
        '400':
          description: |2+
            is returned if the body does not contain a valid JSON representation
            of an array of documents. The response body contains
            an error document in this case.
      tags:
      - Documents
```



<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/document/{collection}:
    delete:
      description: |2+
        The body of the request is an array consisting of selectors for
        documents. A selector can either be a string with a key or a string
        with a document identifier or an object with a *_key* attribute. This
        API call removes all specified documents from *collection*.
        If the *ignoreRevs* query parameter is *false* and the
        selector is an object and has a *_rev* attribute, it is a
        precondition that the actual revision of the removed document in the
        collection is the specified one.
        The body of the response is an array of the same length as the input
        array. For each input selector, the output contains a JSON object
        with the information about the outcome of the operation. If no error
        occurred, an object is built in which the attribute *_id* contains
        the known *document-id* of the removed document, *_key* contains
        the key which uniquely identifies a document in a given collection,
        and the attribute *_rev* contains the document revision. In case of
        an error, an object with the attribute *error* set to *true* and
        *errorCode* set to the error code is built.
        If the *waitForSync* parameter is not specified or set to *false*,
        then the collection's default *waitForSync* behavior is applied.
        The *waitForSync* query parameter cannot be used to disable
        synchronization for collections that have a default *waitForSync*
        value of *true*.
        If the query parameter *returnOld* is *true*, then
        the complete previous revision of the document
        is returned under the *old* attribute in the result.
        Note that if any precondition is violated or an error occurred with
        some of the documents, the return code is still 200 or 202, but
        the additional HTTP header *X-Arango-Error-Codes* is set, which
        contains a map of the error codes that occurred together with their
        multiplicities, as in: *1200:17,1205:10* which means that in 17
        cases the error 1200 "revision conflict" and in 10 cases the error
        1205 "illegal document handle" has happened.
      operationId: removeDocuments
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                array:
                  type: object
                  description: |+
                    A JSON array of strings or documents.
              required:
              - array
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          Collection from which documents are removed.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until deletion operation has been synced to disk.
        in: query
      - name: returnOld
        schema:
          type: boolean
        required: false
        description: |+
          Return additionally the complete previous revision of the changed
          document under the attribute *old* in the result.
        in: query
      - name: ignoreRevs
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, ignore any *_rev* attribute in the selectors. No
          revision check is performed. If set to *false* then revisions are checked.
          The default is *true*.
        in: query
      responses:
        '200':
          description: |2+
            is returned if *waitForSync* was *true*.
        '202':
          description: |2+
            is returned if *waitForSync* was *false*.
      tags:
      - Documents
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentKeyMulti
release: stable
version: '3.10'
---
  ~ var assertEqual = require("jsunity").jsUnity.assertions.assertEqual;
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var documents = db.products.save( [
      { "_key": "1", "type": "tv" },
      { "_key": "2", "type": "cookbook" }
    ] );
    var url = "/_api/document/" + cn;
    var body = [ "1", "2" ];
    var response = logCurlRequest('DELETE', url, body);
    assert(response.code === 200);
    assertEqual(JSON.parse(response.body), documents);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentIdentifierMulti
release: stable
version: '3.10'
---
  ~ var assertEqual = require("jsunity").jsUnity.assertions.assertEqual;
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var documents = db.products.save( [
      { "_key": "1", "type": "tv" },
      { "_key": "2", "type": "cookbook" }
    ] );
    var url = "/_api/document/" + cn;
    var body = [ "products/1", "products/2" ];
    var response = logCurlRequest('DELETE', url, body);
    assert(response.code === 200);
    assertEqual(JSON.parse(response.body), documents);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentObjectMulti
release: stable
version: '3.10'
---
  ~ var assertEqual = require("jsunity").jsUnity.assertions.assertEqual;
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var documents = db.products.save( [
      { "_key": "1", "type": "tv" },
      { "_key": "2", "type": "cookbook" }
    ] );
    var url = "/_api/document/" + cn;
    var body = [ { "_key": "1" }, { "_key": "2" } ];
    var response = logCurlRequest('DELETE', url, body);
    assert(response.code === 200);
    assertEqual(JSON.parse(response.body), documents);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentUnknownMulti
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._drop("other");
    db._create(cn, { waitForSync: true });
    db._create("other", { waitForSync: true });
    var documents = db.products.save( [
      { "_key": "1", "type": "tv" },
      { "_key": "2", "type": "cookbook" }
    ] );
    db.products.remove(documents);
    db.other.save( { "_key": "2" } );
    var url = "/_api/document/" + cn;
    var body = [ "1", "other/2" ];
    var response = logCurlRequest('DELETE', url, body);
    assert(response.code === 202);
    response.parsedBody.forEach(function(doc) {
      assert(doc.error === true);
      assert(doc.errorNum === 1202);
    });
    logJsonResponse(response);
  ~ db._drop(cn);
  ~ db._drop("other");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentRevMulti
release: stable
version: '3.10'
---
  ~ var assertEqual = require("jsunity").jsUnity.assertions.assertEqual;
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var documents = db.products.save( [
      { "_key": "1", "type": "tv" },
      { "_key": "2", "type": "cookbook" }
    ] );
    var url = "/_api/document/" + cn + "?ignoreRevs=false";
    var body = [
      { "_key": "1", "_rev": documents[0]._rev },
      { "_key": "2", "_rev": documents[1]._rev }
    ];
    var response = logCurlRequest('DELETE', url, body);
    assert(response.code === 200);
    assertEqual(JSON.parse(response.body), documents);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDocumentHandlerDeleteDocumentRevConflictMulti
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var documents = db.products.save( [
      { "_key": "1", "type": "tv" },
      { "_key": "2", "type": "cookbook" }
    ] );
    var url = "/_api/document/" + cn + "?ignoreRevs=false";
    var body = [
      { "_key": "1", "_rev": "non-matching revision" },
      { "_key": "2", "_rev": "non-matching revision" }
    ];
    var response = logCurlRequest('DELETE', url, body);
    assert(response.code === 202);
    response.parsedBody.forEach(function(doc) {
      assert(doc.error === true);
      assert(doc.errorNum === 1200);
    });
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

