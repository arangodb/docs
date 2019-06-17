Use cases
---------

### Prefix search

The data contained in our view looks like that:

```json
{ "id": 1, "body": "ThisIsAVeryLongWord" }
{ "id": 2, "body": "ThisIsNotSoLong" }
{ "id": 3, "body": "ThisIsShorter" }
{ "id": 4, "body": "ThisIs" }
{ "id": 5, "body": "ButNotThis" }
```

We now want to search for documents where the attribute `body` starts with "ThisIs",

A simple AQL query executing this prefix search:

    FOR doc IN someView SEARCH STARTS_WITH(doc.body, 'ThisIs')
      RETURN doc

It will find the documents with the ids `1`, `2`, `3`, `4`, but not `5`.
