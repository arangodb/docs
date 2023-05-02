---
layout: default
description: The response object specifies the following properties
---
Response objects
================

The response object specifies the following properties:

* **body**: `Buffer | string`

  Response body as a string or buffer. Can be set directly or using some
  of the response methods.

* **context**: `Context`

  The [service context](foxx-reference-context.html) in which the router is mounted
  (rather than the context in which the route is defined).

* **headers**: `object`

  The raw headers object.

* **statusCode**: `number`

  Status code of the response. Defaults to `200` (body set and not an empty
  string or buffer) or `204` (otherwise) if not changed from `undefined`.

attachment
----------

`res.attachment([filename]): this`

Sets the `content-disposition` header to indicate the response is a
downloadable file with the given name.

**Note:** This does not actually modify the response body or access the
file system. To send a file from the file system see the `download` or
`sendFile` methods.

**Arguments**

* **filename**: `string` (optional)

  Name of the downloadable file in the response body.

  If present, the extension of the filename is used to set the response
  `content-type` if it has not yet been set.

Returns the response object.

cookie
------

`res.cookie(name, value, [options]): this`

Sets a cookie with the given name.

**Arguments**

* **name**: `string`

  Name of the cookie.

* **value**: `string`

  Value of the cookie.

* **options**: `object` (optional)

  An object with any of the following properties:

  * **ttl**: `number` (optional)

    Time to live of the cookie in seconds.

  * **algorithm**: `string` (Default: `"sha256"`)

    Algorithm that is used to sign the cookie.

  * **secret**: `string` (optional)

    Secret that is used to sign the cookie.

    If a secret is specified, the cookie's signature is stored in a second
    cookie with the same options, the same name, and the suffix `.sig`.
    Otherwise no signature is added.

  * **path**: `string` (optional)

    Path for which the cookie should be issued.

  * **domain**: `string` (optional)

    Domain for which the cookie should be issued.

  * **secure**: `boolean` (Default: `false`)

    Whether the cookie should be marked as secure (i.e. HTTPS/SSL-only).

  * **httpOnly**: `boolean` (Default: `false`)

    Whether the cookie should be marked as HTTP-only (rather than also exposing
    it to client-side code).

If a string is passed instead of an options object, it is interpreted as
the `secret` option.

If a number is passed instead of an options object, it is interpreted as
the `ttl` option.

Returns the response object.

download
--------

`res.download(path, [filename]): this`

The equivalent of calling `res.attachment(filename).sendFile(path)`.

**Arguments**

* **path**: `string`

  Path to the file on the local filesystem to be sent as the response body.

* **filename**: `string` (optional)

  Filename to indicate in the `content-disposition` header.

  If omitted, the `path` is used instead.

Returns the response object.

getHeader
---------

`res.getHeader(name): string`

Gets the value of the header with the given name.

**Arguments**

* **name**: `string`

  Name of the header to get.

Returns the value of the header or `undefined`.

json
----

`res.json(data): this`

Sets the response body to the JSON string value of the given data.

**Arguments**

* **data**: `any`

  The data to be used as the response body.

Returns the response object.

redirect
--------

`res.redirect([status], path): this`

Redirects the response by setting the response `location` header and status code.

**Arguments**

