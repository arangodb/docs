---
layout: default
description: The ArangoDB Starter provides a lot of options to control various aspects of the cluster or database you want to run
---
# ArangoDB Starter Options

The ArangoDB Starter provides a lot of options to control various aspects
of the cluster or database you want to run.

Below you'll find a list of all options and their semantics.

## Common options

- `--starter.data-dir=path`

`path` is the directory in which all data is stored. (default "./")

In the directory, a `setup.json` file is created, which is used for restarts,
as well as a directory for each instance that runs on this machine.
Different instances of `arangodb` must use different data directories.

- `--starter.join=address`

Join a cluster with the leader (_master_) Starter at address `address` (default "").
Address can be an host address or name, followed with an optional port.

E.g. these are valid arguments.

```bash
--starter.join=localhost
--starter.join=localhost:5678
--starter.join=192.168.23.1:8528
--starter.join=192.168.23.1
```

- `--starter.local`

Start a local (test) cluster. Since all servers are running on a single machine
this is really not intended for production setups.

- `--starter.mode=cluster|single|activefailover`

Select what kind of database configuration you want.
This can be a `cluster` configuration (which is the default),
a `single` server configuration or a `activefailover` configuration with
2 single services configured to take over when needed.

Note that when running a `single` server configuration you lose all
high availability features that a cluster provides you.

- `--cluster.agency-size=int`

number of Agents in Agency (default 3).

This number has to be positive and odd, and anything beyond 5 probably
does not make sense. The default 3 allows for the failure of one Agent.

- `--starter.address=addr`

`addr` is the address under which this server is reachable from the
outside.

Use this option only in the case that `--cluster.agency-size` is set to 1. 
In a single Agent setup, the sole starter has to start on its own with
no reliable way to learn its own address. Using this option, the leader (_master_)
Starter knows under which address it can be reached from the outside. If you specify
`localhost` here, then all instances must run on the local machine.

- `--starter.host=addr`

`addr` is the address to which this server binds. (default "0.0.0.0")

Usually there is no need to specify this option.
Only when you want to bind the starter to specific network device,
would you set this.
Note that setting this option to `127.0.0.1` makes this starter
unreachable for other starters, which is only allowed for
`single` server deployments or when using `--starter.local`.

- `--docker.image=image`

`image` is the name of a Docker image to run instead of the normal
executable. For each started instance a Docker container is launched.
Usually one would use the Docker image `arangodb/arangodb`.

- `--docker.container=containerName`

`containerName` is the name of a Docker container that is used to run the
executable. If you do not provide this argument but run the starter inside
a Docker container, the starter auto-detects its container name.

## Authentication options

The arango starter by default creates a cluster that uses no authentication.

To create a cluster that uses authentication, create a file containing a random
JWT secret (single line) and pass it through the `--auth.jwt-secret` option.

For example:

```bash
arangodb create jwt-secret --secret=jwtSecret
arangodb --auth.jwt-secret=./jwtSecret
```

All starters used in the cluster must have the same JWT secret.

