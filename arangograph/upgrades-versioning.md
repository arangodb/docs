---
layout: default
description: >-
  Select which version of ArangoDB you want to use within your ArangoGraph
  deployment and choose when to roll out your upgrades
---
# Upgrades and Versioning

{{ page.description }}
{:class="lead"}

{% hint 'info' %}
Please note that this policy comes into effect in April 2023.
{% endhint %}

## Release Definitions

The following definitions are used for release types of ArangoDB within ArangoGraph:

| Release  | Introduces  | Contains breaking changes  |
|----------|-------------|----------------------------|
| **Major** (`X.y.z`) | Major new features and functionalities | Likely large changes |
| **Minor** (`x.Y.z`) | Some new features or improvements | Likely small changes |
| **Patch** (`x.y.Z`) | Essential fixes and improvements | Small changes in exceptional circumstances |

## Release Channels

When creating a deployment in ArangoGraph, you can select the minor version
of ArangoDB that your deployment is going to use. This minor version is in the
format `Major.Minor` and indicates the major and minor version of ArangoDB that
is used in this deployment, for example `3.10` or `3.9`.

To provide secure and reliable service, databases are deployed on the latest
available patch version in the selected version. For example, if `3.10` is
selected and `3.10.3` is the latest version of ArangoDB available for the `3.10`
minor version, then the deployment is initially using ArangoDB `3.10.3`.

## End of Life (EoL)

Each minor version’s availability within ArangoGraph is based on the end of
life date of that particular minor version of ArangoDB, as published in the
[ArangoDB EoL policy](https://www.arangodb.com/master-services-agreement-inc-august-2019/#eolpolicy){:target="_blank"}.
You can refer to the upcoming EoL versions on the
[end of life announcements](https://www.arangodb.com/subscriptions/end-of-life-notice/){:target="_blank"} page.

You can create new deployments of ArangoDB using a minor version up to one
month before the planned end of life date.

## Upgrades

### Manual Upgrades

At any time, you can change the release channel of your deployment to a later
release channel, but not to an earlier one. For example, if you are using `3.10`
then you can change your deployment’s release channel to `3.11`, but you would
not be able to change the release channel to `3.9`.
See [how to edit a deployment](deployments.html#how-to-edit-a-deployment).

Upon changing your release channel, an upgrade process for your deployment is
initiated to upgrade your running database to the latest patch release of your
selected release channel. You can use this mechanism to upgrade your deployments
at a time that suits you, prior to the forced upgrade when your release channel
reaches its end of life.

### Automatic Upgrades

#### Major Versions (`X.y.z`)

The potential disruption of a major version upgrade requires additional testing
of any applications connecting to your ArangoGraph deployment. As a result, when
a new major version is released on the ArangoGraph platform, an email is sent out
to inform you of this release.

You are not forced to upgrade to the latest major release channel until all
other previous release channels have reached their end of life. For example,
you are not forced to upgrade to `4.0` or later until the latest `3.Y` release
channel is end of life. Typically, this would provide a window of upgrade of
around 12 months. It is recommended to pro-actively test with and upgrade to
the latest release channel when it becomes available, rather than waiting for
the end of life of your existing release channel with a forced upgrade.

In the event that you are using the last minor version of a previous major
version that reaches end of life, you are forcibly upgraded to the next
available version. For example, if you are using `3.11` and the version
channels `4.0` and `4.1` are also available, upon the end of life of `3.11`,
you are going to be upgraded to the `4.0` release channel, not `4.1`.

#### Minor Versions (`x.Y.z`)

Although minor upgrades are not expected to cause significant compatibility
changes like major versions, they may still require additional planning and
validation.

This is why minor upgrades are treated in the same manner as major upgrades
within ArangoGraph. When a new minor version is released on the ArangoGraph
platform, an email is sent out to inform you of this release.

You are not forced to upgrade to the next major version until all other
previous release channels have reached their end of life. For example,
if you are running the `3.9` release channel and it reaches end of life,
you are going to be upgraded to `3.10` rather than `3.11`. Typically, this
would provide a window of upgrade of around 12 months. It is recommended to
pro-actively test with and upgrade to the latest release channel when it becomes
available, rather than waiting for the end of life of your existing release
channel with a forced upgrade.

#### Patch Versions (`x.y.Z`)

Upgrades between patch versions are transparent, with no significant disruption
to your applications. As such, you can expect to be automatically upgraded to
the latest patch version of your selected minor version shortly after it becomes
available in ArangoGraph.

ArangoGraph aims to give approximately one week’s notice prior to upgrading your
deployments to the latest patch release. Although in exceptional circumstances
(such as a critical security issue) the upgrade may be triggered with less than
one week's notice.
The upgrade is carried out automatically. However, if your organization belongs 
to the Enterprise tier, you contact the ArangoGraph Support team to request that
this upgrade is manually deferred temporarily.
