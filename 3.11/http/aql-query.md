---
layout: default
description: ArangoDB has an HTTP interface to syntactically validate AQL queries
---
# HTTP interface for AQL queries

## Explain and parse queries

ArangoDB has an HTTP interface to syntactically validate AQL queries.
Furthermore, it offers an HTTP interface to retrieve the execution plan for any
valid AQL query.

Both functionalities do not actually execute the supplied AQL query, but only
inspect it and return meta information about it.

You can also retrieve a list of all query optimizer rules and their properties.

{% docublock post_api_explain %}
{% docublock post_api_query %}
{% docublock get_api_query_rules %}

## Track queries

ArangoDB has an HTTP interface for retrieving the lists of currently
executing AQL queries and the list of slow AQL queries. In order to make meaningful
use of these APIs, query tracking needs to be enabled in the database the HTTP 
request is executed for.

{% docublock get_api_query_properties %}
{% docublock put_api_query_properties %}
{% docublock get_api_query_current %}
{% docublock get_api_query_slow %}
{% docublock delete_api_query_slow %}

## Kill queries

Running AQL queries can also be killed on the server. ArangoDB provides a kill facility
via an HTTP interface. To kill a running query, its id (as returned for the query in the
list of currently running queries) must be specified. The kill flag of the query will
then be set, and the query will be aborted as soon as it reaches a cancelation point.

{% docublock delete_api_query_query %}
