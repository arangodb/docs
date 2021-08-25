---
layout: default
description: ArangoDB will always start up with a default database, named _system
---
Database Names
==============

ArangoDB will always start up with a default database, named *_system*.
Users can create additional databases in ArangoDB, provided the database
names conform to the selected naming convention for databases.

In ArangoDB versions before 3.9 there was only the _traditional_ naming
convention available. Since ArangoDB version 3.9 there is also the _extended_
naming convention, which is disabled by default. It can be enabled on an
installation by setting the startup option `--database.extended-names-databases`
to `true`.

The restrictions of the two naming conventions are:

* For the _traditional_ naming convention:
  * Database names must only consist of the letters *a* to *z* (both lower and
  upper case allowed), the numbers *0* to *9*, and the underscore (*_*) or 
  dash (*-*) symbols
  This also means that any non-ASCII database names are not allowed
  * Database names must always start with a letter. Database names starting 
  with an underscore are considered to be system databases, and users should 
  not create or delete those
  * The maximum allowed length of a database name is 64 bytes
  * Database names are case-sensitive

* For extended naming convention
  * Names can consist of characters not comprised within the ASCII table, such as japanese or arabic letters, emojis, letters with accetuation. Also, former ASCII characters that were banned in the traditional naming convention are now accepted.
  * `.` is accepted, only not as first character for the name.
  * `" "` spaces are accepted, but only in between characters of the name. Leading or trailing spaces are not allowed, but are trimmed from the name when a database with such characters is created.
  * Names cannot contain the character `/` at any position.
  * Names cannot contain the character `:` at any position.
  * Names cannot contain control characters (below ASCII code 32), such as `\n`, `\t`, `\r`, including `\0`, at any position.
  * Utf8 characters are allowed.
  * Database names are case sensitive.
  * Names starting with `_` are considered to be system databases, hence, this character is allowed, but not as the first character of the name if
  the database is not a system one.
  * Names must not start with numeric digits `0-9`.
  * Other ASCII characters not cited above are allowed at any position.
  
