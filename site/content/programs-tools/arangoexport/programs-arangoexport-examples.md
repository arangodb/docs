---
fileID: programs-arangoexport-examples
title: _arangoexport_ Examples
weight: 400
description: 
layout: default
---
_arangoexport_ can be invoked by executing the following command in a command line:

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --collection test --output-directory "dump"
```
{{% /tab %}}
{{< /tabs >}}

This exports the `test` collection into the `dump` directory as one big JSON array. Every entry
in this array is one document from the collection without a specific order. To export more than
one collection at a time specify multiple `--collection` options.

The default output directory is `export`.

_arangoexport_ will by default connect to the `_system` database using the default
endpoint. If you want to connect to a different database or a different endpoint, 
or use authentication, you can use the following command-line options:

- `--server.database <string>`: name of the database to connect to
- `--server.endpoint <string>`: endpoint to connect to
- `--server.username <string>`: username
- `--server.password <string>`: password to use (omit this and you'll be prompted for the
  password)
- `--server.authentication <bool>`: whether or not to use authentication

Here is an example of exporting data from a non-standard endpoint, using a dedicated
[database name](../../appendix/appendix-glossary#database-name):

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangoexport \
  --server.endpoint tcp://192.168.173.13:8531 \
  --server.username backup \
  --server.database mydb \
  --collection test \
  --output-directory "my-export"
```
{{% /tab %}}
{{< /tabs >}}

When finished, _arangoexport_ will print out a summary line with some aggregate 
statistics about what it did, e.g.:

{{< tabs >}}
{{% tab name="" %}}
```
Processed 2 collection(s), wrote 9031763 Byte(s), 78 HTTP request(s)
```
{{% /tab %}}
{{< /tabs >}}

## Export JSON

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --type json --collection test
```
{{% /tab %}}
{{< /tabs >}}

This exports the `test` collection into the `export` output directory as one JSON array.
Every array entry is one document from the `test` collection.

## Export JSONL

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --type jsonl --collection test
```
{{% /tab %}}
{{< /tabs >}}

