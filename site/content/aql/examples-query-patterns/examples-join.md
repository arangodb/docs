---
fileID: examples-join
title: Using Joins in AQL
weight: 3735
description: 
layout: default
---
The two common scenarios when you want to join documents of collections are:

- **One-to-Many**:
  You may have a collection _users_ and a collection _cities_. A user lives in
  a city and you need the city information during a query about the user.

- **Many-To-Many**:
  You may have a collection _authors_ and _books_. An author can write many
  books and a book can have many authors. You want to return a list of books
  with their authors. Therefore you need to join the authors and books.

Unlike many NoSQL databases, ArangoDB does support joins in AQL queries. This
is similar to the way traditional relational databases handle this. However,
because documents allow for more flexibility, joins are also more flexible.
The following sections provide solutions for common questions.

So far we have only dealt with one collection (*users*) at a time. We also have a 
collection *relations* that stores relationships between users. We will now use
this extra collection to create a result from two collections.

First of all, we'll query a few users together with their friends' ids. For that,
we'll use all *relations* that have a value of *friend* in their *type* attribute.
Relationships are established by using the *friendOf* and *thisUser* attributes in the
*relations* collection, which point to the *userId* values in the *users* collection.


## OneToMany

You have a collection called users. Users live in city and a city is identified
by its primary key. In principle you can embedded the city document into the
users document and be happy with it.

{{< tabs >}}
{{% tab name="json" %}}
```json
{
  "_id" : "users/2151975421",
  "_key" : "2151975421",
  "_rev" : "2151975421",
  "name" : {
    "first" : "John",
    "last" : "Doe"
  },
  "city" : {
    "name" : "Metropolis"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

This works well for many use cases. Now assume, that you have additional
information about the city, like the number of people living in it. It would be
impractical to change each and every user document if this numbers changes.
Therefore it is good idea to hold the city information in a separate collection.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.cities.document("cities/2241300989");
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ 
  "population" : 1000, 
  "name" : "Metropolis", 
  "_id" : "cities/2241300989", 
  "_rev" : "2241300989", 
  "_key" : "2241300989" 
}
```
{{% /tab %}}
{{< /tabs >}}

Now you instead of embedding the city directly in the user document, you can use
the key of the city.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.users.document("users/2290649597");
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ 
  "name" : { 
    "first" : "John", 
    "last" : "Doe" 
  }, 
  "city" : "cities/2241300989", 
  "_id" : "users/2290649597", 
  "_rev" : "2290649597", 
  "_key" : "2290649597" 
}
```
{{% /tab %}}
{{< /tabs >}}

We can now join these two collections very easily.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query(
........>"FOR u IN users " + 
........>"  FOR c IN cities " + 
........>"    FILTER u.city == c._id RETURN { user: u, city: c }"
........>).toArray()
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ 
  { 
    "user" : { 
      "name" : { 
        "first" : "John", 
        "last" : "Doe" 
      }, 
      "city" : "cities/2241300989", 
      "_id" : "users/2290649597", 
      "_rev" : "2290649597", 
      "_key" : "2290649597" 
    }, 
    "city" : { 
      "population" : 1000, 
      "name" : "Metropolis", 
      "_id" : "cities/2241300989", 
      "_rev" : "2241300989", 
      "_key" : "2241300989" 
    } 
  } 
]
```
{{% /tab %}}
{{< /tabs >}}

Unlike SQL there is no special `JOIN` keyword. The optimizer ensures that the
primary index is used in the above query.

