---
layout: default
description: The "db" Object
---
The "db" Object
===============

The `db` object is available in [arangosh](getting-started-arangosh.html) by
default, and can also be imported and used in Foxx services.

*db.name* returns a [collection object](appendix-references-collection-object.html) for the collection *name*.

The following methods exists on the *_db* object:

*Database*

* [db._createDatabase(name, options, users)](data-modeling-databases-working-with.html#create-database)
* [db._databases()](data-modeling-databases-working-with.html#list-databases)
* [db._dropDatabase(name, options, users)](data-modeling-databases-working-with.html#drop-database)
* [db._useDatabase(name)](data-modeling-databases-working-with.html#use-database)

*Indexes*

* [db._index(index)](indexing-working-with-indexes.html#fetching-an-index-by-handle)
* [db._dropIndex(index)](indexing-working-with-indexes.html#dropping-an-index-via-a-database-handle)

*Properties*

* [db._id()](data-modeling-databases-working-with.html#id)
* [db._isSystem()](data-modeling-databases-working-with.html#issystem)
* [db._name()](data-modeling-databases-working-with.html#name)
* [db._path()](data-modeling-databases-working-with.html#path)
* [db._version()](data-modeling-documents-document-methods.html#get-the-version-of-arangodb)

*Collection*

* [db._collection(name)](data-modeling-collections-database-methods.html#collection)
* [db._create(name)](data-modeling-collections-database-methods.html#create)
* [db._drop(name)](data-modeling-collections-database-methods.html#drop)
* [db._truncate(name)](data-modeling-collections-database-methods.html#truncate)

*AQL*

* [db._createStatement(query)](aql/invocation-with-arangosh.html#with-createstatement-arangostatement)
* [db._query(query)](aql/invocation-with-arangosh.html#with-dbquery)
* [db._explain(query)](release-notes-new-features28.html#miscellaneous-improvements)

*Document*

* [db._document(object)](data-modeling-documents-database-methods.html#document)
* [db._exists(object)](data-modeling-documents-database-methods.html#exists)
* [db._remove(selector)](data-modeling-documents-database-methods.html#remove)
* [db._replace(selector,data)](data-modeling-documents-database-methods.html#replace)
* [db._update(selector,data)](data-modeling-documents-database-methods.html#update)
