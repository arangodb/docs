---
layout: default
description: JavaScript API to manage ArangoSearch Analyzers
---
Analyzer Management
===================

The JavaScript API can be accessed via the `@arangodb/analyzers` module from
both server-side and client-side code (arangosh, Foxx):

```js
var analyzers = require("@arangodb/analyzers");
```

See [Analyzers](arangosearch-analyzers.html) for general information and
details about the attributes.

Analyzer Module Methods
-----------------------

### Create an Analyzer

```js
var analyzer = analyzers.save(<name>, <type>[, <properties>[, <features>]])
```

Create a new Analyzer with custom configuration in the current database.

- `name` (string): name for identifying the Analyzer later
- `type` (string): the kind of Analyzer to create
- `properties` (object, _optional_): settings specific to the chosen *type*.
  Most types require at least one property, so this may not be optional
- `features` (array, _optional_): array of strings with names of the features
  to enable
- returns `analyzer` (object): Analyzer object, also if an Analyzer with the
  same settings exists already. An error is raised if the settings mismatch
  or if they are invalid

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_create
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_create}
    var analyzers = require("@arangodb/analyzers");
    analyzers.save()

    db._create("exampleTime");
    var timestamps = ["2014-05-07T14:19:09.522","2014-05-07T21:19:09.522","2014-05-08T04:19:09.522","2014-05-08T11:19:09.522","2014-05-08T18:19:09.522"];
    for (i = 0; i < 5; i++) db.exampleTime.save({value:i, ts: timestamps[i]})
    db._query("FOR d IN exampleTime FILTER d.ts > '2014-05-07T14:19:09.522' and d.ts < '2014-05-08T18:19:09.522' RETURN d").toArray()
    ~addIgnoreCollection("example")
    ~db._drop("exampleTime")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_create
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Get an Analyzer

```js
var analyzer = analyzers.analyzer(<name>)
```

Get an Analyzer by the name, stored in the current database. The name can be
prefixed with `_system::` to access Analyzers stored in the `_system` database.

- `name` (string): name of the Analyzer to find
- returns `analyzer` (object\|null): Analyzer object if found, else `null`

### List all Analyzers

```js
var analyzerArray = analyzers.toArray()
```

List all Analyzers available in the current database.

- returns `analyzerArray` (array): array of Analyzer objects

### Remove an Analyzer

```js
analyzers.remove(<name> [, <force>])
```

Delete an Analyzer from the current database.

- `name` (string): name of the Analyzer to remove
- `force` (bool, _optional_): remove Analyzer even if in use by a View.
  Default: `false`
- returns nothing: no return value on success, otherwise an error is raised

Analyzer Object Methods
-----------------------

Individual Analyzer objects expose getter accessors for the aforementioned
definition attributes (see [Create an Analyzer](#create-an-analyzer)).

### Get Analyzer Name

```js
var name = analyzer.name()
```

- returns `name` (string): name of the Analyzer

### Get Analyzer Type

```js
var type = analyzer.type()
```

- returns `type` (string): type of the Analyzer

### Get Analyzer Properties

```js
var properties = analyzer.properties()
```

- returns `properties` (object): *type* dependent properties of the Analyzer

### Get Analyzer Features

```js
var features = analyzer.features()
```

- returns `features` (array): array of strings with the features of the Analyzer
