---
layout: default
description: A natively integrated AQL extension that allows one to
---
ArangoSearch View
=================

A natively integrated AQL extension that allows one to:
 * evaluate together documents located in different collections
 * search documents based on AQL boolean expressions and functions
 * sort the result set based on how closely each document matched the search condition

### Creating an ArangoSearch View

The ArangoSearch specific JSON definition for creating of a view is as follows:

<!-- js/actions/api-view.js -->
{% docublock post_api_view_iresearch %}

### Modifying an ArangoSearch View

The ArangoSearch specific JSON definition for modification of a view is as
follows:

Update of All Possible Properties
---------------------------------

All modifiable properties of a view may be set to the specified definition,
(i.e. "make the view exactly like *this*"), via:

<!-- js/actions/api-view.js -->
{% docublock put_api_view_properties_iresearch %}

Update of Specific Properties (delta)
-------------------------------------

Specific modifiable properties of a view may be set to the specified values,
(i.e. "change only these properties to the specified values"), via:

<!-- js/actions/api-view.js -->
{% docublock patch_api_view_properties_iresearch %}
