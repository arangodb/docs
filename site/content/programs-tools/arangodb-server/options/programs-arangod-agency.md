---
fileID: programs-arangod-agency
title: ArangoDB Server Agency Options
weight: 220
description: 
layout: default
---
## Activate

`agency.activate`

Activate Agency.

## Compaction

`agency.compaction-keep-size`

Keep as many indices before compaction point. 

## Election

`agency.election-timeout-max`

Maximum timeout before an Agent calls for new election in seconds.

`agency.election-timeout-min`

Minimum timeout before an Agent calls for new election in seconds.

## Endpoint

`agency.endpoint`

Agency endpoints.

## My address

`agency.my-address`

Which address to advertise to the outside. 

## Pool size

`agency.pool-size`

Number of Agent pool.

## Size

`agency.size`

Number of Agents.

## Supervision

`agency.supervision`

Perform ArangoDB cluster supervision.

`agency.supervision-frequency`

ArangoDB cluster supervision frequency in seconds.

`agency.supervision-grace-period`

Supervision time, after which a server is considered to have failed, in seconds. 

The default value is `10` seconds, which is recommended for regular cluster deployments.
For active failover deployments it is recommended to use a higher value for the grace
period to avoid unnecessary failovers. In active failover setups, the leader server needs 
to handle all the load and is thus expected to get overloaded and unresponsive more easily 
than a server in a regular cluster which needs to handle only a part of the overall load.