* **status**: `number | string` (optional)

  Response status code to set.

  If the status code is the string value `"permanent"`, it is treated as
  the value `301`.

  If the status code is a string, it is converted to a numeric status code
  using the [statuses module](https://github.com/jshttp/statuses){:target="_blank"} first.

  If the status code is omitted but the response status has not already been
  set, the response status is set to `302`.

* **path**: `string`

  URL to set the `location` header to.

Returns the response object.

removeHeader
------------

`res.removeHeader(name): this`

Removes the header with the given name from the response.

**Arguments**

* **name**: `string`

  Name of the header to remove.

Returns the response object.

send
----

`res.send(data, [type]): this`

Sets the response body to the given data with respect to the response
definition for the response's current status code.

**Arguments**

* **data**: `any`

  The data to be used as the response body. It is converted according to the
  [response definition](foxx-reference-routers-endpoints.html#response) for the response's current
  status code (or `200`) in the following way:

  If the data is an ArangoDB result set, it is converted to an array first.

  If the response definition specifies a model with a `forClient` method,
  that method is applied to the data first. If the data is an array and
  the response definition has the `multiple` flag set, the method is
  applied to each entry individually instead.

  Finally, the data is processed by the response type handler to convert
  the response body to a string or buffer.

* **type**: `string` (Default: `"auto"`)

  Content-type of the response body.

  If set to `"auto"`, the first MIME type specified in the
  [response definition](foxx-reference-routers-endpoints.html#response) for the response's current
  status code (or `200`) is used instead.

  If set to `"auto"` and no response definition exists, the MIME type is
  determined the following way:

  If the data is a buffer, the MIME type is set to binary
  (`application/octet-stream`).

  If the data is an object, the MIME type is set to JSON and the data
  is converted to a JSON string.

  Otherwise, the MIME type is set to HTML and the data is
  converted to a string.

Returns the response object.

sendFile
--------

`res.sendFile(path, [options]): this`

Sends a file from the local filesystem as the response body.

**Arguments**

* **path**: `string`

  Path to the file on the local filesystem to be sent as the response body.

  If no `content-type` header has been set yet, the extension of the filename
  is used to set the value of that header.

* **options**: `object` (optional)

  An object with any of the following properties:

  * **lastModified**: `boolean` (optional)

    If set to `true` or if no `last-modified` header has been set yet and the
    value is not set to `false`, the `last-modified` header is set to the
    modification date of the file in milliseconds.

Returns the response object.

**Examples**

```js
// Send the file "favicon.ico" from this service's folder
res.sendFile(module.context.fileName('favicon.ico'));
```

sendStatus
----------

`res.sendStatus(status): this`

Sends a plaintext response for the given status code.
The response status is set to the given status code, the response body
is set to the status message corresponding to that status code.

**Arguments**

* **status**: `number | string`

  Response status code to set.

  If the status code is a string, it is converted to a numeric status code
  using the [statuses module](https://github.com/jshttp/statuses){:target="_blank"} first.

Returns the response object.

setHeader / set
---------------

`res.setHeader(name, value): this`

`res.set(name, value): this`

`res.set(headers): this`

Sets the value of the header with the given name.

**Arguments**

* **name**: `string`

  Name of the header to set.

* **value**: `string`

  Value to set the header to.

* **headers**: `object`

  Header object mapping header names to values.

Returns the response object.

status
------

`res.status(status): this`

Sets the response status to the given status code.

**Arguments**

* **status**: `number | string`

  Response status code to set.

  If the status code is a string, it is converted to a numeric status
  code using the [statuses module](https://github.com/jshttp/statuses){:target="_blank"} first.

Returns the response object.

throw
-----

`res.throw(status, [reason], [options]): void`

Throws an HTTP exception for the given status, which is handled by Foxx
to serve the appropriate JSON error response.

**Arguments**

* **status**: `number | string`

  Response status code to set.

  If the status code is a string, it is converted to a numeric status code
  using the [statuses module](https://github.com/jshttp/statuses){:target="_blank"} first.

  If the status code is in the 500-range (500-599), its stacktrace is always
  logged as if it were an unhandled exception.

  If development mode is enabled, the error's stacktrace is logged as a
  warning if the status code is in the 400-range (400-499) or as a regular
  message otherwise.

* **reason**: `string` (optional)

  Message for the exception.

  If omitted, the status message corresponding to the status code is
  used instead.

* **options**: `object` (optional)

  An object with any of the following properties:

  * **cause**: `Error` (optional)

    Cause of the exception that is logged as part of the error's stacktrace
    (recursively, if the exception also has a `cause` property and so on).

  * **extra**: `object` (optional)

    Additional properties that are added to the error response body
    generated by Foxx.

    If development mode is enabled, an `exception` property is added to
    this value containing the error message and a `stacktrace` property is
    added containing an array with each line of the error's stacktrace.

If an error is passed instead of an options object, it is interpreted as
the `cause` option. If no reason is provided, the error's `message` is
used as the reason instead.

Returns nothing.

type
----

`res.type([type]): string`

Sets the response content-type to the given type if provided or returns the
previously set content-type.

**Arguments**

* **type**: `string` (optional)

  Content-type of the response body.

  Unlike `res.set('content-type', type)`, file extensions can be provided as
  values and are translated to the corresponding MIME type (e.g. `json`
  becomes `application/json`).

Returns the content-type of the response body.

vary
----

`res.vary(names): this`

`res.vary(...names): this`

This method wraps the `vary` header manipulation method of the
[vary module](https://github.com/jshttp/vary){:target="_blank"} for the current response.

The given names is added to the response's `vary` header if not already present.

Returns the response object.

**Examples**

```js
res.vary('user-agent');
res.vary('cookie');
res.vary('cookie'); // duplicates are ignored

// -- or --

res.vary('user-agent', 'cookie');

// -- or --

res.vary(['user-agent', 'cookie']);
```

write
-----

`res.write(data): this`

Appends the given data to the response body.

**Arguments**

* **data**: `string | Buffer`

  Data to append.

  If the data is a buffer, the response body is converted to a buffer first.

  If the response body is a buffer, the data is not converted.

  If the data is an object, it is converted to a JSON string first.

  If the data is any other non-string value, it is converted to a string first.

Returns the response object.
