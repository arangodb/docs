---
layout: default
description: These functions implement the HTTP API for manipulating Views
---
# View API

These functions implement the
[HTTP API for manipulating Views](../http/views.html).

{% hint 'info' %}
Views were introduced in ArangoDB 3.4 and are not supported by earlier versions
of ArangoDB.
{% endhint %}

## view.exists

`async view.exists(): boolean`

Checks whether the View exists.

**Examples**

```js
const db = new Database();
const view = db.view("some-view");
const result = await view.exists();
// result indicates whether the View exists
```

### view.get

`async view.get(): object`

Retrieves general information about the View.

**Examples**

```js
const db = new Database();
const view = db.view("some-view");
const data = await view.get();
// data contains general information about the View
```

### view.properties

`async view.properties(): object`

Retrieves the View's properties.

**Examples**

```js
const db = new Database();
const view = db.view("some-view");
const data = await view.properties();
// data contains the View's properties
```

## view.create

`async view.create(options?): object`

This is a shorthand for calling `database.createArangoSearchView` with this
View's name and the given _options_, but returning the View properties instead
of a new _View_ instance.

## view.setProperties

`async view.setProperties(properties): object`

Updates the properties of the View.

**Arguments**

- **properties**: `object`

  For information on the _properties_ argument see the
  [HTTP API for modifying views](../http/views-arangosearch.html).

**Examples**

```js
const db = new Database();
const view = db.view("some-view");
const result = await view.setProperties({ consolidationIntervalMsec: 123 });
assert.equal(result.consolidationIntervalMsec, 123);
```

## view.replaceProperties

`async view.replaceProperties(properties): object`

Replaces the properties of the View.

**Arguments**

- **properties**: `object`

  For information on the _properties_ argument see the
  [HTTP API for modifying views](../http/views-arangosearch.html).

**Examples**

```js
const db = new Database();
const view = db.view("some-view");
const result = await view.replaceProperties({ consolidationIntervalMsec: 234 });
assert.equal(result.consolidationIntervalMsec, 234);
```

## view.rename

`async view.rename(name): object`

Renames the View. The _View_ instance will automatically update its
name when the rename succeeds.

**Examples**

```js
const db = new Database();
const view = db.view("some-view");
const result = await view.rename("new-view-name");
assert.equal(result.name, "new-view-name");
assert.equal(view.name, result.name);
// result contains additional information about the View
```

## view.drop

`async view.drop(): boolean`

Deletes the View from the database.

**Examples**

```js
const db = new Database();
const view = db.view("some-view");
await view.drop();
// the View "some-view" no longer exists
```
