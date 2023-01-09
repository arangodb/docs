---
fileID: upgrading-osspecific-info-linux
title: Upgrading on Linux
weight: 1315
description: 
layout: default
---
By installing the new ArangoDB package the standalone instance is automatically
upgraded. In addition to the ArangoDB daemon (_arangod_), also the ArangoDB
_Starter_ binary is updated. As a result, the procedure described in this _Section_
is a first step to upgrade more complex deployments such as [Cluster](../../deployment/cluster/)
or [Active Failover](../../deployment/active-failover/). 

## Upgrading via APT (Ubuntu)

First add the repository key to _apt_:

{{< tabs >}}
{{% tab name="" %}}
```
curl -OL https://download.arangodb.com/arangodb33/xUbuntu_17.04/Release.key
sudo apt-key add - < Release.key
```
{{% /tab %}}
{{< /tabs >}}

Use **apt-get** to install arangodb:

{{< tabs >}}
{{% tab name="" %}}
```
echo 'deb https://download.arangodb.com/arangodb33/xUbuntu_17.04/ /' | sudo tee /etc/apt/sources.list.d/arangodb.list
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install arangodb3=3.3.10
```
{{% /tab %}}
{{< /tabs >}}

**Note**: The latest available version can be found in the [download section](https://www.arangodb.com/download-major/ubuntu/).

## Upgrading via DPKG (Ubuntu)

Download the corresponding file from the [download section](https://download.arangodb.com/).

Install a specific package using **dpkg**:

{{< tabs >}}
{{% tab name="" %}}
```
$ dpkg -i arangodb3-3.3.10-1_amd64.deb
```
{{% /tab %}}
{{< /tabs >}}

## Upgrading via YUM (CentOS)

Use **yum** to install ArangoDB:

{{< tabs >}}
{{% tab name="" %}}
```
cd /etc/yum.repos.d/
curl -OL https://download.arangodb.com/arangodb33/CentOS_7/arangodb.repo
yum -y install arangodb3-3.3.10
```
{{% /tab %}}
{{< /tabs >}}

**Note**: The latest available version can be found in the [download section](https://www.arangodb.com/download-major/centos/).

## Upgrading via RPM (CentOS)

Download the corresponding file from the [download section](https://download.arangodb.com/).

Install a specific package using **rpm**:

{{< tabs >}}
{{% tab name="" %}}
```
$ rpm -i arangodb3-3.3.10-1.x86_64.rpm
```
{{% /tab %}}
{{< /tabs >}}
