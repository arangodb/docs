---
layout: default
description: Download an installation package from arangodb.com/download
---
Installation
============

Head to [arangodb.com/download](https://www.arangodb.com/download/){:target="_blank"},
select your operating system and download ArangoDB. You may also follow
the instructions on how to install with a package manager, if available.

If you installed a binary package under Linux, the server is
automatically started.

If you installed ArangoDB using homebrew under macOS, start the
server by running `/usr/local/sbin/arangod`. It is a symlink for
`/usr/local/Cellar/arangodb/<VERSION>/sbin/arangod`. If it is missing or broken,
you may regenerate it with `brew link --overwrite arangodb`.
On newer devices with Apple silicon (M1 and later), it may be located at
`/opt/homebrew/Cellar/arangodb/<VERSION>/sbin/arangod` instead.

If you installed ArangoDB under Windows as a service, the server is
automatically started. Otherwise, run the `arangod.exe` located in the
installation folder's `bin` directory. You may have to run it as administrator
to grant it write permissions to `C:\Program Files`.

For more in-depth information on how to install ArangoDB, as well as available
startup parameters, installation in a cluster and so on, see
[Installation](installation.html) and
[Deployment](deployment.html).

Securing the installation
-------------------------

The default installation contains one database *_system* and a user
named *root*.

Debian based packages and the Windows installer will ask for a
password during the installation process. Red-Hat based packages will
set a random password. For all other installation packages you need to
execute

```
shell> arango-secure-installation
```

This will ask for a root password and sets this password.

{% hint 'warning' %}
The password that is set for the root user during the installation of the ArangoDB
package has **no effect** in case of deployments done with the _ArangoDB Starter_.
See [Securing Starter Deployments](security-starter.html) instead.
{% endhint %}
