---
layout: default
description: When running ArangoDB in a cluster the Foxx services will run on eachCoordinator
---
Foxx in a cluster setup
=======================

When running ArangoDB in a cluster the Foxx services will run on each
Coordinator. Installing, upgrading and uninstalling services on any Coordinator
will automatically distribute the changes to the service to the other Coordinators,
making deployments as easy as in single-server mode.

The same considerations that apply to writing Foxx services for a
standalone server also apply to writing services for a cluster:

You should avoid any kind of file system state beyond the deployed service
bundle itself. Don't [write data to the file system](foxx-guides-files.html) or encode
any expectations of the file system state other than the files in the
service folder that were installed as part of the service
(e.g. don't use file uploads or custom log files).

Additionally, special precautions need to be taken when using the
[development mode in a cluster](foxx-guides-development-mode.html#in-a-cluster).

How ArangoDB distributes services
---------------------------------

When you install, replace, upgrade or remove a service, these actions first
take place on a single Coordinator and are then distributed to the other
Coordinators. If a Coordinator for some reason fails to be informed,
its periodic self-healing process will pick up the changes eventually
and apply them anyway.

1.  When installing, upgrading or replacing a service, the new service is
    extracted to a temporary directory where Foxx validates the manifest file
    and parses the referenced scripts and main file.

2.  When replacing, upgrading or removing a service, the old service's teardown
    script is executed in a single thread of the Coordinator as desired.

3.  When replacing, upgrading or installing a service, the new service's setup
    script is executed in a single thread of the Coordinator as desired.

4.  The validated service bundle is copied to the Coordinator's service bundles
    directory, extracted to the Coordinator's service directory and committed
    to an internal collection along with a signature.

5.  The service metadata stored in another internal collection is updated,
    replaced or created with the new service bundle's signature. An upgrade
    retains existing metadata like configuration and dependencies whereas
    a replace completely discards any existing metadata.

6.  The existing service is unloaded from the Coordinator's worker threads
    and the new service is reloaded. If the new service runs into an error
    at this point, the service will be marked as broken and
    needs to be replaced manually.

7.  The Coordinator triggers a local self-heal followed by triggering
    a self-heal on all other Coordinators.

8.  During the self-heal the Coordinator compares the signature of the
    local bundle of each service against the signature stored in that
    service's metadata in the database. If necessary, the corresponding
    new bundle is downloaded from the database and extracted and the service
    is reloaded as in step 6 before.

Note that this means that any service that passes the initial validation step
will complete the install, upgrade or replace process, even if any of the
consecutive steps fail (e.g. due to a runtime error encountered while executing
the service's main file or a syntax error in a required file not referenced
from the manifest directly).
