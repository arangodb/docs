---
layout: default
description: >- 
  The ArangoDB-NetworkX Adapter allows you to export graphs from ArangoDB into NetworkX for graph analysis with Python, and vice-versa
---
# NetworkX Adapter

{{ page.description }}
{:class="lead"}

[NetworkX](https://networkx.org/){:target="_blank"} is a commonly used tool for
analysis of network-data. If your
analytics use cases require the use of all your graph data, for example,
to summarize graph structure, or answer global path traversal queries,
then using the ArangoDB Pregel API is recommended. If your analysis pertains
to a subgraph, then you may be interested in getting the NetworkX
representation of the subgraph for one of the following reasons:

- An algorithm for your use case is available in NetworkX
- A library that you want to use for your use case works with NetworkX Graphs as input

## Resources

Check out this
[lunch & learn session](https://www.arangodb.com/resources/lunch-sessions/graph-beyond-lunch-break-2-9-introducing-the-arangodb-networkx-adapter/){:target="_blank"}
to see how using this adapter gives you the best of both
graph worlds - the speed and flexibility of ArangoDB combined with the
ubiquity of NetworkX.

The [ArangoDB-NetworkX Adapter repository](https://github.com/arangoml/networkx-adapter){:target="_blank"}
is also available on Github. 

## Installation

To install the latest release of the ArangoDB-NetworkX Adapter,
run the following command:

```bash
pip install adbnx-adapter
```

## Quickstart

The following examples show how to get started with ArangoDB-NetworkX Adapter.
Check also the 
[interactive tutorial](https://colab.research.google.com/github/arangoml/networkx-adapter/blob/master/examples/ArangoDB_NetworkX_Adapter.ipynb){:target="_blank"}.

```py
from arango import ArangoClient # Python-Arango driver
from networkx import grid_2d_graph # Sample graph from NetworkX

from adbnx_adapter import ADBNX_Adapter

# Let's assume that the ArangoDB "fraud detection" dataset is imported to this endpoint
db = ArangoClient(hosts="http://localhost:8529").db("_system", username="root", password="")

adbnx_adapter = ADBNX_Adapter(db)

# Use Case 1.1: ArangoDB to NetworkX via Graph name
nx_fraud_graph = adbnx_adapter.arangodb_graph_to_networkx("fraud-detection")

# Use Case 1.2: ArangoDB to NetworkX via Collection names
nx_fraud_graph_2 = adbnx_adapter.arangodb_collections_to_networkx(
    "fraud-detection", 
    {"account", "bank", "branch", "Class", "customer"}, # Vertex collections
    {"accountHolder", "Relationship", "transaction"} # Edge collections
)

# Use Case 1.3: ArangoDB to NetworkX via Metagraph
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
nx_fraud_graph_3 = adbnx_adapter.arangodb_to_networkx("fraud-detection", metagraph)

# Use Case 2: NetworkX to ArangoDB
nx_grid_graph = grid_2d_graph(5, 5)
adb_grid_edge_definitions = [
    {
        "edge_collection": "to",
        "from_vertex_collections": ["Grid_Node"],
        "to_vertex_collections": ["Grid_Node"],
    }
]
adb_grid_graph = adbnx_adapter.networkx_to_arangodb("Grid", nx_grid_graph, adb_grid_edge_definitions)
```