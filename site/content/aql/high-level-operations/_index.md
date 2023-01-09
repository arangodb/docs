---
fileID: operations
title: High-level operations
weight: 3520
description: 
layout: default
---
The following high-level operations are described here after:

- [**FOR**](operations-for):
  Iterate over a collection or View, all elements of an array or traverse a graph

- [**RETURN**](operations-return):
  Produce the result of a query.

- [**FILTER**](operations-filter):
  Restrict the results to elements that match arbitrary logical conditions.

- [**SEARCH**](operations-search):
  Query an `arangosearch` or `search-alias` View.

- [**SORT**](operations-sort):
  Force a sort of the array of already produced intermediate results.

- [**LIMIT**](operations-limit):
  Reduce the number of elements in the result to at most the specified number,
  optionally skip elements (pagination).

- [**LET**](operations-let):
  Assign an arbitrary value to a variable.

- [**COLLECT**](operations-collect):
  Group an array by one or multiple group criteria. Can also count and aggregate.

- [**WINDOW**](operations-window):
  Perform aggregations over related rows.

- [**REMOVE**](operations-remove):
  Remove documents from a collection.

- [**UPDATE**](operations-update):
  Partially update documents in a collection.

- [**REPLACE**](operations-replace):
  Completely replace documents in a collection.

- [**INSERT**](operations-insert):
  Insert new documents into a collection.

- [**UPSERT**](operations-upsert):
  Update/replace an existing document, or create it in the case it does not exist.

- [**WITH**](operations-with):
  Specify collections used in a query (at query begin only).
