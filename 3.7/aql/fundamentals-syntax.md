---
layout: default
description: Query types, whitespace, comments, keywords and names explained
title: AQL Syntax Fundamentals
---
AQL Syntax
==========

Query types
-----------

An AQL query must either return a result (indicated by usage of the `RETURN`
keyword) or execute a data-modification operation (indicated by usage
of one of the keywords `INSERT`, `UPDATE`, `REPLACE`, `REMOVE` or `UPSERT`). The AQL
parser will return an error if it detects more than one data-modification 
operation in the same query or if it cannot figure out if the query is meant
to be a data retrieval or a modification operation.

AQL only allows **one** query in a single query string; thus semicolons to
indicate the end of one query and separate multiple queries (as seen in SQL) are
not allowed.

Whitespace
----------

Whitespaces (blanks, carriage returns, line feeds, and tab stops) can be used
in the query text to increase its readability. Tokens have to be separated by
any number of whitespaces. Whitespace within strings or names must be enclosed
in quotes in order to be preserved.

Comments
--------

Comments can be embedded at any position in a query. The text contained in the
comment is ignored by the AQL parser.

Multi-line comments cannot be nested, which means subsequent comment starts within
comments are ignored, comment ends will end the comment.

AQL supports two types of comments:

- Single line comments: These start with a double forward slash and end at
  the end of the line, or the end of the query string (whichever is first).
- Multi line comments: These start with a forward slash and asterisk, and
  end with an asterisk and a following forward slash. They can span as many
  lines as necessary.

```js
/* this is a comment */ RETURN 1
/* these */ RETURN /* are */ 1 /* multiple */ + /* comments */ 1
/* this is
   a multi line
   comment */
// a single line comment
```

Keywords
--------

On the top level, AQL offers the following
[high-level operations](operations.html):

| Operation | Description
|:----------|:-----------
| `FOR`     | Array iteration
| `RETURN`  | Results projection
| `FILTER`  | Non-View results filtering
| `SEARCH`  | View results filtering
| `SORT`    | Result sorting
| `LIMIT`   | Result slicing
| `LET`     | Variable assignment
| `COLLECT` | Result grouping
| `INSERT`  | Insertion of new documents
| `UPDATE`  | (Partial) update of existing documents
| `REPLACE` | Replacement of existing documents
| `REMOVE`  | Removal of existing documents
| `UPSERT`  | Insertion of new or update of existing documents
| `WITH`    | Collection declaration

Each of the above operations can be initiated in a query by using a keyword of
the same name. An AQL query can (and typically does) consist of multiple of the
above operations.

An example AQL query may look like this:

```js
FOR u IN users
  FILTER u.type == "newbie" && u.active == true
  RETURN u.name
```

In this example query, the terms `FOR`, `FILTER`, and `RETURN` initiate the
higher-level operation according to their name. These terms are also keywords,
meaning that they have a special meaning in the language.

For example, the query parser will use the keywords to find out which high-level
operations to execute. That also means keywords can only be used at certain
locations in a query. This also makes all keywords **reserved words** that must
not be used for other purposes than they are intended for.

