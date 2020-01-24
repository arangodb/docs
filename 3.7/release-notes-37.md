---
layout: default
---
Version 3.7
===========

- [What's New in 3.7](release-notes-new-features37.html)
- [Known Issues in 3.7](release-notes-known-issues37.html)
- [Incompatible changes in 3.7](release-notes-upgrading-changes37.html)


### Http2 support

The server now supports upgrading connections from Http 1.1 to Http 2
This should improve ArangoDBs compatibilty with various L7 loadbalancers 
and modern cloud platforms like Kubernetes.

We also expect improved request throughput in cases where there are many concurrent requests.
