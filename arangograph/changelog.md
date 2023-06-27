---
layout: default
description: >-
  The ArangoGraph changelog covers notable changes in behavior or new 
  functionality within the ArangoGraph Insights Platform
title: ArangoGraph Changelog
---
# ArangoGraph Changelog

{{ page.description }}
{:class="lead"}

## 2023

### May 2023

- Removes the ability to launch ArangoDB 3.8.x clusters in accordance with
  the end of life of 3.8
- Adds [ArangoDB 3.10.6](https://raw.githubusercontent.com/arangodb/arangodb/3.10/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.10.5 has been
  removed as a selectable version

### April 2023

- Adds automated ArangoDB version upgrades to ArangoGraph, following the
  [ArangoGraph Versioning Policy](upgrades-versioning.html), ensuring customers benefit from the
  latest bug fixes and improvements
- Improvements made to networking subsystem provide a latency improvement of between
  10-30% (depending on the specific workload)
- Adds email alerts for out-of-memory issues and high CPU usage for deployments in
  ArangoGraph, allowing customers to react to undersizing of deployments
- Adds end-to-end authentication to ArangoGraph notebooks, removing the
  need to sign in separately to notebooks. Users are now automatically
  authenticated to notebooks using their ArangoGraph user, provided they
  have the `notebook.execute` permission assigned
- Removes deprecated port 8840, metrics and notebooks are now served from
  port 8829

### March 2023
- Adds [ArangoDB 3.8.9](https://raw.githubusercontent.com/arangodb/arangodb/3.8/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.8.8 has been
  removed as a selectable version
- Adds [ArangoDB 3.9.10](https://raw.githubusercontent.com/arangodb/arangodb/3.9/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.9.9 has been
  removed as a selectable version
- Adds [ArangoDB 3.10.5](https://raw.githubusercontent.com/arangodb/arangodb/3.10/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.10.4 has been
  removed as a selectable version
- Increases the idle timeout for incoming ArangoGraph connections to 10 
  minutes to better allow for long running queries. If your query exceeds
  10 minutes, then we recommend using an asynchronous query API
- Updates the Python driver example to use Python-Arango, rather than
  PyArango
  
### February 2023

- Adds support for "Sign In With Microsoft Account"
- Simplifies the first-time sign up experience
- Adds [ArangoDB 3.10.4](https://raw.githubusercontent.com/arangodb/arangodb/3.10/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.10.3 has been
  removed as a selectable version
- Adds [ArangoDB 3.9.9](https://raw.githubusercontent.com/arangodb/arangodb/3.9/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.9.8 has been
  removed as a selectable version
- Adds [ArangoDB 3.10.3](https://raw.githubusercontent.com/arangodb/arangodb/3.10/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.10.2 has been
  removed as a selectable version
- Adds [ArangoDB 3.9.8](https://raw.githubusercontent.com/arangodb/arangodb/3.9/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph; 3.9.7 has been
  removed as a selectable version
- Fixes an issue updating Enterprise tier deployments that had been paid for
  in advance

### January 2023

- ArangoGraph is now SOC 2 Type 2 compliant, 
  [contact us](https://www.arangodb.com/contact/){:target="_blank"} for access 
  to the SOC 2 report
- Adds Okta as an SSO provider within ArangoGraph. Enterprise customers can
  contact Support to enable SSO
- Adds [ArangoDB 3.10.2](https://raw.githubusercontent.com/arangodb/arangodb/3.10/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph
- Adds [ArangoDB 3.9.7](https://raw.githubusercontent.com/arangodb/arangodb/3.9/CHANGELOG){:target="_blank"}
  as an available version for deployments in ArangoGraph
- Limits the selectable versions for new deployments in ArangoGraph
  to only the latest patch releases for each minor version (e.g. 
  3.10.2, 3.9.7)
- Emails and invoices are now updated to reflect the renaming of Oasis to 
  ArangoGraph
