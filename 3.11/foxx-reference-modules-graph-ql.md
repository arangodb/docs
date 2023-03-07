---
layout: default
description: >-
  The @arangodb/foxx/graphql module lets you create routers for serving GraphQL requests
title: GraphQL integration for Foxx
---
GraphQL integration
===================

`const createGraphQLRouter = require('@arangodb/foxx/graphql');`

The `@arangodb/foxx/graphql` module lets you create routers for serving
GraphQL requests, which closely mimics the behavior of the
[`express-graphql` module](https://github.com/graphql/express-graphql){:target="_blank"}.

For an example of a GraphQL schema in Foxx that resolves fields using the
database see the [GraphQL example service](https://github.com/arangodb-foxx/demo-graphql){:target="_blank"}
(also available from the Foxx store).

Starting with `graphql` version 0.12 you can use the
[official graphql library](https://github.com/graphql/graphql-js){:target="_blank"}
if you include it in the `node_modules` folder of your service bundle and pass
it to the `graphql` option:

```js
const graphql = require('graphql'); // 0.12 or later
const graphqlSchema = new graphql.Schema({
  //...
});
module.context.use(createGraphQLRouter({
  schema: graphqlSchema,
  graphiql: true,
  graphql: graphql
}))
```

Foxx also bundles version 0.6 of the
[`graphql-sync` module](https://www.npmjs.com/package/graphql-sync){:target="_blank"},
which is a synchronous wrapper for the official JavaScript GraphQL reference
implementation.

{% hint 'warning' %}
`graphql-sync` is a thin wrapper for old versions of `graphql`, allowing it
to run in ArangoDB. This GraphQL server/schema implementation is deprecated
and only shipped for backward compatibility. Version 0.12 and newer of the
official `graphql` package can be used directly. New projects should bundle
their own copy of this module: <https://www.npmjs.com/package/graphql>{:target="_blank"}
{% endhint %}

**Examples**

```js
const graphql = require('graphql-sync');
const graphqlSchema = new graphql.GraphQLSchema({
  // ...
});

// Mounting a graphql endpoint directly in a service:
module.context.use('/graphql', createGraphQLRouter({
  schema: graphqlSchema,
  graphiql: true
}));

// Or at the service's root URL:
module.context.use(createGraphQLRouter({
  schema: graphqlSchema,
  graphiql: true
}));

// Or inside an existing router:
router.get('/hello', function (req, res) {
  res.write('Hello world!');
});
router.use('/graphql', createGraphQLRouter({
  schema: graphqlSchema,
  graphiql: true
}));
```

For more information on `graphql-sync` see the
[`graphql-js` API reference](http://graphql.org/docs/api-reference-graphql/){:target="_blank"}.

Creating a router
-----------------

`createGraphQLRouter(options): Router`

This returns a new router object with POST and GET routes for serving GraphQL requests.

**Arguments**

* **options**: `object`

  An object with any of the following properties:

  * **schema**: `GraphQLSchema`

    A GraphQL Schema object from `graphql-sync`.

  * **context**: `any` (optional)

    The GraphQL context that is passed to the `graphql()` function from
    `graphql-sync` to handle GraphQL queries.

  * **rootValue**: `object` (optional)

    The GraphQL root value that is passed to the `graphql()` function
    from `graphql-sync` to handle GraphQL queries.

  * **pretty**: `boolean` (Default: `false`)

    If `true`, JSON responses are pretty-printed.

  * **formatError**: `Function` (optional)

    A function that is used to format errors produced by `graphql-sync`.
    If omitted, the `formatError` function from `graphql-sync` is used instead.

  * **validationRules**: `Array<any>` (optional)

    Additional validation rules queries must satisfy in addition to those
    defined in the GraphQL spec.

  * **graphiql**: `boolean` (Default: `false`)

    If `true`, the [GraphiQL](https://github.com/graphql/graphiql){:target="_blank"} explorer
    will be served when loaded directly from a browser.

  * **graphql**: `object` (optional)

    If you need to use your own copy of the `graphql-sync` module instead of
    the one bundled with ArangoDB, here you can pass it in directly.

If a GraphQL Schema object is passed instead of an options object, it is
interpreted as the `schema` option.

Generated routes
----------------

The router handles GET and POST requests to its root path and accepts the
following parameters, which can be provided either as query parameters or
as the POST request body:

* **query**: `string`

  A GraphQL query to execute.

* **variables**: `object | string` (optional)

  An object or a string containing a JSON object with runtime values to use
  for any GraphQL query variables.

* **operationName**: `string` (optional)

  If the provided `query` contains multiple named operations, this specifies
  which operation should be executed.

* **raw**: `boolean` (Default: `false`)

  Forces a JSON response even if `graphiql` is enabled and the request was
  made using a browser.

The POST request body can be provided as JSON or as query string using
`application/x-www-form-urlencoded`. A request body passed as
`application/graphql` is interpreted as the `query` parameter.
