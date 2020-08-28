---
layout: default
description: This is a walkthrough to install ArangoDB on Windows. You will find two possible methods to do so, automatically or manually. 
title: Installing ArangoDB on Windows
redirect_from:
  - cookbook/administration-nsissilent-mode.html # 3.5 -> 3.5
---
Installing ArangoDB on Windows
==============================

Introduction
------------

There are two possible methods to install ArangoDB on 64-bit Windows systems:

1. Automated, using an _NSIS_ Installer
   - attended (GUI)
   - unattended (command-line, using NSIS silent mode)
2. Manual, using a ZIP archive (XCopy installation)

Both installation methods have their own pros and cons.

{% hint 'info' %}
For production environments we highly recommend using Linux.
{% endhint %}

Installing using the Installer
------------------------------

The default installation directory is *C:\Program Files\ArangoDB-3.x.x*. During the
installation process you may change this. In the following description we will assume
that ArangoDB has been installed in the location *&lt;ROOTDIR&gt;*.

You have to be careful when choosing an installation directory. You need either
write permission to this directory or you need to modify the configuration file
for the server process. In the latter case the database directory and the Foxx
directory have to be writable by the user.

### Single- and Multiuser Installation

There are two main modes for the installer of ArangoDB.
The installer lets you select:

- multi user installation (default; admin privileges required)
  Will install ArangoDB as service.
- single user installation
  Allow to install Arangodb as normal user.
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

Multi User Default:
- Installation: `%PROGRAMFILES%\ArangoDB-3.x.x`
- DataBase:     `%PROGRAMDATA%\ArangoDB`
- Foxx Service: `%PROGRAMDATA%\ArangoDB-apps`

Single User Default:
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

Select this to add the binary directory to your system's path (multi user
installation) or user's path (single user installation).

#### Desktop Icon

Select if you want the installer to create Desktop Icons that let you:

- access the web inteface
- start the commandline client (arangosh)
- start the database server (single user installation only)

### Starting

If you installed ArangoDB for multiple users (as a service) it is automatically
started. Otherwise you need to use the link that was created on you Desktop if
you chose to let the installer create desktop icons or

the executable *arangod.exe* located in
*&lt;ROOTDIR&gt;\bin*. This will use the configuration file *arangod.conf*
located in *&lt;ROOTDIR&gt;\etc\arangodb*, which you can adjust to your needs
and use the data directory *&lt;ROOTDIR&gt;\var\lib\arangodb*. This is the place
where all your data (databases and collections) will be stored by default.

Please check the output of the *arangod.exe* executable before going on. If the
server started successfully, you should see a line `ArangoDB is ready for
business. Have fun!` at the end of its output.

We now wish to check that the installation is working correctly and to do this
we will be using the administration web interface. Execute *arangod.exe* if you
have not already done so, then open up your web browser and point it to the
page:

```
http://127.0.0.1:8529/
```

### Advanced Starting

If you want to provide our own start scripts, you can set the environment
variable *ARANGODB_CONFIG_PATH*. This variable should point to a directory
containing the configuration files.

### Using the Client

To connect to an already running ArangoDB server instance, there is a shell
*arangosh.exe* located in *&lt;ROOTDIR&gt;\bin*. This starts a shell which can be
used – amongst other things – to administer and query a local or remote
ArangoDB server.

Note that *arangosh.exe* does NOT start a separate server, it only starts the
shell. To use it you must have a server running somewhere, e.g. by using
the *arangod.exe* executable.

*arangosh.exe* uses configuration from the file *arangosh.conf* located in
*&lt;ROOTDIR&gt;\etc\arangodb\*. Please adjust this to your needs if you want to
use different connection settings etc.

### Uninstalling

To uninstall the Arango server application you can use the windows control panel
(as you would normally uninstall an application). Note however, that any data
files created by the Arango server will remain as well as the *&lt;ROOTDIR&gt;*
directory. To complete the uninstallation process, remove the data files and
the *&lt;ROOTDIR&gt;* directory manually.

Unattended installation using the installer
-------------------------------------------

The NSIS based installer requires user interaction by default, but it also
offers a [Silent Mode](https://nsis.sourceforge.io/Docs/Chapter4.html#silent){:target="_blank"}
which allows you to run it non-interactively from the command-line:

    cmd> ArangoDB3-3.x.x_win64.exe /S …

All choices available in the GUI can be passed as arguments. The options can
be specified like `/OPTIONNAME=value`.

### Supported options

*For Installation*:

 - `/PASSWORD` - Set the database password. Newer versions will also try to evaluate a PASSWORD environment variable
 
 - `/INSTDIR` - Installation directory. A directory where you have access to.
 - `/DATABASEDIR` - Database directory. A directory where you have access to and the databases should be created.
 - `/APPDIR` - Foxx Services directory. A directory where you have access to.
 - `/INSTALL_SCOPE_ALL`:
    - `1` - AllUsers +Service - launch the arangodb service via the Windows Services, install it for all users
    - `0` - SingleUser - install it into the home of this user, don'launch a service. Eventually create a desktop Icon so the user can do this.
 - `/DESKTOPICON`
   - `0`: Do not create any shortcuts
   - `1`: Create shortcuts on the desktop for arangosh and the web interface
 - `/PATH`
   - `0` - don't alter the PATH environment at all
   - `1`:
     - `INSTALL_SCOPE_ALL` = 1 add it to the path for all users
     - `INSTALL_SCOPE_ALL` = 0 add it to the path of the currently logged in users
 - `/STORAGE_ENGINE` - which storage engine to use (ArangoDB 3.2 onwards)
   - `auto`: Use default storage engine
     (RocksDB from version 3.4 on, MMFiles in 3.3 and older)
   - `mmfiles`: Use MMFiles storage engine
   - `rocksdb`: Use RocksDB storage engine

*For Uninstallation*:
 - `PURGE_DB`
   - `0` - Database files will remain on the system
   - `1` - Database files ArangoDB created during its lifetime will be removed too.

Installing using the ZIP archive (XCopy installation)
-----------------------------------------------------

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
(_Single Instance_, _Master-Slave_, _Active Failover_ or _Cluster_).

Please refer to the [_Deployment_](deployment.html) chapter for details.
