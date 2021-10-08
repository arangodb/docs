---
layout: default
description: ArangoDB Enterprise License Management
---
Enterprise License Management
=============================

This section includes information related to the administration of
your enterprise license.

{% hint 'tip' %}
Backups, restores, exports and imports and the license feature do not
interfere with eachother. In other words, the license is not backed up
and restored with and of the above mechanisms.
{% endhint %}

{% hint 'warning' %}
This implies that one has to save their license individually. Please
make sure that you know where you have stored your license, and
potentially the email with which you received it.
{% endhint %}

Initial Installation
--------------------

First and foremost: no Worries! The first installation of any ArangoDB
enterprise instance can be immediately used for testing without
restrictions for three days.

In the Email with the download link you will find a full featured but
timewise limited license which allows users to continue testing for 2
weeks.

This evaluation license is applied after startup via `arangosh` like
so:

```js
127.0.0.1:8529@_system> db._setLicense("<license-string>");
```

One receives a message reporting to the success of the
operation. Please be careful to copy the exact string from the Email
and to put it in quotes as indicated above.

```js
{ "error" : false, "code" : 201}
```

Your license has now been applied.

Managing your license
---------------------

At any point you may check the current state of your license from `arangosh`:

```js
127.0.0.1:8529@_system> db._getLicense();
```
```js
{
  "features": {
    "expires": 1632411828
  },
  "license": "JD4E ... dnDw==",
  "version": 1,
  "status": "good"
}
```

The `status` attribute is the executive summary of your license and
can have the following values:

* `good`: your license valid for more than another 2 weeks.
* `expiring`: your license is about to expire shortly. Please contact
  your ArangoDB sales representative to acquire a new license of
  extend your old license.
* `expired`: your license has expired recently. All existing
  enterprise features keep on functioning. However, no new enterprise
  features can be used. This should prompt immediate contact with your
  ArangoDB sales representative or sales@arangodb.com.
* `read-only`: your license has expired for over 2 weeks at which
  point the instance is in read-only mode. As the mode says all read
  operations to the instance will keep functioning. However, no data
  or data definition changes can be made. Please contact your ArangoDB
  sales representative immediately.

The attribute `expires` in `features` denotes the exiry date in
seconds since Jan 1 1970 UTC.

The `license` field holds an encrypted version of the the applied
license for reference and support from ArangoDB.

Monitoring
----------

In order to monitor the remaining validity of the license, the metric
`arangodb_license_expires` is exposed by coordinators and database
servers. Please find its documentation [hier](http/administration-and-monitoring-metrics.html).

