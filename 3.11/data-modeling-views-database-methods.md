---
layout: default
description: View-related JavaScript methods of Database objects for arangosh and Foxx
title: Database Methods in Views JS API
---
Database Methods
================

View
----

`db._view(view-name)`

Returns the view with the given name or null if no such view exists.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDatabaseGet
    @EXAMPLE_ARANGOSH_OUTPUT{viewDatabaseGet}
    ~ db._createView("example", "arangosearch", {});
      | view = db._view("example");
      // or, alternatively
      view = db["example"]
    ~ db._dropView("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDatabaseGet
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

---

`db._view(view-identifier)`

Returns the view with the given identifier or null if no such view exists.
Accessing views by identifier is discouraged for end users. End users should
access views using the view name.

**Examples**

Get a View by name:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDatabaseNameKnown
    @EXAMPLE_ARANGOSH_OUTPUT{viewDatabaseNameKnown}
      db._view("demoView");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDatabaseNameKnown
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Unknown View:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDatabaseNameUnknown
    @EXAMPLE_ARANGOSH_OUTPUT{viewDatabaseNameUnknown}
      db._view("unknown");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDatabaseNameUnknown
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create
------

`db._createView(name, type, properties)`

Creates a new View.

`name` is a string and the name of the View. No View or collection with the
same name may already exist in the current database. For more information on
valid View names please refer to the [naming conventions](data-modeling-naming-conventions.html).

`type` must be the string `"arangosearch"`, as it is currently the only
supported View type.

`properties` is an optional object containing View configuration specific
to each View-type.
- [`arangosearch` View definition](arangosearch-views.html#view-definitionmodification)
- [`search-alias` View definition](arangosearch-views-search-alias.html#view-definition)

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDatabaseCreate
    @EXAMPLE_ARANGOSH_OUTPUT{viewDatabaseCreate}
      v = db._createView("example", "arangosearch");
      v.properties()
      db._dropView("example")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDatabaseCreate
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

All Views
---------

`db._views()`

Returns all views of the given database.

**Examples**

List all views:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDatabaseList
    @EXAMPLE_ARANGOSH_OUTPUT{viewDatabaseList}
    ~ db._createView("exampleView", "arangosearch");
      db._views();
    ~ db._dropView("exampleView");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDatabaseList
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Drop
----

`db._dropView(name)`

Drops a view named `name` and all its data. No error is thrown if there is
no such view.

---

`db._dropView(view-identifier)`

Drops a view identified by `view-identifier` with all its data. No error is
thrown if there is no such view.

**Examples**

Drop a view:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDatabaseDrop
    @EXAMPLE_ARANGOSH_OUTPUT{viewDatabaseDrop}
      db._createView("exampleView", "arangosearch");
      db._dropView("exampleView");
      db._view("exampleView");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDatabaseDrop
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
