---
fileID: arangosearch-views-search-alias
title: search-alias Views Reference
weight: 765
description: 
layout: default
---
`search-alias` Views let you add one or more inverted indexes to a View, enabling
federate searching, sorting search results by relevance, and search highlighting, on top of
sophisticated information retrieval capabilities such as full-text search for
unstructured or semi-structured data provided by the inverted indexes that they
are comprised of.

Views can be managed in the web interface, via an [HTTP API](../../http/views/) and
through a [JavaScript API](../../getting-started/data-modeling/views/data-modeling-views-database-methods).

Views can be queried with AQL via the
[SEARCH operation](../../aql/high-level-operations/operations-search).

See [Information Retrieval with ArangoSearch]() for an
introduction.

## View Definition

A `search-alias` View is configured via an object containing a set of
View-specific configuration directives, allowing you to add inverted indexes:

- **name** (string, _immutable_): the View name
- **type** (string, _immutable_): the value `"search-alias"`
- **indexes** (array, _optional_): a list of inverted indexes for the View.
  Default: `[]`
  - **collection** (string, _required_): the name of a collection
  - **index** (string, _required_): the name of an inverted index of the
    `collection`, or the index ID without the `<collection>/` prefix

## View Modification

You can add or remove inverted indexes from the View definition:

- **indexes** (array, _optional_): a list of inverted indexes to add to or
  remove from the View. Default: `[]`
  - **collection** (string, _required_): the name of a collection
  - **index** (string, _required_): the name of an inverted index of the
    `collection`, or the index ID without the `<collection>/` prefix
  - **operation** (string, _optional_): whether to add or remove the index to
    the stored `indexes` property of the View. Possible values: `"add"`, `"del"`.
    The default is `"add"`
