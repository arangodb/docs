---
fileID: programs-arangoimport-examples-csv
title: _arangoimport_ Examples CSV / TSV
weight: 530
description: 
layout: default
---
## Importing CSV Data

_arangoimport_ offers the possibility to import data from CSV files. This
comes handy when the data at hand is in CSV format already and you don't want to
spend time converting them to JSON for the import.

To import data from a CSV file, make sure your file contains the attribute names
in the first row. All the following lines in the file will be interpreted as
data records and will be imported.

The CSV import requires the data to have a homogeneous structure. All records
must have exactly the same amount of columns as there are headers. By default,
lines with a different number of values will not be imported and there will be 
warnings for them. To still import lines with less values than in the header,
there is the `--ignore-missing` option. If set to true, lines that have a
different amount of fields will be imported. In this case only those attributes
will be populated for which there are values. Attributes for which there are
no values present will silently be discarded.

Example:

```
"first","last","age","active","dob"
"John","Connor",25,true
"Jim","O'Brady"
```

With *--ignore-missing* this will produce the following documents:

```js
{ "first" : "John", "last" : "Connor", "active" : true, "age" : 25 }
{ "first" : "Jim", "last" : "O'Brady" }
```

The cell values can have different data types though. If a cell does not have
any value, it can be left empty in the file. These values will not be imported
so the attributes will not "be there" in document created. Values enclosed in
quotes will be imported as strings, so to import numeric values, boolean values
or the null value, don't enclose the value in quotes in your file.

We will be using the following import for the CSV import:

```
"first","last","age","active","dob"
"John","Connor",25,true,
"Jim","O'Brady",19,,
"Lisa","Jones",,,"1981-04-09"
Hans,dos Santos,0123,,
Wayne,Brewer,null,false,
```

The command line to execute the import is:

    arangoimport --file "data.csv" --type csv --collection "users"

The above data will be imported into 5 documents which will look as follows:

```js
{ "first" : "John", "last" : "Connor", "active" : true, "age" : 25 }
{ "first" : "Jim", "last" : "O'Brady", "age" : 19 }
{ "first" : "Lisa", "last" : "Jones", "dob" : "1981-04-09" }
{ "first" : "Hans", "last" : "dos Santos", "age" : 123 }
{ "first" : "Wayne", "last" : "Brewer", "active" : false }
```

As can be seen, values left completely empty in the input file will be treated
as absent. This is also true for unquoted `null` literals.

The literals `true` and `false` will be treated as booleans if they are not
enclosed in quotes.

