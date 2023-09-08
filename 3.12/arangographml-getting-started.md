---
layout: default
description: >-
  Interface to control all resources inside ArangoGraphML in a scriptable manner
---
# Getting Started with ArangoGraphML Services and Packages

{{ page.description }}
{:class="lead"}

ArangoGraphML is a set of services that provide an easy to use and scalable
interface for graph machine learning. Since all of the orchestration and training
logic is managed by ArangoGraph, all that is typically required is a
specification outlining the data to be used to solve a task.

The following is a guide to show how to use the `arangoml` package in order to:
- Manage projects
- Featurize data
- Submit training jobs
- Evaluate Metrics
- Generate predictions

{% hint 'tip' %}
To enable the ArangoGraphML services,
[get in touch](https://www.arangodb.com/contact/){:target="_blank"}
with the ArangoDB team. Regular notebooks in ArangoGraph don't include the
`arangoml` package.
{% endhint %}

## Specifications

The `arangoml` package requires a properly formed specification. The specifications
describe the task being performed and the data being used. The ArangoGraphML services
work closely together, with one task providing inputs to another.

## Import

The `arangoml` package comes pre-loaded with every ArangoGraphML notebook environment.

To start using it, simply import it:

```
import arangoml
```

## Projects

Projects are an important reference used throughout the entire ArangoGraphML
lifecycle. All activities link back to a project. The creation of the project
is very simple. 

**Create a project**

```
project = arangoml.projects.create_project({"name":"ArangoGraphML_Project_Name"})
```

**List projects**

```
arangoml.projects.list_projects(limit=limit, offset=offset)
```

**Lookup an existing project**

```
project = arangoml.projects.get_project_by_name("ArangoGraphML_Project_Name")

# or by id
project = arangoml.projects.get_project("project_id")
```

**Update an existing project**

```
arangoml.projects.update_project(body={'id': 'project_id', 'name': 'Updated_ArangoGraphML_Project_Name'}, project_id='existing_project_id')
```

**List models associated with project**

```
arangoml.projects.list_models(project_name=project_name, project_id=project_id, job_id=job_id)
```

**Delete an existing project**

```
api_instance.delete_project(project_id)
```

## Featurization

The featurization specification asks that you input the following:
- `featurization_name`: A name for the featurization task.
- `project_name`: The associated project name. 
	You can use `project.name` here if already created or retrieved as descried above.
- `graph_name`: The associated graph name that exists within the database.
- `vertexCollections`: The list of vertex collections to be featurized.
  - Each collection contains a list of features or document attributes and details on how to featurize them.
  ```
          "collectionName": {
            "features": {
                "attribute_name": {
                    "feature_type": 'text' # Currently the supported types include text, category, numerical
                    "feature_generator": { # this advanced option is optional.
                        "method": "transformer_embeddings",
                        "feature_name": "movie_title_embeddings",
                    },
  ```
- `edgeCollections`: This is the list of edge collections associated with the
	vertex collections. There are no additional options.
	```
    	"edgeCollections": {
      	  "edge_name_1",
      	  "edge_name_2
    	},
	```

Once you have filled out the featurization specification you can pass it to
the `featurizer` function.

```
from arangoml.featurizer import featurizer

featurizer(featurizer(_db, featurization_spec)
```

This is all you need to get started with featurization. The following also shows
an example of using the featurization package with a movie dataset and some
additional options available.

```
from arangoml.featurizer import featurizer

featurization_spec = {
    "featurization_name": "Movie_Recommendation",
    "project_name": "movie_recommendation_project",
    "graph_name": "fake_m_hetero_2",
    "vertexCollections": {
        "v0": {
            "features": {
                "movie_title": {
                    "feature_type": "text",
                    "feature_generator": {
                        "method": "transformer_embeddings",
                        "feature_name": "movie_title_embeddings",
                    },
                },
                "genre": {
                    "feature_type": "category",
                    "feature_generator": {
                        "method": "one_hot_encoding",
                        "feature_name": "genre_embeddings",
                    },
                },
            }
        },
        "v1": {
            "features": {
                "actor_summary": {
                    "feature_type": "text",
                    "feature_generator": {
                        "method": "transformer_embeddings",
                        "feature_name": "actor_summary_embeddings",
                    },
                },
                "actor_country": {
                    "feature_type": "category",
                    "feature_generator": {
                        "method": "one_hot_encoding",
                        "feature_name": "actor_country_embedding",
                    },
                },
            }
        },
        "v2": {
            "features": {
                "director_summary": {
                    "feature_type": "text",
                },
            }
        },
    },
    "edgeCollections": {
        "e0"
    },
}

output = featurizer(_db, featurization_spec, batch_size=32)
print(output)

# can also run without analysis
# featurizer(db, featurization_spec, run_analysis_checks=False)
# can also be run with a feature store
import arangomlFeatureStore
from arangomlFeatureStore.defaults import DEFAULT_FEATURE_STORE_DB
fs_db = client.db(DEFAULT_FEATURE_STORE_DB, username="root", password="")  # nosec
admin = arangomlFeatureStore.FeatureStoreAdmin(
    database_connection=fs_db,
)
feature_store = admin.get_feature_store()
output = featurizer(db, featurization_spec, feature_store=feature_store, batch_size=32)
print(output)
```

## Experiment

Each experiment consists of three main phases:
- Training
- Model Selection
- Predictions

## Training Specification 

Training graph machine learning models with ArangoGraphML only requires two steps:
1. Describe which data points should be included in the training job.
2. Pass the training specification to the training service.

See below the different components of the training specification.

- `database_name`: The database name the source data is in.
- `project_name`: The top-level project to which all the experiments will link back. 
- `metagraph`: This is the largest component that details the experiment objective and the associated data points.
  - `mlSpec`: Describes the desired machine learning task, input features, and the attribute label to be predicted.
  - `graph`: The ArangoDB graph name.
  - `vertexCollections`: Here, you can describe all the vertex collections and the features you would
		like to include in training. You must provide an `x` for features, and the desired prediction label is supplied as `y`.
  - `edgeCollections`: Here, you describe the relevant edge collections and any relevant attributes or features that should be considered when training.
  
A training specification allows for concisely defining your training task in a
single object and then passing that object to the training service using the
Python API client, as shown below.

**Create a training job**

```
job = arangoml.training.train(training_spec)
print(job)
job_id = job.job_id
```

```
{'job_id': 'f09bd4a0-d2f3-5dd6-80b1-a84602732d61'}
```

**Get status of a training job**

```
arangoml.training.get_job(job_id)
```

```
{'database_name': 'db_name',
 'job_id': 'efac147a-3654-4866-88fe-03866d0d40a5',
 'job_state': None,
 'job_status': 'COMPLETED',
 'metagraph': {'edgeCollections': {...},
               'graph': 'graph_name',
               'mlSpec': {'classification': {'inputFeatures': 'x',
                                             'labelField': 'label_field',
                                             'targetCollection': 'target_collection_name'}},
               'vertexCollections': {...}
               },
 'project_id': 'project_id',
 'project_name': 'project_name',
 'time_ended': '2023-09-01T17:32:05.899493',
 'time_started': '2023-09-01T17:04:01.616354',
 'time_submitted': '2023-09-01T16:58:43.374269'}
```

**Cancel a running training job**

```
arangoml.training.cancel_job(job_id)
```

```
'OK'
```

## Model Selection

Once the training is complete you can review the model statistics.
The training completes 12 training jobs using grid search parameter optimization.
 
To select a model, use the projects API to gather all relevant models and choose
the one you prefer for the next step.

The following examples uses the model with the highest validation accuracy,
but there may be other factors that motivate you to choose another model.

```
models = arangoml.projects.list_models(project_name=project_name, project_id=project_id, job_id=job_id)

# Tip: Sort by accuracy
models.models.sort(key=(lambda model : model.model_statistics["test"]["accuracy"]) , reverse=True)
# The most accurate model is the first in the list
model = models.models[0]
print(model)

```

```
{'job_id': 'f09bd4a0-d2f3-5dd6-80b1-a84602732d61',
 'model_display_name': 'Node Classification Model',
 'model_id': '123',
 'model_name': 'Node Classification Model '
               '123',
 'model_statistics': {'_id': 'devperf/123',
                      '_key': '123',
                      '_rev': '_gkUc8By--_',
                      'run_id': '123',
                      'test': {'accuracy': 0.8891242216547955,
                               'confusion_matrix': [[13271, 2092],
                                                    [1276, 5684]],
                               'f1': 0.9,
                               'loss': 0.1,
                               'precision': 0.9,
                               'recall': 0.8,
                               'roc_auc': 0.8},
                      'timestamp': '2023-09-01T17:32:05.899493',
                      'validation': {'accuracy': 0.9,
                               'confusion_matrix': [[13271, 2092],
                                                    [1276, 5684]],
                               'f1': 0.85,
                               'loss': 0.1,
                               'precision': 0.86,
                               'recall': 0.85,
                               'roc_auc': 0.85}},
 'target_collection': 'target_collection_name',
 'target_field': 'label_field'}
```

## Prediction

After selecting a model, it is time to persist the results to a collection
using the `predict` function.

```
prediction_spec = {
              "project_name": project.name,
              "database_name": db.name,
              "model_id": model.model_id
            }

prediction_job = arangoml.prediction.predict(prediction_spec)
print(prediction_job)
```

This creates a prediction job that grabs data and generates inferences using the
selected model. Then, by default, it writes the predictions to a new collection
connected via an edge to the original source document.
You may choose to specify instead a `collection`.

### Get prediction job status

```
prediction_status = arangoml.prediction.get_job(prediction_job.job_id)
```

```
{'database_name': 'db_name',
 'job_id': '123-ee43-4106-99e7-123',
 'job_state_information': {'outputAttribute': 'label_field_predicted',
                           'outputCollectionName': 'collectionName_predicted_123',
                           'outputGraphName': 'graph_name'},
 'job_status': 'COMPLETED',
 'model_id': '123',
 'project_id': '123456',
 'project_name': 'project_name',
 'time_ended': '2023-09-05T15:23:01.595214',
 'time_started': '2023-09-05T15:13:51.034780',
 'time_submitted': '2023-09-05T15:09:02.768518'}
```

### Access the predictions

You can now directly access your predictions in your application.
If you left the default option you can access them via the dynamically created
collection with a query such as the following:

```
## Query to return results

query = f"""
FOR prediction IN {prediction_status.job_state_information['outputCollectionName']}
    RETURN prediction
"""
results = db.aql.execute(query)

for r in results:
    for key in r:
        print(key +": "+ str(r[key]))
    print(" ")
```