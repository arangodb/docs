---
layout: default
description: This is an introduction to ArangoDB's interface for views and how to handleviews from the JavaScript shell arangosh
---
JavaScript Interface to Views
=============================

This is an introduction to ArangoDB's interface for views and how to handle
views from the JavaScript shell _arangosh_. For other languages see the
corresponding language API.

Address of a View
-----------------

Like [collections](data-modeling-collections.html), views are accessed by the user via
their unique name and internally via their identifier. Using the identifier for
accessing views is discouraged. Views share their namespace with collections,
so there cannot exist a view and a collection with the same name in the same
database.

Usage
-----

Here follow some basic usage examples. More details can be found in the
following chapters:

- [ArangoSearch Views](views-arango-search.html)
- [Database Methods for Views](data-modeling-views-database-methods.html)
- [View Methods](data-modeling-views-view-methods.html)

Create a view with default properties:

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

Get this view again later by name:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_02
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_02}
    view = db._view("myView");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_02
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Get the view properties:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_03
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_03}
    view.properties();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_03
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Set a view property:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_04
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_04}
    view.properties({cleanupIntervalStep: 12});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_04
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Add a link:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewUsage_05
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_05}
    view.properties({links: {colA: {includeAllFields: true}}});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_05
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Add another link:

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

Drop the view:

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