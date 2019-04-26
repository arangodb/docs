---
layout: default
---
Command-Line Options for arangod
================================

### Endpoint
{% docublock serverEndpoint %}


### Reuse address
{% docublock serverReuseAddress %}


### Disable authentication
{% docublock server_authentication %}


### Disable authentication-unix-sockets
{% docublock serverAuthenticationDisable %}


### Authenticate system only
{% docublock serverAuthenticateSystemOnly %}


### Disable replication-applier
{% docublock serverDisableReplicationApplier %}


### Keep-alive timeout
{% docublock keep_alive_timeout %}


### Default API compatibility
{% docublock serverDefaultApi %}


### Hide Product header
{% docublock serverHideProductHeader %}


### Allow method override
{% docublock serverAllowMethod %}


### Server threads
{% docublock serverThreads %}


### Keyfile
{% docublock serverKeyfile %}


### Cafile
{% docublock serverCafile %}


### SSL protocol
{% docublock serverSSLProtocol %}


### SSL cache
{% docublock serverSSLCache %}


### SSL options
{% docublock serverSSLOptions %}


### SSL cipher
{% docublock serverSSLCipher %}


### Backlog size
{% docublock serverBacklog %}


### Disable server statistics

`--server.disable-statistics value`

If this option is *value* is *true*, then ArangoDB's statistics gathering
is turned off. Statistics gathering causes regular CPU activity so using this
option to turn it off might relieve heavy-loaded instances.
Note: this option is only available when ArangoDB has not been compiled with
the option *--disable-figures*.


### Session timeout
{% docublock SessionTimeout %}


### Foxx queues
{% docublock foxxQueues %}


### Foxx queues poll interval
{% docublock foxxQueuesPollInterval %}


### Directory
{% docublock DatabaseDirectory %}


### Journal size
{% docublock databaseMaximalJournalSize %}


### Wait for sync
{% docublock databaseWaitForSync %}


### Force syncing of properties
{% docublock databaseForceSyncProperties %}


### Disable AQL query tracking
{% docublock databaseDisableQueryTracking %}


### Throw collection not loaded error
{% docublock databaseThrowCollectionNotLoadedError %}


### AQL Query caching mode
{% docublock queryCacheMode %}


### AQL Query cache size
{% docublock queryCacheMaxResults %}


### Index threads
{% docublock indexThreads %}


### V8 contexts
{% docublock v8Contexts %}


### Garbage collection frequency (time-based)
{% docublock jsGcFrequency %}


### Garbage collection interval (request-based)
{% docublock jsStartupGcInterval %}


### V8 options
{% docublock jsV8Options %}
