---
layout: default
description: The most convenient method to import a lot of data into ArangoDB is to use the arangoimport command-line tool
---
# _arangoimport_ Details

The most convenient method to import a lot of data into ArangoDB is to use the
_arangoimport_ command-line tool. It allows you to bulk import data records
from a file into a database collection. Multiple files can be imported into
the same or different collections by invoking it multiple times.

{% hint 'tip' %}
Import files are expected to be UTF-8 encoded **without**
[byte order mark (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark){:target="_blank"}.
Other encodings are not supported, but may not raise warnings or errors.

In case of CSV/TSV files, BOMs become part of the first column's name
(possibly mangled), so be sure the files have none.
{% endhint %}

Importing into an Edge Collection
---------------------------------

_arangoimport_ can also be used to import data into an existing edge collection.
The import data must, for each edge to import, contain at least the `_from` and
`_to` attributes. These indicate which other two documents the edge should connect.
It is necessary that these attributes are set for all records, and point to
valid document IDs in existing collections.

*Example*

```js
{ "_from" : "users/1234", "_to" : "users/4321", "desc" : "1234 is connected to 4321" }
```

**Note**: The edge collection must already exist when the import is started. Using
the `--create-collection` flag does not work because arangoimport always tries to
create a regular document collection if the target collection does not exist.

Attribute Naming and Special Attributes
---------------------------------------

Attributes whose names start with an underscore are treated in a special way by
ArangoDB:

- the optional `_key` attribute contains the document's key. If specified, the value
  must be formally valid (e.g. must be a string and conform to the naming conventions  
  referred in [Key Naming Conventions](data-modeling-naming-conventions-document-keys.html)).
  Additionally, the key value must be unique within the
  collection the import is run for.
- `_from`: when importing into an edge collection, this attribute contains the id
  of one of the documents connected by the edge. The value of `_from` must be a
  syntactically valid document id and the referred collection must exist.
- `_to`: when importing into an edge collection, this attribute contains the id
  of the other document connected by the edge. The value of `_to` must be a
  syntactically valid document id and the referred collection must exist.
- `_rev`: this attribute contains the revision number of a document. However, the
  revision numbers are managed by ArangoDB and cannot be specified on import. Thus
  any value in this attribute is ignored on import.

If you import values into `_key`, you should make sure they are valid and unique.

When importing data into an edge collection, you should make sure that all import
documents can `_from` and `_to` and that their values point to existing documents.

To avoid specifying complete document ids (consisting of collection names and document
keys) for `_from` and `_to` values, there are the options `--from-collection-prefix` and
`--to-collection-prefix`. If specified, these values are automatically prepended
to each value in `_from` (or `_to` resp.). This allows specifying only document keys
inside `_from` and/or `_to`.

*Example*

```
arangoimport --from-collection-prefix users --to-collection-prefix products ...
```

Importing the following document creates an edge between `users/1234` and
`products/4321`:

```js
{ "_from" : "1234", "_to" : "4321", "desc" : "users/1234 is connected to products/4321" }
```

Updating existing documents
---------------------------

By default, arangoimport tries to insert all documents from the import file into the
specified collection. In case the import file contains documents that are already present
in the target collection (matching is done via the `_key` attributes), then a default
arangoimport run does not import these documents and complain about unique key constraint
violations.

However, arangoimport can be used to update or replace existing documents in case they
already exist in the target collection. It provides the command-line option `--on-duplicate`
to control the behavior in case a document is already present in the database.

The default value of `--on-duplicate` is `error`. This means that when the import file
contains a document that is present in the target collection already, then trying to
re-insert a document with the same `_key` value is considered an error, and the document in
the database is not modified.

Other possible values for `--on-duplicate` are:

- `update`: each document present in the import file that is also present in the target
  collection already is updated by arangoimport. `update` performs a partial update
  of the existing document, modifying only the attributes that are present in the import
  file and leaving all other attributes untouched.

  The values of system attributes `_id`, `_key`, and `_rev` cannot be
  updated or replaced in existing documents.

- `replace`: each document present in the import file that is also present in the target
  collection already is replace by arangoimport. `replace` replaces the existing
  document entirely, resulting in a document with only the attributes specified in the import
  file.

  The values of system attributes `_id`, `_key`, and `_rev` cannot be
  updated or replaced in existing documents.

- `ignore`: each document present in the import file that is also present in the target
  collection already is ignored and not modified in the target collection.

When `--on-duplicate` is set to either `update` or `replace`, arangoimport returns the
number of documents updated/replaced in the `updated` return value. When set to another
value, the value of `updated` is always zero. When `--on-duplicate` is set to `ignore`,
arangoimport returns the number of ignored documents in the `ignored` return value.
When set to another value, `ignored` is always zero.

It is possible to perform a combination of inserts and updates/replaces with a single
arangoimport run. When `--on-duplicate` is set to `update` or `replace`, all documents present
in the import file is inserted into the target collection provided they are valid
and do not already exist with the specified `_key`. Documents that are already present
in the target collection (identified by `_key` attribute) are instead updated/replaced.

Result output
-------------

An _arangoimport_ import run prints out the final results on the command line.
It shows the

- number of documents created (`created`)
- number of documents updated/replaced (`updated/replaced`, only non-zero if
  `--on-duplicate` was set to `update` or `replace`, see below)
- number of warnings or errors that occurred on the server side (`warnings/errors`)
- number of ignored documents (only non-zero if `--on-duplicate` was set to `ignore`).

*Example*

```bash
created:          2
warnings/errors:  0
updated/replaced: 0
ignored:          0
```

For CSV and TSV imports, the total number of input file lines read is also printed
(`lines read`).

_arangoimport_ also prints out details about warnings and errors that happened on the
server-side (if any).

Automatic pacing with busy or low throughput disk subsystems
------------------------------------------------------------

_arangoimport_ has an optional automatic pacing algorithm that can limit 
how fast data is sent to the ArangoDB servers. This pacing algorithm 
exists to prevent the import operation from failing due to slow responses.

Google Cloud and other VM providers limit the throughput of disk
devices. Similarly, other users' processes on the shared VMs can limit 
the available throughput of the disk devices.

The automatic pacing algorithm adjusts the transmit block size dynamically 
based upon the actual throughput of the server over the last few seconds. 
Automatic pacing intentionally may not use the full throughput of a
disk device. An unlimited (really fast) disk device might not need
pacing. Raising the number of threads via the `--threads X` command
line to any value of `X` greater than 2 increases the total
throughput used. 

{% hint 'warning' %}
Using parallelism with the `--threads X` parameter
together with the `--on-duplicate` parameter set to `ignore`, `update` or `replace` can 
lead to a race condition, when there are duplicates e.g. multiple identical `_key`
values. Even ignoring the duplicates makes the result unpredictable, meaning 
it is not possible to predict which versions of the documents are inserted.
{% endhint %}

Automatic pacing frees the user from adjusting the throughput used to
match available resources. It is disabled by default, and can be enabled
by invoking arangoimport with the `--auto-rate-limit true` parameter.

When enabling the pacing, the initial chunk size is 8MB per second. This
may be too high or too low, depending on the available disk throughput of
the target system. To start off with a different chunk size, one can
adjust the value of the `--batch-size` parameter.

{% hint 'tip' %}
The pacing algorithm is turned on by default up to version 3.7.10
and turned off by default in version 3.7.11 and higher.
{% endhint %}
