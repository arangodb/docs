---
fileID: tutorials-starter
title: Starting an ArangoDB cluster or database the easy way
weight: 165
description: 
layout: default
---
Starting an ArangoDB cluster involves starting various servers with
different roles (Agents, DB-Servers & Coordinators).

The ArangoDB Starter is designed to make it easy to start and
maintain an ArangoDB cluster or single server database.

Besides starting and maintaining ArangoDB deployments, the starter also provides
various commands to create TLS certificates & JWT token secrets to secure your
ArangoDB deployment.

{{% hints/info %}}
ArangoDB is also available as a cloud service, the
[**ArangoGraph Insights Platform**](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic).
{{% /hints/info %}}

## Installation

The ArangoDB starter (`arangodb`) comes with all current distributions of ArangoDB.

If you want a specific version, download the precompiled binary via the
[GitHub releases page](https://github.com/arangodb-helper/arangodb/releases).

## Starting a cluster

An ArangoDB cluster typically involves 3 machines.
ArangoDB must be installed on all of them.

Then start the ArangoDB starter of all 3 machines like this:

On host A:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb
```
{{% /tab %}}
{{< /tabs >}}

This will use port 8528 to wait for colleagues (3 are needed for a
resilient Agency). On host B (can be the same as A):

{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.join A
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

This will contact A on port 8528 and register. On host C (can be same
as A or B):

{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.join A
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

This will contact A on port 8528 and register.

From the moment on when 3 have joined, each will fire up an Agent, a
Coordinator and a DB-Server and the cluster is up. Ports are shown on
the console, the starter uses the next few ports above the starter
port. That is, if one uses port 8528 for the starter, the Coordinator
will use 8529 (=8528+1), the DB-Server 8530 (=8528+2), and the Agent 8531
(=8528+3). You can change the default starter port with the `--starter.port`
[option](../programs-tools/arangodb-starter/programs-starter-options).

Additional servers can be added in the same way.

If two or more of the `arangodb` instances run on the same machine,
one has to use the `--starter.data-dir` option to let each use a different
directory.

The `arangodb` program will find the ArangoDB executable (`arangod`) and the
other installation files automatically. If this fails, use the
`--server.arangod` and `--server.js-dir` options described below.

## Running in Docker

You can run `arangodb` using our ready made docker container.

When using `arangodb` in a Docker container it will also run all
servers in a docker using the `arangodb/arangodb:latest` docker image.
If you wish to run a specific docker image for the servers, specify it using
the `--docker.image` argument.

When running in docker it is important to care about the volume mappings on
the container. Typically you will start the executable in docker with the following
commands.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
docker volume create arangodb1
docker run -it --name=adb1 --rm -p 8528:8528 \
    -v arangodb1:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP
```
{{% /tab %}}
{{< /tabs >}}


The executable will show the commands needed to run the other instances.

Note that the commands above create a docker volume. If you're running on Linux
it is also possible to use a host mapped volume. Make sure to map it
on `/data`.

**TLS verified Docker services**

Oftentimes, one needs to harden Docker services using client certificate 
and TLS verification. The Docker API allows subsequently only
certified access. As the ArangoDB starter starts the ArangoDB cluster
instances using this Docker API, it is mandatory that the ArangoDB
starter is deployed with the proper certificates handed to it, so that
the above command is modified as follows: 

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
export DOCKER_CERT_PATH=/path/to/certificate
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $DOCKER_CERT_PATH:$DOCKER_CERT_PATH
    -e DOCKER_TLS_VERIFY=1
    -e DOCKER_CERT_PATH=$DOCKER_CERT_PATH
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP \
    --starter.join=A,B,C
```
{{% /tab %}}
{{< /tabs >}}

Note that the environment variables `DOCKER_TLS_VERIFY` and `DOCKER_CERT_PATH` 
as well as the additional mountpoint containing the certificate have been added above. 
directory. The assignment of `DOCKER_CERT_PATH` is optional, in which case it 
is mandatory that the certificates are stored in `$HOME/.docker`. So
the command would then be as follows

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /path/to/cert:/root/.docker \
    -e DOCKER_TLS_VERIFY=1 \
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP \
    --starter.join=A,B,C
```
{{% /tab %}}
{{< /tabs >}}


The TLS verification above applies equally to all below deployment modes.

## Using multiple join arguments

It is allowed to use multiple `--starter.join` arguments.
This eases scripting. For example:

On host A:

{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.join A,B,C
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

On host B:

{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.join A,B,C
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

On host C:

{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.join A,B,C
```
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}

This starts a cluster where the starter on host A is chosen to be leader (_master_) during the bootstrap phase.

Note: `arangodb --starter.join A,B,C` is equal to `arangodb --starter.join A --starter.join B --starter.join C`.

During the bootstrap phase of the cluster, the starters will all choose the leader starter
based on list of given `starter.join` arguments.

The leader starter is chosen as follows:

- If there are no `starter.join` arguments, the starter becomes a leader.
- If there are multiple `starter.join` arguments, these arguments are sorted. If a starter is the first
  in this sorted list, it becomes a starter.
- In all other cases, the starter becomes a follower.

Note: Once the bootstrap phase is over (all arangod servers have started and are running), the bootstrap
phase ends and the starters use the Arango Agency to elect a leader for the runtime phase.

## Starting a local test cluster

If you want to start a local cluster quickly, use the `--starter.local` flag.
It will start all servers within the context of a single starter process.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.local
```
{{% /tab %}}
{{< /tabs >}}

Using the starter this way does not provide resilience and high availability of your cluster!

Note: When you restart the starter, it remembers the original `--starter.local` flag.

## Starting a cluster with Datacenter-to-Datacenter Replication

{{< tag "ArangoDB Enterprise" >}}

Datacenter-to-Datacenter Replication (DC2DC) requires a normal ArangoDB cluster in both data centers
and one or more (`arangosync`) syncmasters & syncworkers in both data centers.
The starter enables you to run these syncmasters & syncworkers in combination with your normal
cluster.

To run a starter with DC2DC support you add the following arguments to the starters command line:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
--auth.jwt-secret=<path of file containing JWT secret for communication in local cluster>
--starter.address=<publicly visible address of this machine>
--starter.sync
--server.storage-engine=rocksdb
--sync.master.jwt-secret=<path of file containing JWT secret used for communication between local syncmaster & workers>
--sync.server.keyfile=<path of keyfile containing TLS certificate & key for local syncmaster>
--sync.server.client-cafile=<path of file containing CA certificate for syncmaster client authentication>
```
{{% /tab %}}
{{< /tabs >}}

Consult `arangosync` documentation for instructions how to create all certificates & keyfiles.

## Starting a single server

If you want to start a single database server, use `--starter.mode=single`.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.mode=single
```
{{% /tab %}}
{{< /tabs >}}

## Starting a single server in Docker

If you want to start a single database server running in a docker container,
use the normal docker arguments, combined with `--starter.mode=single`.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP \
    --starter.mode=single
```
{{% /tab %}}
{{< /tabs >}}

## Starting a resilient single server pair

If you want to start a resilient single database server, use `--starter.mode=activefailover`.
In this mode a 3 machine _Agency_ is started as well as 3 single servers that perform
asynchronous replication an failover if needed.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.mode=activefailover --starter.join A,B,C
```
{{% /tab %}}
{{< /tabs >}}

Run this on machine A, B & C.

## Starting a resilient single server pair in Docker

If you want to start a resilient single database server running in docker containers,
use the normal docker arguments, combined with `--starter.mode=activefailover`.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
{{< tabs >}}
{{% tab name="bash" %}}
    arangodb/arangodb-starter \
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
{{% /tab %}}
{{< /tabs >}}
    --starter.address=$IP \
    --starter.mode=activefailover \
    --starter.join=A,B,C
```
{{% /tab %}}
{{< /tabs >}}

Run this on machine A, B & C.

The starter will decide on which 2 machines to run a single server instance.
To override this decision (only valid while bootstrapping), add a
`--cluster.start-single=false` to the machine where the single server
instance should NOT be scheduled.

## Starting a local test resilient single sever pair

If you want to start a local resilient server pair quickly, use the `--starter.local` flag.
It will start all servers within the context of a single starter process.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.local --starter.mode=activefailover
```
{{% /tab %}}
{{< /tabs >}}

Note: When you restart the started, it remembers the original `--starter.local` flag.

## Starting & stopping in detached mode

If you want the starter to detach and run as a background process, use the `start`
command. This is typically used by developers running tests only.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb start --starter.local=true [--starter.wait]
```
{{% /tab %}}
{{< /tabs >}}

This command will make the starter run another starter process in the background
(that starts all ArangoDB servers), wait for it's HTTP API to be available and
then exit. The starter that was started in the background will keep running until you stop it.

The `--starter.wait` option makes the `start` command wait until all ArangoDB server
are really up, before ending the process of the leader starter.

To stop a starter use this command.

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb stop
```
{{% /tab %}}
{{< /tabs >}}

Make sure to match the arguments given to start the starter (`--starter.port` & `--ssl.*`).

## More information

- [Options](../programs-tools/arangodb-starter/programs-starter-options) contains a list of all commandline options supported by the starter.
- [Security](../programs-tools/arangodb-starter/programs-starter-security) contains instructions of how to create certificates & tokens needed
  to secure an ArangoDB deployment.
