---
layout: default
description: Available JavaScript methods of View objects for arangosh and Foxx
title: View Methods in ArangoSearch Views JS API
---
View Methods
============

Drop
----

<!-- arangod/V8Server/v8-views.cpp -->

`view.drop()`

Drops a View and all its data.

**Examples**

Drop a View:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDrop
    @EXAMPLE_ARANGOSH_OUTPUT{viewDrop}
      | v = db._createView("example", "arangosearch");
      // or
      v = db._view("example");
      v.drop();
      db._view("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDrop
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Query Name
----------

<!-- arangod/V8Server/v8-views.cpp -->

`view.name()`

Returns the name of the View.

**Examples**

Get View name:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewName
    @EXAMPLE_ARANGOSH_OUTPUT{viewName}
      v = db._view("demoView");
      v.name();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewName
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Rename
------

<!-- arangod/V8Server/v8-views.cpp -->

`view.rename(new-name)`

Renames a view using the *new-name*. The *new-name* must not already be used by
a different view or collection in the same database. *new-name* must also be a
valid view name. For more information on valid view names please refer to the
[naming conventions](data-modeling-naming-conventions.html).

If renaming fails for any reason, an error is thrown.

{% hint 'info' %}
The rename method is not available in clusters.
{% endhint %}

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewRename
    @EXAMPLE_ARANGOSH_OUTPUT{viewRename}
      v = db._createView("example", "arangosearch");
      v.name();
      v.rename("exampleRenamed");
      v.name();
      ~ db._dropView("exampleRenamed");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewRename
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Query Type
----------

<!-- arangod/V8Server/v8-views.cpp -->

`view.type()`

Returns the type of the View.

**Examples**

Get View type:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewType
    @EXAMPLE_ARANGOSH_OUTPUT{viewType}
      v = db._view("demoView");
      v.type();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewType
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Query Properties
----------------

<!-- arangod/V8Server/v8-views.cpp -->

`view.properties()`

Returns the properties of the View. The format of the result is specific to
each of the supported [View Types](data-modeling-views.html).

**Examples**

Get View properties:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewGetProperties
    @EXAMPLE_ARANGOSH_OUTPUT{viewGetProperties}
      v = db._view("demoView");
      v.properties();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewGetProperties
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Modify Properties
-----------------

<!-- arangod/V8Server/v8-views.cpp -->

`view.properties(new-properties, partialUpdate)`

Modifies the properties of the *view*. The format of the result is specific to
each of the supported [View Types](data-modeling-views.html).

*partialUpdate* is an optional Boolean parameter (`true` by default) that
determines how the *new-properties* object is merged with current View properties
(adds or updates *new-properties* properties to current if `true` replaces all
properties if `false`).

Currently, the only supported View type is `"arangosearch"`. See
[ArangoSearch View Properties](arangosearch-views.html#view-properties).

**Examples**

Modify View properties:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewModifyProperties
    @EXAMPLE_ARANGOSH_OUTPUT{viewModifyProperties}
      ~ db._createView("example", "arangosearch");
      v = db._view("example");
      | v.properties();
      // set cleanupIntervalStep to 12
      | v.properties({cleanupIntervalStep: 12});
      // add a link
      | v.properties({links: {demo: {}}})
      // remove a link
      v.properties({links: {demo: null}})
      ~ db._dropView("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewModifyProperties
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
