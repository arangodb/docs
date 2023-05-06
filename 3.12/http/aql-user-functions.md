---
layout: default
description: >-
  The HTTP API for user-defined functions (UDFs) lets you add, delete, and list
  registered AQL extensions
---
# HTTP interface for user-defined AQL functions

{{ page.description }}
{:class="lead"}

AQL user functions are a means to extend the functionality
of ArangoDB's query language (AQL) with user-defined JavaScript code.

For an overview of over AQL user functions and their implications, please refer
to [Extending AQL](../aql/extending.html).

All user functions managed through this interface are stored in the
`_aqlfunctions` system collection. You should not modify the documents in this
collection directly, but only via the dedicated interfaces.

{% docublock post_api_aqlfunction, h2 %}
{% docublock delete_api_aqlfunction_function, h2 %}
{% docublock get_api_aqlfunction, h2 %}
