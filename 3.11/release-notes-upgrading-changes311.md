---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.11
---
Incompatible changes in ArangoDB 3.11
=====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.11, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.11:

Restriction of indexable fields
-------------------------------

It is now forbidden to create indexes that cover fields whose attribute names
start or end with `:` , for example, `fields: ["value:"]`. This notation is
reserved for internal use.

Existing indexes are not affected but you cannot create new indexes with a
preceding or trailing colon.

Client tools
------------

### arangoexport

The default output file type produced by arangoexport was changed from `json` to `jsonl`.
This allows more efficient processing of the files produced by arangoexport with
other tools, such as arangoimport.

