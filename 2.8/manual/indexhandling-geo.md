---
layout: default
description: This is an introduction to ArangoDB's geo indexes
---
Geo Indexes
===========

### Introduction to Geo Indexes

This is an introduction to ArangoDB's geo indexes.

ArangoDB uses Hilbert curves to implement geo-spatial indexes. 
See this [blog](https://www.arangodb.com/2012/03/31/using-hilbert-curves-and-polyhedrons-for-geo-indexing){:target="_blank"}
for details.

A geo-spatial index assumes that the latitude is between -90 and 90 degree and
the longitude is between -180 and 180 degree. A geo index will ignore all
documents which do not fulfill these requirements.

Accessing Geo Indexes from the Shell
------------------------------------

<!-- js/server/modules/org/arangodb/arango-collection.js-->
{% docublock collectionEnsureGeoIndex %}

<!-- js/common/modules/org/arangodb/arango-collection-common.js-->
{% docublock collectionGeo %}

<!-- js/common/modules/org/arangodb/arango-collection-common.js-->
{% docublock collectionNear %}

<!-- js/common/modules/org/arangodb/arango-collection-common.js-->
{% docublock collectionWithin %}
{% docublock collectionEnsureGeoConstraint %}
