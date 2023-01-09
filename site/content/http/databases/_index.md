---
fileID: database
title: HTTP Interface for Databases
weight: 1935
description: 
layout: default
---
## Address of a Database

Any operation triggered via ArangoDB's HTTP REST API is executed in the context of exactly
one database. To explicitly specify the database in a request, the request URI must contain
the [database name](../../appendix/appendix-glossary#database-name) in front of the actual path:

    http://localhost:8529/_db/mydb/...

where *...* is the actual path to the accessed resource. In the example, the resource will be
accessed in the context of the database *mydb*. Actual URLs in the context of *mydb* could look
like this:

    http://localhost:8529/_db/mydb/_api/version
    http://localhost:8529/_db/mydb/_api/document/test/12345
    http://localhost:8529/_db/mydb/myapp/get

Special characters in database names must be properly URL-encoded, e.g. `a + b = c`:

    http://localhost:8529/_db/a%20%2B%20b%20%3D%20c/_api/version

Database names containing Unicode must be properly
[NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
Non-NFC-normalized names will be rejected by _arangod_.
