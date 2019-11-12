---
layout: default
description: This guide explains which access control concepts are available in Oasis and how to use them.
title: Access control in ArangoDB Oasis
---
# Access control in ArangoDB Oasis

_Note_: You can also view the [support video on access control](https://www.youtube.com/watch?v=nhg1Y39JZF8&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=7&t=0s){:target="_blank"}.

This guide explains which access control concepts are available in
ArangoDB Oasis (short Oasis) and how to use them.

## Access control subjects

Oasis has a level structured set of resources that are the subject of access control.

Those resources are:

- **Organizations**: They represent (commercial) entities such as companies.
- **Projects**: They represent organizational units such as teams or applications.
- **Deployments**: The actual instances of the ArangoDB database.

Each of these resources have a set of operations that can be invoked upon them.
For example, you can *create* a project in an organization.

## Permissions

Each operation (invoked on a resource) requires zero or more *permissions*.
A permission is a constant string such as `resourcemanager.project.create.
Permissions are defined in the Oasis API and are constant.

## Users, groups & members

When you use Oasis, you are logged in as a user.
A user has properties such as name & email address.
Most important of the user is that it serves as an identity of a person.

A user is member of one or more organizations in Oasis.
You can become a member of an organization in the following ways:

- Create a new organization. You will become the first member and owner of that organization.
- Be invited to join an organization. Once accepted (by the invited user), this user
  becomes a member of the organization.

If the number of members of an organization becomes large, it helps to group
users. In Oasis a group is part of an organization and a group contains
a list of users. All users of the group must be member of the owning organization.

## Roles

As we've seen before, operations on resources in Oasis require zero or more permissions.
Since the number of permissions is large and very detailed, it is not practical
to assign permissions directly to users.
Instead Oasis has *roles*. A role is a list of permissions.

Roles can be predefined or created custom.

Predefined roles are created by Oasis and group permissions together in a logical
role. An example of a predefine role is `deployment-viewer`. That role contains
all permissions needed to view deployments in a project.

## Policy

To give a user (or a group of user) access to resources of Oasis,
you assign a role to that user (or group). This is done in a *policy*.

A policy contains a list of a bindings from role to user(s) for a specific resource.
This means that there is a unique policy per resource.

For example the policy for the `Example.com` organization contains bindings
from roles to user(s) (who must be member of the `Example.com` organization).
These bindings are used to give these users permissions to invoke operations
on the `Example.com` organization.

## Permission inheritance

As we've seen before, Oasis has a level structured set of resources:

- organization
- project
- deployment

Each resource in this structure has its own policy, but this does not
mean that you have to repeat access control bindings on all these policies.

Once you assign a role to a user (or group of users) in a policy at one level,
all the permissions of that role are inherited in lower levels.

For example if you bind the role `deployment-viewer` to user `John` in the policy
of an organization, `John` will have all the permissions contained in that role in
all projects of that organization and all deployments in those projects as well.

An other example. If you bind the role `deployment-viewer` to user `John`
in a project, `John` will have all the permissions contained in that role in that
project as well as in all deployments contained in that project, but not in
other projects of the containing organization.
