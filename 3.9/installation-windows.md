---
layout: default
description: This overview will step you through on how to install ArangoDB
title: Installing ArangoDB on Windows
redirect_from:
  - cookbook/administration-nsissilent-mode.html # 3.5 -> 3.5
---

# Installing  ArangoDB Community Edition on Windows

Please note that  [**ArangoDB Oasis**](https://cloud.arangodb.com/home) is our hosted ArangoDB service option in the cloud which requires no installation on your machine and we offer a free 14–day trial to get you started.



There are three ways to install ArangoDB on Windows:

 1. Using an installation wizard.

 2. Using command line.

 3. Using a ZIP package.

    

There are two options for downloads **Server** which contains both the ArangoDB server and the client tools and **Client Tools** which contains only the client tools.

When you install **server** you will have both ArangoDB Server and the client tools on your server.

**Client tools**, you will access to *arangosh* and *arangodump*. **Client Tools**  can be installed on a remote system rather than on the server. You can install the **client tools** on any system that has network access to the server.

###  Download the Installation Wizard 

1. Go to our **[Download Centre](https://www.arangodb.com/download-major/ )** and a click on the **Windows** logo.

2. Scroll down, Click **Server  3.9.0**, and a download will being.

3. Check your **downloads** folder, the default location will be the **downloads** folder on your machine.

### Installing ArangoDB

- Double-click the **ArangoDB.exe** file to run the Arango DB installation wizard.
- A welcome window will appear, click **Next** to continue. 
- Read and agree terms and conditions and click **Next**. 
- Choose how you would like ArangoDB to be installed.
  - Ticking the **all users** , will install ArangoDB as a service and it wlill start to run automatically after installation.
  - Ticking for the **current user** you will need to manually start the ArangoDB after the installation is completed.
- Leave the other tick boxes options as they are if you are happy for ArangoDB to install with its default settings.
 - A window will appear where you can create a new password, and click **Next**.
 - The ***default username*** is ***root***, so make a note of that when you create a password. Enter a new password, and click **Next**. 
 - Decide if you would like to make a shortcut for ArangoDB on your desktop, and click **Next**. 
 - Click **Install**.
 - Click **Finish** and a window on your default browser will open to the web interface.
 
### Installing ArangoDB with command line 

- Open **Command Prompt**. Make sure that Command Prompt is pointing at the location where the **ArangoDB.exe** is located. You might need to move the file depending on how your windows directory is set up. 
- Enter ``ArangoDB3-3.9.0_win64.exe/S`` to enter silent mode. 

{% hint 'warning' %}
The file name of the **.exe** will changes depending on the version of ArangoDB you are installing 
{% endhint %}

You can set your preferred options listed below by entering `/PASSWORD=your new password`

- `/PASSWORD` - Create a new password. 
- `/INSTDIR` - The directory that you want to install ArangoDB to and which you have access to.
- `/DATABASEDIR` - Database directory. A directory where you have access to and the database will be created.
- `/APPDIR` - Foxx Services directory. A directory that you have access to.
- `/INSTALL_SCOPE_ALL`:
  - `1` - All Users + Service - Launches the ArangoDB service via the Windows Services and installs it for all users.
  - `0` - Single User - Install ArangoDBon the machine of one user, don't try to launch the service. A desktop icon will be created.
- `/DESKTOPICON`:
  - `0`: Do not create any shortcuts.
  - `1`: Create shortcuts on the desktop for *arangosh* and the web interface.
- `/PATH`
  - `0` - don’t alter the PATH environment at all.
  - `1`:
    - `INSTALL_SCOPE_ALL` = 1 add it to the path for all users.
    - `INSTALL_SCOPE_ALL` = 0 add it to the path of the currently logged in users.
    
### Installing ArangoDB using a ZIP package

If you prefer to have a portable application or would like to have different versions of ArangoDB on the same machine you can use the **ZIP package**.

#### Extract the files 

- Click on the **Zip package** and a download will begin.
- Open your **downloads** folder.
- Right-click on the file and select **extract all.**
- This will open a new dialogue box, select where you would like your files to be extracted to.

#### Edit the configuration

This is an optional step you can add when the configuration does not suit your needs. Edit `etc\arangodb3\arangod.conf` to change or add configuration options.

#### Start the Server 

After the installation is completed, you may start ArangoDB in several ways.

The start-up command depends on the type of ArangoDB deployment you are interested in (*Single Instance*, *Active Failover* or *Cluster*).