For example, it is not possible to use a keyword as literal unquoted string
(identifier) for a collection or attribute name. If a collection or attribute
needs to have the same name as a keyword, then the collection or attribute name
needs to be quoted / escaped in the query (also see [Names](#names)).

Keywords are case-insensitive, meaning they can be specified in lower, upper, or
mixed case in queries. In this documentation, all keywords are written in upper
case to make them distinguishable from other query parts.

There are a few more keywords in addition to the higher-level operation keywords.
Additional keywords may be added in future versions of ArangoDB.
The complete list of keywords is currently:

- `AGGREGATE`
- `ALL`
- `AND`
- `ANY`
- `ASC`
- `COLLECT`
- `DESC`
- `DISTINCT`
- `FALSE`
- `FILTER`
- `FOR`
- `GRAPH`
- `IN`
- `INBOUND`
- `INSERT`
- `INTO`
- `K_SHORTEST_PATHS`
- `LET`
- `LIKE`
- `LIMIT`
- `NONE`
- `NOT`
- `NULL`
- `OR`
- `OUTBOUND`
- `REMOVE`
- `REPLACE`
- `RETURN`
- `SHORTEST_PATH`
- `SORT`
- `TRUE`
- `UPDATE`
- `UPSERT`
- `WITH`
{:class="columns-3"}

On top of that, there are a few words used in language constructs which are not
reserved keywords. They may thus be used as collection or attribute names
without quoting or escaping. The query parser can identify them as keyword-like
based on the context:

- `KEEP` –
  [COLLECT](operations-collect.html) operation variant
- `COUNT` (`WITH COUNT INTO`) –
  [COLLECT](operations-collect.html) operation variant
- `OPTIONS` –
  [FOR](operations-for.html#options) /
  [Graph Traversal](graphs-traversals.html) /
  [SEARCH](operations-search.html#search-options) /
  [COLLECT](operations-collect.html#setting-collect-options) /
  [INSERT](operations-insert.html#query-options) /
  [UPDATE](operations-update.html#query-options) /
  [REPLACE](operations-replace.html#query-options) /
  [UPSERT](operations-upsert.html#query-options) /
  [REMOVE](operations-remove.html#query-options)
  operation
- `PRUNE` –
  [Graph Traversal](graphs-traversals.html#pruning), FOR operation variant
- `SEARCH` –
  [SEARCH](operations-search.html) operation
- `TO` –
  [Shortest Path](graphs-shortest-path.html) /
  [k Shortest Paths](graphs-kshortest-paths.html) graph traversal

Last but not least, there are special variables which are available in certain
contexts. Unlike keywords, they are **case-sensitive**:
 
- `CURRENT` –
  available in
  [array inline expressions](advanced-array-operators.html#inline-expressions)
- `NEW` –
  available after
  [INSERT](operations-insert.html#returning-the-inserted-documents) /
  [UPDATE](operations-update.html#returning-the-modified-documents) /
  [REPLACE](operations-replace.html#returning-the-modified-documents) /
  [UPSERT](operations-upsert.html#returning-documents)
  operation
- `OLD` –
  available after
  [UPDATE](operations-update.html#returning-the-modified-documents) /
  [REPLACE](operations-replace.html#returning-the-modified-documents) /
  [UPSERT](operations-upsert.html#returning-documents) /
  [REMOVE](operations-remove.html#returning-the-removed-documents)
  operation

If you define a variable with the same name in the same scope, then its value
will be and remain at what you set it to. Hence you need to avoid these names
for your own variables if you want to access the special variable values.

Names
-----

In general, names are used to identify the following things in AQL queries:
- collections
- attributes
- variables
- functions

Names in AQL are always case-sensitive.
The maximum supported length for collection/View names is 256 bytes.
Variable names can be longer, but are discouraged.

Keywords must not be used as names. If a reserved keyword should be used as
a name, the name must be enclosed in backticks or forward ticks.

```js
FOR doc IN `filter`
  RETURN doc.`sort`
```

Due to the backticks, `filter` and `sort` are interpreted as names and not as
keywords here.

The example can alternatively written as:

```js
FOR f IN ´filter´
  RETURN f.´sort´
```

Instead of ticks, you may use the bracket notation for the attribute access:

```js
FOR f IN `filter`
  RETURN f["sort"]
```

`sort` is a **quoted** string literal in this alternative and does thus not
conflict with the reserved word.

Escaping is also required if special characters such as hyphen minus (`-`) are
contained in a name:

```js
FOR doc IN `my-coll`
  RETURN doc
```

The collection `my-coll` has a dash in its name, but `-` is an arithmetic
operator for subtraction in AQL. The backticks escape the collection name to
refer to the collection correctly. Note that quoting the name with `"` or `'`
is not possible for collections.

### Collection names

Collection names can be used in queries as they are. If a collection happens to
have the same name as a keyword, the name must be enclosed in backticks.

Please refer to the [Naming Conventions in ArangoDB](../data-modeling-naming-conventions-collection-and-view-names.html)
about collection naming conventions.

AQL currently has a limit of up to 256 collections used in one AQL query.
This limit applies to the sum of all involved document and edge collections.

### Attribute names

When referring to attributes of documents from a collection, the fully qualified
attribute name must be used. This is because multiple collections with ambiguous
attribute names may be used in a query.  To avoid any ambiguity, it is not
allowed to refer to an unqualified attribute name.

Please refer to the [Naming Conventions in ArangoDB](../data-modeling-naming-conventions-attribute-names.html)
for more information about the attribute naming conventions.

```js
FOR u IN users
  FOR f IN friends
    FILTER u.active == true && f.active == true && u.id == f.userId
    RETURN u.name
```

In the above example, the attribute names `active`, `name`, `id`, and `userId`
are qualified using the collection names they belong to (`u` and `f`
respectively).

### Variable names

AQL allows the user to assign values to additional variables in a query.  All
variables that are assigned a value must have a name that is unique within the
context of the query. Variable names must be different from the names of any
collection name used in the same query.

```js
FOR u IN users
  LET friends = u.friends
  RETURN { "name" : u.name, "friends" : friends }
```

In the above query, `users` is a collection name, and both `u` and `friends` are
variable names. This is because the `FOR` and `LET` operations need target
variables to store their intermediate results.

Allowed characters in variable names are the letters `a` to `z` (both in lower
and upper case), the numbers `0` to `9`, the underscore (`_`) symbol and the
dollar (`$`) sign. A variable name must not start with a number or underscore.
The dollar sign can only be used as the very first character in a variable name
and must be followed by a letter.
