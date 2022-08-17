---
layout: default
description: ArangoDB Server Web Interface Options
redirect_from:
  - programs-arangod-frontend.html # 3.9 -> 3.10
---
# ArangoDB Server Web Interface Options

## Proxy settings

`--web-interface.proxy-request-check`

Enable proxy request checking.

`--web-interface.trusted-proxy`

List of proxies to trust (may be IP or network).
Make sure `--web-interface.proxy-request-check` is enabled.
