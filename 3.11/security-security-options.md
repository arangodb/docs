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

  - `/_admin/cluster/numberOfServers`
  - `/_admin/log`
  - `/_admin/log/level`
  - `/_admin/status`
  - `/_admin/statistics`
  - `/_admin/statistics-description`
  - `/_api/engine/stats`

  Additionally, no version details will be revealed by the version REST API at 
  `/_api/version`.

  The default value for this option is `false`.

- `--server.support-info-api`
  This option controls access to the REST API endpoint `/_admin/support-info` 
  for retrieving deployment information. It can have the following values:
  - `disabled`: support info API is disabled.
  - `jwt`: support info API can only be accessed via superuser JWT.
  - `admin` (default): the support info API can only be accessed by admin users and superuser JWTs.
  - `public`: everyone with access to the `_system` database can access the
    support info API.

  The default value for this option is `admin`.

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

### Options for allowlisting and denylisting

The following options are available for allowlisting and denylisting access
to dedicated functionality for application code:

- `--javascript.startup-options-[allowlist|denylist]`:
  These options control which startup options will be exposed to JavaScript code.

- `--javascript.environment-variables-[allowlist|denylist]`:
  These options control which environment variables will be exposed to
  JavaScript code.

- `--javascript.files-allowlist`:
  This option controls which filesystem paths can be accessed from JavaScript
  code. There is only an allowlist option for file access.

- `--javascript.endpoints-[allowlist|denylist]`:
  These options control which endpoints can be used from within the
  `@arangodb/request` JavaScript module.

#### Startup option access

The security option to observe the behavior of the pattern matching most easily
is the masquerading of the startup options:

```
--javascript.startup-options-allowlist "^server\."
--javascript.startup-options-allowlist "^log\."
--javascript.startup-options-denylist "^javascript\."
--javascript.startup-options-denylist "^endpoint$"
```

These sets will resolve internally to the following regular expressions:

```
--javascript.startup-options-allowlist = "^server\.|^log\."
--javascript.startup-options-denylist = "^javascript\.|endpoint"
```

Invoking _arangosh_ with these options will hide the denied commandline
options from the output of: 

```js
require('internal').options()
```

… and an exception will be thrown when trying to access items that are masked
in the same way as if they weren't there in first place.

#### Environment variable access

Access to environment variables can be restricted to hide sensitive information
from JavaScript code, for example:

```
--javascript.environment-variables-allowlist "^ARANGO_"
--javascript.environment-variables-denylist "PASSWORD"
```

This will allow JavaScript code to only see environment variables that start
with `ARANGO_` except if they contain `PASSWORD`. It excludes the variables
`PATH` and `ARANGO_ROOT_PASSWORD` for instance.

Note that regular expression matching is case-sensitive. `PASSWORD` will not
exclude environment variables that include `password`. You may use
`[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]` for case-insensitive matching.

You can test the allow-/denylisting in _arangosh_, here using the ArangoDB 3.7
Docker image:

```
docker run --rm -e ARANGO_ROOT_PASSWORD="secret" arangodb:3.7 arangosh --javascript.execute-string "print(process.env)"
...
{
  "ARANGO_PACKAGE" : "arangodb3_3.7.15-1_amd64.deb",
  "HOSTNAME" : "84fe29186eba",
  "SHLVL" : "1",
  "HOME" : "/root",
  "ARANGO_ROOT_PASSWORD" : "secret",
  "ARANGO_VERSION" : "3.7.15",
  "PATH" : "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
  "ARANGO_URL" : "https://download.arangodb.com/arangodb37/DEBIAN/amd64",
  "ARANGO_PACKAGE_URL" : "https://download.arangodb.com/arangodb37/DEBIAN/amd64/arangodb3_3.7.15-1_amd64.deb",
  "ARANGO_SIGNATURE_URL" : "https://download.arangodb.com/arangodb37/DEBIAN/amd64/arangodb3_3.7.15-1_amd64.deb.asc",
  "PWD" : "/",
  "ICU_DATA" : "/usr/share/arangodb3/"
}

docker run --rm -e ARANGO_ROOT_PASSWORD="secret" arangodb:3.7 arangosh --javascript.execute-string "print(process.env)" --javascript.environment-variables-allowlist "^ARANGO_" --javascript.environment-variables-denylist "PASSWORD"
...
[Object {
  "ARANGO_PACKAGE" : "arangodb3_3.7.15-1_amd64.deb",
  "ARANGO_VERSION" : "3.7.15",
  "ARANGO_URL" : "https://download.arangodb.com/arangodb37/DEBIAN/amd64",
  "ARANGO_PACKAGE_URL" : "https://download.arangodb.com/arangodb37/DEBIAN/amd64/arangodb3_3.7.15-1_amd64.deb",
  "ARANGO_SIGNATURE_URL" : "https://download.arangodb.com/arangodb37/DEBIAN/amd64/arangodb3_3.7.15-1_amd64.deb.asc"
}]
```

#### File access

In contrast to other areas, access to directories and files from JavaScript
operations is only controlled via an allowlist, which can be specified via the
startup option `--javascript.files-allowlist`. Thus any files or directories
not matching the allowlist will be inaccessible from JavaScript filesystem
functions.

For example, when using the following startup options

