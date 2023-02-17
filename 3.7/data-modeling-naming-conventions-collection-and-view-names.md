---
layout: default
description: Users can pick names for their collections and Views as desired, provided certain naming constraints are not violated.
title: Naming Conventions for Collections / Views
---
Collection and View Names
=========================

Users can pick names for their collections and Views as desired, provided the
following naming constraints are not violated:

- The names must only consist of the letters *a* to *z* (both in lower 
  and upper case), the numbers *0* to *9*, and the underscore (*_*) or dash (*-*)
  symbols. This also means that any non-ASCII names are not allowed.

- View names must always start with a letter.

- User-defined collection names must always start with a letter. System collection
  names must start with an underscore.

  All collection names starting with an underscore are considered to be system
  collections that are for ArangoDB's internal use only. System collection names
  should not be used by end users for their own collections.

- The maximum allowed length of a name is 256 bytes.

- Collection and View names are case-sensitive.
