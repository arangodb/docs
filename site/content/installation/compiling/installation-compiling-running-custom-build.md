---
fileID: installation-compiling-running-custom-build
title: Running a custom build
weight: 1210
description: 
layout: default
---
Once you built a custom version of ArangoDB (see
[Compiling]()), you may want to run it using
existing data or possibly in isolation from an existing installation.

We assumes that you are in the root directory of the ArangoDB distribution
and compiling has successfully finished.

Note that this guide is for Linux only.

## Running in isolation

This part shows how to run your custom build with an empty database directory

{{< tabs >}}
{{% tab name="bash" %}}
```bash

mkdir /tmp/arangodb


bin/arangod \
    --configuration etc/relative/arangod.conf\
     --database.directory /tmp/arangodb
```
{{% /tab %}}
{{< /tabs >}}

## Running with data

This part shows how to run your custom build with the config and data from a pre-existing stable installation.

{{% hints/danger %}}
ArangoDB's developers may change the db file format and after running with a
changed file format, there may be no way back. Alternatively you can run your
build in isolation and [dump](../../programs-tools/arangodump/) and
[restore](../../programs-tools/arangorestore/) the data from the
stable to your custom build.
{{% /hints/danger %}}

When running like this, you must run the db as the arangod user (the default
installed by the package) in order to have write access to the log, database
directory etc. Running as root will likely mess up the file permissions - good
luck fixing that!

{{< tabs >}}
{{% tab name="bash" %}}
```bash

su


su - arangod
bin/arangod --configuration /etc/arangodb/arangod.conf
```
{{% /tab %}}
{{< /tabs >}}
