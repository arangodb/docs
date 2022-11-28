---
fileID: views-search-alias
title: search-alias Views HTTP API
weight: 2395
description: 
layout: default
---
{% docublock post_api_view_searchalias %}

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
          description: |2+
            If the *view-name* is missing, then a *HTTP 400* is returned.
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


{% docublock put_api_view_properties_searchalias %}

{% docublock patch_api_view_properties_searchalias %}

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
          description: |2+
            If the *view-name* is missing, then a *HTTP 400* is returned.
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
          description: |2+
            If the *view-name* is missing, then a *HTTP 400* is returned.
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

