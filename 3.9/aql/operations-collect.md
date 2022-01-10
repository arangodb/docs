---
layout: default
description: The COLLECT operation can be used to group data by one or multiple grouping criteria
title: Grouping and aggregation with COLLECT in AQL
---
COLLECT
=======

The `COLLECT` operation can be used to group data by one or multiple group
criteria. It can also be used to retrieve all distinct values, count
how often values occur, and calculate statistical properties efficiently.

The `COLLECT` statement will eliminate all local variables in the current
scope. After `COLLECT` only the variables introduced by `COLLECT` itself are
available.

Syntax
------

There are several syntax variants for `COLLECT` operations:

<pre><code>COLLECT <em>variableName</em> = <em>expression</em>
COLLECT <em>variableName</em> = <em>expression</em> INTO <em>groupsVariable</em>
COLLECT <em>variableName</em> = <em>expression</em> INTO <em>groupsVariable</em> = <em>projectionExpression</em>
COLLECT <em>variableName</em> = <em>expression</em> INTO <em>groupsVariable</em> KEEP <em>keepVariable</em>
COLLECT <em>variableName</em> = <em>expression</em> WITH COUNT INTO <em>countVariable</em>
COLLECT <em>variableName</em> = <em>expression</em> AGGREGATE variableName = <em>aggregateExpression</em>
COLLECT <em>variableName</em> = <em>expression</em> AGGREGATE variableName = <em>aggregateExpression</em> INTO <em>groupsVariable</em>
COLLECT AGGREGATE <em>variableName</em> = <em>aggregateExpression</em>
COLLECT AGGREGATE <em>variableName</em> = <em>aggregateExpression</em> INTO <em>groupsVariable</em>
COLLECT WITH COUNT INTO <em>countVariable</em></code></pre>

All variants can optionally end with an `OPTIONS { … }` clause.

Grouping syntaxes
-----------------

The first syntax form of `COLLECT` only groups the result by the defined group 
criteria specified in *expression*. In order to further process the results 
produced by `COLLECT`, a new variable (specified by *variableName*) is introduced. 
This variable contains the group value.

Here's an example query that find the distinct values in `u.city` and makes
them available in variable `city`:

```js
FOR u IN users
  COLLECT city = u.city
  RETURN { 
    "city" : city 
  }
```

The second form does the same as the first form, but additionally introduces a
variable (specified by *groupsVariable*) that contains all elements that fell into the
group. This works as follows: The *groupsVariable* variable is an array containing 
as many elements as there are in the group. Each member of that array is
a JSON object in which the value of every variable that is defined in the 
AQL query is bound to the corresponding attribute. Note that this considers
all variables that are defined before the `COLLECT` statement, but not those on
the top level (outside of any `FOR`), unless the `COLLECT` statement is itself
on the top level, in which case all variables are taken. Furthermore note 
that it is possible that the optimizer moves `LET` statements out of `FOR`
statements to improve performance. 

```js
FOR u IN users
  COLLECT city = u.city INTO groups
  RETURN { 
    "city" : city, 
    "usersInCity" : groups 
  }
```

In the above example, the array `users` will be grouped by the attribute
`city`. The result is a new array of documents, with one element per distinct
`u.city` value. The elements from the original array (here: `users`) per city are
made available in the variable `groups`. This is due to the `INTO` clause.

`COLLECT` also allows specifying multiple group criteria. Individual group
criteria can be separated by commas:

```js
FOR u IN users
  COLLECT country = u.country, city = u.city INTO groups
  RETURN { 
    "country" : country, 
    "city" : city, 
    "usersInCity" : groups 
  }
```

In the above example, the array `users` is grouped by country first and then
by city, and for each distinct combination of country and city, the users
will be returned.

Discarding obsolete variables
-----------------------------

The third form of `COLLECT` allows rewriting the contents of the *groupsVariable* 
using an arbitrary *projectionExpression*:

```js
FOR u IN users
  COLLECT country = u.country, city = u.city INTO groups = u.name
  RETURN { 
    "country" : country, 
    "city" : city, 
    "userNames" : groups 
  }
```

In the above example, only the *projectionExpression* is `u.name`. Therefore,
only this attribute is copied into the *groupsVariable* for each document. 
This is probably much more efficient than copying all variables from the scope into 
the *groupsVariable* as it would happen without a *projectionExpression*.

The expression following `INTO` can also be used for arbitrary computations:

