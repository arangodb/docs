---
layout: default
description: >-
  This quick start guide covers the basics from creating an Oasis account to
  setting up and accessing your first ArangoDB cloud deployment
---
# Use ArangoDB in the Cloud

{{ page.description }}
{:class="lead"}

For general information about ArangoDB Oasis, see
[cloud.arangodb.com](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic){:target="_blank"}.

For guides and reference documentation, see the [Oasis](oasis/) documentation.

## Prerequisites

Please have following information at hand for registration:

- An **email address**, required for email verification.

If you use a public email service provider (e.g. Hotmail), make sure to have
the following information at hand as well:

- A **mobile phone number**, required for SMS verification

{% hint 'info' %}
One mobile phone number will be associated with one account and cannot be
used for multiple accounts.
{% endhint %}

## How to Create a New Account

1. Go to [cloud.arangodb.com](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic){:target="_blank"}.
2. Click the __Start Free__ button or click the __Sign Up__ link in the top
   right corner.

   ![Oasis Homepage](oasis/images/oasis-homepage.png)

3. Review the terms & conditions and privacy policy and click __I accept__.
4. Select the type of sign up you would like to use (GitHub, Google, or
   email address).
     - For GitHub or Google please follow on-screen instructions.
     - For the email address option, type your desired email address in the
       email field and type a strong password in the password field.

     ![Oasis Sign up](oasis/images/oasis-signup.png){:style="max-height: 50vh"}

   Click the __Sign up__ button. You will receive a verification email. In that
   mail, click the __Verify my email address__ link or button.
   It will open a page in ArangoDB Oasis that says __Welcome back!__
5. Click the __Log in__ button to continue and login.
6. If you signed up with an email address of a public email service provider (e.g. Hotmail),
   a form appears asking for your mobile phone number. Enter the country code
   and the number of the mobile phone you want to use for this account.
   For company email addresses, this step is skipped.
7. If you had to enter your phone number in the previous step, a verification
   code will be sent via SMS to the mobile number you entered. Enter the
   verification code.
8. A form will appear asking for your name. Enter your first, last and company
   name, and then press the __Save__ button.
9. An organization with a default project will now be prepared for you.
   Once that is completed, you will be redirected to the
   [ArangoDB Oasis dashboard](https://cloud.arangodb.com/dashboard){:target="_blank"}.

## Get a Deployment up and Running

1. The first card in the Oasis Dashboard has a dropdown menu to select a cloud
   provider and region. Pick one, click __Create deployment__ and accept the
   terms and conditions.

   ![Oasis Dashboard](oasis/images/oasis-dashboard.png)

   You can also [create a deployment](oasis/deployments.html#how-to-create-a-new-deployment)
   manually if you want fine-grained configuration options.
2. The new deployment will show up in the list of deployments for the 
   respective project (here: _Avocado_).

   ![Oasis Deployments Bootstrapping](oasis/images/oasis-deployments-bootstrapping.png)

   It takes a couple of minutes before the deployment can be used. The status
   will change from __Bootstrapping__ to __OK__ eventually and you will also
   receive an email when it is ready.

   ![Oasis Deployment Ready Email](oasis/images/oasis-deployment-ready-email.png){:style="max-height: 50vh"}

3. Click the name or the _View_ button of the deployment card (or the
   __Open deployment details__ link in the email) to get to the deployment
   details.

   ![Oasis Deployment Ready](oasis/images/oasis-deployment-ready.png)

4. You can copy the ArangoDB password for the root user by clicking the second
   button below the label __ROOT PASSWORD__. Then click the __Open endpoint__
   button to bring up the ArangoDB web interface. Enter the credentials
   (user `root` and its password) and log in.

5. You can install example datasets and follow the accompanying guides to get
   started with ArangoDB and its query language. In the Oasis dashboard, click
   the __Examples__ tab of the deployment. Click __Install__ for one of the
   examples to let Oasis create a separate database and import the dataset.
   Click __Guide__ for instructions on how to access and run queries against
   this data.

   ![Oasis Deployment Examples](oasis/images/oasis-deployment-examples.png)

   ![Oasis Deployment Examples IMDB Guide](oasis/images/oasis-deployment-examples-imdb-guide.png)

## General Hierarchy

ArangoDB Oasis supports multi-tenant setups via organizations.
You can create your own organization(s) and invite collaborators or join
existing ones via invites. Your organization contains projects.
Your projects hold your deployments.

- [**Organizations**](oasis/organizations.html)
  represent (commercial) entities such as companies.
  You can be part of multiple organizations with a single user account.
  - [**Projects**](oasis/projects.html)
    represent organizational units such as teams or applications.
    - [**Deployments**](oasis/deployments.html)
      are the actual instances of ArangoDB clusters.

When you sign up for Oasis, an organization and a default project are
automatically created for you. What is still missing is a deployment.

## Take the Tour

In the top right corner you find the __User toolbar__. Click the icon with the
question mark to bring up the help menu and choose __Start tour__. This guided
tour walks you through the creation of a deployment and shows you how to load
example datasets and manage projects and deployments.

![Start tour in menu](oasis/images/oasis-tour-start.png)

Alternatively, follow the steps of the linked guides:
- [Create a new project](oasis/projects.html#how-to-create-a-new-project) (optional)
- [Create a new deployment](oasis/deployments.html#how-to-create-a-new-deployment)
- [Install a new certificate](oasis/projects.html#how-to-manage-certificates) (optional)
- [Access your deployment](oasis/deployments.html#how-to-access-your-deployment)
- [Delete your deployment](oasis/deployments.html#how-to-delete-a-deployment)

## Free-to-Try vs. Professional Service

ArangoDB Oasis comes with a free-to-try tier that lets you test our ArangoDB
Cloud for free for 14 days. It includes one project and one deployment.
After the trial period, your deployments will automatically be deleted.

You can convert to the professional service model at any time by adding 
your billing details and at least one payment method. See:
- [How to add billing details to organizations](oasis/billing.html#how-to-add-billing-details)
- [How to add a payment method to an organization](oasis/billing.html#how-to-add-a-payment-method)

## Limitations of ArangoDB Oasis

ArangoDB Oasis aims to make all features of the ArangoDB
[Enterprise Edition](features-enterprise-edition.html) available to you, but
there are a few limitations:

- Encryption (both at rest & network traffic) is always on and cannot be
  disabled for security reasons.
- Foxx services are not allowed to call out to the internet by default for
  security reasons, but can be enabled on request.
  Incoming calls to Foxx services are fully supported.
- LDAP authentication is currently in a testing phase.
- Datacenter to Datacenter Replication (DC2DC) is not yet available in a
  managed form.
