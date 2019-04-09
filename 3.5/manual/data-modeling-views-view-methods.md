---
layout: default
---
View Methods
============

Drop
----

<!-- arangod/V8Server/v8-views.cpp -->

`view.drop()`

Drops a *view* and all its data.

**Examples**

Drop a view:

    {% example viewDrop %}
    @startDocuBlockInline viewDrop
    @EXAMPLE_ARANGOSH_OUTPUT{viewDrop}
      | v = db._createView("example", "arangosearch");
      // or
      v = db._view("example");
      v.drop();
      db._view("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDrop
    {% endexample %}

Query Name
----------

<!-- arangod/V8Server/v8-views.cpp -->

`view.name()`

Returns the name of the *view*.

**Examples**

Get view name:

    {% example viewName %}
    @startDocuBlockInline viewName
    @EXAMPLE_ARANGOSH_OUTPUT{viewName}
      v = db._view("demoView");
      v.name();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewName
    {% endexample %}

Rename
------

<!-- arangod/V8Server/v8-views.cpp -->

`view.rename(new-name)`

Renames a view using the *new-name*. The *new-name* must not already be used by
a different view or collection in the same database. *new-name* must also be a
valid view name. For more information on valid view names please refer to the
[naming conventions](data-modeling-naming-conventions-readme.html).

If renaming fails for any reason, an error is thrown.

**Note**: this method is not available in a cluster.

**Examples**

    {% example viewRename %}
    @startDocuBlockInline viewRename
    @EXAMPLE_ARANGOSH_OUTPUT{viewRename}
      v = db._createView("example", "arangosearch");
      v.name();
      v.rename("exampleRenamed");
      v.name();
      ~ db._dropView("exampleRenamed");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewRename
    {% endexample %}

Query Type
----------

<!-- arangod/V8Server/v8-views.cpp -->

`view.type()`

Returns the type of the *view*.

**Examples**

Get view type:

    {% example viewType %}
    @startDocuBlockInline viewType
    @EXAMPLE_ARANGOSH_OUTPUT{viewType}
      v = db._view("demoView");
      v.type();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewType
    {% endexample %}

Query Properties
----------------

<!-- arangod/V8Server/v8-views.cpp -->

`view.properties()`

Returns the properties of the *view*. The format of the result is specific to
each of the supported [View Types](data-modeling-views-readme.html).

**Examples**

Get view properties:

    {% example viewGetProperties %}
    @startDocuBlockInline viewGetProperties
    @EXAMPLE_ARANGOSH_OUTPUT{viewGetProperties}
      v = db._view("demoView");
      v.properties();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewGetProperties
    {% endexample %}

Modify Properties
-----------------

<!-- arangod/V8Server/v8-views.cpp -->

`view.properties(view-property-modification, partialUpdate)`

Modifies the properties of the *view*. The format of the result is specific to
each of the supported [View Types](data-modeling-views-readme.html). *partialUpdate* is an optional
boolean parameter (`true` by default) that determines how
*view-property-modification* is merged with current view *properties* (adds or 
updates *view-property-modification* properties to current if `true` and, 
additionally, removes all other properties if `false`).

Currently, the only supported view type is `arangosearch`, and its properties
can be found in
[](../../Views/ArangoSearch/DetailedOverview.md#view-properties).

**Examples**

Modify view properties:

    {% example viewModifyProperties %}
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
    {% endexample %}
