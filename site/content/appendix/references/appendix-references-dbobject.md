---
fileID: appendix-references-dbobject
title: The "db" Object
weight: 12110
description: 
layout: default
---
The `db` object is available in [arangosh](../../programs-tools/arangodb-shell/) by
default, and can also be imported and used in Foxx services.

*db.name* returns a [collection object](appendix-references-collection-object) for the collection *name*.

The following methods exist on the *_db* object:

*Database*

* [db._createDatabase(name, options, users)](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#create-database)
* [db._databases()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#list-databases)
* [db._dropDatabase(name, options, users)](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#drop-database)
* [db._useDatabase(name)](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#use-database)

*Indexes*

* [db._index(index)](../../indexing/working-with-indexes/#fetching-an-index-by-handle)
* [db._dropIndex(index)](../../indexing/working-with-indexes/#dropping-an-index-via-a-database-handle)

*Properties*

* [db._id()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#id)
* [db._isSystem()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#issystem)
* [db._name()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#name)
* [db._path()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#path)
* [db._properties()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#properties)

*Collection*

* [db._collection(name)](../../getting-started/data-modeling/collections/data-modeling-collections-database-methods#collection)
* [db._collections()](../../getting-started/data-modeling/collections/data-modeling-collections-database-methods#all-collections)
* [db._create(name)](../../getting-started/data-modeling/collections/data-modeling-collections-database-methods#create)
* [db._drop(name)](../../getting-started/data-modeling/collections/data-modeling-collections-database-methods#drop)
* [db._truncate(name)](../../getting-started/data-modeling/collections/data-modeling-collections-database-methods#truncate)

*AQL*

* [db._createStatement(query)](../../aql/how-to-invoke-aql/invocation-with-arangosh#with-db_createstatement-arangostatement)
* [db._query(query)](../../aql/how-to-invoke-aql/invocation-with-arangosh#with-db_query)
* [db._explain(query)](../../aql/execution-and-performance/execution-and-performance-explaining-queries)
* [db._parse(query)](../../aql/how-to-invoke-aql/invocation-with-arangosh#query-validation)

*Document*

* [db._document(object)](../../getting-started/data-modeling/documents/data-modeling-documents-database-methods#document)
* [db._exists(object)](../../getting-started/data-modeling/documents/data-modeling-documents-database-methods#exists)
* [db._remove(selector)](../../getting-started/data-modeling/documents/data-modeling-documents-database-methods#remove)
* [db._replace(selector,data)](../../getting-started/data-modeling/documents/data-modeling-documents-database-methods#replace)
* [db._update(selector,data)](../../getting-started/data-modeling/documents/data-modeling-documents-database-methods#update)

*Views*

* [db._view(name)](../../getting-started/data-modeling/views/data-modeling-views-database-methods#view)
* [db._views()](../../getting-started/data-modeling/views/data-modeling-views-database-methods#all-views)
* [db._createView(name, type, properties)](../../getting-started/data-modeling/views/data-modeling-views-database-methods#create)
* [db._dropView(name)](../../getting-started/data-modeling/views/data-modeling-views-database-methods#drop)

*Global*

* [db._compact()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#compact)
* [db._engine()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#engine)
* [db._engineStats()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#engine-statistics)
* [db._createTransaction()](../../transactions/transactions-stream-transactions#create-transaction)
* [db._executeTransaction()](../../transactions/transactions-javascript-transactions#execute-transaction)
* [db._version()](../../getting-started/data-modeling/databases/data-modeling-databases-working-with#get-the-version-of-arangodb)

*License*

* [db._getLicense()](../../administration/administration-license#managing-your-license)]
* [db._setLicense(data)](../../administration/administration-license#initial-installation)]
