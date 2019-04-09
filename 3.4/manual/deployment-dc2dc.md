---
layout: default
---
<!-- don't edit here, it's from https://@github.com/arangodb/arangosync.git / docs/Manual/ -->
# Datacenter to datacenter replication deployment

{% hint 'info' %}
This feature is only available in the
[**Enterprise Edition**](https://www.arangodb.com/why-arangodb/arangodb-enterprise/)
{% endhint %}

This chapter describes how to deploy all the components needed for _datacenter to
datacenter replication_.

For a general introduction to _datacenter to datacenter replication_, please refer
to the [Datacenter to datacenter replication](architecture-deploymentmodes-dc2dc.html) chapter.

[Requirements](architecture-deploymentmodes-dc2dc-requirements.html) can be found in this section.

Deployment steps:

- [Cluster](deployment-dc2dc-cluster.html)
- [ArangoSync Master](deployment-dc2dc-arangosyncmaster.html)
- [ArangoSync Workers](deployment-dc2dc-arangosyncworkers.html)
- [Prometheus & Grafana (optional)](deployment-dc2dc-prometheusgrafana.html)

When using the `kafka` type message queue, you also have to deploy:

- [Kafka & Zookeeper](deployment-dc2dc-kafkazookeeper.html)
