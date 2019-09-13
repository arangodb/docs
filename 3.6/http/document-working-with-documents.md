---
layout: default
---
Working with a Document
=======================

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock get_read_document %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock head_read_document_header %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock post_create_document %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock put_replace_document %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock patch_update_document %}

**Changes in 3.0 from 2.8:**

There are quite some changes in this in comparison to Version 2.8, but
few break existing usage:

  - the *rev* query parameter is gone (was duplication of If-Match)
  - the *policy* query parameter is gone (was non-sensical)
  - the *ignoreRevs* query parameter is new, the default *true* gives 
    the traditional behavior as in 2.8
  - the *returnNew* and *returnOld* query parameters are new

There should be very few changes to behavior happening in real-world
situations or drivers. Essentially, one has to replace usage of the
*rev* query parameter by usage of the *If-Match* header. The non-sensical
combination of *If-Match* given and *policy=last* no longer works, but can
easily be achieved by leaving out the *If-Match* header.

The collection name should now be specified in the URL path. The old
way with the URL path */_api/document* and the required query parameter
*collection* still works.

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock delete_remove_document %}

**Changes in 3.0 from 2.8:**

There are only very few changes in this in comparison to Version 2.8:

  - the *rev* query parameter is gone (was duplication of If-Match)
  - the *policy* query parameter is gone (was non-sensical)
  - the *returnOld* query parameter is new

There should be very few changes to behavior happening in real-world
situations or drivers. Essentially, one has to replace usage of the
*rev* query parameter by usage of the *If-Match* header. The non-sensical
combination of *If-Match* given and *policy=last* no longer works, but can
easily be achieved by leaving out the *If-Match* header.


Bulk Document Operations
========================

ArangoDB supports working with document in bulk. Bulk operations affect a *single* collection. 
Using this API variant allows clients to ammortize the overhead of single requests over
an entire batch of documents. ArangoDB bulk operations are **not guaranteed** to be executed serially,
ArangoDB _may_ execute the operations in parallel. This can translate into large performance improvements
especially in a Cluster deployment.

Should an error occur during the processing of one operations, 
ArangoDB continues to process the remaining operations. Errors are returned _inline_ in
the response body as an error document (See below for more details).
Additionally the _X-Arango-Error-Codes_ header will contains a map of the error codes that occurred 
together with their multiplicities, as in: *1205:10,1210:17* which means that in 10
cases the error 1205 "illegal document handle" and in 17 cases the
error 1210 "unique constraint violated" has happened.

Generally the bulk operations expect an input array and the result body will contain a JSON array of the
same length.

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock get_read_document_MULTI %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock post_create_document_MULTI %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock put_replace_document_MULTI %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock patch_update_document_MULTI %}

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock delete_remove_document_MULTI %}