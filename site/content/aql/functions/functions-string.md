---
fileID: functions-string
title: String functions
weight: 3910
description: 
layout: default
---
`TRIM(value, chars) → strippedString`

Return the string `value` with whitespace stripped from the start and end.

- **value** (string): a string
- **chars** (string, *optional*): override the characters that should
  be removed from the string. It defaults to `\r\n \t` (i.e. `0x0d`, `0x0a`,
  `0x20` and `0x09`).
- returns **strippedString** (string): `value` without `chars` on both sides

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlTrim_1
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN TRIM("foo bar")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlTrim_2
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN TRIM("  foo bar  ")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlTrim_3
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN TRIM("--==[foo-bar]==--", "-=[]")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlTrim_4
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN TRIM("  foobar\\t \\r\\n ")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlTrim_5
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN TRIM(";foo;bar;baz, ", ",; ")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## UPPER()

`UPPER(value) → upperCaseString`

Convert lower-case letters in `value` to their upper-case counterparts.
All other characters are returned unchanged.

- **value** (string): a string
- returns **upperCaseString** (string): `value` with lower-case characters converted
  to upper-case characters

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlUpper
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN UPPER("AVOcado")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## UUID()

`UUID() → UUIDString`

Return a universally unique identifier value.

- returns **UUIDString** (string): a universally unique identifier

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlUuid
description: ''
render: input/output
version: '3.10'
release: stable
---
  FOR i IN 1..3
RETURN UUID()
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## Regular Expression Syntax

A regular expression may consist of literal characters and the following 
characters and sequences:

- `.` – the dot matches any single character except line terminators.
  To include line terminators, use `[\s\S]` instead to simulate `.` with *DOTALL* flag.
- `\d` – matches a single digit, equivalent to `[0-9]`
- `\s` – matches a single whitespace character
- `\S` – matches a single non-whitespace character
- `\b` – matches a word boundary. This match is zero-length
- `\B` – Negation of `\b`. The match is zero-length
- `[xyz]` – set of characters. Matches any of the enclosed characters
  (here: *x*, *y*, or *z*)
- `[^xyz]` – negated set of characters. Matches any other character than the
  enclosed ones (i.e. anything but *x*, *y*, or *z* in this case)
- `[x-z]` – range of characters. Matches any of the characters in the 
  specified range, e.g. `[0-9A-F]` to match any character in
  *0123456789ABCDEF*
- `[^x-z]` – negated range of characters. Matches any other character than the
  ones specified in the range
- `(xyz)` – defines and matches a pattern group. Also defines a capturing group.
- `(?:xyz)` – defines and matches a pattern group without capturing the match
- `(xy|z)` – matches either *xy* or *z*
- `^` – matches the beginning of the string (e.g. `^xyz`)
- `$` – matches the end of the string (e.g. `xyz$`)

To literally match one of the characters that have a special meaning in regular
expressions (`.`, `*`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`, `$`, and `\`)
you may need to escape the character with a backslash, which typically requires
escaping itself. The backslash of shorthand character classes like `\d`, `\s`,
and `\b` counts as literal backslash. The backslash of JSON escape sequences
like `\t` (tabulation), `\r` (carriage return), and `\n` (line feed) does not,
however.

{{% hints/info %}}
Literal backlashes require different amounts of escaping depending on the
context:
- `\` in bind variables (_Table_ view mode) in the web interface (automatically
  escaped to `\\` unless the value is wrapped in double quotes and already
  escaped properly)
- `\\` in bind variables (_JSON_ view mode) and queries in the web interface
- `\\` in bind variables in arangosh
- `\\\\` in queries in arangosh
- Double the amount compared to arangosh in shells that use backslashes for
escaping (`\\\\` in bind variables and `\\\\\\\\` in queries)
{{% /hints/info %}}

Characters and sequences may optionally be repeated using the following
quantifiers:

- `x?` – matches one or zero occurrences of *x*
- `x*` – matches zero or more occurrences of *x* (greedy)
- `x+` – matches one or more occurrences of *x* (greedy)
- `x*?` – matches zero or more occurrences of *x* (non-greedy)
- `x+?` – matches one or more occurrences of *x* (non-greedy)
- `x{y}` – matches exactly *y* occurrences of *x*
- `x{y,z}` – matches between *y* and *z* occurrences of *x*
- `x{y,}` – matches at least *y* occurrences of *x*

Note that `xyz+` matches *xyzzz*, but if you want to match *xyzxyz* instead,
you need to define a pattern group by wrapping the sub-expression in parentheses
and place the quantifier right behind it, like `(xyz)+`.
