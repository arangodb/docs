---
fileID: data-modeling-documents-database-methods
title: Database Methods
weight: 85
description: 
layout: default
---
`db._remove(document-handle)`

`db._remove(document-handle, options)`

As before. Instead of `selector` a `document-handle` can be passed as
first argument. No revision check is performed.

**Examples**

Remove a document:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: documentsCollectionRemoveSuccess
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
  a1 = db.example.insert({ a : 1 });
  db._remove(a1);
  db._remove(a1);  // xpError(ERROR_ARANGO_DOCUMENT_NOT_FOUND);
  db._remove(a1, {overwrite: true}); // xpError(ERROR_ARANGO_DOCUMENT_NOT_FOUND);
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Remove the document in the revision `a1` with a conflict:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: documentsCollectionRemoveConflict
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
  a1 = db.example.insert({ a : 1 });
  a2 = db._replace(a1, { a : 2 });
  db._remove(a1);   // xpError(ERROR_ARANGO_CONFLICT)
  db._remove(a1, {overwrite: true} );
  db._document(a1); // xpError(ERROR_ARANGO_DOCUMENT_NOT_FOUND)
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Remove a document using new signature:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: documentsCollectionRemoveSignature
description: ''
render: input/output
version: '3.10'
release: stable
---
~ db._create("example");
db.example.insert({ _key: "11265325374", a:  1 } );
  db.example.remove("example/11265325374",
   { overwrite: true, waitForSync: false})
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


