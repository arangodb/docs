---
fileID: views-search-alias
title: search-alias Views HTTP API
weight: 2125
description: 
layout: default
---
```http-spec
openapi: 3.0.2
paths:
  /_api/view#searchalias:
    post:
      description: |2+
        Creates a new View with a given name and properties if it does not
        already exist.
      operationId: ' createViewSearchAlias'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    The name of the View.
                type:
                  type: string
                  description: |+
                    The type of the View. Must be equal to `"search-alias"`.
                    This option is immutable.
                indexes:
                  $ref: '#/components/schemas/post_api_view_searchalias_indexes'
                  items:
                    type: post_api_view_searchalias_indexes
                  description: |+
                    A list of inverted indexes to add to the View.
              required:
              - name
              - type
      responses:
        '400':
          description: |2
            If the *name* or *type* attribute are missing or invalid, then an *HTTP 400*
            error is returned.
        '409':
          description: |2
            If a View called *name* already exists, then an *HTTP 409* error is returned.
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewPostViewSearchAlias
release: stable
version: '3.10'
---
    var url = "/_api/view";
    var body = {
      name: "testViewBasics",
      type: "search-alias"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
    db._flushCache();
    db._dropView("testViewBasics");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/view/{view-name}:
    get:
      description: |2+
        The result is an object briefly describing the View with the following attributes:
        - *id*: The identifier of the View
        - *name*: The name of the View
        - *type*: The type of the View as string
      operationId: ' getViews:Properties'
      parameters:
      - name: view-name
        schema:
          type: string
        required: true
        description: |+
          The name of the View.
        in: path
      responses:
        '404':
          description: |2
            If the *view-name* is unknown, then a *HTTP 404* is returned.
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewGetViewIdentifierArangoSearch
release: stable
version: '3.10'
---
    var viewName = "testView";
    var viewType = "arangosearch";
    var view = db._createView(viewName, viewType);
    var url = "/_api/view/"+ view._id;
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._dropView("testView");
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
name: RestViewGetViewNameArangoSearch
release: stable
version: '3.10'
---
    var viewName = "testView";
    var viewType = "arangosearch";
    var view = db._createView(viewName, viewType);
    var url = "/_api/view/testView";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._dropView("testView");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/view/{view-name}/properties:
    get:
      description: |2+
        The result is an object with a full description of a specific View, including
        View type dependent properties.
      operationId: ' getView'
      parameters:
      - name: view-name
        schema:
          type: string
        required: true
        description: |+
          The name of the View.
        in: path
      responses:
        '400':
          description: |2
            If the *view-name* is missing, then a *HTTP 400* is returned.
        '404':
          description: |2
            If the *view-name* is unknown, then a *HTTP 404* is returned.
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewGetViewPropertiesIdentifierArangoSearch
release: stable
version: '3.10'
---
    var viewName = "products";
    var viewType = "arangosearch";
    var view = db._createView(viewName, viewType);
    var url = "/_api/view/"+ view._id + "/properties";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._dropView(viewName);
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
name: RestViewGetViewPropertiesNameArangoSearch
release: stable
version: '3.10'
---
    var viewName = "products";
    var viewType = "arangosearch";
    var view = db._createView(viewName, viewType);
    var url = "/_api/view/products/properties";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._dropView(viewName);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/view:
    get:
      description: |2+
        Returns an object containing a listing of all Views in a database, regardless
        of their type. It is an array of objects with the following attributes:
        - *id*
        - *name*
        - *type*
      operationId: ' getViews:AllViews'
      responses:
        '200':
          description: |2
            The list of Views
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewGetAllViews
release: stable
version: '3.10'
---
    var url = "/_api/view";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/view/{view-name}/properties#searchalias:
    put:
      description: |2+
        Replaces the list of indexes of a `search-alias` View.
      operationId: ' modifyViewSearchAlias'
      parameters:
      - name: view-name
        schema:
          type: string
        required: true
        description: |+
          The name of the View.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                indexes:
                  $ref: '#/components/schemas/put_api_view_searchalias_indexes'
                  items:
                    type: put_api_view_searchalias_indexes
                  description: |+
                    A list of inverted indexes for the View.
              required: []
      responses:
        '200':
          description: |2
            On success, an object with the following attributes is returned
        '400':
          description: |2
            If the *view-name* is missing, then a *HTTP 400* is returned.
        '404':
          description: |2
            If the *view-name* is unknown, then a *HTTP 404* is returned.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: |+
                      The identifier of the View.
                  name:
                    type: string
                    description: |+
                      The name of the View.
                  type:
                    type: string
                    description: |+
                      The View type (`"search-alias"`).
                  indexes:
                    $ref: '#/components/schemas/put_api_view_searchalias_indexes_reply'
                    items:
                      type: put_api_view_searchalias_indexes_reply
                    description: |+
                      The list of inverted indexes that are part of the View.
                required:
                - id
                - name
                - type
                - indexes
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewPutPropertiesSearchAlias
release: stable
version: '3.10'
---
    var viewName = "products";
    var viewType = "search-alias";
    var indexName1 = "inv_title";
    var indexName2 = "inv_descr";
    var coll = db._create("books");
    coll.ensureIndex({ type: "inverted", name: indexName1, fields: ["title"] });
    coll.ensureIndex({ type: "inverted", name: indexName2, fields: ["description"] });
    var view = db._createView(viewName, viewType, {
      indexes: [ { collection: coll.name(), index: indexName1 } ] });
    var url = "/_api/view/"+ view.name() + "/properties";
    var response = logCurlRequest('PUT', url, {
      "indexes": [ { collection: coll.name(), index: indexName2 } ] });
    assert(response.code === 200);
    logJsonResponse(response);
    db._dropView(viewName);
    db._drop(coll.name());
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/view/{view-name}/properties#searchalias:
    patch:
      description: |2+
        Updates the list of indexes of a `search-alias` View.
      operationId: ' modifyViewPartialSearchAlias'
      parameters:
      - name: view-name
        schema:
          type: string
        required: true
        description: |+
          The name of the View.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                indexes:
                  $ref: '#/components/schemas/patch_api_view_searchalias_indexes'
                  items:
                    type: patch_api_view_searchalias_indexes
                  description: |+
                    A list of inverted indexes to add to or remove from the View.
              required: []
      responses:
        '200':
          description: |2
            On success, an object with the following attributes is returned
        '400':
          description: |2
            If the *view-name* is missing, then a *HTTP 400* is returned.
        '404':
          description: |2
            If the *view-name* is unknown, then a *HTTP 404* is returned.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: |+
                      The identifier of the View.
                  name:
                    type: string
                    description: |+
                      The name of the View.
                  type:
                    type: string
                    description: |+
                      The View type (`"search-alias"`).
                  indexes:
                    $ref: '#/components/schemas/patch_api_view_searchalias_indexes_reply'
                    items:
                      type: patch_api_view_searchalias_indexes_reply
                    description: |+
                      The list of inverted indexes that are part of the View.
                required:
                - id
                - name
                - type
                - indexes
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewPatchPropertiesSearchAlias
release: stable
version: '3.10'
---
    var viewName = "products";
    var viewType = "search-alias";
    var indexName1 = "inv_title";
    var indexName2 = "inv_descr";
    var coll = db._create("books");
    coll.ensureIndex({ type: "inverted", name: indexName1, fields: ["title"] });
    coll.ensureIndex({ type: "inverted", name: indexName2, fields: ["description"] });
    var view = db._createView(viewName, viewType, {
      indexes: [ { collection: coll.name(), index: indexName1 } ] });
    var url = "/_api/view/"+ view.name() + "/properties";
    var response = logCurlRequest('PATCH', url, {
      "indexes": [ { collection: coll.name(), index: indexName2 } ] });
    assert(response.code === 200);
    logJsonResponse(response);
    db._dropView(viewName);
    db._drop(coll.name());
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/view/{view-name}/rename:
    put:
      description: |2+
        Renames a View. Expects an object with the attribute(s)
        - *name*: The new name
        It returns an object with the attributes
        - *id*: The identifier of the View.
        - *name*: The new name of the View.
        - *type*: The View type.
        **Note**: This method is not available in a cluster.
      operationId: ' modifyView:rename'
      parameters:
      - name: view-name
        schema:
          type: string
        required: true
        description: |+
          The name of the View to rename.
        in: path
      responses:
        '400':
          description: |2
            If the *view-name* is missing, then a *HTTP 400* is returned.
        '404':
          description: |2
            If the *view-name* is unknown, then a *HTTP 404* is returned.
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewPutRename
release: stable
version: '3.10'
---
    var viewName = "products1";
    var viewType = "arangosearch";
    var view = db._createView(viewName, viewType);
    var url = "/_api/view/" + view.name() + "/rename";
    var response = logCurlRequest('PUT', url, { name: "viewNewName" });
    assert(response.code === 200);
    db._flushCache();
    db._dropView("viewNewName");
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/view/{view-name}:
    delete:
      description: |2+
        Drops the View identified by *view-name*.
        If the View was successfully dropped, an object is returned with
        the following attributes:
        - *error*: *false*
        - *id*: The identifier of the dropped View
      operationId: ' deleteView'
      parameters:
      - name: view-name
        schema:
          type: string
        required: true
        description: |+
          The name of the View to drop.
        in: path
      responses:
        '400':
          description: |2
            If the *view-name* is missing, then a *HTTP 400* is returned.
        '404':
          description: |2
            If the *view-name* is unknown, then a *HTTP 404* is returned.
      tags:
      - Views
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestViewDeleteViewIdentifierArangoSearch
release: stable
version: '3.10'
---
    var viewName = "testView";
    var viewType = "arangosearch";
    var view = db._createView(viewName, viewType);
    var url = "/_api/view/"+ view._id;
    var response = logCurlRequest('DELETE', url);
    assert(response.code === 200);
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
name: RestViewDeleteViewNameArangoSearch
release: stable
version: '3.10'
---
    var viewName = "testView";
    var viewType = "arangosearch";
    var view = db._createView(viewName, viewType);
    var url = "/_api/view/testView";
    var response = logCurlRequest('DELETE', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

