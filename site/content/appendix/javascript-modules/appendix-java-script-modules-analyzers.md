---
fileID: appendix-java-script-modules-analyzers
title: Analyzer Management
weight: 12140
description: 
layout: default
---
The JavaScript API can be accessed via the `@arangodb/analyzers` module from
both server-side and client-side code (arangosh, Foxx):

```js
var analyzers = require("@arangodb/analyzers");
```

See [Analyzers](../../analyzers/) for general information and
details about the attributes.

## Analyzer Module Methods

### Create an Analyzer

```js
var analyzer = analyzers.save(<name>, <type>[, <properties>[, <features>]])
```

Create a new Analyzer with custom configuration in the current database.

- **name** (string): name for identifying the Analyzer later
- **type** (string): the kind of Analyzer to create
- **properties** (object, _optional_): settings specific to the chosen *type*.
  Most types require at least one property, so this may not be optional
- **features** (array, _optional_): array of strings with names of the features
  to enable
- returns **analyzer** (object): Analyzer object, also if an Analyzer with the
  same settings exists already. An error is raised if the settings mismatch
  or if they are invalid


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerCreate
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.save("csv", "delimiter", { "delimiter": "," }, ["frequency", "norm", "position"]);
~analyzers.remove("csv");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Get an Analyzer

```js
var analyzer = analyzers.analyzer(<name>)
```

Get an Analyzer by the name, stored in the current database. The name can be
prefixed with `_system::` to access Analyzers stored in the `_system` database.

- **name** (string): name of the Analyzer to find
- returns **analyzer** (object\|null): Analyzer object if found, else `null`


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerByName
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### List all Analyzers

```js
var analyzerArray = analyzers.toArray()
```

List all Analyzers available in the current database.

- returns **analyzerArray** (array): array of Analyzer objects


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerList
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.toArray();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Remove an Analyzer

```js
analyzers.remove(<name> [, <force>])
```

Delete an Analyzer from the current database.

- **name** (string): name of the Analyzer to remove
- **force** (bool, _optional_): remove Analyzer even if in use by a View.
  Default: `false`
- returns nothing: no return value on success, otherwise an error is raised


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerRemove
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
~analyzers.save("csv", "delimiter", { "delimiter": "," }, []);
analyzers.remove("csv");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Analyzer Object Methods

Individual Analyzer objects expose getter accessors for the aforementioned
definition attributes (see [Create an Analyzer](#create-an-analyzer)).

### Get Analyzer Name

```js
var name = analyzer.name()
```

- returns **name** (string): name of the Analyzer


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerName
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").name();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Get Analyzer Type

```js
var type = analyzer.type()
```

- returns **type** (string): type of the Analyzer


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerType
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").type();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Get Analyzer Properties

```js
var properties = analyzer.properties()
```

- returns **properties** (object): *type* dependent properties of the Analyzer


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerProperties
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").properties();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Get Analyzer Features

```js
var features = analyzer.features()
```

- returns **features** (array): array of strings with the features of the Analyzer


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: analyzerFeatures
description: ''
render: input/output
version: '3.10'
release: stable
---
var analyzers = require("@arangodb/analyzers");
analyzers.analyzer("text_en").features();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


