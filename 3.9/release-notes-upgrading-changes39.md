---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.9
---
Incompatible changes in ArangoDB 3.9
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.9, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.9:

Collection attributes
---------------------

### Behavior change in context of "distributeShardsLike"

The `replicationFactor` and `writeConcern` properties returned for sharded
collections that use the `distributeShardsLike` attribute now also reflect
changes to these properties for the prototype collection.

In previous versions, the `replicationFactor` and `writeConcern` properties
returned for a collection that was created with the `distributeShardsLike`
option were sealed and did not reflect any changes done to these properties
in the prototype collection afterwards.
Now the properties returned are always up-to-date and reflect the _current_
status of these properties in the prototype collection.

### Other changes

Trying to change the `writeConcern` value of an existing collection that uses
the `distributeShardsLike` attribute is now handled with a proper error message.
Previously a cryptic message containing an internal plan id was returned.

Trying to change the `shardingStrategy` attribute of an existing collection
will now result in a "bad parameter" error. The previous behavior was to silently
ignore the change attempt.
