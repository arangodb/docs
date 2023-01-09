---
fileID: foxx-management
title: Foxx Service Management
weight: 2205
description: 
layout: default
---
This is an introduction to ArangoDB's HTTP interface for managing Foxx services.
```http-spec
openapi: 3.0.2
paths:
  /_api/foxx:
    get:
      description: |2+
        Fetches a list of services installed in the current database.
        Returns a list of objects with the following attributes:
        - *mount*: the mount path of the service
        - *development*: *true* if the service is running in development mode
        - *legacy*: *true* if the service is running in 2.8 legacy compatibility mode
        - *provides*: the service manifest's *provides* value or an empty object
        Additionally the object may contain the following attributes if they have been set on the manifest:
        - *name*: a string identifying the service type
        - *version*: a semver-compatible version string
      parameters:
      - name: excludeSystem
        schema:
          type: boolean
        required: false
        description: |+
          Whether or not system services should be excluded from the result.
        in: query
      responses:
        '200':
          description: |2
            Returned if the request was successful.
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/service:
    get:
      description: |2+
        Fetches detailed information for the service at the given mount path.
        Returns an object with the following attributes:
        - *mount*: the mount path of the service
        - *path*: the local file system path of the service
        - *development*: *true* if the service is running in development mode
        - *legacy*: *true* if the service is running in 2.8 legacy compatibility mode
        - *manifest*: the normalized JSON manifest of the service
        Additionally the object may contain the following attributes if they have been set on the manifest:
        - *name*: a string identifying the service type
        - *version*: a semver-compatible version string
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      responses:
        '200':
          description: |2
            Returned if the request was successful.
        '400':
          description: |2
            Returned if the mount path is unknown.
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx:
    post:
      description: |2+
        Installs the given new service at the given mount path.
        The request body can be any of the following formats:
        - `application/zip`: a raw zip bundle containing a service
        - `application/javascript`: a standalone JavaScript file
        - `application/json`: a service definition as JSON
        - `multipart/form-data`: a service definition as a multipart form
        A service definition is an object or form with the following properties or fields:
        - *configuration*: a JSON object describing configuration values
        - *dependencies*: a JSON object describing dependency settings
        - *source*: a fully qualified URL or an absolute path on the server's file system
        When using multipart data, the *source* field can also alternatively be a file field
        containing either a zip bundle or a standalone JavaScript file.
        When using a standalone JavaScript file the given file will be executed
        to define our service's HTTP endpoints. It is the same which would be defined
        in the field `main` of the service manifest.
        If *source* is a URL, the URL must be reachable from the server.
        If *source* is a file system path, the path will be resolved on the server.
        In either case the path or URL is expected to resolve to a zip bundle,
        JavaScript file or (in case of a file system path) directory.
        Note that when using file system paths in a cluster with multiple Coordinators
        the file system path must resolve to equivalent files on every Coordinator.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path the service should be installed at.
        in: query
      - name: development
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to enable development mode.
        in: query
      - name: setup
        schema:
          type: boolean
        required: false
        description: |+
          Set to `false` to not run the service's setup script.
        in: query
      - name: legacy
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to install the service in 2.8 legacy compatibility mode.
        in: query
      responses:
        '201':
          description: |2
            Returned if the request was successful.
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/service:
    delete:
      description: |2+
        Removes the service at the given mount path from the database and file system.
        Returns an empty response on success.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      - name: teardown
        schema:
          type: boolean
        required: false
        description: |+
          Set to `false` to not run the service's teardown script.
        in: query
      responses:
        '204':
          description: |2
            Returned if the request was successful.
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/service:
    put:
      description: |2+
        Removes the service at the given mount path from the database and file system.
        Then installs the given new service at the same mount path.
        This is a slightly safer equivalent to performing an uninstall of the old service
        followed by installing the new service. The new service's main and script files
        (if any) will be checked for basic syntax errors before the old service is removed.
        The request body can be any of the following formats:
        - `application/zip`: a raw zip bundle containing a service
        - `application/javascript`: a standalone JavaScript file
        - `application/json`: a service definition as JSON
        - `multipart/form-data`: a service definition as a multipart form
        A service definition is an object or form with the following properties or fields:
        - *configuration*: a JSON object describing configuration values
        - *dependencies*: a JSON object describing dependency settings
        - *source*: a fully qualified URL or an absolute path on the server's file system
        When using multipart data, the *source* field can also alternatively be a file field
        containing either a zip bundle or a standalone JavaScript file.
        When using a standalone JavaScript file the given file will be executed
        to define our service's HTTP endpoints. It is the same which would be defined
        in the field `main` of the service manifest.
        If *source* is a URL, the URL must be reachable from the server.
        If *source* is a file system path, the path will be resolved on the server.
        In either case the path or URL is expected to resolve to a zip bundle,
        JavaScript file or (in case of a file system path) directory.
        Note that when using file system paths in a cluster with multiple Coordinators
        the file system path must resolve to equivalent files on every Coordinator.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      - name: teardown
        schema:
          type: boolean
        required: false
        description: |+
          Set to `false` to not run the old service's teardown script.
        in: query
      - name: setup
        schema:
          type: boolean
        required: false
        description: |+
          Set to `false` to not run the new service's setup script.
        in: query
      - name: legacy
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to install the new service in 2.8 legacy compatibility mode.
        in: query
      - name: force
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to force service install even if no service is installed under given mount.
        in: query
      responses:
        '200':
          description: |2
            Returned if the request was successful.
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/service:
    patch:
      description: |2+
        Installs the given new service on top of the service currently installed at the given mount path.
        This is only recommended for switching between different versions of the same service.
        Unlike replacing a service, upgrading a service retains the old service's configuration
        and dependencies (if any) and should therefore only be used to migrate an existing service
        to a newer or equivalent service.
        The request body can be any of the following formats:
        - `application/zip`: a raw zip bundle containing a service
        - `application/javascript`: a standalone JavaScript file
        - `application/json`: a service definition as JSON
        - `multipart/form-data`: a service definition as a multipart form
        A service definition is an object or form with the following properties or fields:
        - *configuration*: a JSON object describing configuration values
        - *dependencies*: a JSON object describing dependency settings
        - *source*: a fully qualified URL or an absolute path on the server's file system
        When using multipart data, the *source* field can also alternatively be a file field
        containing either a zip bundle or a standalone JavaScript file.
        When using a standalone JavaScript file the given file will be executed
        to define our service's HTTP endpoints. It is the same which would be defined
        in the field `main` of the service manifest.
        If *source* is a URL, the URL must be reachable from the server.
        If *source* is a file system path, the path will be resolved on the server.
        In either case the path or URL is expected to resolve to a zip bundle,
        JavaScript file or (in case of a file system path) directory.
        Note that when using file system paths in a cluster with multiple Coordinators
        the file system path must resolve to equivalent files on every Coordinator.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      - name: teardown
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to run the old service's teardown script.
        in: query
      - name: setup
        schema:
          type: boolean
        required: false
        description: |+
          Set to `false` to not run the new service's setup script.
        in: query
      - name: legacy
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to install the new service in 2.8 legacy compatibility mode.
        in: query
      - name: force
        schema:
          type: boolean
        required: false
        description: |+
          Set to `true` to force service install even if no service is installed under given mount.
        in: query
      responses:
        '200':
          description: |2
            Returned if the request was successful.
      tags:
      - Foxx
```


