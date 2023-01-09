---
fileID: bulk-imports
title: HTTP Interface for Bulk Imports
weight: 2060
description: 
layout: default
---
ArangoDB provides an HTTP interface to import multiple documents at once into a
collection. This is known as a bulk import.

The data uploaded must be provided in JSON format. There are two mechanisms to
import the data:

* self-contained JSON documents: in this case, each document contains all 
  attribute names and values. Attribute names may be completely different
  among the documents uploaded
* attribute names plus document data: in this case, the first array must 
  contain the attribute names of the documents that follow. The following arrays
  containing only the attribute values. Attribute values will be mapped to the 
  attribute names by positions.

The endpoint address is */_api/import* for both input mechanisms. Data must be
sent to this URL using an HTTP POST request. The data to import must be
contained in the body of the POST request.

The *collection* query parameter must be used to specify the target collection for
the import. Importing data into a non-existing collection will produce an error. 

The *waitForSync* query parameter can be set to *true* to make the import only 
return if all documents have been synced to disk.

The *complete* query parameter can be set to *true* to make the entire import fail if
any of the uploaded documents is invalid and cannot be imported. In this case,
no documents will be imported by the import run, even if a failure happens at the
end of the import. 

If *complete* has a value other than *true*, valid documents will be imported while 
invalid documents will be rejected, meaning only some of the uploaded documents 
might have been imported.

