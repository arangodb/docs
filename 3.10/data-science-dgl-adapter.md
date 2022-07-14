---
layout: default
description: >- 
  ArangoDB-DGL Adapter exports graphs from ArangoDB into Deep Graph Library (DGL), a Python package for graph neural networks, and vice-versa
---
# DGL Adapter

{{ page.description }}
{:class="lead"}

The [Deep Graph Library (DGL)](https://www.dgl.ai/){:target="_blank"} is an
easy-to-use, high performance and scalable
Python package for deep learning on graphs. DGL is framework agnostic, meaning
that, if a deep graph model is a component of an end-to-end application, the
rest of the logics can be implemented in any major frameworks, such as PyTorch,
Apache MXNet or TensorFlow.

## Installation

To install the latest release of the ArangoDB-DGL Adapter,
run the following command:

```bash
pip install adbdgl-adapter
```

## Quickstart

The following examples show how to get started with ArangoDB-DGL Adapter.
Check also the 
[interactive tutorial](https://colab.research.google.com/github/arangoml/dgl-adapter/blob/master/examples/ArangoDB_DGL_Adapter.ipynb){:target="_blank"}.

```py
from arango import ArangoClient  # Python-Arango driver
from dgl.data import KarateClubDataset # Sample graph from DGL

# Let's assume that the ArangoDB "fraud detection" dataset is imported to this endpoint
db = ArangoClient(hosts="http://localhost:8529").db("_system", username="root", password="")

adbdgl_adapter = ADBDGL_Adapter(db)

# Use Case 1.1: ArangoDB to DGL via Graph name
dgl_fraud_graph = adbdgl_adapter.arangodb_graph_to_dgl("fraud-detection")

# Use Case 1.2: ArangoDB to DGL via Collection names
dgl_fraud_graph_2 = adbdgl_adapter.arangodb_collections_to_dgl(
    "fraud-detection",
    {"account", "Class", "customer"},  # Vertex collections
    {"accountHolder", "Relationship", "transaction"},  # Edge collections
)

# Use Case 1.3: ArangoDB to DGL via Metagraph
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

# Use Case 2: DGL to ArangoDB
dgl_karate_graph = KarateClubDataset()[0]
adb_karate_graph = adbdgl_adapter.dgl_to_arangodb("Karate", dgl_karate_graph)
```