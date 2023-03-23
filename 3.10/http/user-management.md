---
layout: default
description: This is an introduction to ArangoDB's HTTP interface for managing users
---
HTTP Interface for User Management
==================================

This is an introduction to ArangoDB's HTTP interface for managing users.

The interface provides a simple means to add, update, and remove users.  All
users managed through this interface will be stored in the system collection
*_users*. You should never manipulate the *_users* collection directly.

This specialized interface intentionally does not provide all functionality that
is available in the regular document REST API.

Please note that user operations are not included in ArangoDB's replication.
{% docublock post_api_user %}
{% docublock put_api_user_user_database_database %}
{% docublock put_api_user_user_database_database_collection %}
{% docublock delete_api_user_user_database_database %}
{% docublock delete_api_user_user_database_database_collection %}
{% docublock get_api_user_user_database %}
{% docublock get_api_user_user_database_database %}
{% docublock get_api_user_user_database_database_collection %}
{% docublock put_api_user_user %}
{% docublock patch_api_user_user %}
{% docublock delete_api_user_user %}
{% docublock get_api_user_user %}
{% docublock get_api_user %}