The *details* query parameter can be set to *true* to make the import API return
details about documents that could not be imported. If *details* is *true*, then
the result will also contain a *details* attribute which is an array of detailed
error messages. If the *details* is set to *false* or omitted, no details will be
returned.
```http-spec
openapi: 3.0.2
paths:
  /_api/import#document:
    post:
      description: |2+
        Creates documents in the collection identified by `collection-name`.
        The first line of the request body must contain a JSON-encoded array of
        attribute names. All following lines in the request body must contain
        JSON-encoded arrays of attribute values. Each line is interpreted as a
        separate document, and the values specified will be mapped to the array
        of attribute names specified in the first header line.
        The response is a JSON object with the following attributes:
        - `created`: number of documents imported.
        - `errors`: number of documents that were not imported due to an error.
        - `empty`: number of empty lines found in the input (will only contain a
          value greater zero for types `documents` or `auto`).
        - `updated`: number of updated/replaced documents (in case `onDuplicate`
          was set to either `update` or `replace`).
        - `ignored`: number of failed but ignored insert operations (in case
          `onDuplicate` was set to `ignore`).
        - `details`: if query parameter `details` is set to true, the result will
          contain a `details` attribute which is an array with more detailed
          information about which documents could not be inserted.
      operationId: ' RestImportHandler#document'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                documents:
                  type: string
                  description: |+
                    The body must consist of JSON-encoded arrays of attribute values, with one
                    line per document. The first row of the request must be a JSON-encoded
                    array of attribute names. These attribute names are used for the data in the
                    subsequent lines.
              required:
              - documents
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The collection name.
        in: query
      - name: fromPrefix
        schema:
          type: string
        required: false
        description: |+
          An optional prefix for the values in `_from` attributes. If specified, the
          value is automatically prepended to each `_from` input value. This allows
          specifying just the keys for `_from`.
        in: query
      - name: toPrefix
        schema:
          type: string
        required: false
        description: |+
          An optional prefix for the values in `_to` attributes. If specified, the
          value is automatically prepended to each `_to` input value. This allows
          specifying just the keys for `_to`.
        in: query
      - name: overwrite
        schema:
          type: boolean
        required: false
        description: |+
          If this parameter has a value of `true` or `yes`, then all data in the
          collection will be removed prior to the import. Note that any existing
          index definitions will be preserved.
        in: query
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until documents have been synced to disk before returning.
        in: query
      - name: onDuplicate
        schema:
          type: string
        required: false
        description: |+
          Controls what action is carried out in case of a unique key constraint
          violation. Possible values are
          - `error` this will not import the current document because of the unique
            key constraint violation. This is the default setting.
          - `update` this will update an existing document in the database with the
            data specified in the request. Attributes of the existing document that
            are not present in the request will be preserved.
          - `replace` this will replace an existing document in the database with the
            data specified in the request.
          - `ignore` this will not update an existing document and simply ignore the
            error caused by the unique key constraint violation.
          Note that `update`, `replace` and `ignore` will only work when the
          import document in the request contains the `_key` attribute. `update` and
          `replace` may also fail because of secondary unique key constraint
          violations.
        in: query
      - name: complete
        schema:
          type: boolean
        required: false
        description: |+
          If set to `true` or `yes`, it will make the whole import fail if any error
          occurs. Otherwise the import will continue even if some documents cannot
          be imported.
        in: query
      - name: details
        schema:
          type: boolean
        required: false
        description: |+
          If set to `true` or `yes`, the result will include an attribute `details`
          with details about documents that could not be imported.
        in: query
      responses:
        '201':
          description: |2
            is returned if all documents could be imported successfully.
        '400':
          description: |2
            is returned if `type` contains an invalid value, no `collection` is
            specified, the documents are incorrectly encoded, or the request
            is malformed.
        '404':
          description: |2
            is returned if `collection` or the `_from` or `_to` attributes of an
            imported edge refer to an unknown collection.
        '409':
          description: |2
            is returned if the import would trigger a unique key violation and
            `complete` is set to `true`.
        '500':
          description: |2
            is returned if the server cannot auto-generate a document key (out of keys
            error) for a document with no user-defined key.
      tags:
      - Bulk
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestImportCsvExample
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var body = '[ "_key", "value1", "value2" ]\n' +
               '[ "abc", 25, "test" ]\n\n' +
               '[ "foo", "bar", "baz" ]';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn, body);
    assert(response.code === 201);
    var r = JSON.parse(response.body)
    assert(r.created === 2);
    assert(r.errors === 0);
    assert(r.empty === 1);
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
name: RestImportCsvEdge
release: stable
version: '3.10'
---
    var cn = "links";
    db._drop(cn);
    db._createEdgeCollection(cn);
    db._drop("products");
    db._create("products");
    var body = '[ "_from", "_to", "name" ]\n' +
               '[ "products/123","products/234", "some name" ]\n' +
               '[ "products/332", "products/abc", "other name" ]';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn, body);
    assert(response.code === 201);
    var r = JSON.parse(response.body)
    assert(r.created === 2);
    assert(r.errors === 0);
    assert(r.empty === 0);
    logJsonResponse(response);
    db._drop(cn);
    db._drop("products");
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
name: RestImportCsvEdgeInvalid
release: stable
version: '3.10'
---
    var cn = "links";
    db._drop(cn);
    db._createEdgeCollection(cn);
    var body = '[ "name" ]\n[ "some name" ]\n[ "other name" ]';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&details=true", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body)
    assert(r.created === 0);
    assert(r.errors === 2);
    assert(r.empty === 0);
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
name: RestImportCsvUniqueContinue
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var body = '[ "_key", "value1", "value2" ]\n' +
               '[ "abc", 25, "test" ]\n' +
               '["abc", "bar", "baz" ]';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&details=true", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body)
    assert(r.created === 1);
    assert(r.errors === 1);
    assert(r.empty === 0);
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
name: RestImportCsvUniqueFail
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var body = '[ "_key", "value1", "value2" ]\n' +
               '[ "abc", 25, "test" ]\n' +
               '["abc", "bar", "baz" ]';
    var response = logCurlRequest('POST', "/_api/import?collection=" + cn + "&complete=true", body);
    assert(response.code === 409);
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
name: RestImportCsvInvalidCollection
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var body = '[ "_key", "value1", "value2" ]\n' +
               '[ "abc", 25, "test" ]\n' +
               '["foo", "bar", "baz" ]';
    var response = logCurlRequest('POST', "/_api/import?collection=" + cn, body);
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
name: RestImportCsvInvalidBody
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var body = '{ "_key": "foo", "value1": "bar" }';
    var response = logCurlRequest('POST', "/_api/import?collection=" + cn, body);
    assert(response.code === 400);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/import#json:
    post:
      description: |2+
        Creates documents in the collection identified by `collection-name`.
        The JSON representations of the documents must be passed as the body of the
        POST request. The request body can either consist of multiple lines, with
        each line being a single stand-alone JSON object, or a singe JSON array with
        sub-objects.
        The response is a JSON object with the following attributes:
        - `created`: number of documents imported.
        - `errors`: number of documents that were not imported due to an error.
        - `empty`: number of empty lines found in the input (will only contain a
          value greater zero for types `documents` or `auto`).
        - `updated`: number of updated/replaced documents (in case `onDuplicate`
          was set to either `update` or `replace`).
        - `ignored`: number of failed but ignored insert operations (in case
          `onDuplicate` was set to `ignore`).
        - `details`: if query parameter `details` is set to true, the result will
          contain a `details` attribute which is an array with more detailed
          information about which documents could not be inserted.
      operationId: ' RestImportHandler'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                documents:
                  type: string
                  description: |+
                    The body must either be a JSON-encoded array of objects or a string with
                    multiple JSON objects separated by newlines.
              required:
              - documents
      parameters:
      - name: type
        schema:
          type: string
        required: true
        description: |+
          Determines how the body of the request will be interpreted. `type` can have
          the following values
          - `documents` when this type is used, each line in the request body is
            expected to be an individual JSON-encoded document. Multiple JSON objects
            in the request body need to be separated by newlines.
          - `list` when this type is used, the request body must contain a single
            JSON-encoded array of individual objects to import.
          - `auto` if set, this will automatically determine the body type (either
            `documents` or `list`).
        in: query
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The collection name.
        in: query
      - name: fromPrefix
        schema:
          type: string
        required: false
        description: |+
          An optional prefix for the values in `_from` attributes. If specified, the
          value is automatically prepended to each `_from` input value. This allows
          specifying just the keys for `_from`.
        in: query
      - name: toPrefix
        schema:
          type: string
        required: false
        description: |+
          An optional prefix for the values in `_to` attributes. If specified, the
          value is automatically prepended to each `_to` input value. This allows
          specifying just the keys for `_to`.
        in: query
      - name: overwrite
        schema:
          type: boolean
        required: false
        description: |+
          If this parameter has a value of `true` or `yes`, then all data in the
          collection will be removed prior to the import. Note that any existing
          index definitions will be preserved.
        in: query
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          Wait until documents have been synced to disk before returning.
        in: query
      - name: onDuplicate
        schema:
          type: string
        required: false
        description: |+
          Controls what action is carried out in case of a unique key constraint
          violation. Possible values are
          - `error` this will not import the current document because of the unique
            key constraint violation. This is the default setting.
          - `update` this will update an existing document in the database with the
            data specified in the request. Attributes of the existing document that
            are not present in the request will be preserved.
          - `replace` this will replace an existing document in the database with the
            data specified in the request.
          - `ignore` this will not update an existing document and simply ignore the
            error caused by a unique key constraint violation.
          Note that that `update`, `replace` and `ignore` will only work when the
          import document in the request contains the `_key` attribute. `update` and
          `replace` may also fail because of secondary unique key constraint violations.
        in: query
      - name: complete
        schema:
          type: boolean
        required: false
        description: |+
          If set to `true` or `yes`, it will make the whole import fail if any error
          occurs. Otherwise the import will continue even if some documents cannot
          be imported.
        in: query
      - name: details
        schema:
          type: boolean
        required: false
        description: |+
          If set to `true` or `yes`, the result will include an attribute `details`
          with details about documents that could not be imported.
        in: query
      responses:
        '201':
          description: |2
            is returned if all documents could be imported successfully.
        '400':
          description: |2
            is returned if `type` contains an invalid value, no `collection` is
            specified, the documents are incorrectly encoded, or the request
            is malformed.
        '404':
          description: |2
            is returned if `collection` or the `_from` or `_to` attributes of an
            imported edge refer to an unknown collection.
        '409':
          description: |2
            is returned if the import would trigger a unique key violation and
            `complete` is set to `true`.
        '500':
          description: |2
            is returned if the server cannot auto-generate a document key (out of keys
            error) for a document with no user-defined key.
      tags:
      - Bulk
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestImportJsonList
release: stable
version: '3.10'
---
    db._flushCache();
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db._flushCache();
    var body = [
      { _key: "abc", value1: 25, value2: "test", allowed: true },
      { _key: "foo", name: "baz" },
      { name: { detailed: "detailed name", short: "short name" } }
    ];
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&type=list", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body);
    assert(r.created === 3);
    assert(r.errors === 0);
    assert(r.empty === 0);
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
name: RestImportJsonLines
release: stable
version: '3.10'
---
    db._flushCache();
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db._flushCache();
    var body = '{ "_key": "abc", "value1": 25, "value2": "test",' +
               '"allowed": true }\n' +
               '{ "_key": "foo", "name": "baz" }\n\n' +
               '{ "name": {' +
               ' "detailed": "detailed name", "short": "short name" } }\n';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn
    + "&type=documents", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body);
    assert(r.created === 3);
    assert(r.errors === 0);
    assert(r.empty === 1);
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
name: RestImportJsonType
release: stable
version: '3.10'
---
    db._flushCache();
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db._flushCache();
    var body = [
      { _key: "abc", value1: 25, value2: "test", allowed: true },
      { _key: "foo", name: "baz" },
      { name: { detailed: "detailed name", short: "short name" } }
    ];
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&type=auto", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body);
    assert(r.created === 3);
    assert(r.errors === 0);
    assert(r.empty === 0);
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
name: RestImportJsonEdge
release: stable
version: '3.10'
---
    db._flushCache();
    var cn = "links";
    db._drop(cn);
    db._createEdgeCollection(cn);
    db._drop("products");
    db._create("products");
    db._flushCache();
    var body = '{ "_from": "products/123", "_to": "products/234" }\n' +
               '{"_from": "products/332", "_to": "products/abc", ' +
               '  "name": "other name" }';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&type=documents", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body);
    assert(r.created === 2);
    assert(r.errors === 0);
    assert(r.empty === 0);
    logJsonResponse(response);
    db._drop(cn);
    db._drop("products");
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
name: RestImportJsonEdgeInvalid
release: stable
version: '3.10'
---
    db._flushCache();
    var cn = "links";
    db._drop(cn);
    db._createEdgeCollection(cn);
    db._flushCache();
    var body = [ { name: "some name" } ];
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&type=list&details=true", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body);
    assert(r.created === 0);
    assert(r.errors === 1);
    assert(r.empty === 0);
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
name: RestImportJsonUniqueContinue
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db._flushCache();
    var body = '{ "_key": "abc", "value1": 25, "value2": "test" }\n' +
               '{ "_key": "abc", "value1": "bar", "value2": "baz" }';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn
    + "&type=documents&details=true", body);
    assert(response.code === 201);
    var r = JSON.parse(response.body);
    assert(r.created === 1);
    assert(r.errors === 1);
    assert(r.empty === 0);
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
name: RestImportJsonUniqueFail
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db._flushCache();
    var body = '{ "_key": "abc", "value1": 25, "value2": "test" }\n' +
               '{ "_key": "abc", "value1": "bar", "value2": "baz" }';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&type=documents&complete=true", body);
    assert(response.code === 409);
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
name: RestImportJsonInvalidCollection
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var body = '{ "name": "test" }';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&type=documents", body);
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
name: RestImportJsonInvalidBody
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db._flushCache();
    var body = '{ }';
    var response = logCurlRequestRaw('POST', "/_api/import?collection=" + cn + "&type=list", body);
    assert(response.code === 400);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