However, very often it is much more convenient for the client of the query if a
single document would be returned, where the city information is embedded in the
user document - as in the simple example above.  With AQL there you do not need
to forgo this simplification.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query(
........>"FOR u IN users " + 
........>"  FOR c IN cities " + 
........>"    FILTER u.city == c._id RETURN merge(u, {city: c})"
........>).toArray()
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ 
  { 
    "_id" : "users/2290649597", 
    "_key" : "2290649597", 
    "_rev" : "2290649597", 
    "name" : { 
      "first" : "John", 
      "last" : "Doe" 
    }, 
    "city" : { 
      "_id" : "cities/2241300989", 
      "_key" : "2241300989", 
      "_rev" : "2241300989", 
      "population" : 1000, 
      "name" : "Metropolis" 
    } 
  } 
]
```
{{% /tab %}}
{{< /tabs >}}

So you can have both: the convenient representation of the result for your
client and the flexibility of joins for your data model.

## ManyToMany

In the relational world you need a third table to model the many-to-many
relation. In ArangoDB you have a choice depending on the information you are
going to store and the type of questions you are going to ask.

Assume that authors are stored in one collection and books in a second. If all
you need is "which are the authors of a book" then you can easily model this as
a list attribute in users.

If you want to store more information, for example which author wrote which
page in a conference proceeding, or if you also want to know "which books were
written by which author", you can use edge collections. This is very similar to
the "join table" from the relational world.

### Embedded Lists

If you only want to store the authors of a book, you can embed them as list in
the book document. There is no need for a separate collection.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.authors.toArray()
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ 
  { 
    "_id" : "authors/2661190141", 
    "_key" : "2661190141", 
    "_rev" : "2661190141", 
    "name" : { 
      "first" : "Maxima", 
      "last" : "Musterfrau" 
    } 
  }, 
  { 
    "_id" : "authors/2658437629", 
    "_key" : "2658437629", 
    "_rev" : "2658437629", 
    "name" : { 
      "first" : "John", 
      "last" : "Doe" 
    } 
  } 
]
```
{{% /tab %}}
{{< /tabs >}}

You can query books

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query("FOR b IN books RETURN b").toArray();
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ 
  { 
    "_id" : "books/2681506301", 
    "_key" : "2681506301", 
    "_rev" : "2681506301", 
    "title" : "The beauty of JOINS", 
    "authors" : [ 
      "authors/2661190141", 
      "authors/2658437629" 
    ] 
  } 
]
```
{{% /tab %}}
{{< /tabs >}}

and join the authors in a very similar manner given in the one-to-many section.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query(
........>"FOR b IN books " +
........>"  LET a = (FOR x IN b.authors " + 
........>"             FOR a IN authors FILTER x == a._id RETURN a) " +
........>"   RETURN { book: b, authors: a }"
........>).toArray();
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ 
  { 
    "book" : { 
      "title" : "The beauty of JOINS", 
      "authors" : [ 
        "authors/2661190141", 
        "authors/2658437629" 
      ], 
      "_id" : "books/2681506301", 
      "_rev" : "2681506301", 
      "_key" : "2681506301" 
    }, 
    "authors" : [ 
      { 
        "name" : { 
          "first" : "Maxima", 
          "last" : "Musterfrau" 
        }, 
        "_id" : "authors/2661190141", 
        "_rev" : "2661190141", 
        "_key" : "2661190141" 
      }, 
      { 
        "name" : { 
          "first" : "John", 
          "last" : "Doe" 
        }, 
        "_id" : "authors/2658437629", 
        "_rev" : "2658437629", 
        "_key" : "2658437629" 
      } 
    ] 
  } 
]
```
{{% /tab %}}
{{< /tabs >}}

