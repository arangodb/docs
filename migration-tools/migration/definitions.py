### Here are mocked definitions from the various 1_structs.md files which are not processed by the http_docublock migration script

definitions = {
    "ARANGO_ERROR": {
        "description": "An ArangoDB Error code", 
        "type": "integer"
    }, 
    "ArangoError": {
        "description": "the arangodb error type", 
        "properties": {
            "code": {
                "description": "the HTTP Status code", 
                "type": "integer"
            }, 
            "error": {
                "description": "boolean flag to indicate whether an error occurred (*true* in this case)", 
                "type": "boolean"
            }, 
            "errorMessage": {
                "description": "a descriptive error message describing what happened, may contain additional information", 
                "type": "string"
            }, 
            "errorNum": {
                "description": "the ARANGO_ERROR code", 
                "type": "integer"
            }
        }
    }, 
    "computed_field": {
        "description": "", 
        "properties": {
            "computeOn": {
                "description": "An array of strings that defines on which write operations the value is\ncomputed. The possible values are `\"insert\"`, `\"update\"`, and `\"replace\"`.\n\n", 
                "format": "string", 
                "items": {
                    "type": "string"
                }, 
                "type": "array"
            }, 
            "expression": {
                "description": "An AQL `RETURN` operation with an expression that computes the desired value.\n\n", 
                "type": "string"
            }, 
            "failOnWarning": {
                "description": "Whether the write operation fails if the expression produces a warning.\n\n", 
                "type": "boolean"
            }, 
            "keepNull": {
                "description": "Whether the target attribute is set if the expression evaluates to `null`.\n\n", 
                "type": "boolean"
            }, 
            "name": {
                "description": "The name of the target attribute.\n\n", 
                "type": "string"
            }, 
            "overwrite": {
                "description": "Whether the computed value takes precedence over a user-provided or\nexisting attribute.\n\n", 
                "type": "boolean"
            }
        }, 
        "type": "object", 
    },
    "edge_representation": {
            "description": "The complete deleted edge document.\nIncludes all attributes stored before this operation.\nWill only be present if returnOld is true.\n\n", 
            "properties": {
                "_from": {
                    "description": "The _from value of the stored data.\n\n", 
                    "type": "string"
                }, 
                "_id": {
                    "description": "The _id value of the stored data.\n\n", 
                    "type": "string"
                }, 
                "_key": {
                    "description": "The _key value of the stored data.\n\n", 
                    "type": "string"
                }, 
                "_rev": {
                    "description": "The _rev value of the stored data.\n\n", 
                    "type": "string"
                }, 
                "_to": {
                    "description": "The _to value of the stored data.\n\n", 
                    "type": "string"
                }
            }, 
            "type": "object", 
        }, 
    "vertex_representation": {
            "description": "The internal attributes for the vertex.\n\n", 
            "properties": {
                "_id": {
                    "description": "The _id value of the stored data.\n\n", 
                    "type": "string"
                }, 
                "_key": {
                    "description": "The _key value of the stored data.\n\n", 
                    "type": "string"
                }, 
                "_rev": {
                    "description": "The _rev value of the stored data.\n\n", 
                    "type": "string"
                }
            }, 
            "required": [
                "vertex"
            ], 
            "type": "object", 
        },
        "move_shard_operation": {
            "description": "", 
            "properties": {
                "collection": {
                    "description": "Collection ID of the collection the shard belongs to.\n\n", 
                    "format": "", 
                    "type": "number"
                }, 
                "from": {
                    "description": "The server name from which to move.\n\n", 
                    "type": "string"
                }, 
                "isLeader": {
                    "description": "True if this is a leader move shard operation.\n\n", 
                    "type": "boolean"
                }, 
                "shard": {
                    "description": "Shard ID of the shard to be moved.\n\n", 
                    "type": "string"
                }, 
                "to": {
                    "description": "The ID of the destination server.\n\n", 
                    "type": "string"
                }
            }, 
            "type": "object", 
        }, 
    "get_api_control_pregel": {
        "description": "\n", 
        "properties": {
            "algorithm": {
                "description": "The algorithm used by the job.\n\n", 
                "type": "string"
            }, 
            "computationTime": {
                "description": "The algorithm execution time. Is shown when the computation started. \n\n", 
                "format": "float", 
                "type": "number"
            }, 
            "created": {
                "description": "The date and time when the job was created.\n\n", 
                "type": "string"
            }, 
            "detail": {
                "$ref": "#/components/schemas/get_api_control_pregel_detail"
            }, 
            "edgeCount": {
                "description": "The total number of edges processed.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "expires": {
                "description": "The date and time when the job results expire. The expiration date is only\nmeaningful for jobs that were completed, canceled or resulted in an error. Such jobs\nare cleaned up by the garbage collection when they reach their expiration date/time.\n\n", 
                "type": "string"
            }, 
            "gss": {
                "description": "The number of global supersteps executed.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "gssTimes": {
                "description": "Computation time of each global super step. Is shown when the computation started.\n\n", 
                "format": "number", 
                "items": {
                    "type": "number"
                }, 
                "type": "array"
            }, 
            "id": {
                "description": "The ID of the Pregel job, as a string.\n\n", 
                "type": "string"
            }, 
            "reports": {
                "description": "This attribute is used by Programmable Pregel Algorithms (`air`, experimental).\nThe value is only populated once the algorithm has finished.\n\n", 
                "format": "object", 
                "items": {
                    "type": "object"
                }, 
                "type": "array"
            }, 
            "startupTime": {
                "description": "The startup runtime of the execution.\nThe startup time includes the data loading time and can be substantial.\n\n", 
                "format": "float", 
                "type": "number"
            }, 
            "state": {
                "description": "The state of the execution. The following values can be returned:\n- `\"none\"`: The Pregel run did not yet start.\n- `\"loading\"`: The graph is loaded from the database into memory before the execution of the algorithm.\n- `\"running\"`: The algorithm is executing normally.\n- `\"storing\"`: The algorithm finished, but the results are still being written\n  back into the collections. Occurs only if the store parameter is set to true.\n- `\"done\"`: The execution is done. In version 3.7.1 and later, this means that\n  storing is also done. In earlier versions, the results may not be written back\n  into the collections yet. This event is announced in the server log (requires\n  at least info log level for the `pregel` log topic).\n- `\"canceled\"`: The execution was permanently canceled, either by the user or by\n  an error.\n- `\"fatal error\"`: The execution has failed and cannot recover.\n- `\"in error\"`: The execution is in an error state. This can be\n  caused by DB-Servers being not reachable or being non responsive. The execution\n  might recover later, or switch to `\"canceled\"` if it was not able to recover\n  successfully. \n- `\"recovering\"` (currently unused): The execution is actively recovering and\n  switches back to `running` if the recovery is successful.\n\n", 
                "type": "string"
            }, 
            "storageTime": {
                "description": "The time for storing the results if the job includes results storage.\nIs shown when the storing started.\n\n", 
                "format": "float", 
                "type": "number"
            }, 
            "totalRuntime": {
                "description": "The total runtime of the execution up to now (if the execution is still ongoing).\n\n", 
                "format": "float", 
                "type": "number"
            }, 
            "ttl": {
                "description": "The TTL (time to live) value for the job results, specified in seconds.\nThe TTL is used to calculate the expiration date for the job's results.\n\n", 
                "format": "float", 
                "type": "number"
            }, 
            "vertexCount": {
                "description": "The total number of vertices processed.\n\n", 
                "format": "int64", 
                "type": "integer"
            }
        }, 
        "required": [
            "detail"
        ], 
        "type": "object", 
    }, 
    "get_api_control_pregel_detail": {
        "description": "The Pregel run details.\n\n", 
        "properties": {
            "aggregatedStatus": {
                "$ref": "#/components/schemas/get_api_control_pregel_detail_aggregated"
            }, 
            "workerStatus": {
                "description": "The details of the Pregel for every DB-Server. Each object key is a DB-Server ID,\nand each value is a nested object similar to the `aggregatedStatus` attribute.\nIn a single server deployment, there is only a single entry with an empty string as key.\n", 
                "format": "", 
                "type": "object"
            }
        }, 
        "required": [
            "aggregatedStatus"
        ], 
        "type": "object", 
    }, 
    "get_api_control_pregel_detail_aggregated": {
        "description": "The aggregated details of the full Pregel run. The values are totals of all the\nDB-Server.\n\n", 
        "properties": {
            "allGssStatus": {
                "$ref": "#/components/schemas/get_api_control_pregel_detail_aggregated_gss"
            }, 
            "graphStoreStatus": {
                "$ref": "#/components/schemas/get_api_control_pregel_detail_aggregated_store"
            }, 
            "timeStamp": {
                "description": "The time at which the status was measured.\n\n", 
                "type": "string"
            }
        }, 
        "type": "object", 
    }, 
    "get_api_control_pregel_detail_aggregated_gss": {
        "description": "Information about the global supersteps.\n\n", 
        "properties": {
            "items": {
                "description": "A list of objects with details for each global superstep.\n\n", 
                "format": "get_api_control_pregel_detail_aggregated_gss_items", 
                "items": {
                    "$ref": "#/components/schemas/get_api_control_pregel_detail_aggregated_gss_items"
                }, 
                "type": "array"
            }
        }, 
        "type": "object", 
    }, 
    "get_api_control_pregel_detail_aggregated_gss_items": {
        "description": "", 
        "properties": {
            "memoryBytesUsedForMessages": {
                "description": "The number of bytes used in memory for the messages in this step.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "messagesReceived": {
                "description": "The number of messages received in this step.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "messagesSent": {
                "description": "The number of messages sent in this step.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "verticesProcessed": {
                "description": "The number of vertices that have been processed in this step.\n\n", 
                "format": "int64", 
                "type": "integer"
            }
        }, 
        "type": "object", 
    }, 
    "get_api_control_pregel_detail_aggregated_store": {
        "description": "The status of the in memory graph.\n\n", 
        "properties": {
            "edgesLoaded": {
                "description": "The number of edges that are loaded from the database into memory.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "memoryBytesUsed": {
                "description": "The number of bytes used in-memory for the loaded graph.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "verticesLoaded": {
                "description": "The number of vertices that are loaded from the database into memory.\n\n", 
                "format": "int64", 
                "type": "integer"
            }, 
            "verticesStored": {
                "description": "The number of vertices that are written back to the database after the Pregel\ncomputation finished. It is only set if the `store` parameter is set to `true`.\n\n", 
                "format": "int64", 
                "type": "integer"
            }
        }, 
        "type": "object", 
    }, 
    "graph_edge_definition": {
        "description": "", 
        "properties": {
            "collection": {
                "description": "Name of the edge collection, where the edge are stored in.\n\n", 
                "type": "string"
            }, 
            "from": {
                "description": "List of vertex collection names.\nEdges in collection can only be inserted if their _from is in any of the collections here.\n\n", 
                "format": "string", 
                "items": {
                    "type": "string"
                }, 
                "type": "array"
            }, 
            "to": {
                "description": "List of vertex collection names.\nEdges in collection can only be inserted if their _to is in any of the collections here.\n", 
                "format": "string", 
                "items": {
                    "type": "string"
                }, 
                "type": "array"
            }
        }, 
        "type": "object", 
    }, 
    "key_generator_type": {
        "description": "A object which contains key generation options\n\n", 
        "properties": {
            "allowUserKeys": {
                "description": "if set to `true`, then it is allowed to supply\nown key values in the `_key` attribute of a document. If set to\n`false`, then the key generator is solely responsible for\ngenerating keys and supplying own key values in the `_key` attribute\nof documents is considered an error.\n\n", 
                "type": "boolean"
            }, 
            "lastValue": {
                "description": "\n", 
                "format": "", 
                "type": "integer"
            }, 
            "type": {
                "description": "specifies the type of the key generator. The currently\navailable generators are `traditional`, `autoincrement`, `uuid`\nand `padded`.\n\n", 
                "type": "string"
            }
        }, 
        "type": "object", 
    },
    "get_api_query_rules": {
        "description": "", 
        "properties": {
            "flags": {
                "$ref": "#/components/schemas/get_api_query_rules_flags"
            }, 
            "name": {
                "description": "The name of the optimizer rule as seen in query explain outputs.\n\n", 
                "type": "string"
            }
        }, 
        "required": [
            "flags"
        ], 
        "type": "object", 
    }, 
    "get_api_query_rules_flags": {
        "description": "An object with the properties of the rule.\n\n", 
        "properties": {
            "canBeDisabled": {
                "description": "Whether users are allowed to disable this rule. A few rules are mandatory.\n\n", 
                "type": "boolean"
            }, 
            "canCreateAdditionalPlans": {
                "description": "Whether this rule may create additional query execution plans.\n\n", 
                "type": "boolean"
            }, 
            "clusterOnly": {
                "description": "Whether the rule is applicable in the cluster deployment mode only.\n\n", 
                "type": "boolean"
            }, 
            "disabledByDefault": {
                "description": "Whether the optimizer considers this rule by default.\n\n", 
                "type": "boolean"
            }, 
            "enterpriseOnly": {
                "description": "Whether the rule is available in the Enterprise Edition only.\n\n", 
                "type": "boolean"
            }, 
            "hidden": {
                "description": "Whether the rule is displayed to users. Internal rules are hidden.\n\n", 
                "type": "boolean"
            }
        }, 
        "type": "object", 
    },
    "api_task_struct": {
        "description": "The function in question\n\n", 
        "properties": {
            "command": {
                "description": "the javascript function for this task\n\n", 
                "type": "string"
            }, 
            "created": {
                "description": "The timestamp when this task was created\n\n", 
                "format": "float", 
                "type": "number"
            }, 
            "database": {
                "description": "the database this task belongs to\n", 
                "type": "string"
            }, 
            "id": {
                "description": "A string identifying the task\n\n", 
                "type": "string"
            }, 
            "name": {
                "description": "The fully qualified name of the user function\n\n", 
                "type": "string"
            }, 
            "offset": {
                "description": "time offset in seconds from the created timestamp\n\n", 
                "format": "float", 
                "type": "number"
            }, 
            "period": {
                "description": "this task should run each `period` seconds\n\n", 
                "format": "", 
                "type": "number"
            }, 
            "type": {
                "description": "What type of task is this [ `periodic`, `timed`]\n  - periodic are tasks that repeat periodically\n  - timed are tasks that execute once at a specific time\n\n", 
                "type": "string"
            }
        }, 
        "type": "object", 
    },
    "collection_info": {
        "description": "\n", 
        "properties": {
            "cacheEnabled": {
                "description": "Whether the in-memory hash cache for documents is enabled for this\ncollection.\n\n", 
                "type": "boolean"
            }, 
            "computedValues": {
                "description": "A list of objects, each representing a computed value.\n\n", 
                "format": "computed_field", 
                "items": {
                    "$ref": "#/components/schemas/computed_field"
                }, 
                "type": "array"
            }, 
            "globallyUniqueId": {
                "description": "Unique identifier of the collection\n", 
                "type": "string"
            }, 
            "id": {
                "description": "unique identifier of the collection; *deprecated*\n\n", 
                "type": "string"
            }, 
            "isSmart": {
                "description": "Whether the collection is used in a SmartGraph (Enterprise Edition only).\n_(cluster only)_\n\n", 
                "type": "boolean"
            }, 
            "isSystem": {
                "description": "true if this is a system collection; usually `name` will start with an underscore.\n\n", 
                "type": "boolean"
            }, 
            "keyOptions": {
                "$ref": "#/components/schemas/key_generator_type"
            }, 
            "name": {
                "description": "literal name of this collection\n\n", 
                "type": "string"
            }, 
            "numberOfShards": {
                "description": "The number of shards of the collection. _(cluster only)_\n\n", 
                "format": "", 
                "type": "integer"
            }, 
            "replicationFactor": {
                "description": "contains how many copies of each shard are kept on different DB-Servers.\nIt is an integer number in the range of 1-10 or the string `\"satellite\"`\nfor a SatelliteCollection (Enterprise Edition only). _(cluster only)_\n\n", 
                "format": "", 
                "type": "integer"
            }, 
            "schema": {
                "description": "The collection level schema for documents.\n\n", 
                "format": "", 
                "type": "object"
            }, 
            "shardKeys": {
                "description": "contains the names of document attributes that are used to\ndetermine the target shard for documents. _(cluster only)_\n\n", 
                "format": "string", 
                "items": {
                    "type": "string"
                }, 
                "type": "array"
            }, 
            "shardingStrategy": {
                "description": "the sharding strategy selected for the collection.\nOne of 'hash' or 'enterprise-hash-smart-edge'. _(cluster only)_\n\n", 
                "type": "string"
            }, 
            "smartGraphAttribute": {
                "description": "Attribute that is used in SmartGraphs (Enterprise Edition only). _(cluster only)_\n\n", 
                "type": "string"
            }, 
            "smartJoinAttribute": {
                "description": "Determines an attribute of the collection that must contain the shard key value\nof the referred-to SmartJoin collection (Enterprise Edition only). _(cluster only)_\n\n", 
                "type": "string"
            }, 
            "type": {
                "description": "The type of the collection:\n  - `0`: \"unknown\"\n  - `2`: regular document collection\n  - `3`: edge collection\n\n", 
                "format": "", 
                "type": "integer"
            }, 
            "waitForSync": {
                "description": "If `true` then creating, changing or removing\ndocuments will wait until the data has been synchronized to disk.\n\n", 
                "type": "boolean"
            }, 
            "writeConcern": {
                "description": "determines how many copies of each shard are required to be\nin sync on the different DB-Servers. If there are less then these many copies\nin the cluster a shard will refuse to write. Writes to shards with enough\nup-to-date copies will succeed at the same time however. The value of\n`writeConcern` cannot be larger than `replicationFactor`. _(cluster only)_\n\n", 
                "format": "", 
                "type": "integer"
            }
        }, 
        "required": [
            "keyOptions"
        ], 
        "type": "object", 
    }, 
    "key_generator_type": {
        "description": "A object which contains key generation options\n\n", 
        "properties": {
            "allowUserKeys": {
                "description": "if set to `true`, then it is allowed to supply\nown key values in the `_key` attribute of a document. If set to\n`false`, then the key generator is solely responsible for\ngenerating keys and supplying own key values in the `_key` attribute\nof documents is considered an error.\n\n", 
                "type": "boolean"
            }, 
            "lastValue": {
                "description": "\n", 
                "format": "", 
                "type": "integer"
            }, 
            "type": {
                "description": "specifies the type of the key generator. The currently\navailable generators are `traditional`, `autoincrement`, `uuid`\nand `padded`.\n\n", 
                "type": "string"
            }
        }, 
        "type": "object", 
    },
    "computed_field": {
        "description": "", 
        "properties": {
            "computeOn": {
                "description": "An array of strings that defines on which write operations the value is\ncomputed. The possible values are `\"insert\"`, `\"update\"`, and `\"replace\"`.\n\n", 
                "format": "string", 
                "items": {
                    "type": "string"
                }, 
                "type": "array"
            }, 
            "expression": {
                "description": "An AQL `RETURN` operation with an expression that computes the desired value.\n\n", 
                "type": "string"
            }, 
            "failOnWarning": {
                "description": "Whether the write operation fails if the expression produces a warning.\n\n", 
                "type": "boolean"
            }, 
            "keepNull": {
                "description": "Whether the target attribute is set if the expression evaluates to `null`.\n\n", 
                "type": "boolean"
            }, 
            "name": {
                "description": "The name of the target attribute.\n\n", 
                "type": "string"
            }, 
            "overwrite": {
                "description": "Whether the computed value takes precedence over a user-provided or\nexisting attribute.\n\n", 
                "type": "boolean"
            }
        }, 
        "type": "object", 
    }, 
    "rebalance_compute": {
            "description": "\n\n", 
            "properties": {
                "databasesExcluded": {
                    "description": "A list of database names to exclude from the analysis. (Default: `[]`)\n\n", 
                    "format": "string", 
                    "items": {
                        "type": "string"
                    }, 
                    "type": "array"
                }, 
                "leaderChanges": {
                    "description": "Allow leader changes without moving data. (Default: `true`)\n\n", 
                    "type": "boolean"
                }, 
                "maximumNumberOfMoves": {
                    "description": "Maximum number of moves to be computed. (Default: `1000`)\n\n", 
                    "format": "", 
                    "type": "number"
                }, 
                "moveFollowers": {
                    "description": "Allow moving followers. (Default: `false`)\n\n", 
                    "type": "boolean"
                }, 
                "moveLeaders": {
                    "description": "Allow moving leaders. (Default: `false`)\n\n", 
                    "type": "boolean"
                }, 
                "piFactor": {
                    "description": "(Default: `256e6`)\n\n", 
                    "format": "", 
                    "type": "number"
                }, 
                "version": {
                    "description": "Must be set to `1`.\n\n", 
                    "format": "", 
                    "type": "number"
                }
            }, 
            "required": [
                ""
            ], 
            "type": "object", 
        }
}