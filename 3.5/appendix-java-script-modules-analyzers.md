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

Analyzer Module Methods
-----------------------

### Create an Analyzer

```js
analyzers.save(<name>, <type>[, <properties>[, <features>]])
```

… where *properties* can be represented either as a string, an object or a null
value and *features* is an array of string encoded feature names.



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

Get an analyzer object by the name of the analyzer:

```js
analyzers.analyzer(<name>)
```

### List all Analyzers

All analyzers available in the current database can be listed as follows:

```js
analyzers.toArray()
```

### Remove an Analyzer

```js
analyzers.remove(<name> [, <force>])
```

Analyzer Object Methods
-----------------------

Individual Analyzer objects expose getter accessors for the aforementioned
definition attributes (see [Create an Analyzer](#create-an-analyzer)).

### Get Analyzer Name

```js
analyzer.name()
```

### Get Analyzer Type

```js
analyzer.type()
```

### Get Analyzer Properties

```js
analyzer.properties()
```

### Get Analyzer Features

```js
analyzer.features()
```
