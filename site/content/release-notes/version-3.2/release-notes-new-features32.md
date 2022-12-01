---
fileID: release-notes-new-features32
title: Features and Improvements in ArangoDB 3.2
weight: 11765
description: 
layout: default
---
### Optimizer improvements

* Geo indexes are now implicitly and automatically used when using appropriate SORT/FILTER
  statements in AQL, without the need to use the somewhat limited special-purpose geo AQL
  functions `NEAR` or `WITHIN`.

  Compared to using the special purpose AQL functions this approach has the
  advantage that it is more composable, and will also honor any `LIMIT` values
  used in the AQL query.

  The special purpose `NEAR` AQL function can now be substituted with the
  following AQL (provided there is a geo index present on the `doc.latitude`
  and `doc.longitude` attributes):

      FOR doc in geoSort
        SORT DISTANCE(doc.latitude, doc.longitude, 0, 0)
        LIMIT 5
        RETURN doc

  `WITHIN` can be substituted with the following AQL:

      FOR doc in geoFilter
        FILTER DISTANCE(doc.latitude, doc.longitude, 0, 0) < 2000
        RETURN doc


### Miscellaneous improvements

* added `REGEX_REPLACE` AQL function

  `REGEX_REPLACE(text, search, replacement, caseInsensitive) → string`

  Replace the pattern *search* with the string *replacement* in the string
  *text*, using regular expression matching.

  - **text** (string): the string to search in
  - **search** (string): a regular expression search pattern
  - **replacement** (string): the string to replace the *search* pattern with
  - returns **string** (string): the string *text* with the *search* regex
    pattern replaced with the *replacement* string wherever the pattern exists
    in *text*

* added new startup option `--query.fail-on-warning` to make AQL queries
  abort instead of continuing with warnings.

  When set to *true*, this will make an AQL query throw an exception and
  abort in case a warning occurs. This option should be used in development to catch
  errors early. If set to *false*, warnings will not be propagated to exceptions and
  will be returned with the query results. The startup option can also be overriden
  on a per query-level.

* the slow query list now contains the values of bind variables used in the
  slow queries. Bind variables are also provided for the currently running
  queries. This helps debugging slow or blocking queries that use dynamic
  collection names via bind parameters.

* AQL breaking change in cluster:
  The SHORTEST_PATH statement using edge collection names instead
  of a graph names now requires to explicitly name the vertex collection names
  within the AQL query in the cluster. It can be done by adding `WITH <name>`
  at the beginning of the query.

  Example:
  {{< tabs >}}
{{% tab name="" %}}
```
  FOR v,e IN OUTBOUND SHORTEST_PATH @start TO @target edges [...]
  ```
{{% /tab %}}
{{< /tabs >}}

  Now has to be:

  {{< tabs >}}
{{% tab name="" %}}
```
  WITH vertices
  FOR v,e IN OUTBOUND SHORTEST_PATH @start TO @target edges [...]
  ```
{{% /tab %}}
{{< /tabs >}}

  This change is due to avoid deadlock sitations in clustered case.
  An error stating the above is included.


## Client tools

* added data export tool, arangoexport.

  arangoexport can be used to export collections to json, jsonl or xml
  and export a graph or collections to xgmml.

* added "jsonl" as input file type for arangoimp

* added `--translate` option for arangoimp to translate attribute names from
  the input files to attriubte names expected by ArangoDB

  The `--translate` option can be specified multiple times (once per translation
  to be executed). The following example renames the "id" column from the input
  file to "_key", and the "from" column to "_from", and the "to" column to "_to":

      arangoimp --type csv --file data.csv --translate "id=_key" --translate "from=_from" --translate "to=_to"

  `--translate` works for CSV and TSV inputs only.

* added `--threads` option to arangoimp to specify the number of parallel import threads

* changed default value for client tools option `--server.max-packet-size` from 128 MB
  to 256 MB. this allows transferring bigger result sets from the server without the
  client tools rejecting them as invalid.


## Authentication

* added [LDAP](../../programs-tools/arangodb-server/programs-arangod-ldap) authentication (Enterprise Edition only)


## Authorization

* added read only mode for users
* collection level authorization rights

Read more in the [overview](../../administration/user-management/).


## Foxx and authorization

* the [cookie session transport](../../foxx-microservices/reference/sessions-middleware/session-transports/foxx-reference-sessions-transports-cookie) now supports
  all options supported by the [cookie method of the response object](../../foxx-microservices/reference/routers/foxx-reference-routers-response#cookie).

* it's now possible to provide your own version of the `graphql-sync` module when using the [GraphQL extensions for Foxx](../../foxx-microservices/reference/related-modules/foxx-reference-modules-graph-ql) by passing a copy of the module using the new _graphql_ option.

* custom API endpoints can now be tagged using the [tag method](../../foxx-microservices/reference/routers/foxx-reference-routers-endpoints#tag) to generate a cleaner Swagger documentation.


## Miscellaneous Changes

* arangod now validates several OS/environment settings on startup and warns if
  the settings are non-ideal. It additionally will print out ways to remedy the
  options.

  Most of the checks are executed on Linux systems only.

* added "deduplicate" attribute for array indexes, which controls whether inserting
  duplicate index values from the same document into a unique array index will lead to
  an error or not:

      // with deduplicate = true, which is the default value:
      db._create("test");
      db.test.ensureIndex({ type: "hash", fields: ["tags[*]"], deduplicate: true });
      db.test.insert({ tags: ["a", "b"] });
      db.test.insert({ tags: ["c", "d", "c"] }); // will work, because deduplicate = true
      db.test.insert({ tags: ["a"] }); // will fail

      // with deduplicate = false
      db._create("test");
      db.test.ensureIndex({ type: "hash", fields: ["tags[*]"], deduplicate: false });
      db.test.insert({ tags: ["a", "b"] });
      db.test.insert({ tags: ["c", "d", "c"] }); // will not work, because deduplicate = false
      db.test.insert({ tags: ["a"] }); // will fail
