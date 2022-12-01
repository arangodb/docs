---
fileID: foxx-reference-sessions-transports-header
title: Header Session Transport
weight: 1110
description: 
layout: default
---
`const headerTransport = require('@arangodb/foxx/sessions/transports/header');`

The header transport stores session identifiers in headers on the request
and response objects.

**Examples**

{{< tabs >}}
{{% tab name="js" %}}
```js
const sessions = sessionsMiddleware({
  storage: module.context.collection('sessions'),
  transport: headerTransport('X-FOXXSESSID')
});
module.context.use(sessions);
```
{{% /tab %}}
{{< /tabs >}}

## Creating a transport

`headerTransport([options]): Transport`

Creates a [Transport]() that can be used in the sessions middleware.

**Arguments**

* **options**: `Object` (optional)

  An object with the following properties:

  * **name**: `string` (Default: `X-Session-Id`)

    Name of the header that contains the session identifier (not case sensitive).

If a string is passed instead of an options object, it will be interpreted
as the *name* option.
