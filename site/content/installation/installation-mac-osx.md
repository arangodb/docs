---
fileID: installation-mac-osx
title: Installing ArangoDB on macOS
weight: 1255
description: 
layout: default
---
You can install ArangoDB on macOS in different ways:

- [Homebrew](#homebrew)
- [_DMG_ Package](#package-installation)
- [_tar.gz_ Archive](#installing-using-the-archive)

{{% hints/tip %}}
Starting from version 3.10.0, ArangoDB has native support for the ARM
architecture and can run on Apple silicon (e.g. M1 chips).
{{% /hints/tip %}}

## Homebrew

{{% hints/info %}}
When installing ArangoDB via the macOS package manager Homebrew,
only the Community Edition is available.
{{% /hints/info %}}

{{% hints/warning %}}
The Homebrew installation is updated a few days after the
official release of a new version. For more information about
the installation packages supported on macOS, see the 
[ArangoDB Homebrew Formulae](https://formulae.brew.sh/formula/arangodb).
{{% /hints/warning %}}

If you are using [_homebrew_](http://brew.sh/),
then you can install the latest released stable version of ArangoDB using `brew`
 as follows:

{{< tabs >}}
{{% tab name="" %}}
```
brew install arangodb
```
{{% /tab %}}
{{< /tabs >}}

This will install the current stable version of ArangoDB and all
dependencies within your Homebrew tree. The integrity of the homebrew formula
is automatically verified by a checksum.


The server binary will be installed at:

{{< tabs >}}
{{% tab name="" %}}
```
/usr/local/Cellar/arangodb/<VERSION>/sbin/arangod
```
{{% /tab %}}
{{< /tabs >}}

`<VERSION>` is a placeholder for the actual version number, e.g. `3.9.0`.

You can start the server by running the command:

{{< tabs >}}
{{% tab name="" %}}
```
/usr/local/Cellar/arangodb/<VERSION>/sbin/arangod &
```
{{% /tab %}}
{{< /tabs >}}

Configuration file is located at:

{{< tabs >}}
{{% tab name="" %}}
```
/usr/local/etc/arangodb3/arangod.conf
```
{{% /tab %}}
{{< /tabs >}}

The ArangoDB shell will be installed as:

{{< tabs >}}
{{% tab name="" %}}
```
/usr/local/Cellar/arangodb/<VERSION>/bin/arangosh
```
{{% /tab %}}
{{< /tabs >}}

You can uninstall ArangoDB using:

{{< tabs >}}
{{% tab name="" %}}
```
brew uninstall arangodb
```
{{% /tab %}}
{{< /tabs >}}

However, in case you started ArangoDB using the _launchctl_, you
need to unload it before uninstalling the server:

{{< tabs >}}
{{% tab name="" %}}
```
launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.arangodb.plist
```
{{% /tab %}}
{{< /tabs >}}

Then remove the LaunchAgent:

{{< tabs >}}
{{% tab name="" %}}
```
rm ~/Library/LaunchAgents/homebrew.mxcl.arangodb.plist
```
{{% /tab %}}
{{< /tabs >}}

{{% hints/tip %}}
If the latest ArangoDB version is not shown in Homebrew, you
also need to update Homebrew executing the command `brew update`.
{{% /hints/tip %}}

### Known issues

- The command-line argument parsing does not accept blanks in filenames; the CLI version below does.
- If you need to change server endpoint while starting _homebrew_ version, you can edit arangod.conf 
  file and uncomment line with endpoint needed, e.g.:
      
      [server]
      endpoint = tcp://0.0.0.0:8529

## Package Installation

ArangoDB provide a command-line app called *ArangoDB-CLI*.

Visit the official [Download](https://www.arangodb.com/download)
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

Note that it is possible to install both, the _homebrew_ version and the command-line
app. You should, however, edit the configuration files of one version and change
the port used.

## Installing using the archive

1. Visit the official [Download](https://www.arangodb.com/download)
   page of the ArangoDB website and download the _tar.gz_ archive for macOS.

2. You may verify the download by comparing the SHA256 hash listed on the website
   to the hash of the file. For example, you can you run `openssl sha256 <filename>`
   or `shasum -a 256 <filename>` in a terminal.

3. Extract the archive by double-clicking the file.
