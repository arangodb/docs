---
fileID: appendix-java-script-modules-queries
title: Queries Module
weight: 11875
description: 
layout: default
---
`const queries = require('@arangodb/aql/queries')`

The query module provides the infrastructure for working with currently running AQL queries via arangosh.

## Properties

`queries.properties()` Returns the servers current query tracking configuration; we change the slow query threshold to get better results:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: QUERY_01_properyOfQueries
description: ''
render: input/output
version: '3.10'
release: stable
---
var queries = require("@arangodb/aql/queries");
queries.properties();
queries.properties({slowQueryThreshold: 1});
queries.properties({slowStreamingQueryThreshold: 1});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Currently running queries

We [create a task](appendix-java-script-modules-tasks) that spawns queries, so we have nice output. Since this task
uses resources, you may want to increase `period` (and not forget to remove it... afterwards):


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: QUERY_02_listQueries
description: ''
render: input/output
version: '3.10'
release: stable
---
~var queries = require("@arangodb/aql/queries");
var theQuery = 'FOR sleepLoooong IN 1..5 LET sleepLoooonger = SLEEP(1000) RETURN sleepLoooong';
var tasks = require("@arangodb/tasks");
 tasks.register({
   id: "mytask-1",
   name: "this is a sample task to spawn a slow aql query",
   command: "require('@arangodb').db._query('" + theQuery + "');"
});
 ~ while (true) {
 ~   require("internal").wait(1);
 ~   if (queries.current().filter(function(query) {
 ~   return query.query === theQuery;
 ~ }).length > 0) {
 ~ break;
 ~   }
~}
queries.current();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 

The function returns the currently running AQL queries as an array.

## Slow queries

The function returns the last AQL queries that exceeded the slow query threshold as an array:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: QUERY_03_listSlowQueries
description: ''
render: input/output
version: '3.10'
release: stable
---
~var queries = require("@arangodb/aql/queries");
queries.slow();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Clear slow queries

Clear the list of slow AQL queries:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: QUERY_04_clearSlowQueries
description: ''
render: input/output
version: '3.10'
release: stable
---
~var queries = require("@arangodb/aql/queries");
queries.clearSlow();
queries.slow();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Kill

Kill a running AQL query:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: QUERY_05_killQueries
description: ''
render: input/output
version: '3.10'
release: stable
---
~var queries = require("@arangodb/aql/queries");
~var tasks = require("@arangodb/tasks");
~var theQuery = 'FOR sleepLoooong IN 1..5 LET sleepLoooonger = SLEEP(1000) RETURN sleepLoooong';
 var runningQueries = queries.current().filter(function(query) {
    return query.query === theQuery;
});
queries.kill(runningQueries[0].id);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 

