---
layout: default
description: This overview will step you through on how to install ArangoDB version 3.9.0 or later.
title: Installing ArangoDB on Windows
redirect_from:
  - cookbook/administration-nsissilent-mode.html # 3.5 -> 3.5
---

# Installing  ArangoDB Community Edition on Windows

>Please note that  [**ArangoDB Oasis**](https://cloud.arangodb.com/home) is our hosted ArangoDB service option in the cloud which requires no installation on your machine and we offer a free 14–day trial to get you started.

## Overview

This overview will step you through on how to install ArangoDB version 3.9.0 or later.

There are three ways to install ArangoDB version 3.9.0 on Windows:

 1. Using an installation wizard
 2. Using Command-line 
 3. Using a ZIP package

###  Install ArangoDB with installation wizard 

>Download the ArangoDB installer for the Community Version 3.9.0 at our [*Download Center*](https://www.arangodb.com/download-major/ )
>>Click on the **Windows** logo 

There are two options for downloads **Server** and **Client Tools**. **Server** is for a standard set up that uses an insalllation wizard and the **Client Tools** contains Arangosh and Arangodump.

Use **Client Tools**  if you are already running ArangoDB on a different machine and want to connect to that server from a client machine.

As an alternative, there is a **Zip** package containing the server, and client tools which can be unpacked in any location.

 1. To begin installation:
	 - Click **Server  3.9.0**, and a download will begin 
 2. Run the Arango DB installation wizard 
 	 - Check your `downloads` folder, the default location of the `ArangoDB.exe` will be the `downloads` folder on your machine 
	 - Double-click the `ArangoDB.exe` file  
 4. Follow the steps in  ArangoDB the Installation Wizard:
	 - Click **Next**, and read and agree terms and conditions 
	 -  If you Tick  **All Users** . This will install ArangoDB as a service 
	 -  When you tick **For the current user** ArangoDB installs as a ***single user***. And it will require a restart of the database server	
	 - Leave the tick boxes as they are if you are happy for ArangoDB to install with its default settings
	 - Click **Next**, a window will appear where you can create a new password 
	 - Enter a new password, and click **Next**. The ***default username*** is ***root***, so make a note of that while you creating a new password 
	 - Click **Next** and decide if you would like to make a shortcut for ArangoDB on your desktop
	 - Click **Install**
	 - Click **Finish** and a window on your default browser will open 
	 - Enter the password you created and leave ***root*** as the default username.
	 - Click **Login**
	 - Select ``DB:_system`` as the default
	 
This will start your instance of ArangoDB.


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

If you want to provide your own start scripts, you can set the environment
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
(_Single Instance_, _Active Failover_ or _Cluster_).

Please refer to the [_Deployment_](deployment.html) chapter for details.
