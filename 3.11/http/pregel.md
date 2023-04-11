---
layout: default
description: >-
  The HTTP API for Pregel lets you execute, cancel, and list Pregel jobs
---
# Pregel HTTP API

{{ page.description }}
{:class="lead"}

See [Distributed Iterative Graph Processing (Pregel)](../graphs-pregel.html)
for details.

## Start A Pregel Job

{% docublock post_api_control_pregel %}

## Status Of Running Pregel Jobs

{% docublock get_api_control_pregel_pregel %}
{% docublock get_api_control_pregel %}

## Cancel Running Pregel

{% docublock delete_api_control_pregel_pregel %}

## Status Of All Past Pregel Jobs

{% docublock get_api_control_pregel_history %}