```js
FOR u IN users
  COLLECT country = u.country, city = u.city INTO groups = { 
    "name" : u.name, 
    "isActive" : u.status == "active"
  }
  RETURN { 
    "country" : country, 
    "city" : city, 
    "usersInCity" : groups 
  }
```

`COLLECT` also provides an optional `KEEP` clause that can be used to control
which variables will be copied into the variable created by `INTO`. If no 
`KEEP` clause is specified, all variables from the scope will be copied as 
sub-attributes into the *groupsVariable*. 
This is safe but can have a negative impact on performance if there 
are many variables in scope or the variables contain massive amounts of data. 

The following example limits the variables that are copied into the *groupsVariable*
to just `name`. The variables `u` and `someCalculation` also present in the scope
will not be copied into *groupsVariable* because they are not listed in the `KEEP` clause:

```js
FOR u IN users
  LET name = u.name
  LET someCalculation = u.value1 + u.value2
  COLLECT city = u.city INTO groups KEEP name 
  RETURN { 
    "city" : city, 
    "userNames" : groups[*].name 
  }
```

`KEEP` is only valid in combination with `INTO`. Only valid variable names can
be used in the `KEEP` clause. `KEEP` supports the specification of multiple 
variable names.

Group length calculation
------------------------

`COLLECT` also provides a special `WITH COUNT` clause that can be used to 
determine the number of group members efficiently.

The simplest form just returns the number of items that made it into the
`COLLECT`:

```js
FOR u IN users
  COLLECT WITH COUNT INTO length
  RETURN length
```

The above is equivalent to, but less efficient than:

```js
RETURN LENGTH(users)
```

The `WITH COUNT` clause can also be used to efficiently count the number
of items in each group:

```js
FOR u IN users
  COLLECT age = u.age WITH COUNT INTO length
  RETURN { 
    "age" : age, 
    "count" : length 
  }
```

{% hint 'info' %}
The `WITH COUNT` clause can only be used together with an `INTO` clause.
{% endhint %}

Aggregation
-----------

A `COLLECT` statement can be used to perform aggregation of data per group. To
only determine group lengths, the `WITH COUNT INTO` variant of `COLLECT` can be
used as described before.

For other aggregations, it is possible to run aggregate functions on the `COLLECT`
results:

```js
FOR u IN users
  COLLECT ageGroup = FLOOR(u.age / 5) * 5 INTO g
  RETURN { 
    "ageGroup" : ageGroup,
    "minAge" : MIN(g[*].u.age),
    "maxAge" : MAX(g[*].u.age)
  }
```

The above however requires storing all group values during the collect operation for 
all groups, which can be inefficient. 

The special `AGGREGATE` variant of `COLLECT` allows building the aggregate values 
incrementally during the collect operation, and is therefore often more efficient.

With the `AGGREGATE` variant the above query becomes:

```js
FOR u IN users
  COLLECT ageGroup = FLOOR(u.age / 5) * 5 
  AGGREGATE minAge = MIN(u.age), maxAge = MAX(u.age)
  RETURN {
    ageGroup, 
    minAge, 
    maxAge 
  }
```

The `AGGREGATE` keyword can only be used after the `COLLECT` keyword. If used, it 
must directly follow the declaration of the grouping keys. If no grouping keys 
are used, it must follow the `COLLECT` keyword directly:

```js
FOR u IN users
  COLLECT AGGREGATE minAge = MIN(u.age), maxAge = MAX(u.age)
  RETURN {
    minAge, 
    maxAge 
  }
```

Only specific expressions are allowed on the right-hand side of each `AGGREGATE`
assignment:

- on the top level, an aggregate expression must be a call to one of the
  supported aggregation functions:
  - `LENGTH()` / `COUNT()`
  - `MIN()`
  - `MAX()`
  - `SUM()`
  - `AVERAGE()` / `AVG()`
  - `STDDEV_POPULATION()` / `STDDEV()`
  - `STDDEV_SAMPLE()`
  - `VARIANCE_POPULATION()` / `VARIANCE()`
  - `VARIANCE_SAMPLE()`
  - `UNIQUE()`
  - `SORTED_UNIQUE()`
  - `COUNT_DISTINCT()` / `COUNT_UNIQUE()`
  - `BIT_AND()`
  - `BIT_OR()`
  - `BIT_XOR()`

- an aggregate expression must not refer to variables introduced by the `COLLECT` itself

