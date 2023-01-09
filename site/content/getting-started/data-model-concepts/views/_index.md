---
fileID: data-modeling-views
title: JavaScript Interface for Views
weight: 100
description: 
layout: default
---
This is an introduction to ArangoDB's interface for views and how to handle
views from the JavaScript shell _arangosh_. For other languages see the
corresponding language API.

## Address of a View

Like [collections](../collections/), views are accessed by the user via
their unique name and internally via their identifier. Using the identifier for
accessing views is discouraged. Views share their namespace with collections,
so there cannot exist a view and a collection with the same name in the same
database.

## Usage

Here follow some basic usage examples. More details can be found in the
following chapters:

- [`arangosearch` Views](../../../indexing/arangosearch/arangosearch-views)
- [`search-alias` Views](../../../indexing/arangosearch/arangosearch-views-search-alias)
- [Database Methods for Views](data-modeling-views-database-methods)
- [View Methods](data-modeling-views-view-methods)

Create a view with default properties:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_01
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("colA");
~ db._create("colB");
view = db._createView("myView", "arangosearch", {});
~ addIgnoreCollection("colA");
~ addIgnoreCollection("colB");
~ addIgnoreView("myView");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Get this view again later by name:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_02
description: ''
render: input/output
version: '3.10'
release: stable
---
view = db._view("myView");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Get the view properties:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_03
description: ''
render: input/output
version: '3.10'
release: stable
---
view.properties();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Set a view property:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_04
description: ''
render: input/output
version: '3.10'
release: stable
---
view.properties({cleanupIntervalStep: 12});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Add a link:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_05
description: ''
render: input/output
version: '3.10'
release: stable
---
view.properties({links: {colA: {includeAllFields: true}}});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Add another link:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_06
description: ''
render: input/output
version: '3.10'
release: stable
---
view.properties({links: {colB: {fields: {text: {}}}}});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Remove the first link again:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_07
description: ''
render: input/output
version: '3.10'
release: stable
---
view.properties({links: {colA: null}});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Drop the view:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewUsage_08
description: ''
render: input/output
version: '3.10'
release: stable
---
~ removeIgnoreCollection("colA");
~ removeIgnoreCollection("colB");
~ removeIgnoreView("myView");
db._dropView("myView");
~ db._drop("colA");
~ db._drop("colB");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


