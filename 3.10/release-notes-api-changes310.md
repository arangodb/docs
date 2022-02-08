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

The cursor API can now return two additional statistics values in its `stats` subattribute:

* *cursorsCreated*: the total number of cursor objects created during query execution. Cursor
  objects are created for index lookups.
* *cursorsRearmed*: the total number of times an existing cursor object was repurposed. 
  Repurposing an existing cursor object is normally more efficient compared to destroying an 
  existing cursor object and creating a new one from scratch.

These attributes are optional and only useful for detailed performance analyses.

### Endpoints moved

### Endpoints deprecated

### Endpoints removed

## JavaScript API
