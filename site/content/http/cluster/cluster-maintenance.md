---
fileID: cluster-maintenance
title: 
weight: 2535
description: 
layout: default
---
<!-- js/actions/api-cluster.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/maintenance:
    put:
      description: "\nThis API allows to temporarily enable the supervision maintenance\
        \ mode. Please be aware that no\nautomatic failovers of any kind will take\
        \ place while the maintenance mode is enabled.\nThe cluster supervision reactivates\
        \ itself automatically at some point after disabling it.\n\nTo enable the\
        \ maintenance mode the request body must contain the string `\"on\"`\n(Please\
        \ note it _must_ be lowercase as well as include the quotes). This will enable\
        \ the\nmaintenance mode for 60 minutes, i.e. the supervision maintenance will\
        \ reactivate itself\nafter 60 minutes.\n\nSince ArangoDB 3.8.3 it is possible\
        \ to enable the maintenance mode for a different \nduration than 60 minutes,\
        \ it is possible to send the desired duration value (in seconds) \nas a string\
        \ in the request body. For example, sending `\"7200\"`\n(including the quotes)\
        \ will enable the maintenance mode for 7200 seconds, i.e. 2 hours.\n\nTo disable\
        \ the maintenance mode the request body must contain the string `\"off\"`\
        \ \n(Please note it _must_ be lowercase as well as include the quotes).\n\n"
      responses:
        '200':
          description: |2+
             is returned when everything went well.
        '400':
          description: |2+
             if the request contained an invalid body
        '501':
          description: |2+
             if the request was sent to a node other than a Coordinator or single-server
      tags:
      - Cluster
```

