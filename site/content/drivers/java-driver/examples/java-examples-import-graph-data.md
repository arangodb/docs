---
fileID: java-examples-import-graph-data
title: Import Graph data with Stream Transactions
weight: 4130
description: 
layout: default
---
Importing graph data is possible using
[bulk import](http://arangodb.github.io/arangodb-java-driver/latest/com/arangodb/ArangoCollection.html#importDocuments-java.util.Collection-com.arangodb.model.DocumentImportOptions-)
functions for every
vertex and edge collection of the graph. Nevertheless sometimes one could have
the need to preserve certain domain specific invariants (consistency) while
inserting the data. For example while populating a movie database, it would be
desirable to insert together with each movie, all its actors and the related
outgoing edges reaching them.

This can be achieved using a
[Stream Transaction](http://arangodb.github.io/arangodb-java-driver/latest/com/arangodb/ArangoDatabase.html#beginStreamTransaction-com.arangodb.model.StreamTransactionOptions-)
which inserts data into all the related vertex and edge collections using
[batch insert](http://arangodb.github.io/arangodb-java-driver/latest/com/arangodb/ArangoCollection.html#insertDocuments-java.util.Collection-com.arangodb.model.DocumentCreateOptions-).
On the other side this would not be possible using _bulk import_ functions,
since they do not support _Stream Transactions_.

Example for every batch of movies:

```java
List<Movie> movies = ...;           // movies of this batch
List<Actor> actors = ...;           // actors who acted in such movies 
List<HasActor> hasActorEdges = ...; // movie --> actor edges

StreamTransactionEntity tx = database.beginStreamTransaction(new StreamTransactionOptions()
                .writeCollections(MOVIES, ACTORS, HAS_ACTOR));

DocumentCreateOptions options = new DocumentCreateOptions().streamTransactionId(tx.getId());

try {
    database.collection(MOVIES).insertDocuments(c1Vertices, options);
    database.collection(ACTORS).insertDocuments(toVertices, options);
    database.collection(HAS_ACTOR).insertDocuments(edges, options.overwrite(true));
    database.commitStreamTransaction(tx.getId());
} catch (Exception e) {
    database.abortStreamTransaction(tx.getId());
    // handle e
}
```

{{% hints/warning %}}
If the batch is too large, you may incur intermediate commits (see
[transactions limitations](../../../transactions/transactions-limitations#rocksdb-storage-engine)).
{{% /hints/warning %}}
