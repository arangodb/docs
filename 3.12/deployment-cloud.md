---
layout: default
---
# Deploying Options in the _Cloud_

## Deploying ArangoDB on AWS

ArangoDB can be deployed on AWS or other cloud platforms. AWS is the
infrastructure provider choice for some of the largest ArangoDB installations.

Up to and including ArangoDB 3.2, official ArangoDB AMI were available in the
[AWS marketplace](https://aws.amazon.com/marketplace/search/results/ref=dtl_navgno_search_box?page=1&searchTerms=arangodb){:target="_blank"}.
Such AMIs are not being maintained anymore, though. However, deploying on AWS
is still possible, and again, a quite common scenario.

After having initialized your preferred AWS instance with one of the ArangoDB supported
operating systems, using the ArangoDB Starter, performing a Manual Deployment, or using
Kubernetes are all valid options to deploy on AWS.

{% hint 'info' %}
In order to deploy on AWS, general guidelines like using a fast, **direct-attached**
SSD disk for the data directory of the ArangoDB processes apply.

We recommend [**EC2 I3 instances**](https://aws.amazon.com/ec2/instance-types/i3/){:target="_blank"}
and to use **io1** storage rather than **gp2** on AWS, which are specifically
designed with higher IOPS demands of databases in mind. Note that replication by
itself generates a manifold of the incoming write load in the back end. Also see the
[AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html){:target="_blank"}.
{% endhint %}

## Deploying ArangoDB on Microsoft Azure

ArangoDB can be deployed on Azure or other cloud platforms. Deploying on a cloud
provider is common choice and many of the most big ArangoDB installation are running
on the cloud.

No Azure-specific scripts or tools are needed to deploy on Azure. Deploying on Azure
is still possible, and again, a quite common scenario.

After having initialized your preferred Azure instance, with one of the ArangoDB supported
operating systems, using the ArangoDB Starter, performing a Manual Deployment,or using
Kubernetes are all valid options to deploy on Azure.

**Important:** In order to deploy on Azure, general guidelines, like using a fast,
**direct-attached**, SSD disk for the data directory of the ArangoDB processes
apply.