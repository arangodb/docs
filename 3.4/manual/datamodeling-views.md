---
layout: default
---
JavaScript Interface to Views
=============================

This is an introduction to ArangoDB's interface for views and how to handle
views from the JavaScript shell _arangosh_. For other languages see the
corresponding language API.

Address of a View
-----------------

Like [collections](datamodeling-collections.html), views are accessed by the user via
their unique name and internally via their identifier. Using the identifier for
accessing views is discouraged. Views share their namespace with collections,
so there cannot exist a view and a collection with the same name in the same
database.

Usage
-----

Here follow some basic usage examples. More details can be found in the
following chapters:

- [ArangoSearch Views](views-arangosearch.html)
- [Database Methods for Views](datamodeling-views-databasemethods.html)
- [View Methods](datamodeling-views-viewmethods.html)

Create a view with default properties:
{% example example="viewUsage_01" examplevar="examplevar" short="short" long="long" %}
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
{% endexample %}
{% include example.html id=examplevar short=short long=long %}

Get this view again later by name:
{% example example="viewUsage_02" examplevar="examplevar" short="short" long="long" %}
    @startDocuBlockInline viewUsage_02
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_02}
    view = db._view("myView");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_02
{% endexample %}
{% include example.html id=examplevar short=short long=long %}

Get the view properties:
{% example example="viewUsage_03" examplevar="examplevar" short="short" long="long" %}
    @startDocuBlockInline viewUsage_03
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_03}
    view.properties();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_03
{% endexample %}
{% include example.html id=examplevar short=short long=long %}

Set a view property:
{% example example="viewUsage_04" examplevar="examplevar" short="short" long="long" %}
    @startDocuBlockInline viewUsage_04
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_04}
    view.properties({cleanupIntervalStep: 12});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_04
{% endexample %}
{% include example.html id=examplevar short=short long=long %}

Add a link:
{% example example="viewUsage_05" examplevar="examplevar" short="short" long="long" %}
    @startDocuBlockInline viewUsage_05
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_05}
    view.properties({links: {colA: {includeAllFields: true}}});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_05
{% endexample %}
{% include example.html id=examplevar short=short long=long %}

Add another link:
{% example example="viewUsage_06" examplevar="examplevar" short="short" long="long" %}
    @startDocuBlockInline viewUsage_06
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_06}
    view.properties({links: {colB: {fields: {text: {}}}}});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_06
{% endexample %}
{% include example.html id=examplevar short=short long=long %}

Remove the first link again:
{% example example="viewUsage_07" examplevar="examplevar" short="short" long="long" %}
    @startDocuBlockInline viewUsage_07
    @EXAMPLE_ARANGOSH_OUTPUT{viewUsage_07}
    view.properties({links: {colA: null}});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewUsage_07
{% endexample %}
{% include example.html id=examplevar short=short long=long %}

Drop the view:
{% example example="viewUsage_08" examplevar="examplevar" short="short" long="long" %}
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
{% endexample %}
{% include example.html id=examplevar short=short long=long %}
