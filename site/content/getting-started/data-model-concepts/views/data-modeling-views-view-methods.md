---
fileID: data-modeling-views-view-methods
title: View Methods
weight: 110
description: 
layout: default
---
## Drop

`view.drop()`

Drops a View and all its data.

**Examples**

Drop a View:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewDrop
description: ''
render: input/output
version: '3.10'
release: stable
---
    v = db._createView("example", "arangosearch");
  // or
  v = db._view("example");
  v.drop();
  db._view("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Query Name

`view.name()`

Returns the name of the View.

**Examples**

Get View name:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewName
description: ''
render: input/output
version: '3.10'
release: stable
---
  v = db._view("demoView");
  v.name();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Rename

`view.rename(new-name)`

Renames a view using the `new-name`. The `new-name` must not already be used by
a different view or collection in the same database. `new-name` must also be a
valid view name. For more information on valid view names please refer to the
[naming conventions](../naming-conventions/).

If renaming fails for any reason, an error is thrown.

{{% hints/info %}}
The rename method is not available in clusters.
{{% /hints/info %}}

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewRename
description: ''
render: input/output
version: '3.10'
release: stable
---
  v = db._createView("example", "arangosearch");
  v.name();
  v.rename("exampleRenamed");
  v.name();
  ~ db._dropView("exampleRenamed");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Query Type

`view.type()`

Returns the type of the View.

**Examples**

Get View type:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewType
description: ''
render: input/output
version: '3.10'
release: stable
---
  v = db._view("demoView");
  v.type();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Query Properties

`view.properties()`

Returns the properties of the View. The format of the result is specific to
each of the supported [View Types]().

**Examples**

Get View properties:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewGetProperties
description: ''
render: input/output
version: '3.10'
release: stable
---
  v = db._view("demoView");
  v.properties();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Modify Properties

`view.properties(new-properties, partialUpdate)`

Modifies the properties of the `view`. The format of the result is specific to
each of the supported [View Types]().

`partialUpdate` is an optional Boolean parameter (`true` by default) that
determines how the `new-properties` object is merged with current View properties
(adds or updates `new-properties` properties to current if `true` replaces all
properties if `false`).

For the available properties of the supported View types, see:
- [`arangosearch` View Properties](../../../indexing/arangosearch/arangosearch-views#view-properties)
- [`search-alias` View Modification](../../../indexing/arangosearch/arangosearch-views-search-alias#view-modification)

**Examples**

Modify `arangosearch` View properties:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewModifyProperties
description: ''
render: input/output
version: '3.10'
release: stable
---
  ~ db._createView("example", "arangosearch");
v = db._view("example");
    v.properties();
// set cleanupIntervalStep to 12
    v.properties({cleanupIntervalStep: 12});
// add a link
    v.properties({links: {demo: {}}})
// remove a link
v.properties({links: {demo: null}})
  ~ db._dropView("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Add and remove inverted indexes from a `search-alias` View:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewModifyPropertiesSearchAlias
description: ''
render: input/output
version: '3.10'
release: stable
---
  ~ db._create("coll");
  ~ db.coll.ensureIndex({ name: "inv1", type: "inverted", fields: ["a"] });
  ~ db.coll.ensureIndex({ name: "inv2", type: "inverted", fields: ["b[*]"] });
  ~ db.coll.ensureIndex({ name: "inv3", type: "inverted", fields: ["c"] });
  ~ db._createView("example", "search-alias", { indexes: [
  ~  { collection: "coll", index: "inv1" },
  ~  { collection: "coll", index: "inv2" }
  ~ ] });
var v = db._view("example");
v.properties();
    v.properties({ indexes: [
      { collection: "coll", index: "inv1", operation: "del" },
      { collection: "coll", index: "inv3" }
] });
  ~ db._dropView("example");
  ~ db._drop("coll");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    
