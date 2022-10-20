---
layout: default
description: >-
  Colocated Jupyter Notebooks within the ArangoGraph Insights Platform
---
# Notebooks

{{ page.description }}
{:class="lead"}

{% hint 'info' %}
This documentation describes the beta version of the Notebooks feature and is
subject to change. The beta version is free for all.
{% endhint %}

The ArangoGraph Insights Platform provides an easy way to run Jupyter Notebooks in the cloud,
without having to move your data outside of the platform.

This feature allows you to:

- Perform data exploration within the platform, without having to download it
to your local environment.
- Control computing resources (GPU, CPU, memory, and disk size) and get a 
transparent understanding of usage from your development environment.
- Use the integrated notebook interface to work with ArangoDB's Graph ML 
Platform, Python and ML libraries.

## How to create a new notebook

1. Navigate to the **Deployments** tab.
2. Open the deployment in which you want to create the notebook.
3. Go to the **Notebooks** tab and click the **Create Notebook** button.
4. Enter a name and optionally a description for your new notebook. Click **Save**.
5. The notebook's phase is set to **Initializing**. Once the phase changes to
**Running**, the notebook's endpoint will be accessible.
6. Click the **Open notebook** button to access your notebook. 
7. To log in into your notebook, use the `root` password from your deployment.

{% hint 'info' %}
Depending on the tier your organization belongs to, different limitations apply:
- Professional and Enterprise tiers: you can create up to three notebooks per deployment.
- Free-to-try tier: you can only create one notebook per deployment.  
{% endhint %}

![Notebooks](images/arangograph-notebooks.png)

{% hint 'info' %}
Notebooks in beta version have a fixed configuration of 10&nbsp;GB of disk size.
{% endhint %}

## How to edit a notebook

1. Select the notebook that you want to change from the **Notebooks** tab.
2. Click **Edit notebook**. You can modify its name and description.
3. To pause a notebook, click the **Pause notebook** button. You can resume it
at anytime. The notebook's phase is updated accordingly.

## How to delete a notebook

1. Select the notebook that you want to remove from the **Notebooks** tab.
2. Click the **Delete notebook** button.
