---
layout: default
description: Please keep in mind that each database contains its own system collections,which need to be set up when a database is created
---
Notes about Databases
=====================

Please keep in mind that each database contains its own system collections,
which need to be set up when a database is created. This will make the creation
of a database take a while.

Foxx applications
are also available only in the context of the database they have been installed 
in. A new database will only provide access to the system applications shipped
with ArangoDB (that is the web interface at the moment) and no other Foxx
applications until they are explicitly installed for the particular database.
