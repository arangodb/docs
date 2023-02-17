---
layout: default
description: Endpoints of the RESTful HTTP API for handling documents
title: Document HTTP API
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

<!-- arangod/RestHandler/RestDocumentHandler.cpp -->
{% docublock delete_remove_document %}

Bulk Document Operations
========================

ArangoDB supports working with document in bulk. Bulk operations affect a
*single* collection. Using this API variant allows clients to amortize the
overhead of single requests over an entire batch of documents. Bulk operations
are **not guaranteed** to be executed serially, ArangoDB _may_ execute the
operations in parallel. This can translate into large performance improvements
especially in a cluster deployment.

ArangoDB will continue to process the remaining operations should an error
occur during the processing of one operation. Errors are returned _inline_ in
the response body as an error document (see below for more details).
Additionally the _X-Arango-Error-Codes_ header will contains a map of the
error codes that occurred together with their multiplicities, like
`1205:10,1210:17` which means that in 10 cases the error 1205
*illegal document handle* and in 17 cases the error 1210
*unique constraint violated* has happened.

Generally the bulk operations expect an input array and the result body will
contain a JSON array of the same length.

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
