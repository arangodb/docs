---
layout: default
description: ArangoDB Server General Options
redirect_from:
  - programs-arangod-global.html # 3.9 -> 3.9
---
# ArangoDB Server General Options

## Help

`--help`

`-h`

Prints a list of the most common options available and then exits. In order to
see all options use *--help-all*.

To receive the startup options in JSON format, pass the `--dump-options` flag. This will
print out all options and exit.

## Version

`--version`

`-v`

Prints the version of the server and exits.

`--version-json`

Prints the version of the server in JSON format and exits.

## Daemon

`--daemon`

Runs the server as a daemon (as a background process). This parameter can only
be set if the pid (process id) file is specified. That is, unless a value to the
parameter pid-file is given, then the server will report an error and exit.

## Default Language

<small>Deprecated in: v3.10.0</small>

`--default-language language-name`

The default language is used for sorting and comparing strings. The language
value is a two-letter language code (ISO-639) or it is composed by a two-letter
language code followed by a two letter country code (ISO-3166). For example:
"de", "en", "en_US", "en_UK".

The default default-language is set to be the system locale on that platform.

## ICU Language

<small>Introduced in: v3.9.1</small>

`--icu-language language-name`

The ICU language is also used for sorting and comparing strings. With this option however,
you can get the sorting and comparing order exactly as it's defined in the ICU standard. 
The language value can be a two-letter language code (ISO-639), a two-letter
language code followed by a two letter country code (ISO-3166), or any other valid ICU locale definition.
For example: "de", "en", "en_US", "en_UK", "de_AT@collation=phonebook".

For example, for the Swedish language (sv) the correct ICU-based sorting order for letters is `"a","A","b","B","z","Z","å","Ä","ö","Ö"`.
To get this order, use `--icu-language sv`. In case of using `--default-language sv`, the sorting order will be
`"A","a","B","b","Z","z","å","Ä","Ö","ö"`.

Please note, that you can use only one of the language options (either `--default-language` or `--icu-language`).
Setting both of them will result in an error.

## Supervisor

`--supervisor`

Executes the server in supervisor mode. In the event that the server
unexpectedly terminates due to an internal error, the supervisor will
automatically restart the server. Setting this flag automatically implies that
the server will run as a daemon. Note that, as with the daemon flag, this flag
requires that the pid-file parameter will set.

```js
unix> ./arangod --supervisor --pid-file /var/run/arangodb.pid /tmp/vocbase/
2012-06-27T15:58:28Z [10133] INFO starting up in supervisor mode
```

As can be seen (e.g. by executing the ps command), this will start a supervisor
process and the actual database process:

```js
unix> ps fax | grep arangod
10137 ?        Ssl    0:00 ./arangod --supervisor --pid-file /var/run/arangodb.pid /tmp/vocbase/
10142 ?        Sl     0:00  \_ ./arangod --supervisor --pid-file /var/run/arangodb.pid /tmp/vocbase/
```

When the database process terminates unexpectedly, the supervisor process will
start up a new database process:

```
> kill -SIGSEGV 10142

> ps fax | grep arangod
10137 ?        Ssl    0:00 ./arangod --supervisor --pid-file /var/run/arangodb.pid /tmp/vocbase/
10168 ?        Sl     0:00  \_ ./arangod --supervisor --pid-file /var/run/arangodb.pid /tmp/vocbase/
```

## User identity

`--uid uid`

The name (identity) of the user the server will run as. If this parameter is not
specified, the server will not attempt to change its UID, so that the UID used
by the server will be the same as the UID of the user who started the server. If
this parameter is specified, then the server will change its UID after opening
ports and reading configuration files, but before accepting connections or
opening other files (such as recovery files).  This is useful when the server
must be started with raised privileges (in certain environments) but security
considerations require that these privileges be dropped once the server has
started work.

Observe that this parameter cannot be used to bypass operating system
security. In general, this parameter (and its corresponding relative gid) can
lower privileges but not raise them.


## Group identity

`--gid gid`

The name (identity) of the group the server will run as. If this parameter is
not specified, then the server will not attempt to change its GID, so that the
GID the server runs as will be the primary group of the user who started the
server. If this parameter is specified, then the server will change its GID
after opening ports and reading configuration files, but before accepting
connections or opening other files (such as recovery files).

This parameter is related to the parameter uid.


## Process identity

`--pid-file filename`

The name of the process ID file to use when running the server as a
daemon. This parameter must be specified if either the flag *daemon* or
*supervisor* is set.

## Console

`--console`

Runs the server in an exclusive emergency console mode. When
starting the server with this option, the server is started with
an interactive JavaScript emergency console, with all networking
and HTTP interfaces of the server disabled.

No requests can be made to the server in this mode, and the only
way to work with the server in this mode is by using the emergency
console.
Note that the server cannot be started in this mode if it is
already running in this or another mode.

## File copying mode

<small>Introduced in: v3.9.4</small>

`--use-splice-syscall`

This is a Linux-specific startup option that controls whether the 
Linux-specific `splice()` syscall should be used for copying file
contents. While that syscall is generally available since Linux 2.6.x,
it is also required that the underlying filesystem supports the splice
operation. This is not true for some encrypted filesystems (e.g.
ecryptfs), on which splice() calls can fail.

By setting the startup option `--use-splice-syscall` to `false`, 
a less efficient, but more portable file copying method will be used 
instead, which should work on all filesystems.

The startup option is not available on other operating systems than Linux.
