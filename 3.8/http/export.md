---
layout: default
---
HTTP Interface for Exporting Documents
======================================

{% hint 'warning' %}
The export API is deprecated from version 3.8.0 on.
This endpoint should no longer be used.
It is superseded by AQL queries with streaming cursors
(`POST /_api/cursor` with `{ "options": { "stream": true } }`).
{% endhint %}

{% docublock post_api_export %}
