---
layout: default
description: ArangoDB v3.8 Release Notes API Changes
---
API Changes in ArangoDB 3.8
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.8.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.8.

## HTTP RESTful API

### Endpoint return value changes

### Endpoints added

### Endpoints augmented

The REST endpoint at GET `/_api/engine/stats` now returns useful information in cluster
setups too. Previously calling this API on a Coordinator always produced an empty JSON
object result, whereas now it will produce a JSON object with one key per DB-Server.
The mapped value per DB-Server are the engine statistics for this particular server.

The return value structure is different to the return value structure in single server,
where the return value is a simple JSON object with the statistics at the top level.

### Endpoints moved

### Endpoints removed

## JavaScript API

## ArangoDB Server Environment Variables
