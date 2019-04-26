---
layout: default
---
Command-Line Options for Communication
======================================

### Scheduler threads
{% docublock schedulerThreads %}


### Scheduler maximal queue size
{% docublock schedulerMaximalQueueSize %}


### Scheduler backend
{% docublock schedulerBackend %}


### Io backends
`--show-io-backends`

If this option is specified, then the server will list available backends and
exit. This option is useful only when used in conjunction with the option
scheduler.backend. An integer is returned (which is platform dependent) which
indicates available backends on your platform. See libev for further details and
for the meaning of the integer returned. This describes the allowed integers for
*scheduler.backend*, see [here](configure-arango-communication.html#command-line-options-for-communication) for details.
