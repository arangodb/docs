---
layout: default
description: Import Graph data
---
# Import Graph data

Importing graph data is possible using [bulk import](java-reference-collection-bulk-import.html) functions for every 
vertex and edge collection of the graph. Nevertheless sometimes one could have the need to preserve certain domain 
specific invariants (consistency) while inserting the data. For example while populating a movie database, it would be
desirable to insert together with each movie, all its actors and the related outgoing edges reaching them.

This can be achieved using a [Stream Transaction](java-reference-database-stream-transactions.html) which inserts data 
into all the related vertex and edge collections using
[batch insert](java-reference-collection-document-manipulation.html#arangocollectioninsertdocuments). On the other side 
this would not be possible using `bulk import` functions, since they do not support `Stream transactions`.

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

Note: if the batch is too large, one could incur intermediate commits (see
[transactions limitations](transactions-limitations.html#rocksdb-storage-engine)).