```
--javascript.files-allowlist "^/etc/required/"
--javascript.files-allowlist "^/etc/mtab/"
--javascript.files-allowlist "^/etc/issue$"
```

The file `/etc/issue` will be allowed to accessed and all files in the directories
`/etc/required` and `/etc/mtab` plus their subdirectories will be accessible,
while access to files in any other directories will be disallowed from
JavaScript operations, with the following exceptions:

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

The endpoint allow-/denylisting limits access to external HTTP resources:

```
--javascript.endpoints-denylist "<regex>"
--javascript.endpoints-allowlist "<regex>"
```

Filtering is done against the full request URL, including protocol, hostname /
IP address, port, and path.

{% hint 'security' %}
Keep in mind that these startup options are treated as regular expressions.
Certain characters have special meaning that may require escaping and the
expression only needs to match a substring by default. It is recommended to
fully specify URLs and to use a leading `^` and potentially a trailing `$` to
ensure that no other than the intended URLs are matched.
{% endhint %}

Specifying `arangodb.org` will match:
- `http://arangodb.org`
- `http://arangodb.org` 
- `http://arangodb.org`
- `http://arangodb.org` 
- `http://arangodb.org`
- `http://arangodb.org` 
- `http://arangodb.org`
- `https://arangodb.org`
- `https://arangodb.org:12345`
- `https://subdomain.arangodb.organic` **(!)**
- `https://arangodb-org.evil.domain` **(!)**
- etc.

An unescaped `.` represents any character. For a literal dot use `\.`.

Specifying `http://arangodb\.org` will match:
- `http://arangodb.org`
- `http://arangodb.org` 
- `http://arangodb.org`
- `http://arangodb.org` 
- `http://arangodb.org`
- `http://arangodb.org` 
- `http://arangodb.org`
- `http://arangodb.org:12345`
- `http://arangodb.organic` **(!)**
- `http://arangodb.org.evil.domain` **(!)**
- etc.

Specifying `^http://arangodb\.org$` will only match `http://arangodb.org`.
Despite port 80 being the default HTTP port, this will not match
`http://arangodb.org:80` with an explicitly stated port. Conversely, specifying
`^http://arangodb\.org:80$` will match `http://arangodb.org:80` with an explicit
port in the request URL but not `http://arangodb.org` with the port left out.
To allow both, you can make the port optional like `^http://arangodb\.org(:80)?$`.
However, the trailing `$` demands that the URL has no path. This means
`http://arangodb.org/folder/file.html` and even `http://arangodb.org/` will not
match. You can specify `^http://arangodb\.org(:80)?/` to allow any path (but
the trailing slash will be needed in the request URL).

Specifying `^https?://arangodb\.org(:80|:443)?(/|$)` will match:
- `http://arangodb.org`
- `http://arangodb.org/`
- `http://arangodb.org/folder/file.html`
- `http://arangodb.org:80`
- `http://arangodb.org:80/`
- `http://arangodb.org:80/folder/file.html`
- `https://arangodb.org:443`
- `https://arangodb.org:443/`
- `https://arangodb.org:443/folder/file.html`
- etc.

You can test the allow-/denylisting in _arangosh_:

```
arangosh --javascript.endpoints-allowlist "^https://arangodb\.org(:443)?/"
127.0.0.1:8529@_system> require('internal').download('http://arangodb.org/file.zip')
JavaScript exception: ArangoError 11: not allowed to connect to this URL: http://arangodb.org/file.zip
...

127.0.0.1:8529@_system> require('internal').download('https://arangodb.org/file.zip')
<request permitted by allowlist>
```

{% hint 'warning' %}
Startup options may require additional escaping in your command line.
Examples are:
- Dollar symbols and backslashes in most Linux and macOS shells (`\$`, `\\`),
  unless the entire string is wrapped in single quotes (`'tcp://arangodb\.org$'`
  instead of `tcp://arangodb\\.org\$`)
- Circumflex accents in Windows `cmd` (`^^`) unless the entire string is
  wrapped in double quotes (`"^http…"`).
{% endhint %}

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

- `--javascript.tasks`: This option can be set to `false` to turn off
  [JavaScript tasks](appendix-java-script-modules-tasks.html). It will
  disallow the execution of user-defined JavaScript code in the server inside 
  one-off or periodic tasks.

- `--javascript.transactions`: This option can be set to `false` to turn off
  [JavaScript Transactions](http/transaction-js-transaction.html). It will 
  disallow the execution of user-defined JavaScript code in the server inside 
  JavaScript transactions.

- `--javascript.user-defined-functions`: This option can be set to `false` to turn off
  [AQL user-defined functions](aql/extending.html). It will disallow the execution of
  user-defined JavaScript code in the server inside AQL user-defined functions (UDFs).

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

- `--foxx.allow-install-from-remote`:
  When set to `false`, this option prevents installation of Foxx apps from any
  remote source other than Github and diactivates the **Remote** tab in the **Services**
  section of the web interface. Installing apps from Github and/or zip files is 
  still possible with this setting, but any other remote sources are blocked.
  When set to `true`, installing Foxx apps from other remote sources via URLs
  is allowed.
  The default value is `false`.
  Note: this option was introduced in ArangoDB v3.8.5.

