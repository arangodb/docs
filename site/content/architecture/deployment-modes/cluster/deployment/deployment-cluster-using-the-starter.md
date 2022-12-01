---
fileID: deployment-cluster-using-the-starter
title: Using the ArangoDB Starter
weight: 835
description: 
layout: default
---
This section describes how to start a Cluster using the tool [_Starter_](../../../../programs-tools/arangodb-starter/)
(the _arangodb_ binary program).

As a precondition you should create a _secret_ to activate authentication. The _Starter_ provides a handy
functionality to generate such a file:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb create jwt-secret --secret=arangodb.secret
```
{{% /tab %}}
{{< /tabs >}}

Set appropriate privilege on the generated _secret_ file, e.g. on Linux:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
chmod 400 arangodb.secret
```
{{% /tab %}}
{{< /tabs >}}

## Local Tests

If you only want a local test Cluster, you can run a single _Starter_ with the 
`--starter.local` argument. It will start a 3 "machine" Cluster on your local PC:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --starter.local --starter.data-dir=./localdata --auth.jwt-secret=/etc/arangodb.secret
```
{{% /tab %}}
{{< /tabs >}}

Please adapt the path to your _secret_ file accordingly.

**Note:** a local Cluster is intended only for test purposes since a failure of 
a single PC will bring down the entire Cluster.

## Multiple Machines

If you want to start a Cluster using the _Starter_, you need to copy the _secret_ file to every machine
and start the Cluster using the following command:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangodb --server.storage-engine=rocksdb --auth.jwt-secret=/etc/arangodb.secret --starter.data-dir=./data --starter.join A,B,C
```
{{% /tab %}}
{{< /tabs >}}

Please adapt the path to your _secret_ file accordingly.

Run the above command on machine A, B & C.

Once all the processes started by the _Starter_ are up and running, and joined the
Cluster (this may take a while depending on your system), the _Starter_ will inform
you where to connect the Cluster from a Browser, shell or your program.

For a full list of options of the _Starter_ please refer to [this](../../../../programs-tools/arangodb-starter/programs-starter-options)
section.

## Using the ArangoDB Starter in Docker

The _Starter_ can also be used to launch Clusters based on _Docker_ containers:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    arangodb/arangodb-starter \
    --starter.address=$IP \
    --starter.join=A,B,C
```
{{% /tab %}}
{{< /tabs >}}

Run the above command on machine A, B & C.

If you use the Enterprise Edition Docker image, you have to set the license key
in an environment variable by adding this option to the above `docker` command:

{{< tabs >}}
{{% tab name="" %}}
```
    -e ARANGO_LICENSE_KEY=<thekey>
```
{{% /tab %}}
{{< /tabs >}}

You can get a free evaluation license key by visiting:

[www.arangodb.com/download-arangodb-enterprise/](https://www.arangodb.com/download-arangodb-enterprise/)

Then replace `<thekey>` above with the actual license key. The start
will then hand on the license key to the Docker containers it launches
for ArangoDB.

**TLS verified Docker services**

Oftentimes, one needs to harden Docker services using client certificate 
and TLS verification. The Docker API allows subsequently only certified access.
As the ArangoDB starter starts the ArangoDB cluster instances using this Docker API, 
it is mandatory that the ArangoDB starter is deployed with the proper certificates
handed to it, so that the above command is modified as follows:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export IP=<IP of docker host>
export DOCKER_CERT_PATH=/path/to/certificate
docker volume create arangodb
docker run -it --name=adb --rm -p 8528:8528 \
    -v arangodb:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $DOCKER_CERT_PATH:$DOCKER_CERT_PATH \
    -e DOCKER_TLS_VERIFY=1 \
    -e DOCKER_CERT_PATH=$DOCKER_CERT_PATH \
    arangodb/arangodb-starter \
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
    arangodb/arangodb-starter \
    --starter.address=$IP \
    --starter.join=A,B,C
```
{{% /tab %}}
{{< /tabs >}}

## Under the Hood

The first `arangodb` you ran will become the _leader_ of your _Starter_ setup
(also called _master_), the other `arangodb` instances will become the
_followers_ of your _Starter_ setup. This is not to be confused with the
Leader/Follower replication of ArangoDB. The terms above refers to the _Starter_ setup.

The _Starter_ _leader_ determines which ArangoDB server processes to launch on which
_Starter_ _follower_, and how they should communicate.

It will then launch the server processes and monitor them. Once it has detected
that the setup is complete you will get the prompt. 

The _Starter_ _leader_ will save the setup for subsequent starts.
