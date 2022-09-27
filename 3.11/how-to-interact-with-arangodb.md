---
layout: default
redirect_from:
  - getting-started-web-interface.html # 3.9 -> 3.10
  - getting-started-databases-collections-documents.html # 3.9 -> 3.10
# - getting-started-next-steps.html # 3.9 -> 3.10 # DELETED
#- Types of requests
#  - low level APIs
#  - AQL (also indexes?)
#  - higher-level APIs?
---
# How to Interact With ArangoDB

## How to Communicate with the Server

The core component of ArangoDB is the [ArangoDB server](programs-arangod.html)
that stores data and handles requests. You have different options for talking to
the server.

### Web Interface

The easiest way to get started with ArangoDB is to use the included
[web interface](programs-web-interface.html). The ArangoDB server serves this
graphical user interface (GUI) and you can access it by pointing your browser to
the server's endpoint, which is `http://localhost:8529` by default if you run a
local server.

The web interface lets you perform all essential actions like creating
collections, viewing documents, and running queries. You can also view graphs
and the server logs and metrics, as well as administrate user accounts.

### Command-line Interface (CLI)

If you are a developer, you may feel more comfortable to work in a terminal.
You can use [arangosh](programs-arangosh.html), an interactive shell that ships
with ArangoDB, and its [JavaScript API](appendix-references-dbobject.html), to
interact with the server. You can also use it for automating tasks.

### Drivers and Integrations

When you start using ArangoDB in your project, you will likely use an official
or community-made [driver](drivers/) written in the same language as your project.
Drivers implement a programming interface that should feel natural for that
programming language, and do all the talking to the server.

Integrations combine a third-party technology with ArangoDB and can be seen as
a translation layer that takes over the low-level communication with the server.

### REST API

Under the hood, all interactions with the server make use of its REST API.
A [REST](https://en.wikipedia.org/wiki/Representational_state_transfer){:target="_blank"}
API is an application programming interface based on the HTTP protocol that
powers the world wide web.

All requests from the outside to the server need to made against the respective
endpoints of this API to perform actions. This includes the web interface, _arangosh_,
as well as the drivers and integrations for different programming languages and
environments. They all provide a convenient way to work with ArangoDB, but you
may use the low-level REST API directly as needed.

See the [HTTP](http/) documentation to learn more about the API, how requests
are handled and what endpoints are available.

<!--
## How to Import Data



## How to Operate ArangoDB



TODO: Aspects to incorporate in other content:

Even for a single document as result, we still get an array at the top level.

You may have noticed that the order of the returned documents is not necessarily
the same as they were inserted. There is no order guaranteed unless you explicitly
sort them.

This does still not return the desired result: James (10074) is returned before
John (9883) and Katie (9915). The reason is that the `_key` attribute is a string
in ArangoDB, and not a number. The individual characters of the strings are
compared. `1` is lower than `9` and the result is therefore "correct". If we
wanted to use the numerical value of the `_key` attributes instead, we could
convert the string to a number and use it for sorting. 

It is called a projection if only a subset of attributes is returned. Another
kind of projection is to change the structure of the results.
It is also possible to compute new values, for example by concatenation:

Pro tip: when defining objects, if the desired attribute key and the variable
to use for the attribute value are the same, you can use a shorthand notation:
`{ sumOfAges }` instead of `{ sumOfAges: sumOfAges }`.

-->
