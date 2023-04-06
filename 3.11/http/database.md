---
layout: default
description: >-
  The HTTP API for databases lets you create and delete databases, list
  available databases, and get information about specific databases
redirect_from:
  - database-notes-on-databases.html # 3.10 -> 3.10
  - database-database-management.html # 3.10 -> 3.10
---
# HTTP interface for databases

{{ page.description }}
{:class="lead"}

The HTTP interface for databases provides operations to create and drop
individual databases. These are mapped to the standard `POST` and `DELETE`
HTTP methods. There is also the `GET` method to retrieve an array of existing
databases.

{% hint 'info' %}
All database management operations can only be accessed via the default
`_system` database and none of the other databases.
{% endhint %}

## Addresses of databases

Any operation triggered via ArangoDB's RESTful HTTP API is executed in the
context of exactly one database. To explicitly specify the database in a request,
the request URI must contain the database name before the actual path:

```
http://localhost:8529/_db/mydb/...
```

The `...` placeholder is the actual path to the accessed resource. In the example,
the resource is accessed in the context of the `mydb` database. Actual URLs in
the context of `mydb` could look like this:

```
http://localhost:8529/_db/mydb/_api/version
http://localhost:8529/_db/mydb/_api/document/test/12345
http://localhost:8529/_db/mydb/myapp/get
```

Special characters in database names must be properly URL-encoded, e.g.
`a + b = c` needs to be encoded as `a%20%2B%20b%20%3D%20c`:

```
http://localhost:8529/_db/a%20%2B%20b%20%3D%20c/_api/version
```

Database names containing Unicode must be properly
[NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms){:target="_blank"}.
Non-NFC-normalized names are rejected by the server.

## Manage databases

{% docublock get_api_database_current %}
{% docublock get_api_database_user %}
{% docublock get_api_database %}
{% docublock post_api_database %}
{% docublock delete_api_database_database %}