… or embed the authors directly:

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query(
........>"FOR b IN books LET a = (" + 
........>"     FOR x IN b.authors " + 
........>"        FOR a IN authors FILTER x == a._id RETURN a)" +
........>"  RETURN merge(b, { authors: a })"
........>).toArray();
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[ 
  { 
    "_id" : "books/2681506301", 
    "_key" : "2681506301", 
    "_rev" : "2681506301", 
    "title" : "The beauty of JOINS", 
    "authors" : [ 
      { 
        "_id" : "authors/2661190141", 
        "_key" : "2661190141", 
        "_rev" : "2661190141", 
        "name" : { 
          "first" : "Maxima", 
          "last" : "Musterfrau" 
        } 
      }, 
      { 
        "_id" : "authors/2658437629", 
        "_key" : "2658437629", 
        "_rev" : "2658437629", 
        "name" : { 
          "first" : "John", 
          "last" : "Doe" 
        } 
      } 
    ] 
  } 
]
```
{{% /tab %}}
{{< /tabs >}}

### Using Edge Collections

If you also want to query which books are written by a given author, embedding authors
in the book document is possible, but it is more efficient to use a edge collections for
speed.

Or you are publishing a proceeding, then you want to store the pages the author has written
as well. This information can be stored in the edge document.

First create the users

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._create("authors");
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="" %}}
```
[ArangoCollection 2926807549, "authors" (type document, status loaded)]
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.authors.save({ name: { first: "John", last: "Doe" } })
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ 
  "error" : false, 
  "_id" : "authors/2935261693", 
  "_rev" : "2935261693", 
  "_key" : "2935261693" 
}
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.authors.save({ name: { first: "Maxima", last: "Musterfrau" } })
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ 
  "error" : false, 
  "_id" : "authors/2938210813", 
  "_rev" : "2938210813", 
  "_key" : "2938210813" 
}
```
{{% /tab %}}
{{< /tabs >}}

Now create the books without any author information.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._create("books");
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="" %}}
```
[ArangoCollection 2928380413, "books" (type document, status loaded)]
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.books.save({ title: "The beauty of JOINS" });
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ 
  "error" : false, 
  "_id" : "books/2980088317", 
  "_rev" : "2980088317", 
  "_key" : "2980088317" 
}
```
{{% /tab %}}
{{< /tabs >}}

An edge collection is now used to link authors and books.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._createEdgeCollection("written");
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="" %}}
```
[ArangoCollection 2931132925, "written" (type edge, status loaded)]
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.written.save("authors/2935261693",
........>"books/2980088317",
........>{ pages: "1-10" })
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ 
  "error" : false, 
  "_id" : "written/3006237181", 
  "_rev" : "3006237181", 
  "_key" : "3006237181" 
}
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db.written.save("authors/2938210813",
........>"books/2980088317",
........>{ pages: "11-20" })
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
{ 
  "error" : false, 
  "_id" : "written/3012856317", 
  "_rev" : "3012856317", 
  "_key" : "3012856317" 
}
```
{{% /tab %}}
{{< /tabs >}}

In order to get all books with their authors you can use a
[graph traversal](../../graphs/traversals/#working-with-collection-sets)

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query(
...> "FOR b IN books " +
...> "LET authorsByBook = ( " +
...> "    FOR author, writtenBy IN INBOUND b written " +
...> "    RETURN { " +
...> "        vertex: author, " +
...> "        edge: writtenBy " +
...> "    } " +
...> ") " +
...> "RETURN { " +
...> "    book: b, " +
...> "    authors: authorsByBook " +
...> "} "
...> ).toArray();
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "book" : {
      "_key" : "2980088317",
      "_id" : "books/2980088317",
      "_rev" : "2980088317",
      "title" : "The beauty of JOINS"
    },
    "authors" : [
      {
        "vertex" : {
          "_key" : "2935261693",
          "_id" : "authors/2935261693",
          "_rev" : "2935261693",
          "name" : {
            "first" : "John",
            "last" : "Doe"
          }
        },
        "edge" : {
          "_key" : "2935261693",
          "_id" : "written/2935261693",
          "_from" : "authors/2935261693",
          "_to" : "books/2980088317",
          "_rev" : "3006237181",
          "pages" : "1-10"
        }
      },
      {
        "vertex" : {
          "_key" : "2938210813",
          "_id" : "authors/2938210813",
          "_rev" : "2938210813",
          "name" : {
            "first" : "Maxima",
            "last" : "Musterfrau"
          }
        },
        "edge" : {
          "_key" : "6833274",
          "_id" : "written/6833274",
          "_from" : "authors/2938210813",
          "_to" : "books/2980088317",
          "_rev" : "3012856317",
          "pages" : "11-20"
        }
      }
    ]
  }
]
```
{{% /tab %}}
{{< /tabs >}}

