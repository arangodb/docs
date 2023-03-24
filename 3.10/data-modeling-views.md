---
layout: default
description: >-
  Views can index documents of one or multiple collections and enable
  sophisticated information retrieval possibilities
---
# Views

Views allows you to perform complex searches at high performance. They are
accelerated by inverted indexes that are updated near real-time.

A View is conceptually a transformation function over documents from zero or
more collections. The transformation depends on the View type and the View
configuration.

See [ArangoSearch](arangosearch.html) for details.

## View types

Available View types:

- The traditional [`arangosearch` Views](../arangosearch-views.html) to which
  you link collections to.
- The modern [`search-alias` Views](../arangosearch-views-search-alias.html)
  that can reference inverted indexes that are defined on the collection-level.

You need to specify the type when you create the View.
The type cannot be changed later.

## View names

You can give each View a name to identify and access it. The name needs to
be unique within a [database](data-modeling-databases.html), but not globally
for the entire ArangoDB instance.

The namespace for Views is shared with [collections](data-modeling-collections.html).
There cannot exist a View and a collection with the same name in the same database.

The View name needs to be a string that adheres to the following constraints:

- The names must only consist of the letters `A` to `Z` (both in lower 
  and upper case), the digits `0` to `9`, and underscore (`_`) and dash (`-`)
  characters. This also means that any non-ASCII names are not allowed.

- View names must start with a letter.

- The maximum allowed length of a name is 256 bytes.

- View names are case-sensitive.

You can rename Views (except in cluster deployments). This changes the
View name, but not the View identifier.

## View identifiers

A View identifier lets you refer to a View in a database, similar to
the name. It is a string value and is unique within a database. Unlike
View names, ArangoDB assigns View IDs automatically and you have no
control over them.

ArangoDB internally uses View IDs to look up Views. However, you
should use the View name to access a View instead of its identifier.

ArangoDB uses 64-bit unsigned integer values to maintain View IDs
internally. When returning View IDs to clients, ArangoDB returns them as
strings to ensure the identifiers are not clipped or rounded by clients that do
not support big integers. Clients should treat the View IDs returned by
ArangoDB as opaque strings when they store or use them locally.

## Views API

The following descriptions cover the JavaScript interface for Views that
you can use to handle Views from the _arangosh_ command-line tool, as
well as in server-side JavaScript code like Foxx microservices.
For other languages see the corresponding language API.

The following examples show the basic usage of the View API.
For more details, see:

- [`arangosearch` Views](arangosearch-views.html)
- [`search-alias` Views](arangosearch-views-search-alias.html)
- [Database Methods for Views](data-modeling-views-database-methods.html)
- [View Methods](data-modeling-views-view-methods.html)

### Create a View

Create a View with default properties:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_01
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_01}
    ~ db._create("colA");
    ~ db._create("colB");
    view = db._createView("myView", "arangosearch", {});
    ~ addIgnoreCollection("colA");
    ~ addIgnoreCollection("colB");
    ~ addIgnoreView("myView");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_01
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Get a View

Get the View called `myView` by its name:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_02
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_02}
    view = db._view("myView");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_02
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Get the View properties

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_03
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_03}
    view.properties();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_03
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Set a View property

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_04
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_04}
    view.properties({cleanupIntervalStep: 12});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_04
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Add and remove links from a View

Link a collection to a View:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_05
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_05}
    view.properties({links: {colA: {includeAllFields: true}}});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_05
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Add another link to the View:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_06
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_06}
    view.properties({links: {colB: {fields: {text: {}}}}});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_06
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Remove the first link again:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_07
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_07}
    view.properties({links: {colA: null}});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_07
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Drop a View

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_08
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_08}
    ~ removeIgnoreCollection("colA");
    ~ removeIgnoreCollection("colB");
    ~ removeIgnoreView("myView");
    db._dropView("myView");
    ~ db._drop("colA");
    ~ db._drop("colB");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_08
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
