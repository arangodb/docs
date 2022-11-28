---
fileID: foxx-configuration
title: Foxx Service configuration / dependencies
weight: 2300
description: 
layout: default
---
This is an introduction to ArangoDB's HTTP interface for managing Foxx services configuration and dependencies.
```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/configuration:
    get:
      description: |2+
        Fetches the current configuration for the service at the given mount path.
        Returns an object mapping the configuration option names to their definitions
        including a human-friendly *title* and the *current* value (if any).
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/configuration:
    patch:
      description: |2+
        Replaces the given service's configuration.
        Returns an object mapping all configuration option names to their new values.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  description: |+
                    A JSON object mapping configuration option names to their new values.
                    Any omitted options will be ignored.
              required:
              - data
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/configuration:
    put:
      description: |2+
        Replaces the given service's configuration completely.
        Returns an object mapping all configuration option names to their new values.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  description: |+
                    A JSON object mapping configuration option names to their new values.
                    Any omitted options will be reset to their default values or marked as unconfigured.
              required:
              - data
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/dependencies:
    get:
      description: |2+
        Fetches the current dependencies for service at the given mount path.
        Returns an object mapping the dependency names to their definitions
        including a human-friendly *title* and the *current* mount path (if any).
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/dependencies:
    patch:
      description: |2+
        Replaces the given service's dependencies.
        Returns an object mapping all dependency names to their new mount paths.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  description: |+
                    A JSON object mapping dependency names to their new mount paths.
                    Any omitted dependencies will be ignored.
              required:
              - data
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/dependencies:
    put:
      description: |2+
        Replaces the given service's dependencies completely.
        Returns an object mapping all dependency names to their new mount paths.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  description: |+
                    A JSON object mapping dependency names to their new mount paths.
                    Any omitted dependencies will be disabled.
              required:
              - data
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


