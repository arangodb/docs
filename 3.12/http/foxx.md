---
layout: default
description: >-
  The HTTP API for Foxx allows you to manipulate Foxx microservices installed in
  a database
redirect_from:
  - foxx-configuration.html # 3.10 -> 3.10
  - foxx-management.html # 3.10 -> 3.10
  - foxx-miscellaneous.html # 3.10 -> 3.10
---
# HTTP interface for Foxx

{{ page.description }}
{:class="lead"}

<small>Introduced in: v3.2.0</small>

For more information on Foxx and its JavaScript APIs see the
[Foxx documentation](../foxx.html).

## Management

{% docublock get_api_foxx %}
{% docublock get_api_foxx_service %}
{% docublock post_api_foxx %}
{% docublock delete_api_foxx_service %}
{% docublock put_api_foxx_service %}
{% docublock patch_api_foxx_service %}

## Configuration

{% docublock get_api_foxx_configuration %}
{% docublock patch_api_foxx_configuration %}
{% docublock put_api_foxx_configuration %}
{% docublock get_api_foxx_dependencies %}
{% docublock patch_api_foxx_dependencies %}
{% docublock put_api_foxx_dependencies %}

## Miscellaneous

{% docublock get_api_foxx_scripts %}
{% docublock post_api_foxx_scripts_script %}
{% docublock post_api_foxx_tests %}
{% docublock post_api_foxx_development %}
{% docublock delete_api_foxx_development %}
{% docublock get_api_foxx_readme %}
{% docublock get_api_foxx_swagger %}
{% docublock post_api_foxx_download %}
{% docublock post_api_foxx_commit %}