To use a JWT secret to access the database, use `arangodb auth header`.
See [Using authentication tokens](programs-starter-security.html#using-authentication-tokens)
for details.

## SSL options

The arango starter by default creates a cluster that uses no unencrypted
connections (no SSL).

To create a cluster that uses encrypted connections, you can use an existing
server key file (.pem format) or let the starter create one for you.

To use an existing server key file use the `--ssl.keyfile` option like this:

```bash
arangodb --ssl.keyfile=myServer.pem
```

Use [`arangodb create tls keyfile`](programs-starter-security.html) to create a
server key file.

To let the starter created a self-signed server key file, use the
`--ssl.auto-key` option like this:

```bash
arangodb --ssl.auto-key
```

All starters used to make a cluster must be using SSL or not.
You cannot have one starter using SSL and another not using SSL.

If you start a starter using SSL, its own HTTP server (see API) also
uses SSL.

Note that all starters can use different server key files.

Additional SSL options:

- `--ssl.cafile=path`

Configure the servers to require a client certificate in their communication to
the servers using the CA certificate in a file with given path.

- `--ssl.auto-server-name=name`

The name of the server that is used in the self-signed certificate created by
the `--ssl.auto-key` option.

- `--ssl.auto-organization=name`

The name of the server that is used in the self-signed certificate created by
the `--ssl.auto-key` option.

## Passing through other database options

Options for `arangod` that are not supported by the starter can still be passed to
the DB-Servers using a pass through option.
Every option that start with a pass through prefix is passed through to the
commandline of one or more server instances.

- `--args.all.<section>.<key>=<value>` is passed as
  `--<section>.<key>=<value>` to all servers started by this starter.
- `--args.coordinators.<section>.<key>=<value>` is passed as
  `--<section>.<key>=<value>` to all Coordinators started by this starter.
- `--args.dbservers.<section>.<key>=<value>` is passed as
  `--<section>.<key>=<value>` to all DB-Servers started by this starter.
- `--args.agents.<section>.<key>=<value>` is passed as
  `--<section>.<key>=<value>` to all Agents started by this starter.

Some options are essential to the function of the starter.
Therefore these options cannot be passed through like this.

Example:

To activate HTTP request logging at debug level for all Coordinators, use a
command like this:

```bash
arangodb --args.coordinators.log.level=requests=debug
```

## Passing through `arangosync` options

Options for `arangosync` that are not supported by the starter can still be
passed to the syncmasters & syncworkers using a pass through option.
Every option that start with a pass through prefix is passed through to the
commandline of one or more `arangosync` instances.

- `--args.sync.<section>.<key>=<value>` is passed as
  `--<section>.<key>=<value>` to all arangosync instances started by this starter.
- `--args.syncmasters.<section>.<key>=<value>` is passed as
  `--<section>.<key>=<value>` to all syncmasters started by this starter.
- `--args.syncworkers.<section>.<key>=<value>` is passed as
  `--<section>.<key>=<value>` to all syncworkers started by this starter.

Some options are essential to the function of the starter.
Therefore these options cannot be passed through like this.

Example:

To set a custom token TTL for direct message queue, use a command like this.

```bash
arangodb --args.syncmasters.mq.direct-token-ttl=12h ...
```

## Passing environment variables

Environment variables by default gonna be passed from arangodb process by
default. However, variables can be overridden using arangodb command line option.

- `--envs.<group>.<env name>=<value>`
- `--envs.all.ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=2G` sets
  `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=2G` for all instances started by this starter.
- `--envs.coordinators.ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=4G` sets
  `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=4G` for all Coordinators started by this starter.
- `--envs.dbservers.ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=8G` sets
  `ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=8G` for all DB-Servers started by this starter.

Example:

```bash
arangodb --envs.all.ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=2G --envs.coordinators.ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=4G --envs.dbservers.ARANGODB_OVERRIDE_DETECTED_TOTAL_MEMORY=8G ...
```

## Datacenter-to-Datacenter Replication options

- `--starter.sync=bool`

If set, the Starter also starts `arangosync` instances.

- `--sync.start-master=bool`

Should an ArangoSync master instance be started (only relevant if `--starter.sync`
is enabled, defaults to `true`)

- `--sync.start-worker=bool`

Should an ArangoSync worker instance be started (only relevant if `--starter.sync`
is enabled, defaults to `true`)

- `--sync.monitoring.token=<token>`

Bearer token used to access ArangoSync monitoring endpoints.

- `--sync.master.jwt-secret=<secret>`

Path of file containing JWT secret used to access the Sync Master (from Sync Worker).

- `--sync.mq.type=<message queue type>`

Type of message queue used by the Sync Master (defaults to "direct").

- `--sync.server.keyfile=<path of keyfile>`

TLS keyfile of local sync master.

- `--sync.server.client-cafile=<path of CA certificate>`

CA Certificate used for client certificate verification.

## Miscellaneous options

- `--version`

Show the version of the starter.

- `--starter.port=int`

The network port for the Starter (default 8528).
This is the port used for communication of the `arangodb` instances
amongst each other.

The Starter uses the subsequent ports for the `arangod` processes it starts.

- `--starter.disable-ipv6=bool`

If disabled, the starter configures the `arangod` servers
to bind to address `0.0.0.0` (all IPv4 interfaces)
instead of binding to `[::]` (all IPv4 and all IPv6 interfaces).

This is useful when IPv6 has actively been disabled on your machine.

- `--server.arangod=path`

The path to the `arangod` executable (default varies from platform to
platform, an executable is searched in various places).

This option only has to be specified if the standard search fails.

- `--server.js-dir=path`

The path to JavaScript library directory (default varies from platform to platform,
this is coupled to the search for the executable).

This option only has to be specified if the standard search fails.

- `--server.storage-engine=rocksdb`

Sets the storage engine used by the `arangod` servers.
Defaults to `rocksdb`, which is also the only available option for
ArangoDB v3.7 and above.

- `--cluster.start-coordinator=bool`

This indicates whether or not a Coordinator instance should be started
(default true).

- `--cluster.start-dbserver=bool`

This indicates whether or not a DB-Server instance should be started
(default true).

- `--server.rr=path`

The path to the `rr` executable to use if non-empty (default ""). Expert and
debugging only.

- `--log.color=bool`

If set to `true`, console log output is colorized.
The default is `true` when a terminal is attached to stdin,
`false` otherwise or when running on Windows.

- `--log.console=bool`

If set to `true`, log output is written to the console (default `true`).

- `--log.file=bool`

If set to `true`, log output is written to the file (default `true`).
The log file, called `arangodb.log`, can be found in the directory
specified using `--log.dir` or if that is not set, the directory
specified using `--starter.data-dir`.

- `--log.verbose=bool`

show more information (default `false`).

- `--log.dir=path`

Set a custom directory to which all log files are written to.
When using the Starter in docker, make sure that this directory is
mounted as a volume for the Starter.

Note: When using a custom log directory, all DB-Server files are named like
`arangod-<role>-<port>.log`. The log for the starter itself is still called
`arangodb.log`.

- `--log.rotate-files-to-keep=int`

Set the number of old log files to keep when rotating log files of server
components (default 5).

- `--log.rotate-interval=duration`

Set the interval between rotations of log files of server components (default `24h`).
Use a value of `0` to disable automatic log rotation.

Note: The starter always performs log rotation when it receives a `HUP` signal.

- `--starter.unique-port-offsets=bool`

If set to true, all port offsets (of follower Starters) are made globally unique.
By default (value is false), port offsets are unique per follower address.

- `--docker.user=user`

`user` is an expression to be used for `docker run` with the `--user`
option. One can give a user id or a user id and a group id, separated
by a colon. The purpose of this option is to limit the access rights
of the process in the Docker container.

- `--docker.endpoint=endpoint`

`endpoint` is the URL used to reach the docker host. This is needed to run
the executable in docker. The default value is "unix:///var/run/docker.sock".

- `--docker.imagePullPolicy=Always|IfNotPresent|Never`

`docker.imagePullPolicy` determines if the Docker image is being pulled from
Docker Hub.

- If set to `Always`, the image is always pulled and an error causes the starter to fail.
- If set to `IfNotPresent`, the image is not pull if it is always available locally.
- If set to `Never`, the image is never pulled (when it is not available locally an error occurs).

The default value is `Always` is the `docker.image` has the `:latest` tag or `IfNotPresent` otherwise.

- `--docker.net-mode=mode`

If `docker.net-mode` is set, all Docker container are started
with the `--net=<mode>` option.

- `--docker.privileged=bool`

If `docker.privileged` is set, all Docker containers are started
with the `--privileged` option turned on.

- `--docker.tty=bool`

If `docker.tty` is set, all Docker containers are started with a TTY.
If the starter itself is running in a docker container without a TTY
this option is overwritten to `false`.

- `--starter.debug-cluster=bool`

If `starter.debug-cluster` is set, the starter records the status codes it receives
upon "server ready" requests to the log. This option is mainly intended for internal testing.

## Starting and stopping in detached mode

If you want the starter to detach and run as a background process, use the `start`
command. This is typically used by developers running tests only.

```bash
arangodb start --starter.local=true [--starter.wait]
```

This command makes the Starter run another starter process in the background
(that starts all ArangoDB servers), wait for its HTTP API to be available and
then exit. The Starter that was started in the background keeps running until
you stop it.

The `--starter.wait` option makes the `start` command wait until all ArangoDB
servers are really up before ending the process of the leader Starter.

To stop a Starter, use this command:

```bash
arangodb stop
```

Make sure to match the arguments given to start the Starter
(`--starter.port` & `--ssl.*`).

## Environment variables

It is possible to replace all commandline arguments for the starter with
environment variables. To do so, set an environment variable named
`ARANGODB_` + `<name of command line option in uppercase>`, where all dashes,
underscores and dots are replaced with underscores.

For example,

```bash
ARANGODB_DOCKER_TTY=true arangodb
```

is equal to:

```bash
arangodb --docker.tty=true
```
