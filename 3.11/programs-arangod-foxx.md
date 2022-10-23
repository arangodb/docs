---
layout: default
---
# ArangoDB Server Foxx Options

## Foxx startup

`--foxx.force-update-on-startup flag`

Enable or disable the Foxx service propagation on startup

if *true*, all Foxx services in all databases will be synchronized between
multiple Coordinators during the boot sequence. This ensures that all Foxx
services are up-to-date when a Coordinator reports itself as ready.

In case the option is set to `false` (i.e. no waiting), the Coordinator 
will complete the boot sequence faster, and the Foxx services will be 
propagated lazily. Until the initialization procedure has completed for
the local Foxx apps, any request to a Foxx app will be responded to with
an HTTP 500 error and message 

    waiting for initialization of Foxx services in this database 

This can cause an unavailability window for Foxx services on Coordinator
startup for the initial requests to Foxx apps until the app propagation 
has completed.
  
When not using Foxx, this option should be set to *false* to benefit from a 
faster Coordinator startup.
Deployments relying on Foxx apps being available as soon as a Coordinator 
is integrated or responding should set this option to *true* (which is 
the default value).

The option only has an effect for cluster setups. On single servers and in 
active failover mode, all Foxx apps will be available from the very beginning.

Note: ArangoDB 3.8 changes the default value to *false* for this option.
In previous versions this option had a default value of *true*.

## Foxx queues

`--foxx.queues flag`

Enable or disable the Foxx queues feature

If *true*, the Foxx queues will be available and jobs in the queues will
be executed asynchronously.

The default is *true*.
When set to `false` the queue manager will be disabled and any jobs
are prevented from being processed, which may reduce CPU load a bit.

## Foxx queues poll interval

`--foxx.queues-poll-interval value`

Poll interval for Foxx queues

The poll interval for the Foxx queues manager. The value is specified in
seconds. Lower values will mean more immediate and more frequent Foxx
queue job execution, but will make the queue thread wake up and query the
queues more often. When set to a low value, the queue thread might cause
CPU load.

The default is *1* second. If Foxx queues are not used much, then this
value may be increased to make the queues thread wake up less.