Numeric values not enclosed in quotes will be treated as numbers.
Note that leading zeros in numeric values will be removed. To import numbers
with leading zeros, please use strings (e.g. `"012"` instead of `012` or
[override the datatype](#overriding-data-types-per-attribute)).

You can set `--convert` to `false` if you want to treat all unquoted literals
and numbers as strings instead. `--convert` is enabled by default.

Other values not enclosed in quotes will be treated as strings. Any values
enclosed in quotes will be treated as strings, too.

String values containing the quote character or the separator must be enclosed
with quote characters. Within a string, the quote character itself must be
escaped with another quote character (or with a backslash if the
`--backslash-escape` option is used).

Note that the quote and separator characters can be adjusted via the
`--quote` and `--separator` arguments when invoking _arangoimport_. The quote
character defaults to the double quote mark (`"`). To use a literal quote in a
string, you can use two quote characters (`""`).
To use backslash for escaping quote characters (`\"`), please set the option
`--backslash-escape` to `true`.

The importer supports Windows (CRLF) and Unix (LF) line breaks. Line breaks might
also occur inside values that are enclosed with the quote character.

Here is an example for using literal quotes and newlines inside values:

```
"name","password"
"Foo","r4ndom""123!"
"Bar","wow!
this is a
multine password!"
"Bartholomew ""Bart"" Simpson","Milhouse"
```

Extra whitespace at the end of each line will be ignored. Whitespace at the
start of lines or between field values will not be ignored, so please make sure
that there is no extra whitespace in front of values or between them.

## Attribute Name Translation

For the CSV and TSV input formats, attribute names can be translated automatically.
This is useful in case the import file has different attribute names than those
that should be used in ArangoDB.

A common use case is to rename an `id` column from the input file into `_key` as
it is expected by ArangoDB. To do this, specify the following translation when
invoking arangoimport:

    arangoimport --file "data.csv" --type csv --translate "id=_key"

Other common cases are to rename columns in the input file to `_from` and `_to`:

    arangoimport --file "data.csv" --type csv --translate "from=_from" --translate "to=_to"

The `--translate` option can be specified multiple times. The source attribute name
and the target attribute must be separated with a `=`.

## Ignoring Attributes

For the CSV and TSV input formats, certain attribute names can be ignored on
imports. In an ArangoDB cluster there are cases where this can come in handy,
when your documents already contain a `_key` attribute and your collection has
a sharding attribute other than `_key`: In the cluster this configuration is
not supported, because ArangoDB needs to guarantee the uniqueness of the `_key`
attribute in **all** shards of the collection.

    arangoimport --file "data.csv" --type csv --remove-attribute "_key"

The same thing would apply if your data contains an `_id` attribute:

    arangoimport --file "data.csv" --type csv --remove-attribute "_id"

## Overriding data types per attribute

<small>Introduced in: v3.9.0</small>

The `--datatype` startup option can be used to fix
the datatypes for certain attributes in CSV/TSV imports. For example, in the
the following CSV input file, it is unclear if the numeric values should be
imported as numbers or as stringified numbers for the individual attributes:

```
key,price,weight,fk
123456,200,5,585852
864924,120,10,9998242
9949,70,11.5,499494
6939926,2130,5,96962612
```

To determine the datatypes for the individual columns, _arangoimport_ can be
invoked with the `--datatype` startup option, once for each attribute:

```
--datatype key=string
--datatype price=number
--datatype weight=number
--datatype fk=string
```

This will turn the numeric-looking values in the `key` attribute into strings
but treat the attributes `price` and `weight` as numbers. Finally, the values in
attribute `fk` will be treated as strings again.

The possible values for `--datatype` are:
- `null`: unconditionally treats all input values as `null`, effectively
  ignoring the column (similar to `--remove-attribute`) because `null` values
  are dropped
- `boolean`: interprets the input values `false`, `null` and `0` (quoted or
  unquoted) as the boolean value `false`, and everything else as the boolean
  value `true`.
- `number`: converts input values that look like numbers to numbers, including
  numbers wrapped in quote marks (`--quote`), and treats everything else as the
  number `0`.
- `string`: treats the input value as a string

If `--datatype` is used for an attribute, it takes precedence over `--convert`
and the automatic conversions applied by the latter. If you want to import
most fields as strings, then you can use `--convert false` and only override
the datatype for non-string fields with `--datatype`:

```
--convert false
--datatype price=number
--datatype weight=number
```

## Merging Attributes

<small>Introduced in: v3.9.0</small>

_arangoimport_ supports creating additional attributes during the import
process, which are concatenations of other attribute values and hard-coded
string literals/separators.

Such attributes can be added in CSV/TSV imports by specifying the option 
`--merge-attributes` for each new attribute.

The following example will add a new attribute named `fullName` that consists
of the values of the `firstName` and `lastName` columns, separated by a colon
character `:`:

```
arangoimport --merge-attributes fullName=[firstName]:[lastName]
```

When referring to existing attribute names from the input data, the referred-to
names need to be enclosed in square brackets (`[` and `]`). Any characters
outside the brackets will be interpreted as literals, and will be added to the
new attribute as-is. 

If an attribute name that is enclosed in brackets does not exist in the input
data, the import will emit a warning message and continue. Non-existing
attributes will be replaced with an empty string in the resulting value.

The `--merge-attribute` option does not support using the brackets (`[` or `]`)
or the equal sign (`=`) in any of the literals, or inside an attribute reference.
Attribute references with empty attribute names (e.g. `[]`) are disallowed too.

`--merge-attributes` can be specified multiple times to create independent
additional fields:

```
arangoimport \
  --merge-attributes fullName=[firstName]:[lastName] \
  --merge-attributes dateOfBirth=[month]-[day]-[year] \
  ...
```

Later merge attributes can build on former merge attributes
(in left-to-right order), e.g.

```
arangoimport \
  --merge-attributes ids=[id1]-[id2] \
  --merge-attributes nameAndIds=[name]-[ids] \
  ...
```

Note that when the `--translate` option is also used, the referred-to attribute
names for `--merge-attributes` must be the ones before translation, e.g.

```
arangoimport --translate _key=id --merge-attributes idAndName=[id]:[lastName]
```

`--merge-attributes` is currently supported for CSV/TSV input files only.

## Importing TSV Data

You may also import tab-separated values (TSV) from a file. This format is very
simple: every line in the file represents a data record. There is no quoting or
escaping. That also means that the separator character (which defaults to the
tabstop symbol) must not be used anywhere in the actual data.

As with CSV, the first line in the TSV file must contain the attribute names,
and all lines must have an identical number of values.

If a different separator character or string should be used, it can be specified
with the `--separator` argument.

An example command line to execute the TSV import is:

    arangoimport --file "data.tsv" --type tsv --collection "users"

## Reading compressed input files

*arangoimport* can transparently process gzip-compressed input files
if they have a ".gz" file extension, e.g.

    arangoimport --file data.csv.gz --type csv --collection "users"

For other input formats it is possible to decompress the input file using another
program and piping its output into arangoimport, e.g.

    bzcat users.csv.bz2 | arangoimport --file "-" --type csv --collection "users"

This example requires that a `bzcat` utility for decompressing bzip2-compressed
files is available, and that the shell supports pipes.

## Reading headers from a separate file

For the CSV and TSV input formats it is sometimes required to read raw data
files that do not contain a first line with all attributes names.

For these cases, *arangoimport* supports a `--headers-file` option to specify
a separate input file just for the header line with all the attribute names.
The contents of this file will be interpreted as CSV/TSV line with attribute
names, and the contents of the regular input file (`--file`) will be
interpreted as the data to import, without any attribute names.

The `--headers-option` can be used as follows:

    arangoimport --file "data.csv" --type csv --headers-file "headers.csv"

If the option is used, it is necessary that the file specified via
`--headers-file` contains one line with the attribute names in CSV/TSV format
(taking into account `--backslash-escape`, `--quote` and `--separator`).
