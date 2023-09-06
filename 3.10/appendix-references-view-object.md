---
layout: default
redirect_from:
  - data-modeling-views-view-methods.html # 3.11 -> 3.11
---
# The _view_ object

The JavaScript API returns _view_ objects when you use the following methods
of the [`db` object](appendix-references-dbobject.html) from the `@arangodb` module:

- `db._createView(...)` 
- `db._views()` 
- `db._view(...)`

{% hint 'info' %}
Square brackets in function signatures denote optional arguments.
{% endhint %}

## Methods

### `view.name()`

Returns the name of the View.

**Examples**

Get View name:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewName
    @EXAMPLE_ARANGOSH_OUTPUT{viewName}
      var view = db._view("demoView");
      view.name();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewName
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `view.type()`

Returns the type of the View.

**Examples**

Get View type:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewType
    @EXAMPLE_ARANGOSH_OUTPUT{viewType}
      var view = db._view("demoView");
      view.type();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewType
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `view.properties(new-properties [, partialUpdate])`

`view.properties()`

Returns the properties of the View. The format of the result is specific to
each of the supported [View Types](data-modeling-views.html).

**Examples**

Get View properties:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewGetProperties
    @EXAMPLE_ARANGOSH_OUTPUT{viewGetProperties}
      var view = db._view("demoView");
      view.properties();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewGetProperties
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

---

`view.properties(new-properties, partialUpdate)`

Modifies the properties of the `view`. The format of the result is specific to
each of the supported [View Types](data-modeling-views.html).

`partialUpdate` is an optional Boolean parameter (`true` by default) that
determines how the `new-properties` object is merged with current View properties
(adds or updates `new-properties` properties to current if `true` replaces all
properties if `false`).

For the available properties of the supported View types, see:
- [`arangosearch` View Properties](arangosearch-views.html#view-properties)
- [`search-alias` View Modification](arangosearch-views-search-alias.html#view-modification)

**Examples**

Modify `arangosearch` View properties:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewModifyProperties
    @EXAMPLE_ARANGOSH_OUTPUT{viewModifyProperties}
      ~ db._createView("example", "arangosearch");
        var view = db._view("example");
      | view.properties();
        // set cleanupIntervalStep to 12
      | view.properties({cleanupIntervalStep: 12});
        // add a link
      | view.properties({links: {demo: {}}})
        // remove a link
        view.properties({links: {demo: null}})
      ~ db._dropView("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewModifyProperties
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Add and remove inverted indexes from a `search-alias` View:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewModifyPropertiesSearchAlias
    @EXAMPLE_ARANGOSH_OUTPUT{viewModifyPropertiesSearchAlias}
      ~ db._create("coll");
      ~ db.coll.ensureIndex({ name: "inv1", type: "inverted", fields: ["a"] });
      ~ db.coll.ensureIndex({ name: "inv2", type: "inverted", fields: ["b[*]"] });
      ~ db.coll.ensureIndex({ name: "inv3", type: "inverted", fields: ["c"] });
     |~ db._createView("example", "search-alias", { indexes: [
     |~  { collection: "coll", index: "inv1" },
     |~  { collection: "coll", index: "inv2" }
      ~ ] });
        var view = db._view("example");
        view.properties();
      | view.properties({ indexes: [
      |   { collection: "coll", index: "inv1", operation: "del" },
      |   { collection: "coll", index: "inv3" }
        ] });
      ~ db._dropView("example");
      ~ db._drop("coll");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewModifyPropertiesSearchAlias
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

### `view.rename(new-name)`

Renames a view using the `new-name`. The `new-name` must not already be used by
a different view or collection in the same database. `new-name` must also be a
valid view name. For information about the naming constraints for Views, see
[View names](data-modeling-views.html#view-names).

If renaming fails for any reason, an error is thrown.

{% hint 'info' %}
The rename method is not available in clusters.
{% endhint %}

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewRename
    @EXAMPLE_ARANGOSH_OUTPUT{viewRename}
      var view = db._createView("example", "arangosearch");
      view.name();
      view.rename("exampleRenamed");
      view.name();
      ~ db._dropView("exampleRenamed");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewRename
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### `view.drop()`

Drops a View and all its data.

**Examples**

Drop a View:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline viewDrop
    @EXAMPLE_ARANGOSH_OUTPUT{viewDrop}
    | var view = db._createView("example", "arangosearch");
      // or
      var view = db._view("example");
      view.drop();
      db._view("example");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock viewDrop
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
