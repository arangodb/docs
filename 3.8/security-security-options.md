---
layout: default
description: arangod provides a variety of options to make a setup more secure
---
# Server security options

_arangod_ provides a variety of options to make a setup more secure. 
Administrators can use these options to limit access to certain ArangoDB
server functionality as well as preventing the leakage of information about
the environment that a server is running in.

## General security options

The following security options are available:

- `--server.harden`
  If this option is set to `true` and authentication is enabled, non-admin users
  will be denied access to the following REST APIs:
  
  - `/_admin/log`
  - `/_admin/log/level`
  - `/_admin/status`
  - `/_admin/statistics`
  - `/_admin/statistics-description`
  - `/_api/engine/stats`
 
  Additionally, no version details will be revealed by the version REST API at 
  `/_api/version`.

  The default value for this option is `false`.

## JavaScript security options

`arangod` has several options that allow you to make your installation more
secure when it comes to running application code in it. Below you will find 
an overview of the relevant options.

### Allowlists and denylists

Several options exist to restrict JavaScript application code functionality 
to just certain allowed subsets. Which subset of functionality is available
can be controlled via "denylisting" and "allowlisting" access to individual 
components.

The set theory for these lists works as follow:

- **Only a denylist is specified:**
  Everything is allowed except a set of items matching the denylist.
- **Only an allowlist is specified:**
  Everything is disallowed except the set of items matching the allowlist.
- **Both allowlist and denylist are specified:**
  Everything is disallowed except the set of items matching the allowlist.
  From this allowed set, subsets can be forbidden again using the denylist.

Values for denylist and allowlist options need to be specified as ECMAScript 
regular expressions.
Each option can be used multiple times. When specifying more than one 
pattern, these patterns will be combined with a _logical or_ to the actual pattern
ArangoDB will use.

These patterns and how they are applied can be observed by enabling 
`--log.level SECURITY=debug` in the `arangod` or `arangosh` log output.

#### Combining patterns

The security option to observe the behavior of the pattern matching most easily
is the masquerading of the startup options:

    --javascript.startup-options-allowlist "^server\."
    --javascript.startup-options-allowlist "^log\."
    --javascript.startup-options-denylist "^javascript\."
    --javascript.startup-options-denylist "^endpoint$"

These sets will resolve internally to the following regular expressions:

```
--javascript.startup-options-allowlist = "^server\.|^log\."
--javascript.startup-options-denylist = "^javascript\.|endpoint"
```

Invoking an arangosh with these options will hide the denied commandline
options from the output of: 

```js
require('internal').options()
```

… and an exception will be thrown when trying to access items that are masked
in the same way as if they weren't there in first place.

#### File access

In contrast to other areas, access to directories and files from JavaScript
operations is only controlled via an allowlist, which can be specified via the
startup option `--javascript.files-allowlist`. Thus any files or directories
not matching the allowlist will be inaccessible from JavaScript filesystem
functions.

For example, when using the following startup options

    --javascript.files-allowlist "^/etc/required/"
    --javascript.files-allowlist "^/etc/mtab/"
    --javascript.files-allowlist "^/etc/issue$"

The file `/etc/issue` will be allowed to accessed and all files in the directories
`/etc/required` and `/etc/mtab` plus their subdirectories will be accessible,
while access to files in any other directories will be disallowed from JavaScript 
  operations, with the following exceptions:

- ArangoDB's temporary directory: JavaScript code is given access to this
  directory for storing temporary files. The temporary directory location 
  can be specified explicitly via the `--temp.path` option at startup. 
  If the option is not specified, ArangoDB will automatically use a subdirectory 
  of the system's temporary directory.
- ArangoDB's own JavaScript code, shipped with the ArangoDB release packages.
  Files in this directory and its subdirectories will be readable for JavaScript
  code running in ArangoDB. The exact path can be specified by the startup option 
  `--javascript.startup-directory`.

#### Endpoint access

The endpoint allow-/denylisting limits access to external HTTP resources. 
In contrast to the URLs specified in the JavaScript code, the filters have
to be specified in the ArangoDB endpoints notation: 

- http:// => tcp://
- https:// => ssl://
- no protocol will match http and https.

Filtering is done on the protocol, hostname / IP address, and the port.

Specifying `arangodb.org` will match:
 - `https://arangodb.org:777`
 - `https://arangodb.org`
 - `http://arangodb.org` 
 
Specifying `ssl://arangodb.org` will match:
 - `https://arangodb.org:777`
 - `https://arangodb.org`

Specifying `ssl://arangodb.org:443` will match:
 - `https://arangodb.org`

Specifying `tcp://arangodb.org` will match:
 - `http://arangodb.org` 

This can be tried out using an allowlist - all non matches will be blocked:

```
arangosh --javascript.endpoints-allowlist ssl://arangodb.org
127.0.0.1:8529@_system> require('internal').download('https://arangodb.org:4444')
<allowlist permitted, error on trying to connect>
127.0.0.1:8529@_system> require('internal').download('http://arangodb.org')
JavaScript exception: ArangoError 11: not allowed to connect to this endpoint
```

### Options supporting allowlisting and denylisting

The following options are available for allowing and denying access
to dedicated functionality for application code:

- `--javascript.startup-options-[allowlist|denylist]`:
  These options control which startup options will be exposed to JavaScript code, 
  following above rules for allowlists and denylists.

- `--javascript.environment-variables-[allowlist|denylist]`:
  These options control which environment variables will be exposed to JavaScript
  code, following above rules for allowlists and denylists.

- `--javascript.endpoints-[allowlist|denylist]`:
  These options control which endpoints can be used from within the `@arangodb/request`
  JavaScript module.
  Endpoint values are passed into the filter in a normalized format starting
  with either of the prefixes `tcp://`, `ssl://`, `unix://` or `srv://`.
  Note that for HTTP/SSL-based endpoints the port number will be included too,
  and that the endpoint can be specified either as an IP address or host name
  from application code.

- `--javascript.files-allowlist`:
  This option controls which filesystem paths can be accessed from JavaScript code.

### Additional JavaScript security options

In addition to the allowlisting and denylisting security options, the following
extra options are available for locking down JavaScript access to server functionality:

- `--javascript.allow-port-testing`:
  If set to `true`, this option enables the `testPort` JavaScript function in the
  `internal` module. The default value is `false`.

- `--javascript.allow-external-process-control`:
  If set to `true`, this option allows the execution and control of external processes
  from JavaScript code via the functions from the `internal` module:
  
  - `executeExternal`
  - `executeExternalAndWait`
  - `getExternalSpawned`
  - `killExternal`
  - `suspendExternal`
  - `continueExternal`
  - `statusExternal`

- `--javascript.harden`:
  If set to `true`, this setting will deactivate the following JavaScript functions
  from the `internal` module, which may leak information about the environment:

  - `getPid()`
  - `logLevel()`

  The default value is `false`.

## Security options for managing Foxx applications

The following options are available for controlling the installation of Foxx applications
in an ArangoDB server:

- `--foxx.api`:
  If set to `false`, this option disables the Foxx management API, which will make it
  impossible to install and uninstall Foxx applications. Setting the option to `false`
  will also deactivate the "Services" section in the web interface. 
  The default value is `true`, meaning that Foxx apps can be installed and uninstalled.

- `--foxx.store`:
  If set to `false`, this option disables the Foxx app store in ArangoDB's web interface,
  which will also prevent ArangoDB and its web interface from making calls to the main Foxx 
  application Github repository at
  [github.com/arangodb/foxx-apps](https://github.com/arangodb/foxx-apps){:target="_blank"}.
  The default value is `true`.
