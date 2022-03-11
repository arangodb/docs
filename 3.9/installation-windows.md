---
layout: default
description: This overview will step you through on how to install and start ArangoDB. 
title: Install and start ArangoDB on Windows
redirect_from:
  - cookbook/administration-nsissilent-mode.html # 3.5 -> 3.5
---
# Installing ArangoDB Community Edition on Windows

Please note that [**ArangoDB Oasis**](https://cloud.arangodb.com/home) is our hosted ArangoDB service option in the cloud which requires no installation on your machine and we offer a free 14–day trial to get you started.

There are three ways to install ArangoDB on Windows:

1.  Using the installation wizard.  
2.  Using the command line.   
3.  Using a ZIP package.
    
## Using the Installation Wizard

***Download the wizard***

1.  Download the latest version from **[Download Centre](https://www.arangodb.com/download-major/)**.  
2.  On the platform page, select **Windows**.
3.  Under NSIS packages, select the **server 3.9.0**.
    
***Run and Install ArangoDB***

1.  From your **Downloads** folder, double-click the **ArangoDB.exe** file.   
2.  You will receive a User Account Control notification, choose **Yes**.   
3.  Acknowledge the ArangoDB License Agreement and choose **Agree**.   
4.  You can use it to customize your installation via **Install options**, select or clear the checkboxes of the options you want:  
-   **For all users** installs ArangoDB as service and a web view of the Arango server will start automatically. 
-   **For the current user** will install it as single user but a manual start of the Arango server is required.   
-   **Enable ArangoDB's own log files** 
-   **Choose custom install paths for databases and installation** leave checkboxes selected or clear the checkboxes if you want override the default paths:
    
    For all users:

    -   Installation: `%PROGRAMFILES%\ArangoDB-3.x.x`   
    -   DataBase: `%PROGRAMDATA%\ArangoDB`   
    -   Foxx Service: `%PROGRAMDATA%\ArangoDB-apps`

    For the current user:
    -   Installation: `%LOCALAPPDATA%\ArangoDB-3.x.x\`   
    -   DataBase: `%LOCALAPPDATA%\ArangoDB\`   
    -   Foxx Service: `%LOCALAPPDATA%\ArangoDB-apps\`
        
    Environment variables:
    -   `%PROGRAMFILES%`: `C:\Program Files` 
    -   `%PROGRAMDATA%`: `C:\ProgramData`  
    -   `%LOCALAPPDATA%`: `C:\Users\<YourName>\AppData\Local`

    {% hint 'info' %}  We do not use the roaming part of the user’s profile. To avoids the risk of data being synced to the windows domain controller.  {% endhint %}
    
-   **Automatically update existing ArangoDB database** creates a backup of the database directory during an upgrade. The backup will be created in your current database directory and will suffixed by a time stamp. Visit our section on [Upgrading on Windows](upgrading-osspecific-info-windows.html).  
-   **Keep a backup of databases** keeps a backup of your data.  
-   **Add ArangoDB3 to the Path environment variable** adds the binary directory to your system’s path (For all users or For the current user).  
-   **ArangoDB3 Desktop Icon** will add shortcuts to the Arango server, start the command line client _arangosh_ and starts the database server (For current user installation).
6.  In the password box, enter new a **password**, click **next**.
7.  Select a **Start Menu Folder**. 
8.  Click **Install**.

{% hint 'info' %}
For production environments we highly recommend using Linux.
{% endhint %}

***Install using the installation wizard***

The default installation directory is *C:\Program Files\ArangoDB-3.x.x*. During the
installation process you may change this. In the following description we will assume
that ArangoDB has been installed in the location *&lt;ROOTDIR&gt;*.

You have to be careful when choosing an installation directory. You need either
write permission to this directory or you need to modify the configuration file
for the server process. In the latter case the database directory and the Foxx
directory have to be writable by the user.

***Start the Arango server***

If you installed ArangoDB for current users (as a service) it is automatically
started. Otherwise you need to use the link that was created on you Desktop if
you chose to let the installer create desktop icons or the executable *arangod.exe* located in
*&lt;ROOTDIR&gt;\bin*. 

This will use the configuration file *arangod.conf*
located in *&lt;ROOTDIR&gt;\etc\arangodb*, which you can adjust to your needs
and use the data directory *&lt;ROOTDIR&gt;\var\lib\arangodb*. This is the place
where all your data (databases and collections) will be stored by default.

Please check the output of the *arangod.exe* executable before going on. If the
server started successfully, you should see a line `ArangoDB is ready for
business. Have fun!` at the end of its output.

We can check that the installation is working correctly and to do this we will be using the administration web interface. Execute *arangod.exe* if you have not already done so, then open up your web browser and point it to the page:

```
http://127.0.0.1:8529/
```

***Advanced Starting***

If you want to provide your own start scripts, you can set the environment
variable *ARANGODB_CONFIG_PATH*. This variable should point to a directory
containing the configuration files.

***Using the Client***

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

***Uninstall the ArangoDB***

To uninstall the Arango server application you can use the windows control panel
(as you would normally uninstall an application). Note however, that any data
files created by the Arango server will remain as well as the *&lt;ROOTDIR&gt;*
directory. To complete the process, remove the data files and
the *&lt;ROOTDIR&gt;* directory manually.

## Using the command line

Using command line in [Silent Mode](https://nsis.sourceforge.io/Docs/Chapter4.html#silent){:target="_blank"} will enable you to run the installation without interacting with an installation wizard.

***Install with command line***

1. Open **Command Prompt**. Make sure that Command Prompt is pointing at the location where the **ArangoDB.exe** is located. You might need to move the file depending on how your windows directory is set up.
2. Enter ``cmd> ArangoDB3-3.x.x_win64.exe /S …`` to enter silent mode.

You can set your preferred options listed below by entering `/PASSWORD=your new password`, for example. Below is the list of the other supported options

| Name                 | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `/PASSWORD`          | Creates a new password.                                      |
| `/INSTDIR`           | The directory that you want to install ArangoDB to and which you have access to. |
| `/DATABASEDIR`       | The directory that you have access to and where the database should be created. |
| `/APPDIR`            | Foxx Services directory. A directory that you have access to. |
| `/INSTALL_SCOPE_ALL` | Option `1`, launches the ArangoDB service via Windows Services, and installs it for all users. Option `0` installs ArangoDB on machine of your chosen user. It will also create a desktop icon and the user will be able to launch the service. |
| `/DESKTOPICON`       | Option `0`, will not create any shortcuts on the desktop. Option `1`, will create a shortcut on the desktop for *arangosh* and the web interface. |
| `/Path`              | Option `0` will not alter the PATH environment. Option `1` `INSTALL_SCOPE_ALL` = 1 add it to the path for all users.`INSTALL_SCOPE_ALL`= 0 add it to the path of the currently logged in users. |

***Uninstall using command line***

 `PURGE_DB`
 ------------
`0` - Database files will remain on the system
`1` - Database files ArangoDB created during its lifetime will be removed too

## Using a ZIP package

Not all users prefer the guided _Installer_ to install ArangoDB. In order to have a
[portable application](http://en.wikipedia.org/wiki/Portable_application){:target="_blank"}, or easily
start different ArangoDB versions on the same machine, and/or for the maximum flexibility,
you might want to install using the _ZIP_ archive ([XCOPY deployment](http://en.wikipedia.org/wiki/XCOPY_deployment){:target="_blank"}).

***Unzip the archive***

Open an explorer, choose a place where you would like ArangoDB to be, and extract the
archive there. It will create its own top-level directory with the version number in the name.

***Edit the configuration***

*This step is optional.*

If the default configuration of ArangoDB does not suite your needs,
you can edit `etc\arangodb3\arangod.conf` to change or add configuration options.

***Start the Server***

After installation, you may start ArangoDB in several ways. The exact start-up command
depends on the type of ArangoDB deployment you are interested in
(_Single Instance_, _Active Failover_ or _Cluster_).

Please refer to the [_Deployment_](deployment.html) chapter for details.

