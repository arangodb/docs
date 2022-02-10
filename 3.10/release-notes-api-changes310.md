---
layout: default
description: ArangoDB v3.10 Release Notes API Changes
---
API Changes in ArangoDB 3.10
============================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.10.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.10.

## HTTP RESTful API

### Privilege changes

### Endpoint return value changes

### Endpoints added

### Endpoints augmented

#### Cursor API

The cursor API can now return two additional statistics values in its `stats` subattribute:

* *cursorsCreated*: the total number of cursor objects created during query execution. Cursor
  objects are created for index lookups.
* *cursorsRearmed*: the total number of times an existing cursor object was repurposed. 
  Repurposing an existing cursor object is normally more efficient compared to destroying an 
  existing cursor object and creating a new one from scratch.

These attributes are optional and only useful for detailed performance analyses.

#### Index API

The index creation API at POST `/_api/index` now accepts an optional `storedValues` 
attribute to include additional attributes in a persistent index.
These additional attributes cannot be used for index lookups or sorts, but they
can be used for projections.
If set, `storedValues` must be an array of index attribute paths. There must be no
overlap of attribute paths between `fields` and `storedValues`. The maximum number
of values is 32.

All index APIs that return additional data about indexes (e.g. GET `/_api/index`)
will now also return the `storedValues` attribute for indexes that have their
`storedValues` attribute set.

The extra index information is also returned by inventory-like APIs that return
the full set of collections with their indexes.


### Endpoints moved

### Endpoints deprecated

### Endpoints removed

## JavaScript API
