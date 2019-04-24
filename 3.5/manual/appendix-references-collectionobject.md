---
layout: default
description: The following methods exist on the collection object (returned by db
---
The "collection" Object
=======================

The following methods exist on the collection object (returned by *db.name*):

*Collection*

* [collection.checksum()](datamodeling-collections-collectionmethods.html#checksum)
* [collection.compact()](datamodeling-collections-collectionmethods.html#compact)
* [collection.count()](datamodeling-documents-documentmethods.html#count)
* [collection.drop()](datamodeling-collections-collectionmethods.html#drop)
* [collection.figures()](datamodeling-collections-collectionmethods.html#figures)
* [collection.getResponsibleShard()](datamodeling-collections-collectionmethods.html#getresponsibleshard)
* [collection.load()](datamodeling-collections-collectionmethods.html#load)
* [collection.properties(options)](datamodeling-collections-collectionmethods.html#properties)
* [collection.revision()](datamodeling-collections-collectionmethods.html#revision)
* [collection.rotate()](datamodeling-collections-collectionmethods.html#rotate)
* [collection.toArray()](datamodeling-documents-documentmethods.html#toarray)
* [collection.truncate()](datamodeling-collections-collectionmethods.html#truncate)
* [collection.type()](datamodeling-documents-documentmethods.html#collection-type)
* [collection.unload()](datamodeling-collections-collectionmethods.html#unload)

*Indexes*

* [collection.dropIndex(index)](indexing-workingwithindexes.html#dropping-an-index-via-a-collection-handle)
* [collection.ensureIndex(description)](indexing-workingwithindexes.html#creating-an-index)
* [collection.getIndexes(name)](indexing-workingwithindexes.html#listing-all-indexes-of-a-collection)
* [collection.index(index)](indexing-workingwithindexes.html#index-identifiers-and-handles)

*Document*

* [collection.all()](datamodeling-documents-documentmethods.html#all)
* [collection.any()](datamodeling-documents-documentmethods.html#any)
* [collection.byExample(example)](datamodeling-documents-documentmethods.html#query-by-example)
* [collection.closedRange(attribute, left, right)](datamodeling-documents-documentmethods.html#closed-range)
* [collection.document(object)](datamodeling-documents-documentmethods.html#document)
* [collection.documents(keys)](datamodeling-documents-documentmethods.html#lookup-by-keys)
* [collection.edges(vertex-id)](datamodeling-documents-documentmethods.html#edges)
* [collection.exists(object)](datamodeling-documents-documentmethods.html#exists)
* [collection.firstExample(example)](datamodeling-documents-documentmethods.html#first-example)
* [collection.inEdges(vertex-id)](datamodeling-documents-documentmethods.html#edges)
* [collection.insert(data)](datamodeling-documents-documentmethods.html#insert--save)
* [collection.edges(vertices)](datamodeling-documents-documentmethods.html#edges)
* [collection.iterate(iterator,options)](datamodeling-documents-documentmethods.html#misc)
* [collection.outEdges(vertex-id)](datamodeling-documents-documentmethods.html#edges)
* [collection.range(attribute, left, right)](datamodeling-documents-documentmethods.html#range)
* [collection.remove(selector)](datamodeling-documents-documentmethods.html#remove)
* [collection.removeByExample(example)](datamodeling-documents-documentmethods.html#remove-by-example)
* [collection.removeByKeys(keys)](datamodeling-documents-documentmethods.html#remove-by-keys)
* [collection.rename()](datamodeling-collections-collectionmethods.html#rename)
* [collection.replace(selector, data)](datamodeling-documents-documentmethods.html#replace)
* [collection.replaceByExample(example, data)](datamodeling-documents-documentmethods.html#replace-by-example)
* [collection.save(data)](datamodeling-documents-documentmethods.html#insert--save)
* [collection.update(selector, data)](datamodeling-documents-documentmethods.html#update)
* [collection.updateByExample(example, data)](datamodeling-documents-documentmethods.html#update-by-example)
