---
layout: default
description: This is a walkthrough to install ArangoDB on Windows. You will find two possible methods to do so, automatically or manually. 
title: Installing ArangoDB on Windows
---
Installing ArangoDB on Windows
==============================

You can install ArangoDB on Windows (64-bit) using different methods:

- Automated, using an installation wizard ("installer")
  - [attended](#installing-using-the-installer) (GUI)
  - [unattended](#unattended-installation-using-the-installer) (command line)
- Manually, using a [ZIP archive](#installing-using-the-zip-archive)

Visit the official [Download](https://www.arangodb.com/download){:target="_blank"}
page of the ArangoDB web site.

You may verify the download by comparing the SHA256 hash listed on the website
to the hash of the file. For example, you can you run `openssl sha256 <filename>`
or `certutil -hashfile <filename> sha256` in a terminal.

{% hint 'info' %}
Running production environments on Windows is not supported.
{% endhint %}

Installing using the Installer
------------------------------

The default installation directory is `%PROGRAMFILES%\ArangoDB-3.x.x`
(multi-user) or `%LOCALAPPDATA%\ArangoDB-3.x.x\` (single-user). You may change
it during the installation process. In the following description, we will assume
that ArangoDB has been installed in the location `<ROOTDIR>`.

You have to be careful when choosing an installation directory. You need either
write permission to this directory or you need to modify the configuration file
for the server process. In the latter case the database directory and the Foxx
directory have to be writable by the user.

### Single- and Multi-User Installation

There are two main modes for the installer of ArangoDB.
The installer lets you select:

- multi-user installation (default; admin privileges required)
  Will install ArangoDB as service.
- single-user installation
  Allow to install ArangoDB as normal user.
  Requires manual starting of the database server.

### Installation Options

The checkboxes allow you to chose weather you want to:

- chose custom install paths
- do an automatic upgrade
- keep an backup of your data
- add executables to path
- create a desktop icon

or not.

#### Custom Install Paths

This checkbox controls if you will be able to override
the default paths for the installation in subsequent steps.

The default installation paths are:

Multi-User Default:
- Installation: `%PROGRAMFILES%\ArangoDB-3.x.x`
- DataBase:     `%PROGRAMDATA%\ArangoDB`
- Foxx Service: `%PROGRAMDATA%\ArangoDB-apps`

Single-User Default:
- Installation: `%LOCALAPPDATA%\ArangoDB-3.x.x\`
- DataBase:     `%LOCALAPPDATA%\ArangoDB\`
- Foxx Service: `%LOCALAPPDATA%\ArangoDB-apps\`

The environment variables are typically:
- `%PROGRAMFILES%`: `C:\Program Files`
- `%PROGRAMDATA%`: `C:\ProgramData`
- `%LOCALAPPDATA%`: `C:\Users\<YourName>\AppData\Local`

We are not using the roaming part of the user's profile, because doing so
avoids the data being synced to the windows domain controller.

#### Automatic Upgrade

If this checkbox is selected the installer will attempt to perform an automatic
update. For more information please see
[Upgrading on Windows](upgrading-osspecific-info-windows.html).

#### Keep Backup

Select this to create a backup of your database directory during automatic upgrade.
The backup will be created next to your current database directory suffixed by
a time stamp.

#### Add to Path

Select this to add the binary directory to your system's path (multi-user
installation) or user's path (single-user installation).

#### Desktop Icon

Select if you want the installer to create Desktop Icons that let you:

- access the web interface
- start the command-line client (arangosh)
- start the database server (single-user installation only)

### Starting

If you installed ArangoDB for multiple users (as a service), it is automatically
started. Otherwise you need to use the shortcut that was created on your desktop
(depending on the installer settings) or by running the executable `arangod.exe`
located in `<ROOTDIR>\usr\bin`. It will use the configuration file `arangod.conf`
located in `<ROOTDIR>\etc\arangodb3`, which you can adjust to your needs.

Please check the output of the `arangod.exe` executable before continuing.
If the server started successfully, you should see a line
`ArangoDB is ready for business. Have fun!` at the end of its output.

You can access the administration web interface by pointing your web browser to
the following address:

```
http://127.0.0.1:8529/
```

### Advanced Starting

If you want to provide your own start scripts, you can set the environment
variable `ARANGODB_CONFIG_PATH`. This variable should point to a directory
containing the configuration files.

### Using the Client

To connect to an already running ArangoDB server instance, there is a shell
`arangosh.exe` located in `<ROOTDIR>\usr\bin`. This starts a shell that can be
used – amongst other things – to administer and query a local or remote
ArangoDB server.

Note that `arangosh.exe` does NOT start a separate server, it only starts the
shell. To use it you must have a server running somewhere, e.g. by using
the `arangod.exe` executable.

`arangosh.exe` uses configuration from the file `arangosh.conf` located in
`<ROOTDIR>\etc\arangodb3\`. Please adjust this to your needs if you want to
use different connection settings etc.

### Uninstalling

To uninstall the Arango server application you can use the windows control panel
(as you would normally uninstall an application). Note however, that any data
files created by the ArangoDB server will remain as well as the `<ROOTDIR>`
directory. To complete the uninstallation process, remove the data files and
the `<ROOTDIR>` directory manually.

Unattended installation using the installer
-------------------------------------------

The NSIS-based installer requires user interaction by default, but it also
offers a [Silent Mode](https://nsis.sourceforge.io/Docs/Chapter4.html#silent){:target="_blank"}
which allows you to run it non-interactively from the command line:

    ArangoDB3-3.x.x_win64.exe /S ...

You can run the uninstaller in Silent Mode:

    Uninstall.exe /S ...

All choices available in the GUI can be passed as arguments. The options can
be specified like `/OPTIONNAME=value`.

### Supported options

*For Installation*:

- `/PASSWORD` - Set the password for the `root` user. If this option is not set
  but a persistent environment variable `PASSWORD` is, then its value will be
  used as password.
- `/INSTDIR` - Installation directory. A directory that you have access to.
- `/DATABASEDIR` - Database directory. A directory that you have access to
  and the databases should be created in.
- `/APPDIR` - Foxx Services directory. A directory that you have access to.
- `/INSTALL_SCOPE_ALL`:
  - `1` - Install for all users, as well as install a Windows service called
    `arangodb` and launch it.
  - `0` - Install for the current user only. Does not start the server
    automatically, but creates a shortcut on the desktop to start it.
- `/DESKTOPICON`
  - `0` - Do not create any shortcuts
  - `1` - Create shortcuts on the desktop for arangosh and the web interface
- `/UPGRADE`
  - `1` - Automatically upgrade existing ArangoDB databases
  - `0` - No upgrade of databases
- `/BACKUP_ON_UPGRADE`
  - `1` - Keep a backup of the databases if `/UPGRADE=1` is set
  - `0` - No backup
- `/PATH`
  - `0` - Do not add ArangoDB to the PATH environment variable
  - `1`:
    - With `/INSTALL_SCOPE_ALL=1`: add it to the path for all users
    - With `/INSTALL_SCOPE_ALL=0`: add it to the path of the currently logged in users

*For Uninstallation*:

- `/PURGE_DB`
  - `0` - Database files will remain on the system
  - `1` - Database files ArangoDB created during its lifetime will be removed, too.

Installing using the ZIP archive
--------------------------------

Not all users prefer the guided _Installer_ to install ArangoDB. In order to have a
[portable application](http://en.wikipedia.org/wiki/Portable_application){:target="_blank"}, or easily
start different ArangoDB versions on the same machine, and/or for the maximum flexibility,
you might want to install using the _ZIP_ archive ([XCOPY deployment](http://en.wikipedia.org/wiki/XCOPY_deployment){:target="_blank"}).

### Unzip the archive

Open an explorer, choose a place where you would like ArangoDB to be, and extract the
archive there. It will create its own top-level directory with the version number in the name.

### Edit the configuration

*This step is optional.*

If the default configuration of ArangoDB does not suite your needs,
you can edit `etc\arangodb3\arangod.conf` to change or add configuration options.

### Start the Server

After installation, you may start ArangoDB in several ways. The exact start-up command
depends on the type of ArangoDB deployment you are interested in
(_Single Instance_, _Active Failover_ or _Cluster_).

Please refer to the [_Deployment_](deployment.html) chapter for details.