This exports the `test` collection into the `export output directory` as [JSONL](http://jsonlines.org).
Every line in the export is one document from the `test` collection as JSON.

## Export CSV

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --type csv --collection test --fields _key,_id,_rev
```
{{% /tab %}}
{{< /tabs >}}

This exports the `test` collection into the `export` output directory as CSV. The first
line contains the header with all field names. Each line is one document represented as
CSV and separated with a comma. Objects and arrays are represented as a JSON string.

Starting with ArangoDB version 3.8.5, string values in the CSV output will be enclosed in 
double quotes. If any string value starts with one of the following characters: `+`, `=`, `@`, `-`,
it is treated as a potential formula and will be prefixed by an extra single quote.
This is done to prevent formula injection attacks in spreadsheet programs such as MS Excel or
OpenOffice. If you don't want to use this functionality, you can turn it off via 
the `--escape-csv-formulae` option.

## Export XML

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --type xml --collection test
```
{{% /tab %}}
{{< /tabs >}}

This exports the `test` collection into the `export` output directory as generic XML.
The root element of the generated XML file is named `collection`.
Each document in the collection is exported in a `doc` XML attribute.
Each document attribute is exported as a generic `att` element, which has a
`name` attribute with the attribute name, a `type` attribute indicating the
attribute value type, and a `value` attribute containing the attribute's value.

## Export XGMML

[XGMML](https://en.wikipedia.org/wiki/XGMML) is an XML application
based on [GML](https://en.wikipedia.org/wiki/Graph_Modelling_Language).
To view the XGMML file you can use for example [Cytoscape](http://cytoscape.org).

{{% hints/warning %}}
Please note, if you export all attributes (`--xgmml-label-only false`), attribute
types have to be the same for all documents. For example, if you have an
attribute named `rank`, which is a string in one document and an integer in another,
it will not work.

Incorrect:

{{< tabs >}}
{{% tab name="js" %}}
```js
{ "rank": 1 }   // doc1
{ "rank": "2" } // doc2
```
{{% /tab %}}
{{< /tabs >}}

Correct:

{{< tabs >}}
{{% tab name="js" %}}
```js
{ "rank": 1 } // doc1
{ "rank": 2 } // doc2
```
{{% /tab %}}
{{< /tabs >}}
{{% /hints/warning %}}

**XGMML-specific options**

`--xgmml-label-attribute` specify the name of the attribute that will become the label in the XGMML file.

`--xgmml-label-only` set to true will only export the label without any attributes in edges or nodes.

**Export based on collections**

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangoexport \
  --type xgmml \
  --graph-name mygraph \
  --collection vertex \
  --collection edge
```
{{% /tab %}}
{{< /tabs >}}

This exports an unnamed graph with the vertex collection named `vertex` and the edge collection
named `edge` into the `mygraph.xgmml` XGMML file.

**Export based on a named graph**

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --type xgmml --graph-name mygraph
```
{{% /tab %}}
{{< /tabs >}}

This exports the named graph mygraph into the `mygraph.xgmml` XGMML file.

**Export XGMML without attributes**

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --type xgmml --graph-name mygraph --xgmml-label-only true
```
{{% /tab %}}
{{< /tabs >}}

This exports the named graph mygraph into the `mygraph.xgmml` XGMML file without the `<att>` tag in nodes and edges.

**Export XGMML with a specific label**

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --type xgmml --graph-name mygraph --xgmml-label-attribute name
```
{{% /tab %}}
{{< /tabs >}}

This exports the named graph mygraph into the `mygraph.xgmml` XGMML file with a
label from documents attribute `name` instead of the default attribute `label`.

## Export via AQL query

Exporting via an AQL query allows you to export the returned data as the type
specified with `--type`.

The example exports all books as JSONL that are sold more than 100 times:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangoexport \
    --type jsonl \
    --custom-query "FOR book IN books FILTER book.sold > 100 RETURN book"
```
{{% /tab %}}
{{< /tabs >}}

A `--fields` list is required for CSV exports, but you can use an AQL query to produce
these fields. For example, you can de-normalize document structures like arrays and
nested objects to a tabular form as demonstrated below:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangoexport \
  --type csv \
  --fields title,category1,category2 \
  --custom-query "FOR book IN books RETURN { title: book.title, category1: book.categories[0], category2: book.categories[1] }"
```
{{% /tab %}}
{{< /tabs >}}

The `--custom-query-bindvars` option lets you set bind variables that you can
use in the `--custom-query` option:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangoexport \
  --type jsonl \
  --custom-query 'FOR book IN @@@@collectionName FILTER book.sold > @@sold RETURN book' \
  --custom-query-bindvars '{"@@collectionName": "books", "sold": 100}'
```
{{% /tab %}}
{{< /tabs >}}

Note that you need to escape at signs in command-lines by doubling them (see
[Environment variables as parameters](../../administration/administration-configuration#environment-variables-as-parameters)).

You can save a query to a file and use it as a custom query with the
`--custom-query-file` option. It is mutually exclusive with the `--custom-query`
option:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
// example.aql
FOR book IN @@collectionName
  FILTER book.sold > @sold
  RETURN book
```
{{% /tab %}}
{{< /tabs >}}

{{< tabs >}}
{{% tab name="" %}}
```
arangoexport --custom-query-file example.aql
```
{{% /tab %}}
{{< /tabs >}}

You can optionally limit the query runtime via the `--custom-query-max-runtime`
option. Specify the maximum query runtime in seconds. Set it to `0` for no limit,
to override the default `--query.max-runtime` of the server (if set).

{{< tabs >}}
{{% tab name="bash" %}}
```bash
arangoexport \
  --type jsonl \
  --custom-query-max-runtime 10 \
  --custom-query "FOR book IN books FILTER book.sold > 100 RETURN book"
```
{{% /tab %}}
{{< /tabs >}}
