---
layout: default
description: ArangoDB is a database that serves documents to clients
title: ArangoDB Data Model & Concepts
---
# Data Model & Concepts

This chapter introduces ArangoDB's core concepts and covers

- its data model (or data models respectively),
- the terminology used throughout the database system and in this
  documentation

You will also find usage examples on how to interact with the database system
using [arangosh](programs-arangosh.html), e.g. how to create and
drop databases / collections, or how to save, update, replace and remove
documents. You can do all this using the [web interface](getting-started-web-interface.html)
as well and may therefore skip these sections as beginner.

Data model
----------

The documents you can store in ArangoDB closely follow the JSON format,
although they are stored in a binary format called [VelocyPack](https://github.com/arangodb/velocypack#readme){:target="_blank"}.
A **document** contains zero or more attributes, each of these attributes having
a value. A value can either be an atomic type, i. e. number, string, boolean
or null, or a compound type, i.e. an array or embedded document / object.
Arrays and sub-objects can contain all of these types, which means that
arbitrarily nested data structures can be represented in a single document.

Documents are grouped into **collections**. A collection contains zero or more
documents. If you are familiar with relational database management systems (RDBMS)
then it is safe to compare collections to tables and documents to rows. The
difference is that in a traditional RDBMS, you have to define columns before
you can store records in a table. Such definitions are also known as schemas.
ArangoDB is by default schema-less, which means that there is no need to define what
attributes a document can have. Every single document can have a completely
different structure and still be stored together with other documents in a
single collection. In practice, there will be common denominators among the
documents in a collection, but the database system itself doesn't force you to
limit yourself to a certain data structure. To check for and/or enforce a
common structure ArangoDB supports optional
[**schema validation** for documents](data-modeling-documents-schema-validation.html)
on collection level.

There are two types of collections: **document collection** (also refered to as
*vertex collections* in the context of graphs) as well as **edge collections**.
Edge collections store documents as well, but they include two special attributes,
*_from* and *_to*, which are used to create relations between documents.
Usually, two documents (**vertices**) stored in document collections are linked
by a document (**edge**) stored in an edge collection. This is ArangoDB's graph
data model. It follows the mathematical concept of a directed, labeled graph,
except that edges don't just have labels, but are full-blown documents.

Collections exist inside of **databases**. There can be one or many databases.
Different databases are usually used for multi tenant setups, as the data inside
them (collections, documents etc.) is isolated from one another. The default
database *_system* is special, because it cannot be removed. Database users
are managed in this database, and their credentials are valid for all databases
of a server instance.

Similarly **databases** may also contain **view** entities. A
[View](data-modeling-views.html) in its simplest form can be seen as a read-only
array or collection of documents. The view concept quite closely matches a
similarly named concept available in most relational database management systems
(RDBMS). Each view entity usually maps some implementation specific document
transformation, (possibly identity), onto documents from zero or more
collections.
