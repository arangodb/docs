---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.8
---
Incompatible changes in ArangoDB 3.8
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.8, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.8:

Foxx
----

The default value of the startup option `--foxx.force-update-on-startup` changes
from `true` to `false` in ArangoDB 3.8.
This option controls whether the startup procedure should synchronize all Foxx
apps in all databases before making them available, or whether startup should
proceed without ensuring all Foxx apps are in sync. In the latter case, the 
synchronization will happen eventually.

In ArangoDB 3.6 and 3.7, the option's default value is `true`, meaning all Foxx apps 
in all databases will be synchronized on server startup. This can delay the startup
procedure for installations with many databases, and is unnecessary in case no
Foxx apps are used.

In ArangoDB 3.8 the default value for the option is `false`, meaning a server will
complete the boot sequence faster, and the Foxx services will be synchronized in 
a background operation. Until that operation has completed, any requests to a 
Foxx app may be responded to with an HTTP 500 error and message 

    waiting for initialization of Foxx services in this database 

This can cause an unavailability window for Foxx apps for the initial requests to
Foxx apps.

This option only has an effect for cluster setups. On single servers and in
active failover mode, all Foxx apps will always be initialized completely when
the server starts up, and there will be no unavailability window.


Startup options
---------------

The following startup options have been renamed in ArangoDB 3.8:

| Old name | New name |
|:---------|:---------|
| `--javascript.startup-options-whitelist` | `--javascript.startup-options-allowlist`
| `--javascript.startup-options-blacklist` | `--javascript.startup-options-denylist`
| `--javascript.environment-variables-whitelist` | `--javascript.environment-variables-allowlist`
| `--javascript.environment-variables-blacklist` | `--javascript.environment-variables-denylist`
| `--javascript.endpoints-whitelist` | `--javascript.endpoints-allowlist`
| `--javascript.endpoints-blacklist` | `--javascript.endpoints-denylist`
| `--javascript.files-whitelist` | `--javascript.files-allowlist`

Using the old option names will still work in ArangoDB 3.8, but is discouraged.

### Endpoint return value changes

The endpoint `/_api/replication/clusterInventory` returns, among other things,
an array of the existing collections. Each collection has a `planVersion`
attribute, which in ArangoDB 3.8 is now hard-coded to the value of 1.

Before 3.7, the most recent Plan version from the agency was returned inside
`planVersion` for each collection. In 3.7, the attribute contained the Plan
version that was in use when the in-memory LogicalCollection object was last
constructed. The object was always reconstructed in case the underlying Plan
data for the collection changed, or when a collection contained links to
ArangoSearch Views. This made the attribute relatively useless for any
real-world use cases, and so we are now hard-coding it to simplify the internal
code. Using the attribute in client applications is also deprecated.
