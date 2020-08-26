---
layout: default
description: How to create projects and to group deployments in your Oasis organization.
title: ArangoDB Oasis Project Guide
---
# Project Guide

## Deployments



## Reference: ArangoDB Oasis Site Hierarchy

Your global account holds:

- Organizations (each has exactly 1 policy)
- Members (contains members of an organization)
- Groups (contains groups of related members)
- Roles (contains individual permissions that can be assigned to members or groups)
- Policy (binds roles to members or groups on an organization level)
- Projects (each has exactly 1 policy)
  - Deployments (contains ArangoDB instances, each has exactly 1 policy)
  - Certificate (utilized for encrypted remote administration)
  - Policy (binds roles to members or groups on a project level)
