---
layout: default
description: The license feature manages the enterprise license functionality
---
HTTP Interface for the License feature
=================================

The license feature is the facility that manages all functionality related to enterprise licensing in ArangoDB.
The http API, that allows one to both view current license status as well as assign a license to an ArangoDB cluster is callable on coordinators and database servers of enterprise editions.

```
curl -XGET http://$SERVER:$PORT/_admin/license
```
```js
{
  "features": {
    "expires": 1640255734
  },
  "license": "JD4EOk5fcxcGeigDcEAzATBUHFUwUTpaOH9aeE9+ewNhN2hbV2RFRz4ULw03an1HblZIK1hfFAxnX0J/UAcAQXttcX9SRgVOb1sqVVI2YEE1Xy0tAzlVUD1eX3wsWAR0f3cFW2F3fENXelwWbzp/A1EONgp/WisTOAU/LhIJDh9/BS9Tajd3cE8iASlcQAweLyRgG3dlAxxqBw9eNWd9dVBfbiYbEAAeYUlbbmJvAglheXpgZnRrZG1nXB5sXFxDYwdrY2ExFnczWHtRVRcBIRlAGhJ+AnMVYVtFYGFtfBxjcGtOSG9aXQdHZ0UyUxN4Zg8nN2YOExYAZBVEUSQscyxbUhwGcy1LYHEsETpDKA1TZGdTV35wCWcHdAdnWjY1FhlhYFdeQHt1JGtqf1N9SlNXZlxld0VNYnhmGVR/WU8HC0MJZ2EuSAx2BBd5DjFEaVgGW2QdRQF4X0ZNeGFkY2EJbDthAXQXAjRiZTUIKH4yBjB9B3VdTC86XSJhQ2cVVgoAe2YIIwp4N29qYGVrB3t6KQRkAmcAbQ4YchkDFGFpbw1rM3xeWHYDCkpjYGV0Ux93Q2p/d3hrBV8zNwIrQHsNYwweGT9bNiNpSlVSZX16akNMUENmYmtzZ2w1WxpAVmU1DwEAYTIoNnc2EhI+JGMAWSExbThDamsvfSxxRXEwNAtrAwkDQ2YJXW9RJGhlUAFwBQUHLyQ3H2F1YQhQCHcDQXx9ZWRlUGBBcn5VfX1lH3tyV3MmHFAKAwU0dwR+HgdnWw==",
  "version": 1,
  "status": "good"
}
```

The `expires` key lists the expiry date as seconds since Jan 1 1970 UTC. The `status` key allows one to confirm the state of the installed license on a glance.
The possible values are as follows:

* `good`: the license is valid for more than 2 weeks.
* `expiring`: the license is valid for less than 2 weeks.
* `expired`: the license has expired. In this situation, no new enterprise features can be utilised.
* `read-only`: the license is expired over 2 weeks. The instance is now restricted to read-only mode.

To install a new license into the installation, a single `PUT` call to any coordinator is performed:

```
curl -XPUT http://$SERVER:$PORT/_admin/license -d '"<license-string>"'
```
```js
{
  "result": {
    "error": false,
    "code": 201
  }
}
```

