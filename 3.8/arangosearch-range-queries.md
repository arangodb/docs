---
layout: default
description: Match values that are above, below or between a minimum and a maximum value
title: ArangoSearch Range Query Examples
---
# Range Queries with ArangoSearch

{{ page.description }}
{:class="lead"}

The primary use case for range queries is to search **numeric** values in
documents that are
- greater than (exclusive),
- greater than or equal (inclusive),
- less than (exclusive),
- less than or equal (inclusive) to a reference number, or
- between two numbers (inclusive or exclusive)

Range queries are also possible for string values.

## Comparing to a Number

## Comparing to a Numeric Range

## Comparing Strings

{% hint 'warning' %}
The alphabetical order of characters is not taken into account by ArangoSearch,
i.e. range queries in SEARCH operations against Views will not follow the
language rules as per the defined Analyzer locale nor the server language
(startup option `--default-language`)!
Also see [Known Issues](release-notes-known-issues38.html#arangosearch).
{% endhint %}

