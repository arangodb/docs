---
layout: default
description: ArangoDB will always start up with a default database, named _system
---
Database Names
==============

ArangoDB will always start up with a default database, named `_system`.
Users can create additional databases in ArangoDB, provided the database
names conform to the selected naming convention for databases.

In ArangoDB versions before 3.9 there was only the **traditional** naming
convention available. Since ArangoDB version 3.9 there is also the **extended**
naming convention, which is disabled by default. It can be enabled on an
installation by setting the startup option `--database.extended-names-databases`
to `true`.

The restrictions of the two naming conventions are:

- For the **traditional** naming convention:
  - Database names must only consist of the letters `a` to `z` (both lower and
    upper case allowed), the numbers `0` to `9`, and the underscore (`_`) or
    dash (`-`) symbols.
    This also means that any non-ASCII database names are not allowed.
  - Database names must always start with a letter. Database names starting
    with an underscore are considered to be system databases, and users should
    not create or delete those.
  - The maximum allowed length of a database name is 64 bytes.
  - Database names are case-sensitive.

- For the **extended** naming convention:
  - Names can consist of most UTF-8 characters, such as Japanese or Arabic
    letters, emojis, letters with accentuation. Some ASCII characters are
    disallowed, but less compared to the  _traditional_ naming convention.
  - Names cannot contain the characters `/` or `:` at any position, nor any
    control characters (below ASCII code 32), such as `\n`, `\t`, `\r`, and `\0`.
  - Spaces are accepted, but only in between characters of the name. Leading
    or trailing spaces are not allowed, but are automatically trimmed from the
    name when a database is created.
  - `.` (dot), `_` (underscore) and the numeric digits `0`-`9` are not allowed
    as first character, but at later positions.
  - Database names are case sensitive.
  - The maximum length of a database name is 128 bytes. As a UTF-8 character may
    consist of multiple bytes, this does not necessarily equate to 128 characters.

  Example database names that can be used with the _extended_ naming convention:
  `"España", "😀", "犬", "كلب", "@abc123", "København", "München", "Россия", "abc? <> 123!"` 

{% hint 'warning' %}
While it is possible to change the value of the
`--database.extended-names-databases` option from `false` to `true` to enable
extended names, the reverse is not true. Once the extended names have been
enabled they will remain permanently enabled so that existing databases with
extended names remain accessible.

In a cluster, it is also required to set the value of the startup option
consistently on all Coordinators and DB-Servers.
{% endhint %}
