---
layout: default
description: This section describes how to start a cluster using the Starter tool (the arangodb executable)
---
# Using the ArangoDB Starter

This section describes how to start a Cluster using the [_Starter_](programs-starter.html)
tool (the `arangodb` executable).

As a precondition you should create a _secret_ to activate authentication.
The _Starter_ provides a handy functionality to generate such a file:

```bash
arangodb create jwt-secret --secret=arangodb.secret
```

Set appropriate privilege on the generated _secret_ file, e.g. on Linux:

```bash
chmod 400 arangodb.secret
```

Also see [Security](programs-starter-security.html) for instructions of how to
create certificates and tokens needed to secure an ArangoDB deployment.

## Local test cluster

If you want to start a local test cluster quickly, you can run a single
_Starter_ with the `--starter.local` argument. It starts a 3 "machine" cluster
on your local computer within the context of a single starter process:

```bash
arangodb --starter.local --starter.data-dir=./localdata --auth.jwt-secret=/etc/arangodb.secret
```

Please adapt the path to your _secret_ file accordingly.

{% hint 'warning' %}
A local cluster is intended for test purposes only. It does not provide
resilience and high availability!
{% endhint %}

When you restart the Starter, it remembers the original `--starter.local` flag.

## Multiple machines

An ArangoDB cluster typically involves three machines. ArangoDB must be
installed on all of them.

You need to copy the _secret_ file to every machine.
Then run the ArangoDB Starter like this on host A (adapt the path to your
_secret_ file accordingly):

```bash
arangodb --auth.jwt-secret=/etc/arangodb.secret --starter.data-dir=./data
```

This uses port 8528 to wait for other Starters and the nodes they manage.
Three Agent nodes are needed for a resilient Agency, which is the default number,
and the Starters wait for Agent nodes to form the Agency.

Run the following command on host B and C (replace `A` with the host name or
IP address of the host):

```bash
arangodb --auth.jwt-secret=/etc/arangodb.secret --starter.data-dir=./data --starter.join A
```

The `--server.join` option is for pointing a Starter to an existing Starter.
If you run Starters on ports other than the default (`8528`) using the
`--starter.port` option, then you need to append the port to the address
(e.g. `--starter.join 127.0.0.1:9528`).

The latter two Starters contact the Starter on host A on port 8528 and register
themselves. From the moment on when three have joined, each fires up an Agent, a
Coordinator, and a DB-Server.

Once all the processes started by the _Starter_ are up and running, and joined the
cluster (this may take a while depending on your system), the _Starter_ informs
you where to connect to the cluster from a browser, shell, or program.

Additional servers can be added in the same way. For example, on host D, you run
the above command pointing to the Starter that runs on `A` (or on `B` or `C`, as
long as they are connected to `A`). This adds another DB-Server and Coordinator,
but no fourth Agent, as the default Agency size (`--cluster.agency-size`) of `3`
is already reached. To only add a DB-Server, use `--cluster.start-coordinator false`.
To only add a Coordinator, use `--cluster.start-dbserver false`.

You can also set both `--cluster.start-dbserver` and `--cluster.start-coordinator`
to `false` for the first three Starters to only create the Agency. This lets you
run the Agents on specific machines. Later, you can add the DB-Servers and
Coordinators to the cluster using other machines.

The Starter uses the next few ports above the Starter port for the cluster nodes.
That is, if you use port 8528 for the Starter, the Coordinator uses 8529
(=8528+1), the DB-Server 8530 (=8528+2), and the Agent 8531 (=8528+3).
You can change the default Starter port with the
[`--starter.port` option](programs-starter-options.html).

If two or more of the `arangodb` instances run on the same machine,
you have to use the `--starter.data-dir` option to let each use a different
directory.

The Starter tries to find the ArangoDB executable (`arangod`) and the
other installation files automatically. If this fails, use the
`--server.arangod` and `--server.js-dir` options to manually point it to them.

For a full list of options of the _Starter_, see the
[Starter options](programs-starter-options.html).

## Using multiple join arguments

It is allowed to use multiple `--starter.join` arguments.
This eases scripting. For example, you can run a command like below on hosts
A, B, and C (replace `A`, `B`, and `C` with the host names):

```bash
arangodb ... --starter.join A,B,C
```

Note: `arangodb --starter.join A,B,C` is equal to
`arangodb --starter.join A --starter.join B --starter.join C`.

