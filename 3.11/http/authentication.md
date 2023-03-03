---
layout: default
description: >-
  You can gain access to a protected ArangoDB server via HTTP authentication
  using a username and password, or a JSON Web Tokens (JWT) generated from the
  user credentials or the JWT secret of the deployment
---
# Authentication

{{ page.description }}
{:class="lead"}

Client authentication can be achieved by using the `Authorization` HTTP header
in client requests. ArangoDB supports authentication via HTTP Basic or JWT.

Authentication is turned on by default for all internal database APIs but
turned off for custom Foxx apps. To toggle authentication for incoming
requests to the internal database APIs, use the
[`--server.authentication`](../programs-arangod-options.html#--serverauthentication)
startup option. This option is turned on by default so authentication is
required for the database APIs.

{% hint 'security' %}
Requests using the HTTP `OPTIONS` method are answered by
ArangoDB in any case, even if no authentication data is sent by the client or if
the authentication data is wrong. This is required for handling CORS preflight
requests (see [Cross Origin Resource Sharing requests](general.html#cross-origin-resource-sharing-cors-requests)).
The response to an HTTP `OPTIONS` request is generic and doesn't expose any
private data.
{% endhint %}

There is an additional option to control authentication for custom Foxx apps. The
[`--server.authentication-system-only`](../programs-arangod-options.html#--serverauthentication-system-only)
startup option controls whether authentication is required only for requests to
the internal database APIs and the admin interface. It is turned on by default,
meaning that other APIs (this includes custom Foxx apps) do not require
authentication.

The default values allow exposing a public custom Foxx API built with ArangoDB
to the outside world without the need for HTTP authentication, but still
protecting the usage of the internal database APIs (i.e. `/_api/`, `/_admin/`)
with HTTP authentication.

If the server is started with the `--server.authentication-system-only`
option set to `false`, all incoming requests need HTTP authentication
if the server is configured to require HTTP authentication
(i.e. `--server.authentication true`). Setting the option to `true`
makes the server require authentication only for requests to the internal
database APIs and allows unauthenticated requests to all other URLs.

Here is a short summary:

- `--server.authentication true --server.authentication-system-only true`:
  This requires authentication for all requests to the internal database
  APIs but not custom Foxx apps. This is the default setting.
- `--server.authentication true --server.authentication-system-only false`:
  This requires authentication for all requests (including custom Foxx apps).
- `--server.authentication false`: Authentication is disabled for all requests.

Whenever authentication is required and the client has not yet authenticated,
ArangoDB returns **HTTP 401** (Unauthorized). It also sends the
`Www-Authenticate` response header, indicating that the client should prompt
the user for username and password if supported. If the client is a browser,
then sending back this header normally triggers the display of the
browser-side HTTP authentication dialog. As showing the browser HTTP
authentication dialog is undesired in AJAX requests, ArangoDB can be told to
not send the `Www-Authenticate` header back to the client. Whenever a client
sends the `X-Omit-Www-Authenticate` HTTP header (with an arbitrary value) to
the server, ArangoDB only sends status code 401, but no `Www-Authenticate`
header. This allows clients to implement credentials handling and bypassing
the browser's built-in dialog.

## HTTP Basic Authentication

<!-- TODO:
curl -u <username>:<password> http://...

Authorization: Basic <base64(<username>:<password>)>

Security warning
-->

## Bearer Token Authentication

ArangoDB uses a standard JWT-based authentication method.
To authenticate via JWT, you must first obtain a JWT token with a signature
generated via HMAC with SHA-256. The secret may either be set using
`--server.jwt-secret` or it is randomly generated on server startup.

For more information on JWT please consult RFC7519 and [jwt.io](https://jwt.io){:target="_blank"}.

### JWT user tokens

To authenticate with a specific user you need to supply a JWT token containing
the `preferred_username` field with the username.
You can either let ArangoDB generate this token for you via an API call
or you can generate it yourself (only if you know the JWT secret).

ArangoDB offers a RESTful API to generate user tokens for you if you know the
username and password. To do so send a POST request to:

```
/_open/auth
```

… containing `username` and `password` JSON-encoded like so:

```json
{
  "username": "root",
  "password": "rootPassword"
}
```

On success, the endpoint returns a **200 OK** and an answer containing
the JWT in a JSON-encoded object like so:

```json
{ "jwt": "eyJhbGciOiJIUzI1NiI..x6EfI" }
```

This JWT should then be used within the Authorization HTTP header in subsequent
requests:

```
Authorization: bearer eyJhbGciOiJIUzI1NiI..x6EfI
```

{% hint 'security' %}
The JWT token expires after **one hour** by default and needs to be updated.
You can configure the token lifetime via the `--server.session-timeout`
startup option.
{% endhint %}

You can find the expiration date of the JWT token in the `exp` field, encoded as
Unix timestamp in seconds.
Please note that all JWT tokens must contain the `iss` field with string value
`arangodb`. As an example the decoded JWT body would look like this:

```json
{
  "exp": 1540381557,
  "iat": 1537789.55727901,
  "iss": "arangodb",
  "preferred_username": "root"
}
```

### JWT superuser tokens

To access specific internal APIs as well as Agency and DB-Server instances a
token generated via `POST /open/auth` is not good enough. For these special
APIs, you need to generate a special JWT token which grants superuser
access. Note that using superuser access for normal database operations is
**not advised**.

{% hint 'security' %}
It is only possible to generate this JWT token with the knowledge of the
JWT secret.
{% endhint %}

For your convenience it is possible to generate this token via the
[ArangoDB starter CLI](../programs-starter-security.html#using-authentication-tokens).

Should you wish to generate the JWT token yourself with a tool of your choice,
you need to include the correct body. The body must contain the `iss` field
with string value `arangodb` and the `server_id` field with an arbitrary string
identifier:

```json
{
  "exp": 1537900279,
  "iat": 1537800279,
  "iss": "arangodb",
  "server_id": "myclient"
}
```

For example to generate a token via the
[jwtgen tool](https://www.npmjs.com/package/jwtgen){:target="_blank"}
(note the lifetime of one hour):

```
jwtgen -s <my-secret> -e 3600 -v -a "HS256" -c 'iss=arangodb' -c 'server_id=myclient'
curl -v -H "Authorization: bearer $(jwtgen -s <my-secret> -e 3600 -a "HS256" -c 'iss=arangodb' -c 'server_id=myclient')" http://<database-ip>:8529/_api/version
```

## Hot-reload JWT secrets

<small>Introduced in: v3.7.0</small>

{% include hint-ee.md feature="Hot-reloading of secrets" %}

To reload the JWT secrets of a local arangod process without a restart, you
may use the following RESTful API. A `POST` request reloads the secret, a
`GET` request may be used to load information about the currently used secrets.

{% docublock get_admin_server_jwt %}
{% docublock post_admin_server_jwt %}

Example result:

```json
{
  "error": false,
  "code": 200,
  "result": {
    "active": {
      "sha256": "c6c1021286dfe870b7050f9e704df93c7f1de3c89dbdadc3fb30394bebd81e97"
    },
    "passive": [
      {
        "sha256": "6d2fe32dc4249ef7e7359c6d874fffbbf335e832e49a2681236e1b686af78794"
      },
      {
        "sha256": "448a28491967ea4f7599f454af261a685153c27a7d5748456022565947820fb9"
      },
      {
        "sha256": "6745d49264bdfc2e89d4333fe88f0fce94615fdbdb8990e95b5fda0583336da8"
      }
    ]
  }
}
```