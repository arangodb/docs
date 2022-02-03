---
layout: default
description: How to manage organizations
title: Organizations in ArangoDB Oasis
---
# Organizations

At the highest level of the Oasis deployment hierarchy are organizations.
Organizations are a container for projects.

**<u>Organizations</u> → Projects → Deployments**

An organization typically represents a (commercial) entity such as a company,
a company division, an institution or a non-profit organization.

Users can be members of one or more organizations. However, you can only be a
member of one _Free to try_ tier organization at a time.

## How to switch between my organizations

1. The first entry in the main navigation (with a double arrow icon) indicates
   the current organization.
2. Click it to bring up a dropdown menu to select another organization of which you
   are a member.
3. The overview will open for the selected organization, showing the number of
   projects, the tier and when it was created.

![Oasis Organization Switcher](images/oasis-organization-switcher.png)

![Oasis Organization Overview](images/oasis-organization-overview.png)

## How to upgrade to professional

ArangoDB Oasis comes with a free-to-try tier that lets you test our ArangoDB
Cloud for free for 14 days. After the trial period, your deployments will
be deleted automatically.

You can convert to the professional service model at any time by adding
your billing details and at least one payment method. You can then create
additional organizations and projects and have more and larger deployments.

See [Billing: How to add billing details / payment methods](billing.html)

![Oasis Billing](images/oasis-billing.png)

## How to create a new organization

See [My Account: How to create a new organization](my-account.html#how-to-create-a-new-organization)

## How to restrict access to an organization

If you want to restrict access to an organization, you can do it by specifying which authentication providers are accepted for users trying to access the organization. For more information, refer to the [Access Control](access-control.html#restricting-access-to-organizations) section.

## How to delete the current organization

{% hint 'danger' %}
Removing an organization implies the deletion of projects and deployments.
This operation cannot be undone and **all deployment data will be lost**.
Please proceed with caution.
{% endhint %}

1. Click **Overview** in the **Organization** section of the main navigation.
2. Open the **Danger zone** tab.
3. Click the **Delete organization** button.
4. Enter `Delete!` to confirm and click **Yes**.

{% hint 'info' %}
If you are no longer a member of any organization, then a new organization is
created for you when you log in again.
{% endhint %}

{% hint 'tip' %}
If the organization has a locked resource (a project or a deployment), you need to [unlock](access-control.html#locked-resources)
that resource first to be able to delete the organization.
{% endhint %}