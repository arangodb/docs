---
fileID: data-science-pyg-adapter
title: PyTorch Geometric (PyG) Adapter
weight: 920
description: >- 
  The ArangoDB-PyG Adapter exports Graphs from ArangoDB into PyTorch Geometric (PyG), a PyTorch-based Graph Neural Network library, and vice-versa
layout: default
---
PyTorch Geometric (PyG) is a library built upon [PyTorch](https://pytorch.org/)
to easily write and train Graph Neural Networks (GNNs) for a wide range of
applications related to structured data.

It consists of various methods for deep learning on graphs and other irregular structures,
also known as [geometric deep learning](https://geometricdeeplearning.com/), 
from a variety of published papers. In addition, it consists of easy-to-use
mini-batch loaders for operating on many small and single giant graphs,
[multi GPU-support](https://github.com/pyg-team/pytorch_geometric/tree/master/examples/multi_gpu),
[`DataPipe` support](https://github.com/pyg-team/pytorch_geometric/blob/master/examples/datapipe.py),
distributed graph learning via [Quiver](https://github.com/pyg-team/pytorch_geometric/tree/master/examples/quiver),
a large number of common benchmark datasets (based on simple interfaces to create your own),
the [GraphGym](https://pytorch-geometric.readthedocs.io/en/latest/notes/graphgym.html) 
experiment manager, and helpful transforms, both for learning on arbitrary
graphs as well as on 3D meshes or point clouds.

## Resources

The [ArangoDB-PyG Adapter repository](https://github.com/arangoml/pyg-adapter)
is available on Github. Check it out!

## Installation

To install the latest release of the ArangoDB-PyG Adapter,
run the following command:

```bash
pip install torch
pip install adbpyg-adapter
```

## Quickstart

The following examples show how to get started with ArangoDB-PyG Adapter.
Check also the 
[interactive tutorial](https://colab.research.google.com/github/arangoml/pyg-adapter/blob/master/examples/ArangoDB_PyG_Adapter.ipynb).

### Setup

```py
import torch
import pandas
from torch_geometric.datasets import FakeHeteroDataset

from arango import ArangoClient  # Python-Arango driver

from adbpyg_adapter import ADBPyG_Adapter, ADBPyG_Controller
from adbpyg_adapter.encoders import IdentityEncoder, CategoricalEncoder


data = FakeHeteroDataset(
    num_node_types=2,
    num_edge_types=3,
    avg_num_nodes=20,
    avg_num_channels=3,  # avg number of features per node
    edge_dim=2,  # number of features per edge
    num_classes=3,  # number of unique label values
)[0]


db = ArangoClient(hosts="http://localhost:8529").db("_system", username="root", password="")

adbpyg_adapter = ADBPyG_Adapter(db)
```

### PyG to ArangoDB

```py

adb_g = adbpyg_adapter.pyg_to_arangodb("FakeData", data)


def y_tensor_to_2_column_dataframe(pyg_tensor):
    """
    A user-defined function to create two
    ArangoDB attributes out of the 'y' label tensor

    NOTE: user-defined functions must return a Pandas Dataframe
    """
    label_map = {0: "Kiwi", 1: "Blueberry", 2: "Avocado"}

    df = pandas.DataFrame(columns=["label_num", "label_str"])
    df["label_num"] = pyg_tensor.tolist()
    df["label_str"] = df["label_num"].map(label_map)

    return df


metagraph = {
    "nodeTypes": {
        "v0": {
            "x": "features",  # 1) you can specify a string value for attribute renaming
            "y": y_tensor_to_2_column_dataframe,  # 2) you can specify a function for user-defined handling, as long as the function returns a Pandas DataFrame
        },
    },
    "edgeTypes": {
        ("v0", "e0", "v0"): {
            # 3) you can specify a list of strings for tensor dissasembly (if you know the number of node/edge features in advance)
            "edge_attr": [ "a", "b"]  
        },
    },
}


adb_g = adbpyg_adapter.pyg_to_arangodb("FakeData", data, metagraph, explicit_metagraph=False)




adb_g = adbpyg_adapter.pyg_to_arangodb("FakeData", data, metagraph, explicit_metagraph=True)


class Custom_ADBPyG_Controller(ADBPyG_Controller):
    def _prepare_pyg_node(self, pyg_node: dict, node_type: str) -> dict:
        """Optionally modify a PyG node object before it gets inserted into its designated ArangoDB collection.

        :param pyg_node: The PyG node object to (optionally) modify.
        :param node_type: The PyG Node Type of the node.
        :return: The PyG Node object
        """
        pyg_node["foo"] = "bar"
        return pyg_node

    def _prepare_pyg_edge(self, pyg_edge: dict, edge_type: tuple) -> dict:
        """Optionally modify a PyG edge object before it gets inserted into its designated ArangoDB collection.

        :param pyg_edge: The PyG edge object to (optionally) modify.
        :param edge_type: The Edge Type of the PyG edge. Formatted
            as (from_collection, edge_collection, to_collection)
        :return: The PyG Edge object
        """
        pyg_edge["bar"] = "foo"
        return pyg_edge


adb_g = ADBPyG_Adapter(db, Custom_ADBPyG_Controller()).pyg_to_arangodb("FakeData", data)
```

### ArangoDB to PyG

```py

db.delete_graph("FakeData", drop_collections=True, ignore_missing=True)
adbpyg_adapter.pyg_to_arangodb("FakeData", data)


pyg_g = adbpyg_adapter.arangodb_graph_to_pyg("FakeData")


pyg_g = adbpyg_adapter.arangodb_collections_to_pyg("FakeData", v_cols={"v0", "v1"}, e_cols={"e0"})


metagraph_v1 = {
    "vertexCollections": {
        # we instruct the adapter to create the "x" and "y" tensor data from the "x" and "y" ArangoDB attributes
        "v0": { "x": "x", "y": "y"},  
        "v1": {"x": "x"},
    },
    "edgeCollections": {
        "e0": {"edge_attr": "edge_attr"},
    },
}
pyg_g = adbpyg_adapter.arangodb_to_pyg("FakeData", metagraph_v1)



metagraph_v2 = {
    "vertexCollections": {
        "Movies": {
            "x": {  # Build a feature matrix from the "Action" & "Drama" document attributes
                "Action": IdentityEncoder(dtype=torch.long),
                "Drama": IdentityEncoder(dtype=torch.long),
            },
            "y": "Comedy",
        },
        "Users": {
            "x": {
                "Gender": CategoricalEncoder(mapping={"M": 0, "F": 1}),
                "Age": IdentityEncoder(dtype=torch.long),
            }
        },
    },
    "edgeCollections": {
        "Ratings": {
            "edge_weight": "Rating"
        }
    },
}
pyg_g = adbpyg_adapter.arangodb_to_pyg("IMDB", metagraph_v2)


def udf_v0_x(v0_df):
    # process v0_df here to return v0 "x" feature matrix
    # v0_df["x"] = ...
    return torch.tensor(v0_df["x"].to_list())


def udf_v1_x(v1_df):
    # process v1_df here to return v1 "x" feature matrix
    # v1_df["x"] = ...
    return torch.tensor(v1_df["x"].to_list())


metagraph_v3 = {
    "vertexCollections": {
        "v0": {
            "x": udf_v0_x,  # supports named functions
            "y": lambda df: torch.tensor(df["y"].to_list()),  # also supports lambda functions
        },
        "v1": {"x": udf_v1_x},
    },
    "edgeCollections": {
        "e0": {"edge_attr": (lambda df: torch.tensor(df["edge_attr"].to_list()))},
    },
}
pyg_g = adbpyg_adapter.arangodb_to_pyg("FakeData", metagraph_v3)
```