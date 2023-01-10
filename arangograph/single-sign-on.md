---
layout: default
description: Single Sign-On (SSO) and SCIM
title: Single Sign-On (SSO)
---
# Single Sign-On (SSO)

{% hint 'info' %}
This feature is only available in ArangoGraph Enterprise.
{% endhint %}

ArangoGraph provides support to enable Single Sign-On (SSO) authentication using
SAML 2.0 with SCIM provisioning. This enables you to propagate to ArangoGraph any
user access changes by using the dedicated API.

[SCIM](https://www.rfc-editor.org/rfc/rfc7644){:target="_blank"}, or the System
for Cross-domain Identity Management [specification](http://www.simplecloud.info/){:target="_blank"},
is an open standard designed to manage user identity information.
SCIM provides a defined schema for representing users, and a RESTful
API to run CRUD operations on these user resources.

The SCIM specification expects the following operations so that the SSO system
can sync the information about user resources in real-time:

- `GET /Users` - Lists all users.
- `GET /Users/:user_id` - Get details for a given user ID.
- `POST /Users` - Invite a new user to ArangoGraph.
- `PATCH /Users/:user_id` - Update a given user ID.
- `DELETE /Users/:user_id` - Delete a specified user ID.

Organization administrators can generate an API key for a specific organization.
The API key consists of a key and a secret. Using this key and secret as the
Basic Authentication Header in SCIM provisioning, you can access the APIs and
manage the user resources.

To learn how to generate a new API key, see the [API Keys](my-account.html#api-keys) section.

{% hint 'info' %}
When creating an API key, it is required to select an organization from the
list.
{% endhint %}