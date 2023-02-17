---
layout: default
description: Setting up a working Leader/Follower replication requires at least two ArangoDBinstances
redirect_from:
  - deployment-master-slave-manual-start.html # 3.8 -> 3.8
---
Manual Start
============

Setting up a working _Leader/Follower_ replication requires at least two ArangoDB
instances:

1. **Leader:** this is the instance where all data-modification operations should
be directed to.

1. **Follower:** this is the instance that replicates, in an asynchronous way, the data
from the _Leader_. For the replication to happen, a _replication applier_ has to
be started on the Follower. The _replication applier_ will fetch data from the _Leader_'s
_write-ahead log_ and apply its operations locally. One or more Followers can replicate
from the same Leader.

Generally, one deploys the _Leader_ on a machine and each _Follower_ on an additional,
separate, machine (one per _Follower_). In case the _Leader_ and the _Followers_ are
running on the same machine (tests only), please make sure you use different ports
(and data directories) for the _Leader_ and the _Followers_.

Please install the _Leader_ and the _Followers_ as they were, separate,
[single instances](deployment-single-instance.html). There are no specific differences,
at this stage, between a _Leader_ a _Follower_ and a _single instance_.

Once the ArangoDB _Leader_ and _Followers_ have been deployed, the replication has
to be started on each of the available _Followers_. This can be done at database level,
or globally.

For further information on how to set up the replication in _Leader/Follower_ environment,
please refer to [this](administration-leader-follower-setting-up.html) _Section_.
