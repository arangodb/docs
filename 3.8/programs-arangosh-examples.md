---
layout: default
description: By default arangosh will try to connect to an ArangoDB server running on server localhost on port 8529
---
# _arangosh_ Examples

Connecting to a server
----------------------

By default _arangosh_ will try to connect to an ArangoDB server running on
server *localhost* on port *8529*. It will use the username *root* and an
empty password by default. Additionally it will connect to the default database
(*_system*). All these defaults can be changed using the following 
command-line options:

- `--server.database <string>`: name of the database to connect to
- `--server.endpoint <string>`: endpoint to connect to
- `--server.username <string>`: database username
- `--server.password <string>`: password to use when connecting 
- `--server.authentication <bool>`: whether or not to use authentication

For example, to connect to an ArangoDB server on IP *192.168.173.13* on port
8530 with the user *foo* and using the database *test*, use:

    arangosh --server.endpoint tcp://192.168.173.13:8530 --server.username foo --server.database test --server.authentication true

_arangosh_ will then display a password prompt and try to connect to the 
server after the password was entered.

{% hint 'warning' %}
Due to how ArangoSH processes arguments, a command-line argument provided as `--server.username <arg>` or `--server.password <arg>` (non-exhaustive list) containing two `@` will treat the symbols in between as the name of a system environment variable. This edge case may appear when using password generators.

To avoid this behavior, escape all `@` symbols by prefixing them by another `@`.

Example: `password@test@123` would need to become `password@@test@@123` to work correctly. (Please avoid using insecure passwords in production environments)
{% endhint %}

The shell will print its own version number and if successfully connected
to a server the version number of the ArangoDB server.

{% hint 'tip' %}
If the server endpoint is configured for SSL then clients such as _arangosh_
need to connect to it using an SSL socket as well. For example, use `http+ssl://`
as schema in `--server.endpoint` for an SSL-secured HTTP connection.
{% endhint %}

The schema of an endpoint is comprised of a protocol and a socket in the format
`protocol+socket://`. There are alternatives and shorthands for some combinations,
`ssl://` is equivalent to `http+ssl://` and `https://` for instance:

Protocol     | Socket           | Schema
-------------|------------------|-----------
HTTP         | TCP              | `http+tcp`, `http+srv`, `http`, `tcp`
HTTP         | TCP with SSL/TLS | `http+ssl`, `https`, `ssl`
HTTP         | Unix             | `http+unix`, `unix`
VelocyStream | TCP              | `vst+tcp`, `vst+srv`, `vst`
VelocyStream | TCP with SSL/TLS | `vst+ssl`, `vsts`
VelocyStream | Unix             | `vst+unix`

Using _arangosh_
----------------

To change the current database after the connection has been made, you
can use the `db._useDatabase()` command in _arangosh_:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline shellUseDB
    @EXAMPLE_ARANGOSH_OUTPUT{shellUseDB}
    db._createDatabase("myapp");
    db._useDatabase("myapp");
    db._useDatabase("_system");
    db._dropDatabase("myapp");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock shellUseDB
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

To get a list of available commands, _arangosh_ provides a *help()* function.
Calling it will display helpful information.

_arangosh_ also provides auto-completion. Additional information on available 
commands and methods is thus provided by typing the first few letters of a
variable and then pressing the tab key. It is recommend to try this with entering
*db.* (without pressing return) and then pressing tab.
