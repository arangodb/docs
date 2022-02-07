---
layout: default
description: ArangoDB v3.10 Release Notes API Changes
---
API Changes in ArangoDB 3.10
============================

This document summarizes the HTTP API changes and other API changes in ArangoDB 3.10.
The target audience for this document are developers who maintain drivers and
integrations for ArangoDB 3.10.

## HTTP RESTful API

### Privilege changes

### Endpoint return value changes

* `/_admin/metrics`, `/_admin/metrics/v2` We removed unnecessary spaces between the "}" delimiting the labels and the value of the metric


### Endpoints added

### Endpoints augmented

### Endpoints moved

### Endpoints deprecated

### Endpoints removed

* `/_admin/metrics`, metrics API v1 was deprecated in 3.8. Now we removed it, and `/_admin/metrics` just redirect you to `/_admin/metrics/v2`.

## JavaScript API
