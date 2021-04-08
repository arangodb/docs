---
layout: default
description: ArangoDB v3.9 Release Notes API Changes
---
API Changes in ArangoDB 3.9
===========================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.9.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.9.

## HTTP RESTful API

### Privilege changes

### Endpoint return value changes

### Endpoints added

### Endpoints augmented

The following changes affect the behavior of the RESTful collection APIs at
endpoints starting with path `/_api/collection/`:

#### Behavior change in context of "distributeShardsLike"

The `replicationFactor` and `writeConcern` properties returned for sharded
collections that use the `distributeShardsLike` attribute now also reflect
changes to these properties for the prototype collection.

In previous versions, the `replicationFactor` and `writeConcern` properties
returned for a collection that was created with the `distributeShardsLike`
option were sealed and did not reflect any changes done to these properties
in the prototype collection afterwards.
Now the properties returned are always up-to-date and reflect the _current_
status of these properties in the prototype collection.

#### Other changes

Trying to change the `writeConcern` value of an existing collection that uses
the `distributeShardsLike` attribute is now handled with a proper error message.
Previously a cryptic message containing an internal plan id was returned.

Trying to change the `shardingStrategy` attribute of an existing collection
will now result in a "bad parameter" error. The previous behavior was to silently
ignore the change attempt.

### Endpoints moved

### Endpoints removed

## JavaScript API
