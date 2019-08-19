---
layout: default
description: JavaScript API to manage ArangoSearch Analyzers with arangosh and Foxx
title: ArangoSearch Analyzer JS API
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

- **name** (string): name for identifying the Analyzer later
- **type** (string): the kind of Analyzer to create
- **properties** (object, _optional_): settings specific to the chosen *type*.
  Most types require at least one property, so this may not be optional
- **features** (array, _optional_): array of strings with names of the features
  to enable
- returns **analyzer** (object): Analyzer object, also if an Analyzer with the
  same settings exists already. An error is raised if the settings mismatch
  or if they are invalid

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_create
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_create}
    var analyzers = require("@arangodb/analyzers");
    analyzers.save("csv", "delimiter", { "delimiter": "," }, []);
    ~analyzers.remove("csv");
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

- **name** (string): name of the Analyzer to find
- returns **analyzer** (object\|null): Analyzer object if found, else `null`

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_analyzer
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_analyzer
    var analyzers = require("@arangodb/analyzers");
    analyzers.analyzer("text_en");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_analyzer
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### List all Analyzers

```js
var analyzerArray = analyzers.toArray()
```

List all Analyzers available in the current database.

- returns **analyzerArray** (array): array of Analyzer objects

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_list
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_list
    var analyzers = require("@arangodb/analyzers");
    analyzers.toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_list
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Remove an Analyzer

```js
analyzers.remove(<name> [, <force>])
```

Delete an Analyzer from the current database.

- **name** (string): name of the Analyzer to remove
- **force** (bool, _optional_): remove Analyzer even if in use by a View.
  Default: `false`
- returns nothing: no return value on success, otherwise an error is raised

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_remove
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_remove
    var analyzers = require("@arangodb/analyzers");
    ~analyzers.save("csv", "delimiter", { "delimiter": "," }, []);
    analyzers.remove("csv");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_remove
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Analyzer Object Methods
-----------------------

Individual Analyzer objects expose getter accessors for the aforementioned
definition attributes (see [Create an Analyzer](#create-an-analyzer)).

### Get Analyzer Name

```js
var name = analyzer.name()
```

- returns **name** (string): name of the Analyzer

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_name
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_name
    var analyzers = require("@arangodb/analyzers");
    analyzers.analyzer("text_en").name();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_name
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Get Analyzer Type

```js
var type = analyzer.type()
```

- returns **type** (string): type of the Analyzer

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_type
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_type
    var analyzers = require("@arangodb/analyzers");
    analyzers.analyzer("text_en").type();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_type
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Get Analyzer Properties

```js
var properties = analyzer.properties()
```

- returns **properties** (object): *type* dependent properties of the Analyzer

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_properties
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_properties
    var analyzers = require("@arangodb/analyzers");
    analyzers.analyzer("text_en").properties();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_properties
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Get Analyzer Features

```js
var features = analyzer.features()
```

- returns **features** (array): array of strings with the features of the Analyzer

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline analyzer_features
    @EXAMPLE_ARANGOSH_OUTPUT{analyzer_features
    var analyzers = require("@arangodb/analyzers");
    analyzers.analyzer("text_en").features();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock analyzer_features
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
