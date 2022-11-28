---
fileID: release-notes-upgrading-changes35
title: Incompatible changes in ArangoDB 3.5
weight: 11715
description: 
layout: default
---
3.5 enforces the invalidation of variables in AQL queries after usage of an AQL 
COLLECT statements as documented. The documentation for variable invalidation claims
that

    The COLLECT statement will eliminate all local variables in the current scope. 
    After COLLECT only the variables introduced by COLLECT itself are available.

However, the described behavior was not enforced when a COLLECT was preceded by a
FOR loop that was itself preceded by a COLLECT. In the following query the final
RETURN statement accesses variable `key1` though the variable should have been 
invalidated by the COLLECT directly before it:

    FOR x1 IN 1..2 
      COLLECT key1 = x1 
      FOR x2 IN 1..2 
        COLLECT key2 = x2 
        RETURN [key2, key1] 
  
In previous releases, this query was
parsed ok, but the contents of variable `key1` in the final RETURN statement were
undefined. 
  
This change is about making queries as the above fail with a parse error, as an 
unknown variable `key1` is accessed here, avoiding the undefined behavior. This is 
also in line with what the documentation states about variable invalidation.

## HTTP Replication APIs

### New parameter for WAL tailing API

Tailing of recent server operations via `/_api/wal/tail` gets a new parameter
`syncerId`, which helps in tracking the WAL tick of each client. If set, this
supersedes the parameter `serverId` for this purpose. The API stays backwards
compatible.


## Miscellaneous

### Index creation

In previous versions of ArangoDB, if one attempted to create an index with a
specified `_id`, and that `_id` was already in use, the server would typically
return the existing index with matching `_id`. This is somewhat unintuitive, as
it would ignore if the rest of the definition did not match. This behavior has
been changed so that the server will now return a duplicate identifier error.

ArangoDB 3.5 also disallows creating indexes on the `_id` sub-attribute of an attribute,
`referredTo._id` or `documents[*]._id`. Previous versions of ArangoDB allowed creating
such indexes, but the indexes were non-functional.
Starting with ArangoDB 3.5 such indexes cannot be created anymore, and any attempts to 
create them will fail.

### Version details output

The attribute key `openssl-version` in the server/client tool version details 
output was renamed to `openssl-version-compile-time`.

This change affects the output produced when starting one of the ArangoDB
executables (e.g. arangod, arangosh) with the `--version` command. It also 
changes the attribute name in the detailed response of the `/_api/version` REST API.

### Overcommit settings

On Linux, ArangoDB will now show a startup warning in case the kernel setting 
`vm.overcommit_memory` is set to a value of 2 and the jemalloc memory allocator 
is in use. This combination does not play well together, and may lead to the 
kernel denying arangod's memory allocation requests in more cases than necessary.

## Usage of V8

`ArangoQueryStreamCursor.id()` used to return a 32 bit number, and will now
return a string as similar places where V8 has representations of ArangoDB IDs.