Or if you want only the information stored in the vertices.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query(
...> "FOR b IN books " +
...> "LET authorsByBook = ( " +
...> "    FOR author IN INBOUND b written " +
...> "    OPTIONS { " +
...> "        order: 'bfs', " +
...> "        uniqueVertices: 'global' " +
...> "    } " +
...> "    RETURN author " +
...> ") " +
...> "RETURN { " +
...> "    book: b, " +
...> "    authors: authorsByBook " +
...> "} "
...> ).toArray();
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "book" : {
      "_key" : "2980088317",
      "_id" : "books/2980088317",
      "_rev" : "2980088317",
      "title" : "The beauty of JOINS"
    },
    "authors" : [
      {
        "_key" : "2938210813",
        "_id" : "authors/2938210813",
        "_rev" : "2938210813",
        "name" : {
          "first" : "Maxima",
          "last" : "Musterfrau"
        }
      },
      {
        "_key" : "2935261693",
        "_id" : "authors/2935261693",
        "_rev" : "2935261693",
        "name" : {
          "first" : "John",
          "last" : "Doe"
        }
      }
    ]
  }
]
```
{{% /tab %}}
{{< /tabs >}}

Or again embed the authors directly into the book document.

{{< tabs >}}
{{% tab name="js" %}}
```js
arangosh> db._query(
...> "FOR b IN books " +
...> "LET authors = ( " +
...> "    FOR author IN INBOUND b written " +
...> "    OPTIONS { " +
...> "        order: 'bfs', " +
...> "        uniqueVertices: 'global' " +
...> "    } " +
...> "    RETURN author " +
...> ") " +
...> "RETURN MERGE(b, {authors: authors}) "
...> ).toArray();
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "_id" : "books/2980088317",
    "_key" : "2980088317",
    "_rev" : "2980088317",
    "title" : "The beauty of JOINS",
    "authors" : [
      {
        "_key" : "2938210813",
        "_id" : "authors/2938210813",
        "_rev" : "2938210813",
        "name" : {
          "first" : "Maxima",
          "last" : "Musterfrau"
        }
      },
      {
        "_key" : "2935261693",
        "_id" : "authors/2935261693",
        "_rev" : "2935261693",
        "name" : {
          "first" : "John",
          "last" : "Doe"
        }
      }
    ]
  }
]
```
{{% /tab %}}
{{< /tabs >}}

If you need the authors and their books, simply reverse the direction.

{{< tabs >}}
{{% tab name="js" %}}
```js
> db._query(
...> "FOR a IN authors " +
...> "LET booksByAuthor = ( " +
...> "    FOR b IN OUTBOUND a written " +
...> "    OPTIONS { " +
...> "        order: 'bfs', " +
...> "        uniqueVertices: 'global' " +
...> "    } " +
...> "    RETURN b" +
...> ") " +
...> "RETURN MERGE(a, {books: booksByAuthor}) "
...> ).toArray();
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "_id" : "authors/2935261693",
    "_key" : "2935261693",
    "_rev" : "2935261693",
    "name" : {
      "first" : "John",
      "last" : "Doe"
    },
    "books" : [
      {
        "_key" : "2980088317",
        "_id" : "books/2980088317",
        "_rev" : "2980088317",
        "title" : "The beauty of JOINS"
      }
    ]
  },
  {
    "_id" : "authors/2938210813",
    "_key" : "2938210813",
    "_rev" : "2938210813",
    "name" : {
      "first" : "Maxima",
      "last" : "Musterfrau"
    },
    "books" : [
      {
        "_key" : "2980088317",
        "_id" : "books/2980088317",
        "_rev" : "2980088317",
        "title" : "The beauty of JOINS"
      }
    ]
  }
]
```
{{% /tab %}}
{{< /tabs >}}

## More examples

### Join tuples

We will start with a SQL-ish result set and return each tuple (user name, friends userId) 
separately. The AQL query to generate such result is:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: joinTuples
description: ''
render: input/output
version: '3.10'
release: stable
dataset: joinSampleDataset
bindVars:
  {
      "friend": "friend"
      }
---
FOR u IN users
  FILTER u.active == true
  LIMIT 0, 4
  FOR f IN relations
FILTER f.type == @friend && f.friendOf == u.userId
RETURN {
  "user" : u.name,
  "friendId" : f.thisUser
}
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



We iterate over the collection users. Only the 'active' users will be examined.
For each of these users we will search for up to 4 friends. We locate friends
by comparing the *userId* of our current user with the *friendOf* attribute of the
*relations* document. For each of those relations found we return the users name
and the userId of the friend.

### Horizontal lists

Note that in the above result, a user can be returned multiple times. This is the
SQL way of returning data. If this is not desired, the friends' ids of each user
can be returned in a horizontal list. This will return each user at most once.

The AQL query for doing so is:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  FILTER u.active == true LIMIT 0, 4
  RETURN {
    "user" : u.name,
    "friendIds" : (
      FOR f IN relations
        FILTER f.friendOf == u.userId && f.type == "friend"
        RETURN f.thisUser
    )
  }
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "user" : "Abigail",
    "friendIds" : [
      108,
      102,
      106
    ]
  },
  {
    "user" : "Fred",
    "friendIds" : [
      209
    ]
  },
  {
    "user" : "Mary",
    "friendIds" : [
      207,
      104
    ]
  },
  {
    "user" : "Mariah",
    "friendIds" : [
      203,
      205
    ]
  }
]
```
{{% /tab %}}
{{< /tabs >}}

