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

* For the _extended_ naming convention:
  * Names can consist of UTF-8 characters not comprised within the ASCII table, such as Japanese or Arabic letters, emojis, letters with accentuation. Also, some ASCII characters that are disallowed in the _traditional_ naming convention are accepted.
  * ` ` spaces are accepted, but only in between characters of the name. Leading or trailing spaces are not allowed, but are automatically trimmed from the name when a database is created.
  * Names cannot contain the characters `/` or `:` at any position, nor any control characters (below ASCII code 32), such as `\n`, `\t`, `\r`, including `\0`.
  * `.` (dot), `_` (underscore) and the numeric digits `0-9` are not allowed as the first character, but at later positions.
  * Database names are case sensitive.
  * The maximum length of a database name is 128 bytes. As a UTF-8 character may consist of multiple bytes, this does not necessarily equate to 128 characters.
  
