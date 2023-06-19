---
layout: default
description: You can use ArangoDB on macOS via Docker images, and run client tools using tar.gz archives
title: Installing ArangoDB on macOS
---
Installing ArangoDB on macOS
============================

You can use ArangoDB on macOS with [Docker images](#docker) and run the client
tools using [_tar.gz_ archives](#installing-using-the-archive).

{% hint 'tip' %}
Starting from version 3.10.0, ArangoDB has native support for the ARM
architecture and can run on Apple silicon (e.g. M1 chips).
{% endhint %}

{% hint 'info' %}
Running production environments on macOS is not supported.
{% endhint %}

{% hint 'info' %}
Starting from version 3.11.0, ArangoDB Server binaries for macOS are not
provided anymore.
{% endhint %}

## Docker

The recommended way of using ArangoDB on macOS is to use the
[ArangoDB Docker images](https://www.arangodb.com/download-major/docker/){:target="_blank"}
with, for instance, [Docker Desktop](https://www.docker.com/products/docker-desktop/){:target="_blank"}.

See the documentation on [Docker Hub](https://hub.docker.com/_/arangodb){:target="_blank"},
as well as the [Deployments](architecture-deployment-modes.html) section about
different deployment modes and methods including Docker containers.

## Installing the client tools using the archive

1. Visit the official [Download](https://www.arangodb.com/download){:target="_blank"}
   page of the ArangoDB website and download the client tools _tar.gz_ archive for macOS.

2. You may verify the download by comparing the SHA256 hash listed on the website
   to the hash of the file. For example, you can you run `openssl sha256 <filename>`
   or `shasum -a 256 <filename>` in a terminal.

3. Extract the archive by double-clicking the file.
