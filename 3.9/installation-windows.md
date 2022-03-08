---
layout: default
description: This overview will step you through on how to install ArangoDB
title: Installing ArangoDB on Windows
redirect_from:
  - cookbook/administration-nsissilent-mode.html # 3.5 -> 3.5
---


# Installing ArangoDB Community Edition on Windows

Please note that [**ArangoDB Oasis**](https://cloud.arangodb.com/home) is our hosted ArangoDB service option in the cloud which requires no installation on your machine and we offer a free 14–day trial to get you started.

There are three ways to install ArangoDB on Windows:

1. Using an installation wizard.
2. Using command line.
3. Using a ZIP package.

## Using the Installation Wizard

***To download the wizard**

We provide a single package that contains the server and the client tools. For a standard server setup, download the server package called **Server 3.9.0**. And if you would like to install the client tools to a different machine then download the **Client Tools** package.

1. Go to our **[Download Centre](https://www.arangodb.com/download-major/ )** and a click on the **Windows** logo.
2. Scroll down, Click **Server 3.9.0**, and a download will being.
3. Check your **downloads** folder, the default location will be the **downloads** folder on your machine.

***Installing ArangoDB***

1. Double-click the **ArangoDB.exe** file to run the Arango DB installation wizard.
2. A **user control** dialog box will appear and will ask permission for the application to makes changes to your device, click **Yes**.
3. A set-up window will appear, click **Next** to continue.
4. Read and agree terms and conditions and click **Next**.
5. Choose how you would like ArangoDB to be installed.
- Selecting the **all users** tick box, will install ArangoDB as a service and it will start to run automatically after installation.
- Selecting for the **current user** tick box will require you to manually start the ArangoDB server after the installation is completed.
6. Leave the tick boxes selected if you are want ArangoDB to install with its default settings.
7. A dialog box will appear where you can create a new password,enter a new password and click **Next**.
8. Decide if you would like to make a shortcut for ArangoDB on your desktop, and click **Next**.
10. Click **Install**.
11. Wait for the installation.
12. Leave the **Launch ArangoDB** tick box selected and click **Finish** 
13. The ArangoDB server will launch on your default browser will open the web interface.
12. Enter the password you created and leave **root** as the default username.
13. Click **Login**.
14. Select **DB:_system** as the default.

## Installing ArangoDB with command line
Using command line in silent mode will enable you to run the installation without interacting with an installation wizard.

*** To install with command line ***

1. Open **Command Prompt**. Make sure that Command Prompt is pointing at the location where the **ArangoDB.exe** is located. You might need to move the file depending on how your windows directory is set up.
2. Enter ``ArangoDB3-3.9.0_win64.exe/S`` to enter silent mode.

{% hint 'warning' %}

The file name of the **.exe** will change depending on the version of ArangoDB you are installing

{% endhint %}

*** Setting up your preferences ***

You can set your preferred options listed below by entering `/PASSWORD=your new password`, for example. Below is the list of the other settings options that can be set up using command line:

|Name|Description|
|--|--|
|`/PASSWORD`|creates a new password.|
|`/INSTDIR`|the directory that you want to install ArangoDB to and which you have access to.|
|`/DATABASEDIR`|the directory that you have access to and where the database should be created.|
|`/APPDIR`|Foxx Services directory.A directory that you have access to.|
|`/INSTALL_SCOPE_ALL`|Option `1`, launches the ArangoDB service via Windows Services, and installs it for all users. Option `0` installs ArangoDB on machine of your chosen user. It will also create a desktop icon and the user will be able to launch the service.|
|`/DESKTOPICON`|Option `0`, will not create any shortcuts on the desktop. Option `1`, will create a shortcut on the desktop for *arangosh* and the web interface.|
|`/Path`|Option `0` will not alter the PATH environment. Option `1` `INSTALL_SCOPE_ALL` = 1 add it to the path for all users.`INSTALL_SCOPE_ALL`= 0 add it to the path of the currently logged in users.|

## Installing ArangoDB using a ZIP package

If you prefer to have a portable application or would like to have different versions of ArangoDB on the same machine you can use the **ZIP Package**.

***Extract the files***

1. Click on the **Zip package** and a download will begin.

2. Open your **downloads** folder.

3. Right-click on the file and select **extract all**.

4. Right-clicking will open a new dialogue box, select where you would like your files to be extracted to.

***Edit the configuration***

This is an optional step, when the configuration does not suit your needs. Edit `etc\arangodb3\arangod.conf` to change or add configuration options.

***Start the Server***

After the installation is completed, you can start ArangoDB in several ways.

The  start-up command depends on the type of ArangoDB deployment you are interested in using. We offer a *Single Instance*, *Active Failover* or *Cluster*.
