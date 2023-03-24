---
layout: default
description: This is an introduction to ArangoDB's HTTP interface for views
---
# HTTP interface for Views

## Addresses of Views

All Views in ArangoDB have a unique identifier and a unique
name. To access a View, use the View name to refer to it:

```
http://server:port/_api/view/<view-name>
```

For example, assume that the View identifier is `7254820` and
the View name is `demo`, then the URL of that View is:

```
http://localhost:8529/_api/view/demo
```
