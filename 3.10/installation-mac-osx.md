---
layout: default
description: You can use ArangoDB on macOS via Docker images, DMG packages, or tar.gz archives
title: Installing ArangoDB on macOS
---
Installing ArangoDB on macOS
============================

You can use ArangoDB on macOS in different ways:

- [Docker images](#docker)
- [_DMG_ packages](#package-installation)
- [_tar.gz_ archives](#installing-using-the-archive)

{% hint 'tip' %}
Starting from version 3.10.0, ArangoDB has native support for the ARM
architecture and can run on Apple silicon (e.g. M1 chips).
{% endhint %}

{% hint 'info' %}
Running production environments on macOS is not supported.
{% endhint %}

Docker
------

The recommended way of using ArangoDB on macOS is to use the
[ArangoDB Docker images](https://www.arangodb.com/download-major/docker/){:target="_blank"}
with, for instance, [Docker Desktop](https://www.docker.com/products/docker-desktop/){:target="_blank"}.

See the documentation on [Docker Hub](https://hub.docker.com/_/arangodb){:target="_blank"},
as well as the [Deployments](architecture-deployment-modes.html) section about
different deployment modes and methods including Docker containers.

Package Installation
--------------------

ArangoDB provide a command-line app called *ArangoDB-CLI*.

Visit the official [Download](https://www.arangodb.com/download){:target="_blank"}
page of the ArangoDB website and download the *DMG* Package for macOS.

You may verify the download by comparing the SHA256 hash listed on the website
to the hash of the file. For example, you can you run `openssl sha256 <filename>`
or `shasum -a 256 <filename>` in a terminal. You may also run
`codesign --verify --verbose <filename>` to validate the notarization of an
executable.

You can install the application in your application folder.

Starting the application will start the server and open a terminal window
showing you the log-file.

    ArangoDB server has been started

    The database directory is located at
       '/Users/<user>/Library/ArangoDB/var/lib/arangodb3'

    The log file is located at
       '/Users/<user>/Library/ArangoDB/var/log/arangodb3/arangod.log'

    You can access the server using a browser at 'http://127.0.0.1:8529/'
    or start the ArangoDB shell
       '/Applications/ArangoDB3-CLI.app/Contents/Resources/arangosh'

    Switching to log-file now, killing this windows will NOT stop the server.


    2022-10-21T09:37:01Z [13373] INFO ArangoDB (version 3.9.3 [darwin]) is ready for business. Have fun!

Installing using the archive
----------------------------

1. Visit the official [Download](https://www.arangodb.com/download){:target="_blank"}
   page of the ArangoDB website and download the _tar.gz_ archive for macOS.

2. You may verify the download by comparing the SHA256 hash listed on the website
   to the hash of the file. For example, you can you run `openssl sha256 <filename>`
   or `shasum -a 256 <filename>` in a terminal.

3. Extract the archive by double-clicking the file.
