---
layout: default
description: >-
  The cluster-specific endpoints let you get information about individual
  cluster nodes and the cluster as a whole, as well as monitor and administrate
  cluster deployments
redirect_from:
  - endpoints.html # 3.10 -> 3.10
  - cluster-server-id.html # 3.10 -> 3.10
  - cluster-server-role.html # 3.10 -> 3.10
  - cluster-statistics.html # 3.10 -> 3.10
  - cluster-health.html # 3.10 -> 3.10
  - cluster-maintenance.html # 3.10 -> 3.10
---
# HTTP interface for clusters

{{ page.description }}
{:class="lead"}

## Monitoring

{% docublock get_admin_cluster_statistics %}
{% docublock get_admin_cluster_health %}

## Endpoints

{% docublock get_api_cluster_endpoints %}

## Cluster node information

{% docublock get_admin_server_id %}
{% docublock get_admin_server_role %}

## Maintenance

{% docublock put_admin_cluster_maintenance %}
{% docublock get_admin_cluster_maintenance_dbserver %}
{% docublock put_admin_cluster_maintenance_dbserver %}

## Rebalance

The API calls in this chapter deserve some explanation. As of Version
3.10 ArangoDB has some builtin capabilities to rebalance the
distribution of shards. This might become necessary since imbalances
can lead to uneven disk usage across the DBServers (data
unbalance) or to uneven load distribution across the DBServers
(leader imbalance).

If the data is distributed relatively evenly across the DBServers, then
the leader imbalance can usually be adjusted relatively cheaply, since
we only have to transfer leadership for a number of shards to a
different replica, which already has the data. This is not true in all
cases, but as a rule of thumb it is true.

If, however, data needs to be moved between DBServers, then this is a
costly and potentially lengthy operation. This is inevitable, but we
have made it so that this is done in the backgroud and does not lead to
service interruption.

Nevertheless, data movement requires I/O, CPU and network resources and
thus will always put an additional load on the cluster.

Rebalancing shards is a rather complex optimization problem, in
particular if there are many shards in the system. Fortunately, in most
situations it is relatively easy to find operations to make good
progress towards a better state, but "perfection" is hard, and finding
a "cheap" way to get there is even harder.

The APIs described here try to help with the following approach: There
is a "imbalance score" which is computed on a given shard distribution, which
basically says how "imbalanced" the cluster is. This score involves
leader imbalance as well as data imbalance. Higher score means more
imbalance, the actual numerical value does not have any meaning.

The `GET` API call can be used to evaluate this score and give back how
imbalanced the cluster currently is. The `POST` API call does the same
and additionally computes a list of shard movements which the system 
suggests to lower the imbalance score. A variant of the `POST` API call
can then take this (or another) suggestion and execute it in the
backgroud. For convenience, we offer the `PUT` API call to do all at
once: compute the score, suggest moves and execute them right away.
Since the execution can take some time, the `GET` API call will also
tell how many of the moves are still outstanding.

There are three types of moves:

1. Switch leadership of one shard from the leader to a follower, which
   is currently in sync. This is a fast move.
2. Move the data of a leader to a new DBServer and make it the new leader.
   This is a slow move, since it needs to copy the data over the network
   and then switch the leadership.
3. Move the data of a follower to a new DBServer and make it a new
   follower, then drop the data on the previous follower. This is a slow
   move, since it needs to copy the data over the network.

The suggestion engine behind the `POST` and `PUT` API calls has three
switches to activate/deactivate these three types of moves
independently. If a type of move is activated, the engine will consider
all possible such moves, if it is deactivated, no such moves will be
considered. The three flags are:

1. `leaderChanges` (default `true`): consider moves of type 1.
2. `moveLeaders` (default `false`): consider moves of type 2.
3. `moveFollowers` (default `false`): consider moves of type 3.

The engine will then enumerate all possible moves of the various types.
It will then always first choose the one which improves the imbalance
the most. After that move, it will reevaluate the imbalance score and
again look for the move which improves the imbalance score the most.
It will altogether suggest/do up to `maximumNumberOfMoves` moves and
then stop. The default for this maximum is 1000 and it is capped at 5000
to avoid overly long optimization computations.
It is conceivable that for large clusters 1000 or even 5000 might not be
enough to achieve a full balancing. In such cases one simply has to
repeat the API calls potentially multiple times.

Finally, we need to explain that some rebalancing tasks are beyond the
current scope and limits of this API.

First, in the case of smart graphs or one shard databases, not all shards can
be moved freely. Rather, some shards are "coupled" and can only move
their place in the cluster or even their leadership together. This
severly limits the possibilities of shard movement and sometimes makes a
good balance impossible. A prominent example here is a single one shard
database in the cluster. In this case **all** leaders **have to** reside
on the same server, so no good leader distribution is possible at all.

Secondly, the current implementation does not take actual shard sizes
into account. It essentially works on the number of shards and tries
to distribute the numbers evenly. It computes weights on the grounds of
how many shards are "coupled" together, but it does not take actual data
size into account. This means that it is possible that we get a "good"
data distribution w.r.t. number of shards, but not with respect to their
disk size usage.

Thirdly, the current implementation does not take compute load on
different collections and shards into account. Therefore, it is possible
that we end up with a shard distribution which distributes the **leader
numbers** evenly across the cluster, even though the actual compute load
is then unevenly distributed, since some collections/shard simply are
hit by more queries than others.

Finally, good shard balancing is a difficult problem and we are likely
to make changes to this part of the system in the future. If you run
into a situation in which the decisions of the shard rebalancer are
bad, we would like to hear about this, such that we can improve things
in the future. For such reports we need an agency history (covering the
shard distribution before and after the move) and if at all possible
also the output of the API calls described here.

{% docublock get_admin_cluster_rebalance %}
{% docublock post_admin_cluster_rebalance %}
{% docublock post_admin_cluster_rebalance_execute %}
{% docublock put_admin_cluster_rebalance %}
