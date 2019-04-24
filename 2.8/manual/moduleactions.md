---
layout: default
description: The action module provides the infrastructure for defining HTTP actions
---
Module "actions"
================

The action module provides the infrastructure for defining HTTP actions.

Basics
------
### Error message
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsGetErrorMessage %}

Standard HTTP Result Generators
-------------------------------
{% docublock actionsDefineHttp %}

### Result ok
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultOk %}

### Result bad
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultBad %}

### Result not found
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultNotFound %}

### Result unsupported
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultUnsupported %}

### Result error
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultError %}

### Result not Implemented
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultNotImplemented %}

### Result permanent redirect
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultPermanentRedirect %}

### Result temporary redirect
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultTemporaryRedirect %}

ArangoDB Result Generators
--------------------------

### Collection not found
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsCollectionNotFound %}

### Index not found
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsIndexNotFound %}

### Result exception
<!-- js/server/modules/org/arangodb/actions.js -->
{% docublock actionsResultException %}