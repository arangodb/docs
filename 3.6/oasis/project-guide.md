---
layout: default
description: How to create projects and to group deployments in your Oasis organization.
title: ArangoDB Oasis Project Guide
---
# Project Guide

This guide explains how to create projects in Oasis, and how they are used to
group deployments in your organization.

## Organizations

At the highest level of the Oasis deployment hierarchy are organizations.
An organization typically represents a (commercial) entity such as a company,
company division, institution or non-profit organization.

In the general hierarchy, organizations are a container for projects.

![Oasis My Organizations](../images/oasis-my-organizations.png)

### Creating a new organization

1. In the upper right hand corner click the _User_ icon.
2. From the drop-down menu that appears, click the _My organizations_ link.
3. All the organizations you have access to will be listed here.
4. To create a new organization, press the _New organization_ button.
5. To edit the name or description of an existing organization, in the action
   column click the _Edit_ icon (the pad of paper with pencil).

![Oasis New Organization](../images/oasis-new-org.png)

Also see the video
[Organizations with ArangoDB Oasis](https://www.youtube.com/watch?v=raQPpCyrRtY&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=3&t=0s){:target="_blank"}.

**Notes**

- You can only be a member of one _Free to try_ organization at a time.
- Organizations contain exactly **one policy**.
- Within that policy, you can define role bindings to regulate access control
  on an organization level.

{% hint 'warning' %}
Deleting an organization will delete all projects and deployments contained in
the organization. This operation is **irreversible**.
{% endhint %}

## Projects

Below organizations in the Oasis deployment hierarchy are projects. They can
represent organizational units such as teams, product groups, environments
(e.g. staging vs. production). You can have any number of projects under one
organization.

Projects are a container for related deployments, certificates & IP whitelists.
Projects also come with their own policy for access control. You can have any
number of deployment under one project.

In essence, you can create whatever structure fits you for a given organization,
its projects and deployments.

![Oasis Projects Overview](../images/oasis-projects-overview.png)

Also see the video
[Projects with ArangoDB Oasis](https://www.youtube.com/watch?v=b7q-PdLEpug&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=4&t=0s){:target="_blank"}.

### Creating a new project

1. In the main navigation, in the _Projects_ section, click the _Overview_ link.
2. Click the _New project_ button.
3. Enter a name and optional description for your new project.

   ![Oasis New Project](../images/oasis-new-project.png)

4. Click the _Create_ button.
5. You will now be taken to the project summary page.

   ![Oasis Project Summary](../images/oasis-project.png)

**Notes**

- Projects contain exactly **one policy**.
- Within that policy, you can define role bindings to regulate access control
  on a project level.

{% hint 'warning' %}
Deleting a project will delete contained deployments, certificates & IP whitelists.
This operation is **irreversible**.
{% endhint %}

## Deployments

Below projects in the Oasis deployment hierarchy are deployments. A deployment
contains an ArangoDB, configured as you choose. You can have any number of
deployments under one project.

Each deployment can also be backed up manually or automatically by schedules
you can define.

In essence, you can create whatever structure fits you for a given organization,
its projects and deployments.

![Oasis Deployments](../images/oasis-deployments-page.png)

Also see the video
[Create a Deployment on ArangoDB Oasis](https://www.youtube.com/watch?v=yg2FfcNsKFc&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=9&t=0s){:target="_blank"}.

### Creating a new deployment

1. If you don't have a project, yet, [create one first](#creating-a-new-project).
2. In the main navigation, in the _Projects_ section, click on the project for
   which you want to create a new deployment.
3. Navigate to the _Deployments_ tab. You will see an empty list or a list with
   your project's deployments.
4. Press the _New deployment_ button.
5. Set up your deployment (see [Getting Started](./getting-started.html#creating-a-new-deployment)).

![Oasis New Deployment](../images/oasis-new-deployment1.png)

**Notes**

- Deployments contain exactly **one policy**.
- Within that policy, you can define role bindings to regulate access control
  on a deployment level.

{% hint 'warning' %}
Deleting a deployment will delete all its data and backups.
This operation is **irreversible**.
{% endhint %}



## Roles

A role is a set of permissions. Roles can then be bound to groups (preferably)
or individual members. These bindings contribute to the respective organization,
project or deployment policy.

![Oasis Roles](../images/oasis-access-control-roles.png)

### Creating a new role

1. In the main navigation, in the _Access Control_ section, click on _Roles_.
2. Press the _New role_ button.
3. Enter a name and optional description for your new role.
4. Select the permissions you want to assign to your new role.
5. Press the _Create_ button.

![Oasis New Role](../images/oasis-create-role.png)

### Viewing or managing an existing role

1. In the main navigation, in the _Access Control_ section, click on _Roles_.
2. Press the icons in the _Actions_ column to view, edit or delete a role.

**Notes**

- You cannot delete predefined system roles.
- Also see [Reference: predefined roles](#reference-predefined-roles)

## Policy

A policy is a set of bindings that binds roles to groups or individual members.

![Oasis Policy Page](../images/oasis-policy-page.png)

Also see the video
[Access Control with ArangoDB Oasis](https://www.youtube.com/watch?v=nhg1Y39JZF8&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=7&t=0s){:target="_blank"}.

### Oasis permission inheritance

- Permissions are inherited downwards from an organization to its projects and
  from a project to its deployments.
- For more inclusive permissions, add the highest permission for a member or
  group at the at the organization level.
- For more restrictive permissions, add the highest permission at the project
  or even deployment level, and least permission at the organization level.

**Inheritance example**

- Imagine you have a group _Deployers_.
- That group holds all persons that deal with deployments.
- Further imagine you have a role _Deployment Viewer_, containing permission
  `data.deployment.get` and `data.deployment.list`.
- You could now add a role binding of _Deployers_ to _Deployment Viewer_.
- If you add the binding to the organization policy, the members of this group
  will be granted the defined permissions for the organization, all its projects and all its deployments.
- If you add it project A's policy, the members of this group will be granted
  the defined permissions for project A only and its deployments, but not for
  other projects and its deployments.
- If you add it to deployment X's policy of project A, the members of this
  group will be granted the defined permissions for deployment X only, and not
  any other deployment of project A or any other project of the organization.

The role _Deployment viewer_ is effective on the following entities depending
on which policy the binding is added to:

Role binding added to →<br>Role effective on ↓ | Organization policy | Project A's policy | Deployment X's policy of project A |
|:---:|:---:|:---:|:---:|
Organization, its projects and deployments | ✓ | — | —
Project A and its deployments              | ✓ | ✓ | —
Project B and its deployments              | ✓ | — | —
Deployment X of project A                  | ✓ | ✓ | ✓
Deployment Y of project A                  | ✓ | ✓ | —
Deployment Z of project B                  | ✓ | — | —

### Editing a policy

1. Decide whether you want to edit the policy of the organization or of a
   project or deployment.
    - For the organization policy, in the main navigation, in the
      _Access Control_ section, click on _Policy_.
    - For a project policy, in the main navigation, in the _Projects_ section,
      click on the desired project and then navigate to the _Policy_ tab.
    - For a deployment policy, find your deployment and navigate to the
      _Policy_ tab.
2. Press the _New role binding_ button.
3. Select the members or groups to bind to a role.
4. Select the roles that you want to bind to the specified members and groups.
5. Press the _Create_ button.

![Oasis New Role Binding](../images/oasis-new-policy-role-binding.png)

### Viewing or managing the role bindings of a policy

1. Decide whether you want to edit the policy of the organization or of a
   project or deployment.
    - For the organization policy, in the main navigation, in the
      _Access Control_ section, click on _Policy_.
    - For a project policy, in the main navigation, in the _Projects_ section,
      click on the desired project and then navigate to the _Policy_ tab.
    - For a deployment policy, find your deployment and navigate to the
      _Policy_ tab.
2. Press the _Trash_ icon in the 'Actions' column to delete a role binding.
   **Note**: currently, you cannot edit a role binding, you can only delete it.

## Reference: predefined roles

These are predefined roles that already provide a specific set of permissions
for performing specific functions or operations.

| Name | Description |
|:-----|:------------|
| Backup Administrator | `backup-admin` |
| Backup Viewer | `backup-viewer` |
| Backup Policy Administrator | `backuppolicy-admin` |
| Backup Policy Viewer | `backuppolicy-viewer` |
| Billing Administrator | `billing-admin` |
| Billing Viewer | `billing-viewer` |
| CA Certificate Administrator | `cacertificate-admin` |
| CA Certificate Viewer | `cacertificate-viewer` |
| Deployment Administrator | `deployment-admin` |
| Deployment Content Administrator | `deployment-content-admin` |
| Deployment Viewer | `deployment-viewer` |
| Example Datasets Viewer | `exampledataset-viewer` |
| Example Dataset Installation Administrator | `exampledatasetinstallation-admin` |
| Example Dataset Installation Viewer | `exampledatasetinstallation-viewer` |
| Group Administrator | `group-admin` |
| Group Viewer | `group-viewer` |
| IAM provider Administrator | `iamprovider-admin` |
| IAM provider Viewer | `iamprovider-viewer` |
| IP whitelist Administrator | `ipwhitelist-admin` |
| IP whitelist Viewer | `ipwhitelist-viewer` |
| Organization Administrator | `organization-admin` |
| Organization Viewer | `organization-viewer` |
| Policy Administrator | `policy-admin` |
| Policy Viewer | `policy-viewer` |
| Project Administrator | `project-admin` |
| Project Viewer | `project-viewer` |
| Replication Administrator | `replication-admin` |
| Role Administrator | `role-admin` |
| Role Viewer | `role-viewer` |

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
