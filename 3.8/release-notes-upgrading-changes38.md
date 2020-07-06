---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.8
---
Incompatible changes in ArangoDB 3.8
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.8, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.8:

Startup options
---------------

The following startup options have been renamed in ArangoDB 3.8:

* `--javascript.startup-options-whitelist` is now `--javascript.startup-options-allowlist`
* `--javascript.startup-options-blacklist` is now `--javascript.startup-options-denylist`
* `--javascript.environment-variables-whitelist` is now `--javascript.environment-variables-allowlist`
* `--javascript.environment-variables-blacklist` is now `--javascript.environment-variables-denylist`
* `--javascript.endpoints-whitelist` is now `--javascript.endpoints-allowlist`
* `--javascript.endpoints-blacklist` is now `--javascript.endpoints-denylist`
* `--javascript.files-whitelist` is now `--javascript.files-allowlist`

Using the old option names will still work in ArangoDB 3.8, but is discouraged.
