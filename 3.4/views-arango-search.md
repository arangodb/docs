---
layout: default
description: 'Under the hood ArangoSearch view is an index powered by IResearch library combined of 2 data structures: Inverted index and Columnar store.'
title: ArangoSearch Views powered by IResearch
---
# ArangoSearch Views powered by IResearch

ArangoSearch is a natively integrated AQL extension making use of the
IResearch library.

ArangoSearch allows one to:

- join documents located in different collections to one result list
- filter documents based on AQL boolean expressions and functions
- sort the result set based on how closely each document matched the filter

A concept of value "analysis" that is meant to break up a given value into
a set of sub-values internally tied together by metadata which influences both
the filter and sort stages to provide the most appropriate match for the
specified conditions, similar to queries to web search engines.

In plain terms this means a user can for example:

- request documents where the `body` attribute best matches `a quick brown fox`
- request documents where the `dna` attribute best matches a DNA sub sequence
- request documents where the `name` attribute best matches gender
- etc. (via custom analyzers)

## The IResearch Library

IResearch is a cross-platform open source indexing and searching engine written
in modern C++, optimized for speed and memory footprint, with source available
from https://github.com/iresearch-toolkit/iresearch

IResearch is the framework for indexing, filtering and sorting of data.
The indexing stage can treat each data item as an atom or use custom "analyzers"
to break the data item into sub-atomic pieces tied together with internally
tracked metadata.

The IResearch framework in general can be further extended at runtime with
custom implementations of analyzers (used during the indexing and filtering
stages) and scorers (used during the sorting stage) allowing full control over
the behavior of the engine.

## Using ArangoSearch Views

To get more familiar with ArangoSearch usage, you may start with
[Getting Started](views-arango-search-getting-started.html) simple guide and then explore details of
ArangoSearch in [Detailed Overview](views-arango-search-detailed-overview.html),
[Analyzers](views-arango-search-analyzers.html) and
[Scorers](views-arango-search-scorers.html) topics.
