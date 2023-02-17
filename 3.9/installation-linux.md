---
layout: default
description: Download an installation or tar package, or use a package manager
title: Installing ArangoDB on Linux
---
Installing ArangoDB on Linux
============================

You can install ArangoDB on most common Linux distributions. The basic
installation steps are:

1. Visit the official [Download](https://www.arangodb.com/download){:target="_blank"}
   page of the ArangoDB web site and choose between Community and
   Enterprise Edition.

2. Click the logo of the distribution that matches your operating system.
   If you use Linux Mint, click Ubuntu or Debian.

3. You can choose between different installation methods and packages:
   - distribution-dependent installation packages (`.rpm`, `.deb`)
   - tar packages (`tar.gz` archives)
   - installation via a package manager

4. Installation and tar packages: You may verify the integrity of a download
   by comparing the SHA256 hash listed on the website with the hash of the file.
   For example, you can you run `openssl sha256 <filename>` or
   `sha256sum <filename>` in a terminal.

   Package manager: package managers generally validate downloaded packages
   automatically. For more information, see
   [SecureApt](https://wiki.debian.org/SecureApt){:target="_blank"} (Debian packages) and
   [Secure distribution of RPM packages](https://www.redhat.com/en/blog/secure-distribution-rpm-packages){:target="_blank"}
   for instance.

5. Installation packages: run `sudo rpm -i <filename>.rpm` or
   `sudo apt install <filename>.deb` respectively in a terminal and follow the
   on-screen instructions.

   Tar packages: unpack the archive, for example by running `tar -xzf <filename>`.

   Package manager: follow the installation instructions on the _Download_ page.
   You may also use another package manager. After setting up the ArangoDB
   repository, you can easily install ArangoDB using _yum_, _aptitude_, _urpmi_,
   or _zypper_.

6. You can start ArangoDB in several ways. The exact start-up command depends on
   your Linux distribution, as well as on the type of ArangoDB deployment you
   are interested in (_Single Server_, _Active Failover_, _Cluster_, _DC2DC_).
   Please refer to the [Deployment](deployment.html) chapter for details.

Securing your Installation
--------------------------

### Debian / Ubuntu

Debian-based packages will ask you to set a password for the `root` user during
installation.

#### Securing Unattended Installations on Debian

For unattended installations, you can set the password using the
[debconf helpers](http://www.microhowto.info/howto/perform_an_unattended_installation_of_a_debian_package.html){:target="_blank"}:

```
echo arangodb3 arangodb3/password password NEWPASSWORD | debconf-set-selections
echo arangodb3 arangodb3/password_again password NEWPASSWORD | debconf-set-selections
```

The commands above should be executed prior to the installation.

### Red-Hat / CentOS

Red-Hat-based packages will set a random password for the `root` user during
installation. The generated random password is printed during the installation.
Please write it down somewhere, or change it to a password of your choice by
executing:

```
ARANGODB_DEFAULT_ROOT_PASSWORD=NEWPASSWORD arango-secure-installation
```

The command should be executed after the installation.

### Other Distributions

For other distributions run `arango-secure-installation` to set the password
for the `root` user.

{% hint 'danger' %}
Please be aware that running `arango-secure-installation` on your ArangoDB
server will remove all current database users but root.
{% endhint %}
