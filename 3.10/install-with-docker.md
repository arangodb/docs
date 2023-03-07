---
layout: default
description: >-
  You can use Docker images to run ArangoDB in containers on Linux, macOS, and Windows
---
# Install with Docker

{{ page.description }}
{:class="lead"}

The recommended way of using ArangoDB is via ArangoDB Docker images with,
for instance, [Docker Desktop](https://www.docker.com/products/docker-desktop/){:target="_blank"}. 

You can choose one of the following:
- [`arangodb` official Docker images](https://hub.docker.com/_/arangodb){:target="_blank"},
  verified and published by Docker.
- [`arangodb/arangodb` Docker images](https://hub.docker.com/r/arangodb/arangodb){:target="_blank"}, 
  maintained and directly published by ArangoDB on a regular basis.

## Start an ArangoDB instance

In order to start an ArangoDB instance, run:

```
unix> docker run -e ARANGO_RANDOM_ROOT_PASSWORD=1 -d --name arangodb-instance arangodb
```

Thhis creates and launches the ArangoDB Docker instance as a background process.
The identifier of the process is printed. By default, ArangoDB listens on port
`8529` for requests and the image includes `EXPOSE 8529`. If you link an
application container, it is automatically available in the linked container.

In order to get the IP ArangoDB listens on, run:

```
unix> docker inspect --format '{{ .NetworkSettings.IPAddress }}' arangodb-instance
```

## Using the instance

To use the running instance from an application, link the container:

```
unix> docker run -e ARANGO_RANDOM_ROOT_PASSWORD=1 --name my-app --link arangodb-instance:db-link arangodb
```

This uses the instance named `arangodb-instance` and links it into the
application container. The application container contains the following
environment variables, which can be used to access the database.

```
DB_LINK_PORT_8529_TCP=tcp://172.17.0.17:8529
DB_LINK_PORT_8529_TCP_ADDR=172.17.0.17
DB_LINK_PORT_8529_TCP_PORT=8529
DB_LINK_PORT_8529_TCP_PROTO=tcp
DB_LINK_NAME=/naughty_ardinghelli/db-link
```

## Exposing the port to the outside world

If you want to expose the port to the outside world, run:

```
unix> docker run -e ARANGO_RANDOM_ROOT_PASSWORD=1 -p 8529:8529 -d arangodb
```

ArangoDB listens on port `8529` for requests and the image includes `EXPOSE 8529`.
The `-p 8529:8529` exposes this port on the host.

## Choosing an authentication method

The ArangoDB image provides several authentication methods which can be
specified via environment variables (-e) when using `docker run`.

1. `ARANGO_RANDOM_ROOT_PASSWORD=1`

    Generates a random root password when starting. The password is printed to
    `stdout` (and may be inspected later using `docker logs`).

2. `ARANGO_NO_AUTH=1`
    
    Disables authentication. Useful for testing.

    {% hint 'warning' %}
    Disabling authentication in production environments exposes all your data.
    Make sure that ArangoDB is not directly accessible from the internet.
    {% endhint %}

3. `ARANGO_ROOT_PASSWORD=somepassword`

    Specify your own root password.

{% hint 'note' %}
These authentication methods only apply to single server installations. For
clusters you have to provision the users via the root user with an empty
password once the system is up and running.
{% endhint %}

## Command line options

You can pass arguments to the ArangoDB server by appending them at the end of
the Docker command.

```
unix> docker run -e ARANGO_RANDOM_ROOT_PASSWORD=1 arangodb --help
```

The entry point script starts the `arangod` binary by default and forwards
your arguments.

You may also start other binaries, such as the ArangoDB Shell (`arangosh`):

```
unix> docker run -it arangodb arangosh --server.database myDB ...
```

Note that you need to set up networking for containers if `arangod` runs in one
container and you want to access it with `arangosh` running in another container.
It is easier to execute it in the same container instead.
Use `docker ps` to find out the container ID or the name of a running container:

```
unix> docker ps
CONTAINER ID   IMAGE     COMMAND                 CREATED      STATUS      PORTS                   NAMES
1234567890ab   arangodb  "/entrypoint.sh aran…"  2 hours ago  Up 2 hours  0.0.0.0:8529->8529/tcp  jolly_joker
```

Then, use `docker exec` and the ID or name to run something inside of the
existing container:

```
unix> docker exec -it jolly_joker arangosh
```

For more information, see the [Configuration](administration-configuration.html) section.

## Limiting resource utilization

`arangod` checks the following environment variables, which can be used to
restrict how much memory and how many CPU cores it should use.

- `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY` *(introduced in v3.6.3)*

    This variable can be used to override the automatic detection of the total
    amount of RAM present in the system. You can specify a decimal number
    (in bytes). Furthermore, if `G` or `g` is appended, the value is multiplied
    by `2^30`. If `M` or `m` is appended, the value is multiplied by `2^20`.
    If `K` or `k` is appended, the value is multiplied by `2^10`. That is, `64G`
    meaning 64 gigabytes.

    The total amount of RAM detected is logged as an INFO message at server start.
    If the variable is set, the overridden value is shown. Various default sizes
    are calculated based on this value (i.e. RocksDB buffer cache size).

    Setting this option can be useful in two cases:

    1. If `arangod` is running in a container and its cgroup has a RAM limitation,
    then you should specify this limitation in this environment variable, since
    it is currently not automatically detected.

    2. If `arangod` is running alongside other services on the same machine and
    thus sharing the RAM with them, you should limit the amount of memory using
    this environment variable.

- `ARANGODB_OVERRIDE_DETECTED_NUMBER_OF_CORES` *(introduced in v3.7.1)*

    This variable can be used to override the automatic detection of the number
    of CPU cores present on the system.

    The number of CPU cores detected is logged as an INFO message at server start.
    If the variable is set, the overridden value is shown. Various default values
    for threading are calculated based on this value.

    Setting this option is useful if `arangod` is running in a container or alongside
    other services on the same machine and shall not use all available CPUs.

## Using host directories

You can map the container's volumes to a directory on the host, so that the data
is kept between the runs of the container.

```
unix> mkdir /tmp/arangodb
unix> docker run -e ARANGO_RANDOM_ROOT_PASSWORD=1 -p 8529:8529 -d \
          -v /tmp/arangodb:/var/lib/arangodb3 \
          arangodb
```

This uses the `/tmp/arangodb directory` of the host as database directory for
ArangoDB inside the container.

## Using a data container

Alternatively, you can create a container holding the data and use this data
container in your ArangoDB container.

```
unix> docker create --name arangodb-persist arangodb true
```

```
unix> docker run -e ARANGO_RANDOM_ROOT_PASSWORD=1 --volumes-from arangodb-persist -p 8529:8529 arangodb
```

If you want to save a few bytes, you can alternatively use [busybox](https://hub.docker.com/_/busybox){:target="_blank"}
or [alpine](https://hub.docker.com/_/alpine){:target="_blank"} for creating the volume containers. 
Note that you need to provide the used volumes in this case.

```
unix> docker run -d --name arangodb-persist -v /var/lib/arangodb3 busybox true
```

## Using as a base image

If you are using the image as a base image, make sure to wrap any CMD in the
[exec](https://docs.docker.com/engine/reference/builder/#cmd){:target="_blank"} form. 
Otherwise, the default entry point will not do its bootstrapping work.

When deriving the image, you can control the instantiation via putting files
into `/docker-entrypoint-initdb.d/`.

- `*.sh` - files having this extension are run as a bash shell script.
- `*.js` - files having this extension are executed with `arangosh`. You can
  specify additional `arangosh` arguments via the `ARANGOSH_ARGS` environment variable.
- `dumps/` - in this directory you can place subdirectories containing database
  dumps generated using [arangodump](programs-arangodump.html).
  They can be restored using [arangorestore](programs-arangorestore.html).