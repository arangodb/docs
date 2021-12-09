---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.10
---
Incompatible changes in ArangoDB 3.10
=====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.10, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.10:

AQL
---



Startup options
---------------

The option `--foxx.allow-install-from-remote` controls if installing Foxx apps
from remote URL sources other than Github is allowed. If set to `false`,
installing Foxx apps is blocked for other remote sources than Github. Installing
Foxx apps from Github or from uploaded zip files is still possible with this
setting.
Setting the option to `true` will allow installing Foxx apps from any remote
URL sources.

The default value for this option in ArangoDB 3.10 is `false`, meaning that
installing Foxx apps from remote sources other than Github is disallowed. This
also disables the "Remote" tab in the "Services" section of the web interface.
This is a downwards-incompatible default value change compared to previous
versions of ArangoDB, which was made for security reasons. To enable installing
apps from remote sources again, this option should be set to `true`.


Client tools
------------

### arangobench

The following deprecated arangobench testcases have been removed from _arangobench_:
* `aqltrx`
* `aqlv8`
* `counttrx`
* `deadlocktrx`
* `multi-collection`
* `multitrx`
* `random-shapes`
* `shapes`
* `shapes-append`
* `skiplist`
* `stream-cursor`

These test cases had been deprecated since ArangoDB 3.9.

The testcase `hash` was renamed to `persistent-index` to better reflect its
scope.
