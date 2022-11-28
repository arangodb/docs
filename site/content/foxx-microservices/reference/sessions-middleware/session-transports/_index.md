---
fileID: foxx-reference-sessions-transports
title: Session Transports
weight: 1210
description: 
layout: default
---
`transport.set(response, sid): void`

Attaches a session identifier to a response object.

If present this method will automatically be invoked at the end of a request
regardless of whether the session was modified or not.

**Arguments**

* **response**: `Response`

  [Response object](../../routers/foxx-reference-routers-response) to attach a session identifier to.

* **sid**: `string`

  Session identifier to attach to the response.

Returns nothing.

**Examples**

```js
set(res) {
  res.set('x-session-id', value);
}
```

## clear

`transport.clear(response): void`

Attaches a payload indicating that the session has been cleared to the
response object. This can be used to clear a session cookie when the session
has been destroyed (e.g. during logout).

If present this method will automatically be invoked instead of `set` when the
`req.session` attribute was removed by the route handler.

**Arguments**

* **response**: `Response`

  Response object to remove the session identifier from.

Returns nothing.
