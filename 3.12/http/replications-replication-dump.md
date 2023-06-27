---
layout: default
---
# Replication dump commands

## Inventory

The *inventory* method can be used to query an ArangoDB database's current
set of collections plus their indexes. Clients can use this method to get an 
overview of which collections are present in the database. They can use this information
to either start a full or a partial synchronization of data, e.g. to initiate a backup
or the incremental data synchronization.

{% docublock get_api_replication_inventory %}

## Batch

The *batch* method will create a snapshot of the current state that then can be
dumped. A batchId is required when using the dump API with RocksDB.

{% docublock post_api_replication_batch %}
{% docublock delete_replication_batch_batch %}
{% docublock put_api_replication_batch_batch %}

## Dump

The *dump* method can be used to fetch data from a specific collection. As the
results of the dump command can be huge, *dump* may not return all data from a collection
at once. Instead, the dump command may be called repeatedly by replication clients
until there is no more data to fetch. The dump command will not only return the
current documents in the collection, but also document updates and deletions.

Note that the *dump* method will only return documents, updates, and deletions
from a collection's journals and datafiles. Operations that are stored in the write-ahead
log only will not be returned. In order to ensure that these operations are included
in a dump, the write-ahead log must be flushed first. 

To get to an identical state of data, replication clients should apply the individual
parts of the dump results in the same order as they are provided.

{% docublock get_api_replication_dump %}
{% docublock get_api_replication_revisions_tree %}
{% docublock post_api_replication_revisions_tree %}
{% docublock put_api_replication_revisions_ranges %}
{% docublock put_api_replication_revisions_documents %}
{% docublock put_api_replication_sync %}
{% docublock get_api_replication_clusterInventory %}
