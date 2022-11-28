---
fileID: data-modeling-views-database-methods
title: Database Methods
weight: 105
description: 
layout: default
---
`db._dropView(view-identifier)`

Drops a view identified by `view-identifier` with all its data. No error is
thrown if there is no such view.

**Examples**

Drop a view:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: viewDatabaseDrop
description: ''
render: input/output
version: '3.10'
release: stable
---
  db._createView("exampleView", "arangosearch");
  db._dropView("exampleView");
  db._view("exampleView");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


