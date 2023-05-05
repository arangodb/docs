---
layout: default
description: >-
  The HTTP API for Analyzers lets you create and delete Analyzers, as well as
  list all or get specific Analyzers with all their settings
---
# HTTP interface for Analyzers

{{ page.description }}
{:class="lead"}

The RESTful API for managing ArangoSearch Analyzers is accessible via the
`/_api/analyzer` endpoint.

See the description of [Analyzers](../analyzers.html) for an
introduction and the available types, properties and features.

{% docublock post_api_analyzer, h2 %}
{% docublock get_api_analyzer_analyzer, h2 %}
{% docublock get_api_analyzer, h2 %}
{% docublock delete_api_analyzer_analyzer, h2 %}
