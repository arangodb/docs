---
layout: default
redirect_from:
  - getting-started-web-interface.html # 3.9 -> 3.10
---
- Communication
  - Web UI
  - arangosh
  - REST API
  - Drivers
- Data model?
- Types of requests
  - low level APIs
  - AQL (also indexes?)
  - higher-level APIs?

# How to Interact With ArangoDB

ArangoDB is a database that serves documents to clients. These documents are
transported using [JSON](https://en.wikipedia.org/wiki/JSON){:target="_blank"} via a TCP connection,
using the HTTP protocol. A [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer){:target="_blank"}
is provided to interact with the database system.

The [web interface](programs-web-interface.html) that comes with
ArangoDB, called *Aardvark*, provides graphical user interface that is easy to use.
An [interactive shell](programs-arangosh.html), called *arangosh*, is also
shipped. In addition, there are so called [drivers](drivers/index.html)
that make it easy to use the database system in various environments and
programming languages. All these tools use the HTTP interface of the server and
remove the necessity to roll own low-level code for basic communication in most
cases.

## Web Interface

The server itself (_arangod_) speaks HTTP / REST, but you can use the
graphical web interface to keep it simple. There is also
[arangosh](programs-arangosh.html), a synchronous shell
for interaction with the server. If you are a developer, you might
prefer the shell over the GUI. It does not provide features like
syntax highlighting however.

When you start using ArangoDB in your project, you will likely use an official
or community-made driver written in the same language as your project. Drivers
implement a programming interface that should feel natural for that programming
language, and do all the talking to the server. Therefore, you can most certainly
ignore the HTTP API unless you want to write a driver yourself or explicitly
want to use the raw interface.

To get familiar with the database system you can even put drivers aside and
use the web interface (code name *Aardvark*) for basic interaction.
The web interface will become available shortly after you started `arangod`.
You can access it in your browser at
[http://localhost:8529](http://localhost:8529){:target="_blank"} - if not, please
see [Troubleshooting](troubleshooting.html).

By default, authentication is enabled. The default user is `root`.
Depending on the installation method used, the installation process either
prompted for the root password or the default root password is empty
(see Securing the installation - TODO link (getting-started-installation.html#securing-the-installation)).

![Aardvark Login Form](images/loginView.png)

Next you will be asked which database to use. Every server instance comes with
a `_system` database. Select this database to continue.

![select database](images/selectDBView.png)

You should then be presented the dashboard with server statistics like this:

![Aardvark Dashboard Request Statistics](images/dashboardView.png)

For a more detailed description of the interface, see [Web Interface](programs-web-interface.html).

## Command-line Interface

<!-- TODO: arangosh -->

## API and Drivers 

<!-- TODO REST/HTTP API and Drivers -->




---
layout: default
redirect_from:
  - getting-started-databases-collections-documents.html # 3.9 -> 3.10
---
# Key Concepts

<!-- TODO: Overlaps with Data Model & Concepts, weird mix of guide and explanation -->

## Data Model

**Databases** are sets of collections. **Collections** store records, which are referred
to as **documents**. Collections are the equivalent of tables in RDBMS, and
documents can be thought of as rows in a table. The difference is that you don't
define what columns (or rather attributes) there will be in advance. Every
document in any collection can have arbitrary attribute keys and
values. Documents in a single collection will likely have a similar structure in
practice however, but the database system itself does not impose it and will
operate stable and fast no matter how your data looks like.

Read more in the [data-model concepts](data-modeling-concepts.html) chapter.

For now, you can stick with the default `_system` database and use the web
interface to create collections and documents. Start by clicking the
*COLLECTIONS* menu entry, then the *Add Collection* tile. Give it a name, e.g.
*users*, leave the other settings unchanged (we want it to be a document
collection) and *Save* it. A new tile labeled *users* should show up, which
you can click to open.

There will be *No documents* yet. Click the green circle with the white plus
on the right-hand side to create a first document in this collection. A dialog
will ask you for a `_key`. You can leave the field blank and click *Create* to
let the database system assign an automatically generated (unique) key. Note
that the `_key` property is immutable, which means you can not change it once
the document is created. What you can use as document key is described in the
[naming conventions](data-modeling-naming-conventions-document-keys.html).

An automatically generated key could be `"9883"` (`_key` is always a string!),
and the document `_id` would be `"users/9883"` in that case. Aside from a few
system attributes, there is nothing in this document yet. Let's add a custom
attribute by clicking the icon to the left of *(empty object)*, then *Append*.
Two input fields will become available, *FIELD* (attribute key) and *VALUE*
(attribute value). Type `name` as key and your name as value. *Append* another
attribute, name it `age` and set it to your age. Click *Save* to persist the
changes. If you click on *Collection: users* at the top on the right-hand side
of the ArangoDB logo, the document browser will show the documents in the
*users* collection and you will see the document you just created in the list.

## Data Retrieval

**Queries** are used to filter documents based on certain criteria, to compute
new data, as well as to manipulate or delete existing documents. Queries can be
as simple as a "query by example" or as complex as ["joins"](aql/examples-join.html)
using many collections or traversing graph structures. They are written in
the [ArangoDB Query Language](aql/index.html) (AQL).

**Cursors** are used to iterate over the result of queries, so that you get
easily processable batches instead of one big hunk.

**Indexes** are used to speed up searches. There are various types of indexes,
such as [persistent indexes](indexing-persistent.html)
and [geo-spatial indexes](indexing-geo.html).


---
layout: default
description: Querying the Database
redirect_from:
  - getting-started-querying-the-database.html # 3.9 -> 3.10
  - getting-started-next-steps.html # 3.9 -> 3.10
---
<!-- TODO: title? Overlaps with the AQL Tutorial and the Data Queries page -->
Querying the Database
=====================

Time to retrieve our document using AQL, ArangoDB's query language. We can
directly look up the document we created via the `_id`, but there are also
other options. Click the *QUERIES* menu entry to bring up the query editor
and type the following (adjust the document ID to match your document):

```js
RETURN DOCUMENT("users/9883")
```

Then click *Execute* to run the query. The result appears below the query editor:

```json
[
  {
    "_key": "9883",
    "_id": "users/9883",
    "_rev": "9883",
    "age": 32,
    "name": "John Smith"
  }
]
```

As you can see, the entire document including the system attributes is returned.
[DOCUMENT()](aql/functions-miscellaneous.html) is a function to retrieve
a single document or a list of documents of which you know the `_key`s or `_id`s.
We return the result of the function call as our query result, which is our
document inside of the result array (we could have returned more than one result
with a different query, but even for a single document as result, we still get
an array at the top level).

This type of query is called data access query. No data is created, changed or
deleted. There is another type of query called data modification query. Let's
insert a second document using a modification query:

```js
INSERT { name: "Katie Foster", age: 27 } INTO users
```

The query is pretty self-explanatory: the `INSERT` keyword tells ArangoDB that
we want to insert something. What to insert, a document with two attributes in
this case, follows next. The curly braces `{ }` signify documents, or objects.
When talking about records in a collection, we call them documents. Encoded as
JSON, we call them objects. Objects can also be nested. Here's an example:

```json
{
  "name": {
    "first": "Katie",
    "last": "Foster"
  }
}
```

`INTO` is a mandatory part of every `INSERT` operation and is followed by the
collection name that we want to store the document in. Note that there are no
quote marks around the collection name.

If you run above query, there will be an empty array as result because we did
not specify what to return using a `RETURN` keyword. It is optional in
modification queries, but mandatory in data access queries. Even with `RETURN`,
the return value can still be an empty array, e.g. if the specified document
was not found. Despite the empty result, the above query still created a new
user document. You can verify this with the document browser.

Let's add another user, but return the newly created document this time:

```js
INSERT { name: "James Hendrix", age: 69 } INTO users
RETURN NEW
```

`NEW` is a pseudo-variable, which refers to the document created by `INSERT`.
The result of the query will look like this:

```json
[
  {
    "_key": "10074",
    "_id": "users/10074",
    "_rev": "10074",
    "age": 69,
    "name": "James Hendrix"
  }
]
```

Now that we have 3 users in our collection, how to retrieve them all with a
single query? The following **does not work**:

```js
RETURN DOCUMENT("users/9883")
RETURN DOCUMENT("users/9915")
RETURN DOCUMENT("users/10074")
```

There can only be a single `RETURN` statement here and a syntax error is raised
if you try to execute it. The `DOCUMENT()` function offers a secondary signature
to specify multiple document handles, so we could do:

```js
RETURN DOCUMENT( ["users/9883", "users/9915", "users/10074"] )
```

An array with the `_id`s of all 3 documents is passed to the function. Arrays
are denoted by square brackets `[ ]` and their elements are separated by commas.

But what if we add more users? We would have to change the query to retrieve
the newly added users as well. All we want to say with our query is: "For every
user in the collection users, return the user document". We can formulate this
with a `FOR` loop:

```js
FOR user IN users
  RETURN user
```

It expresses to iterate over every document in `users` and to use `user` as
variable name, which we can use to refer to the current user document. It could
also be called `doc`, `u` or `ahuacatlguacamole`, this is up to you. It is
advisable to use a short and self-descriptive name however.

The loop body tells the system to return the value of the variable `user`,
which is a single user document. All user documents are returned this way:

```json
[
  {
    "_key": "9915",
    "_id": "users/9915",
    "_rev": "9915",
    "age": 27,
    "name": "Katie Foster"
  },
  {
    "_key": "9883",
    "_id": "users/9883",
    "_rev": "9883",
    "age": 32,
    "name": "John Smith"
  },
  {
    "_key": "10074",
    "_id": "users/10074",
    "_rev": "10074",
    "age": 69,
    "name": "James Hendrix"
  }
]
```

You may have noticed that the order of the returned documents is not necessarily
the same as they were inserted. There is no order guaranteed unless you explicitly
sort them. We can add a `SORT` operation very easily:

```js
FOR user IN users
  SORT user._key
  RETURN user
```

This does still not return the desired result: James (10074) is returned before
John (9883) and Katie (9915). The reason is that the `_key` attribute is a string
in ArangoDB, and not a number. The individual characters of the strings are
compared. `1` is lower than `9` and the result is therefore "correct". If we
wanted to use the numerical value of the `_key` attributes instead, we could
convert the string to a number and use it for sorting. There are some implications
however. We are better off sorting something else. How about the age, in descending
order?

```js
FOR user IN users
  SORT user.age DESC
  RETURN user
```

The users will be returned in the following order: James (69), John (32), Katie
(27). Instead of `DESC` for descending order, `ASC` can be used for ascending
order. `ASC` is the default though and can be omitted.

We might want to limit the result set to a subset of users, based on the age
attribute for example. Let's return users older than 30 only:

```js
FOR user IN users
  FILTER user.age > 30
  SORT user.age
  RETURN user
```

This will return John and James (in this order). Katie's age attribute does not
fulfill the criterion (greater than 30), she is only 27 and therefore not part
of the result set. We can make her age to return her user document again, using
a modification query:

```js
UPDATE "9915" WITH { age: 40 } IN users
RETURN NEW
```

`UPDATE` allows to partially edit an existing document. There is also `REPLACE`,
which would remove all attributes (except for `_key` and `_id`, which remain the
same) and only add the specified ones. `UPDATE` on the other hand only replaces
the specified attributes and keeps everything else as-is.

The `UPDATE` keyword is followed by the document key (or a document / object
with a `_key` attribute) to identify what to modify. The attributes to update
are written as object after the `WITH` keyword. `IN` denotes in which collection
to perform this operation in, just like `INTO` (both keywords are actually
interchangeable here). The full document with the changes applied is returned
if we use the `NEW` pseudo-variable:

```json
[
  {
    "_key": "9915",
    "_id": "users/9915",
    "_rev": "12864",
    "age": 40,
    "name": "Katie Foster"
  }
]
```

If we used `REPLACE` instead, the name attribute would be gone. With `UPDATE`,
the attribute is kept (the same would apply to additional attributes if we had
them).

Let us run our `FILTER` query again, but only return the user names this time:

```js
FOR user IN users
  FILTER user.age > 30
  SORT user.age
  RETURN user.name
```

This will return the names of all 3 users:

```json
[
  "John Smith",
  "Katie Foster",
  "James Hendrix"
]
```

It is called a projection if only a subset of attributes is returned. Another
kind of projection is to change the structure of the results:

```
FOR user IN users
  RETURN { userName: user.name, age: user.age }
```

The query defines the output format for every user document. The user name is
returned as `userName` instead of `name`, the age keeps the attribute key in
this example:

```json
[
  {
    "userName": "James Hendrix",
    "age": 69
  },
  {
    "userName": "John Smith",
    "age": 32
  },
  {
    "userName": "Katie Foster",
    "age": 40
  }
]
```

It is also possible to compute new values, for example by concatenation:

```js
FOR user IN users
  RETURN CONCAT(user.name, "'s age is ", user.age)
```

`CONCAT()` is a function that can join elements together to a string. We use it
here to return a statement for every user. As you can see, the result set does
not always have to be an array of objects:

```json
[
  "James Hendrix's age is 69",
  "John Smith's age is 32",
  "Katie Foster's age is 40"
]
```

Now let's do something crazy: for every document in the users collection,
iterate over all user documents again and return user pairs, e.g. John and Katie.
We can use a loop inside a loop for this to get the cross product (every possible
combination of all user records, 3 \* 3 = 9). We don't want pairings like *John +
John* however, so let's eliminate them with a filter condition:

```js
FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    RETURN [user1.name, user2.name]
```

We get 6 pairings. Pairs like *James + John* and *John + James* are basically
redundant, but fair enough:

```json
[
  [ "James Hendrix", "John Smith" ],
  [ "James Hendrix", "Katie Foster" ],
  [ "John Smith", "James Hendrix" ],
  [ "John Smith", "Katie Foster" ],
  [ "Katie Foster", "James Hendrix" ],
  [ "Katie Foster", "John Smith" ]
]
```

We could calculate the sum of both ages and compute something new this way:

```js
FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    RETURN {
        pair: [user1.name, user2.name],
        sumOfAges: user1.age + user2.age
    }
```

We introduce a new attribute `sumOfAges` and add up both ages for the value:

```json
[
  {
    "pair": [ "James Hendrix", "John Smith" ],
    "sumOfAges": 101
  },
  {
    "pair": [ "James Hendrix", "Katie Foster" ],
    "sumOfAges": 109
  },
  {
    "pair": [ "John Smith", "James Hendrix" ],
    "sumOfAges": 101
  },
  {
    "pair": [ "John Smith", "Katie Foster" ],
    "sumOfAges": 72
  },
  {
    "pair": [ "Katie Foster", "James Hendrix" ],
    "sumOfAges": 109
  },
  {
    "pair": [ "Katie Foster", "John Smith" ],
    "sumOfAges": 72
  }
]
```

If we wanted to post-filter on the new attribute to only return pairs with a
sum less than 100, we should define a variable to temporarily store the sum,
so that we can use it in a `FILTER` statement as well as in the `RETURN`
statement:

```js
FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    LET sumOfAges = user1.age + user2.age
    FILTER sumOfAges < 100
    RETURN {
        pair: [user1.name, user2.name],
        sumOfAges: sumOfAges
    }
```

The `LET` keyword is followed by the designated variable name (`sumOfAges`),
then there's a `=` symbol and the value or an expression to define what value
the variable is supposed to have. We re-use our expression to calculate the
sum here. We then have another `FILTER` to skip the unwanted pairings and
make use of the variable we declared before. We return a projection with an
array of the user names and the calculated age, for which we use the variable
again:

```json
[
  {
    "pair": [ "John Smith", "Katie Foster" ],
    "sumOfAges": 72
  },
  {
    "pair": [ "Katie Foster", "John Smith" ],
    "sumOfAges": 72
  }
]
```

Pro tip: when defining objects, if the desired attribute key and the variable
to use for the attribute value are the same, you can use a shorthand notation:
`{ sumOfAges }` instead of `{ sumOfAges: sumOfAges }`.

Finally, let's delete one of the user documents:

```js
REMOVE "9883" IN users
```

It deletes the user John (`_key: "9883"`). We could also remove documents in a
loop (same goes for `INSERT`, `UPDATE` and `REPLACE`):

```js
FOR user IN users
    FILTER user.age >= 30
    REMOVE user IN users
```

The query deletes all users whose age is greater than or equal to 30.

## Next Steps

There is a lot more to [discover in AQL](aql/index.html) and much more
functionality that ArangoDB offers. Continue reading the other chapters and
experiment with a test database to foster your knowledge.

If you want to write more AQL queries right now, have a look here:

- [Data Queries](aql/data-queries.html): data access and modification queries
- [High-level operations](aql/operations.html): detailed descriptions
  of `FOR`, `FILTER` and more operations not shown in this introduction
- [Functions](aql/functions.html): a reference of all provided functions

Visit the [ArangoDB Training Center](https://www.arangodb.com/learn/){:target="_blank"}
for courses, tutorials and more.
