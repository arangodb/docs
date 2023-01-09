---
fileID: data-science-dgl-adapter
title: DGL Adapter
weight: 720
description: >- 
  The ArangoDB-DGL Adapter exports graphs from ArangoDB into Deep Graph Library (DGL), a Python package for graph neural networks, and vice-versa
layout: default
---
The [Deep Graph Library (DGL)](https://www.dgl.ai/) is an
easy-to-use, high performance and scalable
Python package for deep learning on graphs. DGL is framework agnostic, meaning
that, if a deep graph model is a component of an end-to-end application, the
rest of the logics can be implemented in any major frameworks, such as PyTorch,
Apache MXNet or TensorFlow.

## Resources

Watch this
[lunch & learn session](https://www.arangodb.com/resources/lunch-sessions/graph-beyond-lunch-break-2-8-dgl-adapter/)
to get an introduction and see how to use the DGL adapter.

The [ArangoDB-DGL Adapter repository](https://github.com/arangoml/dgl-adapter)
is available on Github. Check it out!

## Installation

To install the latest release of the ArangoDB-DGL Adapter,
run the following command:

{{< tabs >}}
{{% tab name="bash" %}}
```bash
pip install adbdgl-adapter
```
{{% /tab %}}
{{< /tabs >}}

## Quickstart

The following examples show how to get started with ArangoDB-DGL Adapter.
Check also the 
[interactive tutorial](https://colab.research.google.com/github/arangoml/dgl-adapter/blob/master/examples/ArangoDB_DGL_Adapter.ipynb).

{{< tabs >}}
{{% tab name="py" %}}
```py
from arango import ArangoClient  # Python-Arango driver
from dgl.data import KarateClubDataset # Sample graph from DGL


db = ArangoClient(hosts="http://localhost:8529").db("_system", username="root", password="")

adbdgl_adapter = ADBDGL_Adapter(db)


dgl_fraud_graph = adbdgl_adapter.arangodb_graph_to_dgl("fraud-detection")


dgl_fraud_graph_2 = adbdgl_adapter.arangodb_collections_to_dgl(
    "fraud-detection",
    {"account", "Class", "customer"},  # Vertex collections
    {"accountHolder", "Relationship", "transaction"},  # Edge collections
)


metagraph = {
    "vertexCollections": {
        "account": {"Balance", "account_type", "customer_id", "rank"},
        "customer": {"Name", "rank"},
    },
    "edgeCollections": {
        "transaction": {"transaction_amt", "sender_bank_id", "receiver_bank_id"},
        "accountHolder": {},
    },
}
dgl_fraud_graph_3 = adbdgl_adapter.arangodb_to_dgl("fraud-detection", metagraph)


dgl_karate_graph = KarateClubDataset()[0]
adb_karate_graph = adbdgl_adapter.dgl_to_arangodb("Karate", dgl_karate_graph)
```
{{% /tab %}}
{{< /tabs >}}