In this query we are still iterating over the users in the *users* collection
and for each matching user we are executing a subquery to create the matching
list of related users.

### Self joins

To not only return friend ids but also the names of friends, we could "join" the
*users* collection once more (something like a "self join"):

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR u IN users
  FILTER u.active == true
  LIMIT 0, 4
  RETURN {
    "user" : u.name,
    "friendIds" : (
      FOR f IN relations
        FILTER f.friendOf == u.userId && f.type == "friend"
        FOR u2 IN users
          FILTER f.thisUser == u2.useId
          RETURN u2.name
    )
  }
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "user" : "Abigail",
    "friendIds" : [
      "Jim",
      "Jacob",
      "Daniel"
    ]
  },
  {
    "user" : "Fred",
    "friendIds" : [
      "Mariah"
    ]
  },
  {
    "user" : "Mary",
    "friendIds" : [
      "Isabella",
      "Michael"
    ]
  },
  {
    "user" : "Mariah",
    "friendIds" : [
      "Madison",
      "Eva"
    ]
  }
]
```
{{% /tab %}}
{{< /tabs >}}

This query will then again in term fetch the clear text name of the
friend from the users collection. So here we iterate the users collection,
and for each hit the relations collection, and for each hit once more the
users collection.

### Outer joins

Lets find the lonely people in our database - those without friends.

{{< tabs >}}
{{% tab name="aql" %}}
```aql

FOR user IN users
  LET friendList = (
    FOR f IN relations
      FILTER f.friendOf == u.userId
      RETURN 1
  )
  FILTER LENGTH(friendList) == 0
  RETURN { "user" : user.name }
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
```json
[
  {
    "user" : "Abigail"
  },
  {
    "user" : "Fred"
  }
]
```
{{% /tab %}}
{{< /tabs >}}

So, for each user we pick the list of their friends and count them. The ones where
count equals zero are the lonely people. Using *RETURN 1* in the subquery
saves even more precious CPU cycles and gives the optimizer more alternatives.

### Index usage

Especially on joins you should make sure indexes can be used to
[speed up your query](../execution-and-performance/execution-and-performance-explaining-queries).
Please note that sparse indexes don't qualify for joins:

In joins you typically would also want to join documents not containing the property 
you join with. However sparse indexes don't contain references to documents that 
don't contain the indexed attributes - thus they would be missing from the join operation.
For that reason you should provide non-sparse indexes. 

### Pitfalls

Since we're free of schemata, there is by default no way to tell the format of the
documents. So, if your documents don't contain an attribute, it defaults to
null. We can however check our data for accuracy like this:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN LENGTH(FOR u IN users FILTER u.userId == null RETURN 1)
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
{{< tabs >}}
{{% tab name="json" %}}
```json
[
  10000
]
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN LENGTH(FOR f IN relations FILTER f.friendOf == null RETURN 1)
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="json" %}}
{{< tabs >}}
{{% tab name="json" %}}
```json
[
  10000
]
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

So if the above queries return 10k matches each, the result of the Join tuples
query will become 100,000,000 items larger and use much memory plus computation
time. So it is generally a good idea to revalidate that the criteria for your
join conditions exist.

Using indexes on the properties can speed up the operation significantly.
You can use the explain helper to revalidate your query actually uses them.

If you work with joins on edge collections you would typically aggregate over
the internal fields *_id*, *_from* and *_to* (where *_id* equals *userId*,
*_from* *friendOf* and *_to* would be *thisUser* in our examples). ArangoDB
implicitly creates indexes on them.
