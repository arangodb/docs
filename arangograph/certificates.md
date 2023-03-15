---
layout: default
description: >-
  X.509 certificates in ArangoGraph are utilized for encrypted remote administration.
  The communication with and between the servers of an ArangoGraph deployment is
  encrypted using the TLS protocol
---
# X.509 Certificates

{{ page.description }}
{:class="lead"}

X.509 certificates are digital certificates that are used to verify the
authenticity of a website, user, or organization in a public key infrastructure
(PKI). They are used in various applications, including SSL/TLS encryption,
which is the basis for HTTPS - the primary protocol for securing communication
and data transfer over a network.

The X.509 certificate format is a standard defined by the
[International Telecommunication Union (ITU)](https://www.itu.int/en/Pages/default.aspx){:target="_blank"}
and contains information such as the name of the certificate holder, the public
key associated with the certificate, the certificate's issuer, and the
certificate's expiration date. An X.509 certificate can be signed by a
certificate authority (CA) or self-signed.

ArangoGraph is using:
- **well-known X.509 certificates** created by
[Let's Encrypt](https://letsencrypt.org/){:target="_blank"}
- **self-signed X.509 certificates** created by ArangoGraph platform

## Certificate chains

A certificate chain, also called the chain of trust, is a hierarchical structure
that links together a series of digital certificates. The trust in the chain is
established by verifying the identity of the issuer of each certificate in the
chain. The root of the chain is a trusted third-party, such as a certificate
authority (CA). The CA issues a certificate to an organization, which in turn
can issue certificates to servers and other entities. 

For example, when you visit a website with an SSL/TLS certificate, the browser
checks the chain of trust to verify the authenticity of the digital certificate.
The browser checks to see if the root certificate is trusted, and if it is, it
trusts the chain of certificates that lead to the end-entity certificate.
If any of the certificates in the chain are invalid, expired, or revoked, the
browser does not trust the digital certificate.

## X.509 certificates in ArangoGraph

Each ArangoGraph deployment is accessible on two different port numbers:
- default port `8529`
- high port `18529`

Each ArangoGraph Notebook is accessible on two different port numbers:
- default port `8840`
- high port `18840`

Metrics are accessible on two different port numbers:
- default port `8829`
- high port `18829`

The distinction between these port numbers is in the certificate used for the
TLS connection.

### Well known X.509 certificates

**Well known X.509 certificates** created by
[Let's Encrypt](https://letsencrypt.org/){:target="_blank"} are used on the
default ports, i.e. `8529`.

This type of certificate has a lifetime of 5 years and is rotated automatically.
It is recommended to use well-known certificates, as this eases access of a
deployment in your browser.

### Self-signed X.509 certificates

**Self-signed X.509 certificates** are used on the high ports, i.e. `18529`.
This type of certificate has a lifetime of 1 year, and it is created by the
ArangoGraph platform. It is also rotated automatically before the expiration
date.

{% hint 'info' %}
Unless you switch off the **Use well known certificate** option in the
certificate generation, both the default and high port serve the same
self-signed certificate.
{% endhint %}

### Subject Alternative Name (SAN)

The Subject Alternative Name (SAN) is an extension to the X.509 specification 
that allows you to specify additional host names for a single SSL certificate.

When using [private endpoints](deployments.html#how-to-create-a-private-endpoint-deployment),
[notebooks](notebooks.html), and [metrics](monitoring-metrics.html), you can specify 
alternate domain names. Note that these are added **only** to the self-signed certificate
as Subject Alternative Name (SAN).

## How to create a new certificate

1. Click a project name in the **Projects** section of the main navigation.
2. Click the **Security** tab.
3. In the **Certificates** section, click:
   - The **New certificate** button to create a new certificate.
   - A name or the **eye** icon in the **Actions** column to view a certificate.
     The dialog that opens provides commands for installing and uninstalling
     the certificate through a console.
   - The **pencil** icon to edit a certificate.
     You can also view a certificate and click the **Edit** button.
   - The **tag** icon to make the certificate the new default.
   - The **recycle bin** icon to delete a certificate.

![ArangoGraph Create New Certificate](images/arangograph-new-certificate.png)

Certificates that have the **Use well known certificate** option enabled do
not need any installation and are supported by almost all web browsers
automatically.

When creating a self-signed certificate that has the **Use well known certificate**
option disabled, the certificate needs to be installed on your local machine as
well. This operation slightly varies between operating systems.

![ArangoGraph Certificates](images/arangograph-cert-page-with-cert-present.png)

![ArangoGraph Certificate Install Instructions](images/arangograph-cert-install-instructions.png)

## How to connect to your application

[ArangoDB drivers](../drivers/index.html), also called connectors, allow you to
easily connect and manipulate ArangoGraph deployments right from within your
application. 

1. Navigate to the **Deployments** tab and click the **View** button to show the
   deployment page.
2. In the Quick start section, click the **Connecting drivers** button.
3. Select your programming language, i.e. Go, Java, Python, etc.
4. Use the code examples to connect a driver to your deployment.

![ArangoGraph Connecting Drivers](images/arangograph-connecting-drivers.png)

## Certificate Rotation

Every certificate has a self-signed root certificate that is going to expire.
When certificates that are used in existing deployments are about to expire,
an automatic rotation of the certificates is triggered. This means that the
certificate is cloned and all affected deployments then start using
the cloned certificate. 

Based on the type of certificate used, you may also need to install the new
certificate on your local machine. To prevent any downtime, it is recommended to
manually create a new certificate and apply the required changes prior
to the expiration date.