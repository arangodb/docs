---
layout: default
description: ArangoDB Server Database Options
---
# ArangoDB Server Database Options

## Auto upgrade

`--database.auto-upgrade`

Specifying this option will make the server perform a database upgrade instead
of starting the server normally. A database upgrade will first compare the
version number stored in the file VERSION in the database directory with the
current server version.

If the version number found in the database directory is higher than the version
number the server is running, the server expects this is an unintentional
downgrade and will warn about this. Using the server in these conditions is
neither recommended nor supported.

If the version number found in the database directory is lower than the version
number the server is running, the server will check whether there are any
upgrade tasks to perform. It will then execute all required upgrade tasks and
print their statuses. If one of the upgrade tasks fails, the server will exit
with an error. Re-starting the server with the upgrade option will then again
trigger the upgrade check and execution until the problem is fixed.

Whether or not this option is specified, the server will always perform a
version check on startup. Running the server with a non-matching version number
in the VERSION file will make the server refuse to start.

## Directory

`--database.directory directory`

The directory containing the collections and datafiles. Defaults
to */var/lib/arango*. When specifying the database directory, please
make sure the directory is actually writable by the arangod process.

You should further not use a database directory which is provided by a
network filesystem such as NFS. The reason is that networked filesystems
might cause inconsistencies when there are multiple parallel readers or
writers or they lack features required by arangod (e.g. flock()).

`directory`

When using the command line version, you can simply supply the database
directory as argument.

**Examples**

```
> ./arangod --server.endpoint tcp://127.0.0.1:8529 --database.directory
/tmp/vocbase
```

## Database directory state precondition

`--database.required-directory-state state`

Using this option it is possible to require the database directory to be
in a specific state on startup. the options for this value are:

- non-existing: database directory must not exist
- existing: database directory must exist
- empty: database directory must exist but be empty
- populated: database directory must exist and contain specific files already
- any: any directory state allowed

## Force syncing of properties

`--database.force-sync-properties boolean`

Force syncing of collection properties to disk

Force syncing of collection properties to disk after creating a collection
or updating its properties.

If turned off, no fsync will happen for the collection and database
properties stored in `parameter.json` files in the file system. Turning
off this option will speed up workloads that create and drop a lot of
collections (e.g. test suites).

The default is *true*.

## Wait for sync

`--database.wait-for-sync boolean`

Default wait for sync behavior

Default wait-for-sync value. Can be overwritten when creating a new
collection.

The default is *false*.

## More advanced options

`--database.replication-applier flag`

Enable/disable replication applier.

If *false* the server will start with replication appliers turned off,
even if the replication appliers are configured with the *autoStart* option.
Using the command-line option will not change the value of the *autoStart*
option in the applier configuration, but will suppress auto-starting the
replication applier just once.

If the option is not used, ArangoDB will read the applier configuration
from the file *REPLICATION-APPLIER-CONFIG* on startup, and use the value of
the *autoStart* attribute from this file.

The default is *true*.
