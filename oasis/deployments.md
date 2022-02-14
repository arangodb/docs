---
layout: default
description: How to manage deployments
title: Deployments in ArangoDB Oasis
---
# Deployments

Below projects in the Oasis deployment hierarchy are deployments. A deployment
contains an ArangoDB, configured as you choose. You can have any number of
deployments under one project.

**Organizations → Projects → <u>Deployments</u>**

Each deployment can also be backed up manually or automatically by schedules
you can define.

In essence, you can create whatever structure fits you for a given organization,
its projects and deployments.

![Oasis Deployments](images/oasis-deployments-page.png)

Also see the video
[Create a Deployment on ArangoDB Oasis](https://www.youtube.com/watch?v=yg2FfcNsKFc&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=9&t=0s){:target="_blank"}.

## How to create a new deployment

1. If you do not have a project yet,
   [create a project](projects.html#how-to-create-a-new-project) first.
2. In the main navigation, in the _Projects_ section, click on the project for
   which you want to create a new deployment.
3. In the _Deployments_ tab, you will see an empty list or a list with
   your project's existing deployments.
4. Click the _New deployment_ button.
5. Set up your deployment. The configuration options are described below.

![Oasis New Deployment](images/oasis-new-deployment1.png)

Also see the video
[Create a Deployment on ArangoDB Oasis](https://www.youtube.com/watch?v=yg2FfcNsKFc&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=9&t=0s){:target="_blank"}.

{% hint 'info' %}
Deployments contain exactly **one policy**. Within that policy, you can define
role bindings to regulate access control on a deployment level.
{% endhint %}

### In the _General_ section

- Enter the name and optionally a short description for the deployment.

### In the _Location_ section

1. Select the _Provider_ and _Region_ of the provider.
2. Select the _DB Version_.
   **Note**: If you don't know which DB version to select, leave the version
   selected by default.
3. In the _CA Certificate_ field
    - The default certificate created for your project will automatically be selected.
    - If you have no default certificate, or want to use a new certificate
      create a new certificate by typing the desired name for it and hitting
      enter or clicking on the name when done.
    - Or, if you already have multiple certificates, select the desired one.
4. _Optional but strongly recommended:_ In the _IP allowlist_ field, select the
   desired one in case you want to limit access to your deployment to certain
   IP ranges. To create a allowlist, navigate to your project and select the
   _IP allowlists_ tab (also see the video
   [IP allowlists with ArangoDB Oasis](https://www.youtube.com/watch?v=Et6nlTHBI50&list=PL0tn-TSss6NWH3DNyF96Zbz8LQ0OaFmvS&index=6&t=0s){:target="_blank"}).

{% hint 'security' %}
For any kind of production deployment we strongly advise to use an IP allowlist.
{% endhint %}

![Oasis New Deployment](images/oasis-new-deployment1.png)

### In the _Configuration_ section

Choose between a **OneShard**, **Sharded** or **Developer** deployment.

- OneShard deployments are suitable when your data set fits in a single node.
  They are ideal for graph use cases.

- Sharded deployments are suitable when your data set is larger than a single
  node. The data will be sharded across multiple nodes.

- Developer deployments are suitable when you want to try out ArangoDB without
  the need for high availability or scalability. The deployment will contain a
  single server only. Your data will not be replicated and your deployment can
  be restarted at any time.

#### OneShard

1. Select the memory size of your node.
2. Select the CPU size of your node.
3. Select the initial disk size of your node. The available ranges for the disk size
   depend on the selected memory size.
4. Select the upper limit for the disk size. It defaults to twice the initial
   disk size. You can set it to the same value as the initial disk size to
   disable automatic disk sizing.

{% hint 'info' %}
A deployment's node disk size is automatically increased by 25% when the maximal
disk usage of a node exceeds 75% of its capacity, up to the configured limit.
You will be notified via email when the disk size is increased, as well as when
your deployment runs out of disk space but cannot be resized because it reached
the upper disk size limit already.
{% endhint %}

![Oasis Deployment OneShard](images/oasis-new-deployment2.png)

#### Sharded

- In addition to memory and disk size as in the OneShard configuration, select
  the number of nodes for your deployment. The more nodes you have, the higher
  the replication factor can be.

![Oasis Deployment Sharded](images/oasis-new-deployment3-sharded.png)

#### Developer

- Like with OneShard and Sharded deployments, you choose memory and disk size.
  However note that the sizes you choose are for the entire deployment.
  For OneShard and Sharded deployments the chosen sizes are per node.

![Oasis Deployment Developer](images/oasis-new-deployment3-developer.png)

### In the _Summary_ section

1. Review the configuration, and if you're ok with the setup press the
  _Create_ button.
2. You will be taken to the deployment overview page.
   **Note:** Your deployment is at that point being bootstrapped, this process
   will take a few minutes. Once it is ready, you will receive a confirmation email.

## How to access your deployment

1. In the main navigation, in the _Projects_ section, click on the project for
   which you created a deployment earlier.
2. Navigate to the _Deployments_ tab.
3. For each deployment in your project, you see the status. While your new
   deployment is being set up, it will display the _bootstrapping_ status.
4. Press the _View_ button to show the deployment page.
5. When a deployment displays a status of _OK_, you can access it.
6. Click the copy icon next to the root password. This will copy the deployment
   root password to your clipboard. You can also click the view icon to unmask
   the root password to see it.
7. You will also receive an email that the deployment is available, with a URL
   to open it up.
8. Click on the _Open endpoint_ button or on the endpoint URL property to open
   the dashboard of your new ArangoDB deployment.
9. In the _username_ field type `root`, and in the _password_ field paste the
   password that you copied earlier.
10. Press the _Login_ button.
11. Press the _Select DB: \_system_ button

At this point your ArangoDB deployment is available for you to use — **Have fun!**

{% hint 'info' %}
Each deployment is accessible on two ports:

- Port 8529 is the standard port recommended for use by web-browsers.
- Port 18529 is the alternate port that is recommended for use by automated services.

The difference between these ports is the certificate used. If you enable
_Use well known certificate_, the certificates used on port 8529 is well known
and automatically accepted by most web browsers. The certificate used on port
18529 is a self-signed certificate. For securing automated services, the use of
a self-signed certificate is recommended.
{% endhint %}

## How to create a private network deployment

Microsoft Azure offers a feature called
[Azure Private Link](https://docs.microsoft.com/en-us/azure/private-link){:target="_blank"}
that allows you to limit communication between different Azure servers and
services to Microsoft's backbone network without exposure to the public internet.
It can lower network latency and increase security.

If you want to connect an ArangoDB Oasis deployment running on Azure with other
services you run on Azure using such a tunnel, then
[create a regular deployment](#how-to-create-a-new-deployment) and change it
to a private network deployment afterwards.

The deployment will not be reachable from the public internet anymore, other than via
the Oasis dashboard to administrate it. To revert to a public deployment, please
contact support via _Request help_ in the help menu.

1. **View** the deployment you want to change.
2. On the **Overview** tab, click the **Edit** button with an ellipsis (`…`)
   icon. If you see a pencil icon and no menu opens, then you are either on the
   free-to-try or professional tier, or the selected deployment is not eligible.
   The private network option is only available on the enterprise tier, for
   OneShard and Sharded deployments running on Azure.
3. Click **Change to private network** in the menu
   ![Oasis Deployment Private Network Menu](images/oasis-deployment-private-network-menu.png)
4. In the configuration wizard, click **Next** to enter your configuration details.
5. You need to enter one or more Azure Subscription IDs (GUIDs). They cannot be
   changed anymore once a connection has been established.
   Proceed by clicking **Next**.
   ![Oasis Deployment Private Network Setup 2](images/oasis-deployment-private-network-setup2.png)
6. You may enter one or more Alternate DNS names. This step is optional.
   Continue with or without Alternate DNS names entered by clicking **Next**.
   They can be changed later.
7. Click **Confirm Settings** to change the deployment.
8. Back on the **Overview** tab, scroll down to the **Private Network** section
   that is now displayed to see the connection status and to change the
   configuration.
   ![Oasis Deployment Private Network](images/oasis-deployment-private-network.png)
9. Oasis will configure a Private Endpoint Service. As soon as the **Azure alias**
   becomes available, you can copy it and then go to your Microsoft Azure portal
   to create Private Endpoints using this alias. The number of established
   **Connections** will increase and you can view the connection details by
   clicking on it.

## How to delete a deployment

{% hint 'danger' %}
Deleting a deployment will delete all its data and backups.
This operation is **irreversible**. Please proceed with caution.
{% endhint %}

1. In the main navigation, in the _Projects_ section, click on the project that
   holds the deployment you wish to delete.
2. On the _Deployments_ tab, click on the deployment you wish to delete.
3. Click on to the _Danger zone_ tab.
4. Click the _Delete deployment_ button.
5. In the modal dialog, confirm the deletion by entering `Delete!` into the
   designated text field.
6. Confirm the deletion by pressing the _Yes_ button.
7. You will be taken back to the deployments page of the project.
   The deployment being deleted will display the _Deleting_ status until it has
   been successfully removed.
