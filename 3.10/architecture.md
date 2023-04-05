---
layout: default
description: >-
  This chapter describes ArangoDB's deployment modes and provides useful information
  about different data models and scalability, data sharding, the storage engine
  that lies at the very bottom of an ArangoDB database system, and also about the
  replication methods that ArangoDB offers.
---
# Architecture

{{ page.description }}
{:class="lead"}

## Available deployment modes

ArangoDB can be deployed in a variety of configurations, depending on your needs.

You can deploy it on-premises as a single server, optionally as a resilient pair
with asynchronous replication and automatic failover, or as a
cluster comprised of multiple nodes with synchronous replication and automatic
failover for high availability and resilience. For the highest level of data
safety, you can additionally set up off-site replication for your entire cluster.

Read more about [deployment modes](architecture-deployment-modes.html) to find out all
important details about each mode and the included features.

## ArangoDB Components

The full ArangoDB package ships with a set of programs and tools that may
simplify your workflow, such as:
- ArangoDB Server or `arangod`, the core component of ArangoDB
- ArangoDB Shell or `arangosh`, a client tool that you can use for administration
  of ArangoDB servers
- ArangoDB Starter or `arangodb`, a tool that helps you deploy ArangoDB in an easy way

and many more.

For more information, including the full list of available tools plus examples,
read the [Programs & Tools](programs.html) chapter.

## Deploying by technology

There are different ways that can be used to deploy an environment. You can
manually start all the needed processes localy or in Docker containers. 
Or use the ArangoDB _Starter_, the _arangodb_ binary program, for
local setups using processes or Docker containers.

If you want to deploy in your Kubernetes cluster, you can use the 
[ArangoDB Kubernetes Operator](deployment-kubernetes.html) (`kube-arangodb`).

The fastest way to get ArangoDB up and running is to run it in the cloud - the
[ArangoGraph Platform](https://cloud.arangodb.com){:target="_blank"} offers a 
fully managed cloud service, available on AWS, Microsoft Azure, 
and Google Cloud Platform.

## Scaling ArangoDB

ArangoDB is a distributed database supporting multiple data models,
and can thus be scaled horizontally, that is, by using many servers,
typically based on commodity hardware. This approach not only delivers 
performance as well as capacity improvements, but also achieves
resilience by means of replication and automatic fail-over. Furthermore,
one can build systems that scale their capacity dynamically up and down 
automatically according to demand.

One can also scale ArangoDB vertically, that is, by using
ever larger servers. There is no built in limitation in ArangoDB,
for example, the server will automatically use more threads if
more CPUs are present. 

However, scaling vertically has the disadvantage that the
costs grow faster than linear with the size of the server, and
none of the resilience and dynamical capabilities can be achieved 
in this way.