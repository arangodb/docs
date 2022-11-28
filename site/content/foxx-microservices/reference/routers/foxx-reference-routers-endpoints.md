---
fileID: foxx-reference-routers-endpoints
title: Endpoints
weight: 1060
description: 
layout: default
---
`endpoint.tag(...tags): this`

Marks the endpoint with the given tags that will be used to group related
routes in the generated API documentation.

If the endpoint is a child router, all routes of that router will also be
marked with the tags. If the endpoint is a middleware, this method has no effect.

This method only affects the generated API documentation and has no other
effect within the service itself.

**Arguments**

* **tags**: `string`

  One or more strings that will be used to group the endpoint's routes.

Returns the endpoint.

**Examples**

```js
router.get(/* ... */)
.tag('auth', 'restricted');
```

## securityScheme

`endpoint.securityScheme(type, [options], [description])`

Defines an OpenAPI security scheme for this endpoint.

This method only affects the generated API documentation and has no other
effect within the service itself.

**Arguments**

* **type**: `string`

  Type of the security scheme.
  Must be one of `"basic"`, `"apiKey"` or `"oauth2"`.

* **options**: `object`

  An object with the following property:

  * **id**: `string` (optional)

    Unique identifier that can be used to opt in to or out of this scheme or
    to specify OAuth 2 scopes required by this endpoint.

  If **type** is set to `"basic"`, this parameter is optional.

  If **type** is set to `"apiKey"`, the following additional properties are
  required:

  * **name**: `string`

    The name of the header or query parameter that contains the API key.

  * **in**: `string`

    The location of the API key.
    Must be one of `"header"` or `"query"`.

  If **type** is set to `"oauth2"`, the following additional properties are
  required:

  * **flow**: `string`

    The OAuth 2 flow used by this security scheme.
    Must be one of `"implicit"`, `"password"`, `"application"` or
    `"accessCode"`.

  * **scopes**: `object`

    The available scopes for this OAuth 2 security scheme as a mapping of
    scope names to descriptions.

  If **flow** is set to `"implicit"` or `"accessCode"`, the following
  additional property is required:

  * **authorizationUrl**: `string`

    The authorization URL to be used for this OAuth 2 flow.

  If **flow** is set to `"password"`, `"application"` or `"accessCode"`, the
  following additional property is required:

  * **tokenUrl**: `string`

    The token URL to be used for this OAuth 2 flow.

* **description**: `string` (optional)

  A human-readable string that describes the security scheme.

Returns the endpoint.

**Examples**

```js
router.get(/* ... */)
.securityScheme('basic', 'Basic authentication with username and password.')
.securityScheme('apiKey', {name: 'x-api-key', in: 'header'},
  'API key as alternative to password-based authentication.'
);
```

## security

`endpoint.security(id, enabled)`

Opts this endpoint in to or out of the security scheme with the given ID.

* **id**: `string`

  Unique identifier of the security scheme. See `endpoint.securityScheme`.

* **enabled**: `boolean`

  Whether the security scheme should be enabled or disabled for this endpoint.
  Security schemes are enabled for all child routes by default.

**Examples**

```js
router.securityScheme('basic', {id: 'basic-auth'},
  'Basic authentication used by most endpoints on this router.'
);

router.get(/* ... */)
.security('basic-auth', false); // Opt this endpoint out
```

## securityScope

`endpoint.securityScope(id, ...scopes)`

Defines OAuth 2 scopes required by this endpoint for security scheme with the
given ID.

* **id**: `string`

  Unique identifier of the security scheme. See `endpoint.securityScheme`.

* **scopes**: `Array<string>`

  Names of OAuth 2 scopes required by this endpoint.

**Examples**

```js
router.get(/* ... */)
.securityScheme('oauth2', {
  id: 'thebookface-oauth2',
  flow: 'implicit',
  authorizationUrl: 'https://thebookface.example/oauth2/authorization',
  scopes: {
    'profile:read': 'Read user profile',
    'profile:write': 'Modify user profile'
  }
}, 'OAuth 2 authentication for The Bookface.')
.securityScope('thebookface-oauth2', 'profile:read');
```
