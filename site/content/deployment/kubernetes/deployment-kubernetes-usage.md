---
fileID: deployment-kubernetes-usage
title: Using the ArangoDB Kubernetes Operator
weight: 860
description: 
layout: default
---
## Installation

The ArangoDB Kubernetes Operator needs to be installed in your Kubernetes
cluster first. Make sure you have access to this cluster and the rights to
deploy resources at cluster level.

The following cloud provider Kubernetes offerings are officially supported:

- Amazon Elastic Kubernetes Service (EKS)
- Google Kubernetes Engine (GKE)
- Microsoft Azure Kubernetes Service (AKS)

If you have `Helm` available, use it for the installation as it is the
recommended installation method.

### Installation with Helm

To install the ArangoDB Kubernetes Operator with [`helm`](https://www.helm.sh/),
run the following commands (replace `<version>` with the
[version of the operator](https://github.com/arangodb/kube-arangodb/releases)
that you want to install):

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export URLPREFIX=https://github.com/arangodb/kube-arangodb/releases/download/<version>
helm install $URLPREFIX/kube-arangodb-crd-<version>.tgz
helm install $URLPREFIX/kube-arangodb-<version>.tgz
```
{{% /tab %}}
{{< /tabs >}}

This installs operators for the `ArangoDeployment` and `ArangoDeploymentReplication`
resource types, which are used to deploy ArangoDB and ArangoDB
Datacenter-to-Datacenter Replication respectively.

If you want to avoid the installation of the operator for the `ArangoDeploymentReplication`
resource type, add `--set=DeploymentReplication.Create=false` to the `helm install`
command.

To use `ArangoLocalStorage` resources, also run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
helm install $URLPREFIX/kube-arangodb-<version>.tgz --set "operator.features.storage=true"
```
{{% /tab %}}
{{< /tabs >}}

The default CPU architecture of the operator is `amd64` (x86-64). To enable ARM
support (`arm64`) in the operator, overwrite the following setting:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
helm install $URLPREFIX/kube-arangodb-<version>.tgz --set "operator.architectures={amd64,arm64}"
```
{{% /tab %}}
{{< /tabs >}}

{{% hints/tip %}}
Use at least version 1.2.20 of the operator to use the ARM architecture.
{{% /hints/tip %}}

Note that you need to set [`spec.architecture`](deployment-kubernetes-deployment-resource#specarchitecture-string)
in the deployment specification, too, in order to create a deployment that runs
on ARM chips.

For more information on installing with `Helm` and how to customize an installation,
see [Using the ArangoDB Kubernetes Operator with Helm](deployment-kubernetes-helm).

### Installation with Kubectl

To install the ArangoDB Kubernetes Operator without `Helm`,
run (replace `<version>` with the version of the operator that you want to install):

{{< tabs >}}
{{% tab name="bash" %}}
```bash
export URLPREFIX=https://raw.githubusercontent.com/arangodb/kube-arangodb/<version>/manifests
kubectl apply -f $URLPREFIX/arango-crd.yaml
kubectl apply -f $URLPREFIX/arango-deployment.yaml
```
{{% /tab %}}
{{< /tabs >}}

To use `ArangoLocalStorage` resources to provision `PersistentVolumes` on local
storage, also run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl apply -f $URLPREFIX/arango-storage.yaml
```
{{% /tab %}}
{{< /tabs >}}

Use this when running on bare-metal or if there is no provisioner for fast
storage in your Kubernetes cluster.

To use `ArangoDeploymentReplication` resources for ArangoDB
Datacenter-to-Datacenter Replication, also run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl apply -f $URLPREFIX/arango-deployment-replication.yaml
```
{{% /tab %}}
{{< /tabs >}}

See [ArangoDeploymentReplication Custom Resource](deployment-kubernetes-deployment-replication-resource)
for details and an example.

You can find the latest release of the ArangoDB Kubernetes Operator
in the [kube-arangodb repository](https://github.com/arangodb/kube-arangodb/releases/latest).

## ArangoDB deployment creation

After deploying the latest ArangoDB Kubernetes operator, use the command below to deploy your [license key](../../administration/administration-license) as a secret which is required for the Enterprise Edition starting with version 3.9:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl create secret generic arango-license-key --from-literal=token-v2="<license-string>"
```
{{% /tab %}}
{{< /tabs >}}

Once the operator is running, you can create your ArangoDB database deployment
by creating a `ArangoDeployment` custom resource and deploying it into your
Kubernetes cluster.

For example (all examples can be found in the [kube-arangodb repository](https://github.com/arangodb/kube-arangodb/tree/master/examples)):

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl apply -f examples/simple-cluster.yaml
```
{{% /tab %}}
{{< /tabs >}}
Additionally, you can specify the license key required for the Enterprise Edition starting with version 3.9 as seen below:

{{< tabs >}}
{{% tab name="yaml" %}}
```yaml
spec:
  [...]
  image: arangodb/enterprise:3.9.1
  license:
    secretName: arango-license-key
```
{{% /tab %}}
{{< /tabs >}}

## Connecting to your database

Access to ArangoDB deployments from outside the Kubernetes cluster is provided
using an external-access service. By default, this service is of type
`LoadBalancer`. If this type of service is not supported by your Kubernetes
cluster, it is replaced by a service of type `NodePort` after a minute.

To see the type of service that has been created, run (replace `<service-name>`
with the `metadata.name` you set in the deployment configuration, e.g.
`example-simple-cluster`):

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl get service <service-name>-ea
```
{{% /tab %}}
{{< /tabs >}}

When the service is of the `LoadBalancer` type, use the IP address
listed in the `EXTERNAL-IP` column with port 8529.
When the service is of the `NodePort` type, use the IP address
of any of the nodes of the cluster, combine with the high (>30000) port listed
in the `PORT(S)` column.

Point your browser to `https://<ip>:<port>/` (note the `https` protocol).
Your browser shows a warning about an unknown certificate. Accept the
certificate for now. Then log in using the username `root` and an empty password.

## Deployment removal

To remove an existing ArangoDB deployment, delete the custom resource.
The operator deletes all created resources.

For example:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl delete -f examples/simple-cluster.yaml
```
{{% /tab %}}
{{< /tabs >}}

**Note that this will also delete all data in your ArangoDB deployment!**

If you want to keep your data, make sure to create a backup before removing the deployment.

## Operator removal

To remove the entire ArangoDB Kubernetes Operator, remove all
clusters first and then remove the operator by running:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
helm delete <release-name-of-kube-arangodb-chart>

helm delete <release-name-of-kube-arangodb-storage-chart>
```
{{% /tab %}}
{{< /tabs >}}

or when you used `kubectl` to install the operator, run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
kubectl delete deployment arango-deployment-operator

kubectl delete deployment -n kube-system arango-storage-operator

kubectl delete deployment arango-deployment-replication-operator
```
{{% /tab %}}
{{< /tabs >}}

## Example deployment using `minikube`

If you want to get your feet wet with ArangoDB and Kubernetes, you can deploy
your first ArangoDB instance with `minikube`, which lets you easily set up a
local Kubernetes cluster.

Visit the [`minikube` website](https://minikube.sigs.k8s.io/)
and follow the installation instructions and start the cluster with
`minikube start`.

Next, go to <https://github.com/arangodb/kube-arangodb/releases>
to find out the latest version of the ArangoDB Kubernetes Operator. Then run the
following commands, with `<version>` replaced by the version you looked up:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
minikube kubectl -- apply -f https://raw.githubusercontent.com/arangodb/kube-arangodb/<version>/manifests/arango-crd.yaml
minikube kubectl -- apply -f https://raw.githubusercontent.com/arangodb/kube-arangodb/<version>/manifests/arango-deployment.yaml
minikube kubectl -- apply -f https://raw.githubusercontent.com/arangodb/kube-arangodb/<version>/manifests/arango-storage.yaml
```
{{% /tab %}}
{{< /tabs >}}

To deploy a single server, create a file called `single-server.yaml` with the
following content:

{{< tabs >}}
{{% tab name="yaml" %}}
```yaml
apiVersion: "database.arangodb.com/v1"
kind: "ArangoDeployment"
metadata:
  name: "single-server"
spec:
  mode: Single
```
{{% /tab %}}
{{< /tabs >}}

Insert this resource in your Kubernetes cluster using:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
minikube kubectl -- apply -f single-server.yaml
```
{{% /tab %}}
{{< /tabs >}}

To deploy an ArangoDB cluster instead, create a file called `cluster.yaml` with
the following content:

{{< tabs >}}
{{% tab name="yaml" %}}
```yaml
apiVersion: "database.arangodb.com/v1"
kind: "ArangoDeployment"
metadata:
  name: "cluster"
spec:
  mode: Cluster
```
{{% /tab %}}
{{< /tabs >}}

The same commands used in the single server deployment can be used to inspect
your cluster. Just use the correct deployment name (`cluster` instead of
`single-server`).

The `ArangoDeployment` operator in `kube-arangodb` inspects the resource you
just deployed and starts the process to run ArangoDB.

To inspect the current status of your deployment, run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
minikube kubectl -- describe ArangoDeployment single-server

minikube kubectl -- describe arango single-server
```
{{% /tab %}}
{{< /tabs >}}

To inspect the pods created for this deployment, run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
minikube kubectl -- get pods --selector=arango_deployment=single-server
```
{{% /tab %}}
{{< /tabs >}}

The result looks similar to this:

{{< tabs >}}
{{% tab name="plain" %}}
```plain
NAME                                 READY     STATUS    RESTARTS   AGE
single-server-sngl-cjtdxrgl-fe06f0   1/1       Running   0          1m
```
{{% /tab %}}
{{< /tabs >}}

Once the pod reports that it is has a `Running` status and is ready,
your ArangoDB instance is available.

To access ArangoDB, run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
minikube service single-server-ea
```
{{% /tab %}}
{{< /tabs >}}

This creates a temporary tunnel for the `single-server-ea` service and opens
your browser. You need change the URL to start with `https://`. By default,
it is `http://`, but the deployment uses TLS encryption for the connection.
For example, if the address is `http://127.0.0.1:59050`, you need to change it
to `https://127.0.0.1:59050`.

Your browser warns about an unknown certificate. This is because a self-signed
certificate is used. Continue anyway. The exact steps for this depend on your
browser.

You should see the logon screen of ArangoDB's web interface. Enter `root` as the
username, leave the password field empty, and log in. Select the default
`_system` database. You should see the dashboard and be able to interact with
ArangoDB.

If you want to delete your single server ArangoDB database, just run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
minikube kubectl -- delete ArangoDeployment single-server
```
{{% /tab %}}
{{< /tabs >}}

To shut down `minikube`, run:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
minikube stop
```
{{% /tab %}}
{{< /tabs >}}

## See also

- [Driver configuration](deployment-kubernetes-driver-configuration)
- [Scaling](deployment-kubernetes-scaling)
- [Upgrading](deployment-kubernetes-upgrading)
- [Using the ArangoDB Kubernetes Operator with Helm](deployment-kubernetes-helm)