`COLLECT` vs. `RETURN DISTINCT`
-------------------------------

In order to make a result set unique, one can either use `COLLECT` or
`RETURN DISTINCT`.

```js
FOR u IN users
  RETURN DISTINCT u.age
```

```js
FOR u IN users
  COLLECT age = u.age
  RETURN age
```

Behind the scenes, both variants create a *CollectNode*. However, they use
different implementations of `COLLECT` that have different properties:

- `RETURN DISTINCT` **maintains the order of results**, but it is limited to
  a single value.

- `COLLECT` **changes the order of results** (sorted or undefined), but it
  supports multiple values and is more flexible than `RETURN DISTINCT`.

Aside from `COLLECT`s sophisticated grouping and aggregation capabilities, it
allows you to place a `LIMIT` operation before `RETURN` to potentially stop the
`COLLECT` operation early.

`COLLECT` options
-----------------

### `method`

There are two variants of `COLLECT` that the optimizer can choose from:
the *sorted* and the *hash* variant. The `method` option can be used in a
`COLLECT` statement to inform the optimizer about the preferred method,
`"sorted"` or `"hash"`.

```js
COLLECT ... OPTIONS { method: "sorted" }
```

If no method is specified by the user, then the optimizer will create a plan
that uses the *sorted* method, and an additional plan using the *hash* method
if the `COLLECT` statement qualifies for it.

If the method is explicitly set to *sorted*, then the optimizer will always use
the *sorted* variant of `COLLECT` and not even create a plan using the *hash*
variant. If it is explicitly set to *hash*, then the optimizer will create a
plan using the *hash* method **only if the `COLLECT` statement qualifies**.
Not all `COLLECT` statements can use the *hash* method, in particular ones with
an `INTO` clause are not eligible. In case the `COLLECT` statement qualifies,
there will only be one plan that uses the *hash* method. Otherwise, the
optimizer will default to the *sorted* method.

The *sorted* method requires its input to be sorted by the group criteria
specified in the `COLLECT` clause. To ensure correctness of the result, the
optimizer will automatically insert a `SORT` operation into the query in front
of the `COLLECT` statement. The optimizer may be able to optimize away that
`SORT` operation later if a sorted index is present on the group criteria.

In case a `COLLECT` statement qualifies for using the *hash* variant, the
optimizer will create an extra plan for it at the beginning of the planning
phase. In this plan, no extra `SORT` statement will be added in front of the
`COLLECT`. This is because the *hash* variant of `COLLECT` does not require
sorted input. Instead, a `SORT` statement will be added after the `COLLECT` to
sort its output. This `SORT` statement may be optimized away again in later
stages.

If the sort order of the `COLLECT` is irrelevant to the user, adding the extra
instruction `SORT null` after the `COLLECT` will allow the optimizer to remove
the sorts altogether:

```js
FOR u IN users
  COLLECT age = u.age
  SORT null  /* note: will be optimized away */
  RETURN age
```

Which `COLLECT` variant is used by the optimizer if no preferred method is set
explicitly depends on the optimizer's cost estimations. The created plans with
the different `COLLECT` variants will be shipped through the regular
optimization pipeline. In the end, the optimizer will pick the plan with the
lowest estimated total cost as usual.

In general, the *sorted* variant of `COLLECT` should be preferred in cases when
there is a sorted index present on the group criteria. In this case the
optimizer can eliminate the `SORT` operation in front of the `COLLECT`, so that
no `SORT` will be left.

If there is no sorted index available on the group criteria, the up-front sort
required by the *sorted* variant can be expensive. In this case it is likely
that the optimizer will prefer the *hash* variant of `COLLECT`, which does not
require its input to be sorted.

Which variant of `COLLECT` will actually be used can be figured out by looking
at the execution plan of a query, specifically the comment of the *CollectNode*:

```js
Execution plan:
 Id   NodeType                  Est.   Comment
  1   SingletonNode                1   * ROOT
  2   EnumerateCollectionNode      5     - FOR doc IN coll   /* full collection scan, projections: `name` */
  3   CalculationNode              5       - LET #2 = doc.`name`   /* attribute expression */   /* collections used: doc : coll */
  4   CollectNode                  5       - COLLECT name = #2   /* hash */
  6   SortNode                     5       - SORT name ASC   /* sorting strategy: standard */
  5   ReturnNode                   5       - RETURN name
```
