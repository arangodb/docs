---
fileID: architecture
title: Architecture
weight: 780
description: >-
  This chapter describes ArangoDB's deployment modes and provides useful information
  about different data models and scalability, data sharding, the storage engine
  that lies at the very bottom of an ArangoDB database system, and also about the
  replication methods that ArangoDB offers.
layout: default
---
## What deployment modes are available?

ArangoDB can be deployed in a variety of configurations, depending on your needs.

You can deploy it on-premises as a single server, optionally as a resilient pair
with asynchronous replication and automatic failover, or as a
cluster comprised of multiple nodes with synchronous replication and automatic
failover for high availability and resilience. For the highest level of data
safety, you can additionally set up off-site replication for your entire cluster.

Read more about [deployment modes](deployment-modes/) to find out all
important details about each mode and the included features.

## Deploying by technology

You can deploy ArangoDB manually, using the ArangoDB Starter tool, in Docker
containers, or using the ArangoDB Kubernetes Operator.

Continue with [Deployment by Technology](../deployment/by-technology/)
chapter to learn more about all the available options.