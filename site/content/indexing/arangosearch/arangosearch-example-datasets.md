---
fileID: arangosearch-example-datasets
title: Example Datasets for ArangoSearch
weight: 500
description: Datasets you may use for experimenting with ArangoSearch features
layout: default
---
## IMDB Movie Dataset

This is a movies and actors dataset based on data of the
[Internet Movie Database](https://www.imdb.com/) (IMDB).
It was converted into a graph. Also see the
[arangodb/example-datasets](https://github.com/arangodb/example-datasets/tree/master/Graphs/IMDB)
repository.

1. Download [imdb_graph_dump_rev2.zip](https://github.com/arangodb/example-datasets/releases/download/imdb-graph-dump-rev2/imdb_graph_dump_rev2.zip) (6.45 MB)
2. Unpack the downloaded archive
3. Restore the folder `dump` with [arangorestore](../../programs-tools/arangorestore/)
   into an ArangoDB instance, e.g.
   `arangorestore --server.endpoint tcp://localhost:8529 --server.database IMDB --create-database --include-system-collections --input-directory dump`
4. Create a View called `imdb` in the IMDB database. You can find various View
   configuration examples in this chapter.

## Demo Geo S2 Dataset

This is a New York restaurants and neighborhoods dataset taken from
[opendata.city](http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods).
Also see the
[arangodb-foxx/demo-geo-s2](https://github.com/arangodb-foxx/demo-geo-s2)
repository.

1. Download [demo-geo-s2-dump.zip](https://github.com/arangodb-foxx/demo-geo-s2/archive/refs/heads/dump.zip) (2.2 MB)
2. Unpack the downloaded archive
3. Restore the folder `demo-geo-s2-dump` with [arangorestore](../../programs-tools/arangorestore/)
   into an ArangoDB instance, e.g.
   `arangorestore --server.endpoint tcp://localhost:8529 --server.database GeoS2 --create-database --input-directory demo-geo-s2-dump`
4. Create a View called `restaurantsView` in the GeoS2 database. You can find
   various View configuration examples in this chapter.
