---
layout: default
description: >-
  The HTTP API for user management lets you create, modify, delete, and list
  ArangoDB user accounts, as well as grant and revoke permissions for databases
  and collections
---
# HTTP interface for user management

{{ page.description }}
{:class="lead"}

The interface provides the means to manage database system users. All
users managed through this interface are stored in the protected `_users`
system collection.

You should never manipulate the `_users` collection directly. The specialized
endpoints intentionally have limited functionality compared to the regular
Document API.

{% hint 'info' %}
User management operations are not included in ArangoDB's replication.
{% endhint %}

## Manage users

{% docublock post_api_user %}
{% docublock put_api_user_user %}
{% docublock patch_api_user_user %}
{% docublock delete_api_user_user %}
{% docublock get_api_user_user %}
{% docublock get_api_user %}

## Manage permissions

{% docublock put_api_user_user_database_database %}
{% docublock put_api_user_user_database_database_collection %}
{% docublock delete_api_user_user_database_database %}
{% docublock delete_api_user_user_database_database_collection %}
{% docublock get_api_user_user_database %}
{% docublock get_api_user_user_database_database %}
{% docublock get_api_user_user_database_database_collection %}
