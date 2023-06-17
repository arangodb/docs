---
layout: default
description: >-
  If you have an issue with a specific AQL query, you can create a debug package
  to provide all necessary information to others for investigating the issue
---
# Query debug packages

{{ page.description }}
{:class="lead"}

Query debug packages, or debug dumps, facilitate the debugging of issues you
might find after executing AQL queries. A debug package is a JSON file that
contains information about the query and the environment to make it possible to
reproduce the issue:

- General information about the server including the exact version
- The properties of the involved database, collections, Views, and graphs
- The query, its bind variables, and options
- The query execution plan
- Storage engine statistics
- Optionally samples of your data, with the option to
  **obfuscated all string values** in a non-reversible way

{% hint 'security' %}
Before sharing a debug package, open the file locally and check if it contains
anything that you are not allowed or willing to share and obfuscate it.
{% endhint %}

## Create a query debug package in the web interface

1. In **QUERIES** section of the web interface, enter an AQL query into the
   editor and provide the bind parameters if necessary.
2. Click **Create Debug Package** below the text area.
3. The download of a compressed debug package starts.
4. Unzip the downloaded file if you want to inspect its content.

## Create a query debug package with _arangosh_

Connect to the server with the [ArangoDB shell](programs-arangosh.html) and call
the `debugDump()` method of the explainer module. You can specify the output
file path, the AQL query, any bind parameters if necessary, as well as options
for the query, including two additional options to include sample documents,
`examples` and `anonymize`:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 01_debugDumpCreate
    @EXAMPLE_ARANGOSH_OUTPUT{01_debugDumpCreate}
      var examples = require("@arangodb/graph-examples/example-graph");
      var g = examples.loadGraph("worldCountry");
      var query = `FOR v, e, p IN 0..10 INBOUND "worldVertices/continent-europe" GRAPH "worldCountry" FILTER v._key != @country RETURN CONCAT_SEPARATOR(" -- ", p.vertices)`;
      var bindVars = { country: "country-denmark" };
      var options = { examples: 10, anonymize: true }
      var explainer = require("@arangodb/aql/explainer"); 
      explainer.debugDump("/tmp/debugDumpFilename", query, bindVars, options);
    ~ examples.dropGraph("worldCountry");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 01_debugDumpCreate
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

See [Gathering debug information about a query](aql/execution-and-performance-explaining-queries.html#gathering-debug-information-about-a-query)
for details.

## Inspect a query debug package with _arangosh_

The debug package JSON is compactly formatted. To get a more readable output,
you can use a tool for pretty-printing like [`jq`](https://stedolan.github.io/jq/){:target="_blank"},
or use the `inspectDump()` method of the explainer module for formatting.

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 02_debugDumpInspect
    @EXAMPLE_ARANGOSH_OUTPUT{02_debugDumpInspect}
    ~ require("fs");
    ~ assert(fs.exists("/tmp/debugDumpFilename"));
      var explainer = require("@arangodb/aql/explainer"); 
      explainer.inspectDump("/tmp/debugDumpFilename");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 02_debugDumpInspect
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}
