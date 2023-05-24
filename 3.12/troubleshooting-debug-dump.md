---
layout: default
description: Using debug dump to troubleshoot issues 
title: DebugDump Troubleshooting
---
# Troubleshooting with DebugDump

The tool debugDump was made for debugging issues found after the execution of a 
specific query. With this tool, the user can create a query and save information 
about it such as its execution plan from the explainer, and also a sequence of 
steps to reproduce the environment in which the query would be run. 

The result of the execution of debugDump is a file that provides information about 
the collections related to the query and the result of the execution of the 
explainer, that contains the query's execution plan. 

Then, inspecting the result of this file with the tool inspectDump results in a 
sequence of steps to restore the collections related to the query as mentioned. 

In the UI, this is done in the menu item "QUERIES", after adding a query to the 
editor and clicking on the button "Create Debug Package". 

In the shell, this is done using the explainer API, as in the example below:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 01_workWithTroubleShooting_debugging1
    @EXAMPLE_ARANGOSH_OUTPUT{01_workWithTroubleShooting_debugging1}
    examples = require("@arangodb/graph-examples/example-graph.js");
    g = examples.loadGraph("worldCountry");
    tmpDebugFileName = "/tmp/myFile"; 
    outFileName = "/tmp/outFile";
    query = 'FOR v, e, p IN 0..10 INBOUND "worldVertices/continent-europe" 
    GRAPH "worldCountry" FILTER v._key != "country-denmark" RETURN 
    CONCAT_SEPARATOR(" -- ", p.vertices[*])';
    explainer = require("@arangodb/aql/explainer"); 
    explainer.debugDump(tmpDebugFileName, query, {}, {examples: 10}); 
    explainer.inspectDump(tmpDebugFileName, outFileName);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 01_workWithTroubleshooting_debugging1
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

More examples can be found in [Explain AQL Queries](aql/execution-and-performance-explaining-queries.md).

The fourth parameter of the function `explainer.debugDump` is an object that can 
contain the key/value pair `examples`, which can be used to generate document 
examples for each of the restored collections. If previously there were already 
documents in the collections, they will be used as the examples in the restore 
process. If not provided, the default value for `examples` is zero. 
To restore the data, the user must execute the steps in the output file after 
the execution of `explainer.inspectDump()`.

