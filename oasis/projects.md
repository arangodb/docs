---
layout: default
description: How to manage projects
title: Projects in ArangoDB Oasis
---
# Projects

Below organizations in the Oasis deployment hierarchy are projects. They can
represent organizational units such as teams, product groups, environments
(e.g. staging vs. production). You can have any number of projects under one
organization.

**Organizations → <u>Projects</u> → Deployments**

Projects are a container for related deployments, certificates & IP allowlists.
Projects also come with their own policy for access control. You can have any
number of deployment under one project.

In essence, you can create whatever structure fits you for a given organization,
its projects and deployments.

![Oasis Projects Overview](images/oasis-projects-overview.png)

## How to create a new project

1. Click __Overview__ in the __Projects__ section of the main navigation.
2. Click the __New project__ button.
3. Enter a name and optionally a description for your new project.
4. Click the __Create__ button.
5. You will be taken to the project page.
6. To change the name or description, click either at the top of the page.

![Oasis New Project](images/oasis-new-project.png)

![Oasis Project Summary](images/oasis-project.png)

{% hint 'info' %}
Projects contain exactly **one policy**. Within that policy, you can define
role bindings to regulate access control on a project level.
{% endhint %}

## How to create a new deployment

See [Deployments: How to create a new deployment](deployments.html#how-to-create-a-new-deployment)

## How to delete a project

{% hint 'danger' %}
Deleting a project will delete contained deployments, certificates & IP allowlists.
This operation is **irreversible**.
{% endhint %}

1. Click __Overview__ in the __Projects__ section of the main navigation.
2. Click a __recycle bin__ icon in the __Actions__ column.
3. Enter `Delete!` to confirm and click __Yes__.

Alternatively, you can also delete a project via the project page:

1. Click a project name in the __Projects__ section of the main navigation.
2. Click the __Danger zone__ tab.
3. Click the __Delete project...__ button.
4. Enter `Delete!` to confirm and click __Yes__.

{% hint 'tip' %}
If the project has a locked deployment, you need to [unlock](access-control.html#locked-resources)
it first to be able to delete the project.
{% endhint %}

## How to manage IP allowlists

IP allowlists let you limit access to your deployment to certain IP ranges.
It is optional, but strongly recommended to do so.

You can create an allowlist as part of 

1. Click a project name in the __Projects__ section of the main navigation.
2. Click the __Security__ tab.
3. In the __IP allowlists__ section, click:
   - The __New IP allowlist__ button to create a new allowlist.
   - A name or the __eye__ icon in the __Actions__ column to view the allowlist.
   - The __pencil__ icon to edit the allowlist.
     You can also view the allowlist and click the __Edit__ button.
   - The __recycle bin__ icon to delete the allowlist.

## How to manage certificates

Certificates are utilized for encrypted remote administration.

Certificates that do have the __Use well known certificate__ option enabled do
not need any installation and will be supported by almost all web-browsers
automatically.

Each certificate you create in ArangoDB Oasis that has the
__Use well known certificate__ option disabled, you will also need to install on
your local machine. This operation will slightly vary between operating systems.

1. Click a project name in the __Projects__ section of the main navigation.
2. Click the __Security__ tab.
3. In the __Certificates__ section, click:
   - The __New certificate__ button to create a new certificate.
   - A name or the __eye__ icon in the __Actions__ column to view a certificate.
     The dialog that opens provides commands for installing and uninstalling
     the certificate through a console.
   - The __pencil__ icon to edit a certificate.
     You can also view a certificate and click the __Edit__ button.
   - The __tag__ icon to make the certificate the new default.
   - The __recycle bin__ icon to delete a certificate.

![Oasis Certificates](images/oasis-cert-page-with-cert-present.png)

![Oasis Certificate Install Instructions](images/oasis-cert-install-instructions.png)

## How to manage role bindings

See:
- [Access Control: How to view, edit or remove role bindings of a policy](access-control.html#how-to-view-edit-or-remove-role-bindings-of-a-policy)
- [Access Control: How to add a role binding to a policy](access-control.html#how-to-add-a-role-binding-to-a-policy)
