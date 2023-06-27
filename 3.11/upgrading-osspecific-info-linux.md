---
layout: default
description: By installing the new ArangoDB package the standalone instance is automatically upgraded
---
Upgrading on Linux
==================

By installing the new ArangoDB package the standalone instance is automatically
upgraded. In addition to the ArangoDB daemon (_arangod_), also the ArangoDB
_Starter_ binary is updated. As a result, the procedure described below
is a first step to upgrade more complex deployments such as a
[Cluster](architecture-deployment-modes-cluster-architecture.html) or an
[Active Failover](architecture-deployment-modes-active-failover.html) setup.

{% hint 'warning' %}
It is highly recommended to take a backup of your data before upgrading ArangoDB
using [_arangodump_](programs-arangodump.html).
{% endhint %}

Upgrading via APT (Ubuntu)
--------------------------

First add the repository key to _apt_:

```
curl -OL https://download.arangodb.com/arangodb33/xUbuntu_17.04/Release.key
sudo apt-key add - < Release.key
```

Use **apt-get** to install arangodb:

```
echo 'deb https://download.arangodb.com/arangodb33/xUbuntu_17.04/ /' | sudo tee /etc/apt/sources.list.d/arangodb.list
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install arangodb3=3.3.10
```

**Note**: The latest available version can be found in the [download section](https://www.arangodb.com/download-major/ubuntu/){:target="_blank"}.

Upgrading via DPKG (Ubuntu)
---------------------------

Download the corresponding file from the [download section](https://download.arangodb.com/){:target="_blank"}.

Install a specific package using **dpkg**:

```
$ dpkg -i arangodb3-3.3.10-1_amd64.deb
```

Upgrading via YUM (CentOS)
-------------------------

Use **yum** to install ArangoDB:

```
cd /etc/yum.repos.d/
curl -OL https://download.arangodb.com/arangodb33/CentOS_7/arangodb.repo
yum -y install arangodb3-3.3.10
```

**Note**: The latest available version can be found in the [download section](https://www.arangodb.com/download-major/centos/){:target="_blank"}.

Upgrading via RPM (CentOS)
---------------------------

Download the corresponding file from the [download section](https://download.arangodb.com/){:target="_blank"}.

Install a specific package using **rpm**:

```
$ rpm -i arangodb3-3.3.10-1.x86_64.rpm
```