During the bootstrap phase of the cluster, the Starters all choose the leader
Starter ("master") based on the list of the given `--starter.join` arguments.

The leader Starter is chosen as follows:

- If there are no `--starter.join` arguments, the Starter becomes the leader.
- If there are multiple `--starter.join` arguments, these arguments are sorted.
  If a Starter is the first in this sorted list, it becomes the leader.
- In all other cases, the Starter becomes a follower.

Note: Once the bootstrap phase is over (all `arangod` processes have started and
are running), the bootstrap phase ends and the Starters use the ArangoDB Agency
to elect a leader for the runtime phase.

## Using the ArangoDB Starter in Docker

The _Starter_ can also be used to launch clusters based on ArangoDB
_Docker_ containers.

If you use `arangodb` in a Docker container, it runs all servers in a Docker
using the `arangodb/arangodb:latest` Docker image by default. If you wish to run
a specific Docker image for the servers, specify it using the `--docker.image`
option.

If you use Docker, it is important to care about the volume mappings on
the container. Typically, you start the executable in Docker with the following
commands:

```bash
export IP=<IP of docker host>
docker volume create arangodb1
docker run -it --name=adb1 --rm -p 8528:8528 \
    -v arangodb1:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    arangodb/arangodb-starter \
    --starter.address=$IP
```

If you are running on Linux, it is also possible to use a host-mapped volume
instead of creating a Docker volume. Make sure to map it to `/data`.

To run the other instances, adjust the volume and container names and
additionally specify the join address of the first instance (replace `N` with
the respective number and `A` with the host address):

```bash
export IP=<IP of docker host>
docker volume create arangodbN
docker run -it --name=adbN --rm -p 8528:8528 \
    -v arangodbN:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    arangodb/arangodb-starter \
    --starter.address=$IP \
    --starter.join A
```

If you use the Enterprise Edition Docker image, you have to set the license key
in an environment variable by adding this option to the above `docker` command
(place `<the-key>` with the actual license key):

```
    -e ARANGO_LICENSE_KEY=<the-key>
```

The Starter hands the license key to the Docker containers it launches for ArangoDB.

You can get a free evaluation license key by visiting:

[www.arangodb.com/download-arangodb-enterprise/](https://www.arangodb.com/download-arangodb-enterprise/){:target="_blank"}

**TLS verified Docker services**

Oftentimes, one needs to harden Docker services using client certificate 
and TLS verification. The Docker API allows subsequently only certified access.
As the ArangoDB starter starts the ArangoDB cluster instances using this Docker API, 
it is mandatory that the ArangoDB starter is deployed with the proper certificates
handed to it, so that the above command is modified as follows:

```bash
export IP=<IP of docker host>
export DOCKER_CERT_PATH=/path/to/certificate
docker volume create arangodbN
docker run -it --name=adbN --rm -p 8528:8528 \
    -v arangodbN:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $DOCKER_CERT_PATH:$DOCKER_CERT_PATH \
    -e DOCKER_TLS_VERIFY=1 \
    -e DOCKER_CERT_PATH=$DOCKER_CERT_PATH \
    arangodb/arangodb-starter \
    --starter.address=$IP
```

Note that the environment variables `DOCKER_TLS_VERIFY` and `DOCKER_CERT_PATH` 
as well as the additional mountpoint containing the certificate have been added above. 
The assignment of `DOCKER_CERT_PATH` is optional, in which case it 
is mandatory that the certificates are stored in `$HOME/.docker`. So
the command would then be as follows:

```bash
export IP=<IP of docker host>
docker volume create arangodbN
docker run -it --name=adbN --rm -p 8528:8528 \
    -v arangodbN:/data \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /path/to/cert:/root/.docker \
    -e DOCKER_TLS_VERIFY=1 \
    arangodb/arangodb-starter \
    --starter.address=$IP
```

## Under the Hood

The first `arangodb` you run becomes the _leader_ of your _Starter_ setup
(also called _master_), the other `arangodb` instances become the
_followers_ of your _Starter_ setup. This is not to be confused with the
the Leader/Follower replication of ArangoDB. The terms above refer to the _Starter_ setup.

The _Starter_ _leader_ determines which ArangoDB server processes to launch on which
_Starter_ _follower_, and how they should communicate.

It then launches the server processes and monitors them. Once it has detected
that the setup is complete, you get the prompt.

The _Starter_ _leader_ saves the setup for subsequent starts.
