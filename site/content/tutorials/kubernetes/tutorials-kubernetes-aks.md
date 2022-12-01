---
fileID: tutorials-kubernetes-aks
title: Start ArangoDB on Azure Kubernetes Service (AKS)
weight: 185
description: 
layout: default
---
## Requirements

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (**version >= 1.10**)
* [helm](https://www.helm.sh/)
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest)

## Deploy cluster

* In Azure dashboard choose **Create a resource**
* Choose **Kubernetes Service**

## Cluster basics (version >=1.10)

![basics](/images/aks-create-basics.png)

## Cluster authentication (Enable RBAC)

![basics](/images/aks-create-auth.png)

## Wait for cluster to be created

![basics](/images/aks-create-valid.png)

## Move to control using `kubectl`

- Login to Azure using CLI

  {{< tabs >}}
{{% tab name="" %}}
```
  $ az login
    [
      {
        "cloudName": "AzureCloud",
        "id": "...",
        "isDefault": true,
        "name": "ArangoDB-INC",
        "state": "Enabled",
        "tenantId": "...",
        "user": {
          "name": "xxx@arangodb.com",
          "type": "user"
        }
      }
    ]
  ```
{{% /tab %}}
{{< /tabs >}}

- Get AKS credentials to merge with local config, using resource group and
  cluster names used for above deployment

  {{< tabs >}}
{{% tab name="" %}}
```
    $ az aks get-credentials --resource-group clifton --name ArangoDB
  ```
{{% /tab %}}
{{< /tabs >}}

- Verify successful merge

  {{< tabs >}}
{{% tab name="" %}}
```
  $ kubectl get svc
    NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
    kubernetes   ClusterIP   10.0.0.1     <none>        443/TCP   38m
  ```
{{% /tab %}}
{{< /tabs >}}

- Initialize `helm`

  {{< tabs >}}
{{% tab name="" %}}
```
  $ kubectl create serviceaccount --namespace kube-system tiller
    serviceaccount/tiller created
  ```
{{% /tab %}}
{{< /tabs >}}

  {{< tabs >}}
{{% tab name="" %}}
```
  $ kubectl create clusterrolebinding tiller-cluster-rule \
        --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
    clusterrolebinding.rbac.authorization.k8s.io/tiller-cluster-rule created
  ```
{{% /tab %}}
{{< /tabs >}}

  {{< tabs >}}
{{% tab name="" %}}
```
  $ helm init --service-account tiller
    $HELM_HOME has been configured at /home/xxx/.helm.
    ...
    Happy Helming!

    Tiller (the Helm server-side component) has been
    installed into your Kubernetes Cluster.
  ```
{{% /tab %}}
{{< /tabs >}}

- Deploy ArangoDB operator

  {{< tabs >}}
{{% tab name="" %}}
```
  $ helm install \
      github.com/arangodb/kube-arangodb/releases/download/X.X.X/kube-arangodb.tgz
    NAME:   orderly-hydra
    LAST DEPLOYED: Wed Oct 31 15:11:37 2018
    NAMESPACE: default
    STATUS: DEPLOYED
    ...
    See https://www.arangodb.com/docs/stable/tutorials-kubernetes.html
    for how to get started.
  ```
{{% /tab %}}
{{< /tabs >}}

- Deploy ArangoDB cluster

  {{< tabs >}}
{{% tab name="" %}}
```
  $ kubectl apply -f https://raw.githubusercontent.com/arangodb/kube-arangodb/master/examples/simple-cluster.yaml
  ```
{{% /tab %}}
{{< /tabs >}}
