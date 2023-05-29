---
layout: default
---
# The _cursor_ object

The JavaScript API returns _cursor_ objects when you use the following methods
of the [`db` object](appendix-references-dbobject.html) from the `@arangodb`
module in _arangosh_, as well as in server-side JavaScript contexts if the
`stream` query option is enabled:

- `db._query(...)` 
- `db._createStatement(...).execute()`

If a query returns a cursor, then you can use the `hasNext()` and `next()`
methods to iterate over the results, or `toArray()` to convert them to an array.

If the number of query results is expected to be big, it is possible to 
limit the amount of documents transferred between the server and the client
to a specific value. This value is called `batchSize`. The `batchSize`
can optionally be set when a statement is executed using its `execute()` method.
If no `batchSize` value is specified, the server picks a reasonable default value.
If the server has more documents than should be returned in a single batch,
the server sets the `hasMore` attribute in the result. It also
returns the ID of the server-side cursor in the `id` attribute in the response.
This ID can be used with the Cursor API to fetch any outstanding results from
the server and dispose the server-side cursor afterwards.

{% hint 'tip' %}
Square brackets in function signatures designate optional arguments.
{% endhint %}

## `cursor.hasNext()`

Checks if the cursor is exhausted.

The `hasNext()` method returns `true`, then the cursor still has
documents. In this case the next document can be accessed using the
`next` operator, which advances the cursor.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline cursorHasNext
    @EXAMPLE_ARANGOSH_OUTPUT{cursorHasNext}
    ~ db._create("five");
    ~ db.five.save({ name : "one" });
    ~ db.five.save({ name : "two" });
    ~ db.five.save({ name : "three" });
    ~ db.five.save({ name : "four" });
    ~ db.five.save({ name : "five" });
      var a = db._query("FOR x IN five RETURN x");
      while (a.hasNext()) print(a.next());
    ~ db._drop("five")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock cursorHasNext
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

## `cursor.next()`

Returns the next result document.

If the `hasNext()` method returns `true`, then the underlying
cursor of the AQL query still has documents. In this case the
next document can be accessed using the `next()` method, which
advances the underlying cursor. If you use `next()` on an
exhausted cursor, then `undefined` is returned.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline cursorNext
    @EXAMPLE_ARANGOSH_OUTPUT{cursorNext}
    ~ db._create("five");
    ~ db.five.save({ name : "one" });
    ~ db.five.save({ name : "two" });
    ~ db.five.save({ name : "three" });
    ~ db.five.save({ name : "four" });
    ~ db.five.save({ name : "five" });
      db._query("FOR x IN five RETURN x").next();
    ~ db._drop("five")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock cursorNext
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

## `cursor.dispose()`

Disposes the cursor and its results.

If you are no longer interested in any further results, you should call
`dispose()` in order to free any resources associated with the cursor.
After calling `dispose()`, you can no longer access the cursor.

## `cursor.count()`

Counts the number of documents in the result set and
returns that number. The `count()` method ignores any limits and returns
the total number of documents found.

---

`cursor.count(true)`

If the result set was limited by the `limit()` method or documents were
skipped using the `skip()` method, the `count()` method with argument
`true` uses the number of elements in the final result set - after
applying limit and skip.
