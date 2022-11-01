---
layout: default
description: ArangoDB Server General Options
redirect_from:
  - programs-arangod-global.html # 3.9 -> 3.9
---
# ArangoDB Server General Options

|||||||| how to make users discover --help and --help-all ??? ||||||||

## Help

`--help`

`-h`

Prints a list of the most common options available and then exits. In order to
see all options use *--help-all*.

To receive the startup options in JSON format, pass the `--dump-options` flag. This will
print out all options and exit.


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
ecryptfs), on which `splice()` calls can fail.

You can set the `--use-splice-syscall` startup option to `false`
to use a less efficient, but more portable file copying method
instead, which should work on all filesystems.

The startup option is not available on other operating systems than Linux.
