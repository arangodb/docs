---
fileID: go-example-requests
title: ArangoDB GO Driver - Example requests 
weight: 4010
description: 
layout: default
---
## Connecting to ArangoDB

{{< tabs >}}
{{% tab name="go" %}}
```go
conn, err := http.NewConnection(http.ConnectionConfig{
    Endpoints: []string{"http://localhost:8529"},
    TLSConfig: &tls.Config{ /*...*/ },
})
if err != nil {
    // Handle error
}
client, err := driver.NewClient(driver.ClientConfig{
    Connection: conn,
    Authentication: driver.BasicAuthentication("user", "password"),
})
if err != nil {
    // Handle error
}
```
{{% /tab %}}
{{< /tabs >}}

## Creating a new database
{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
options := driver.CreateDatabaseOptions{ /*...*/ }
db, err := client.CreateDatabase(ctx, "myDB", &options)
if err != nil {
// handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Opening a database 

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
db, err := client.Database(ctx, "myDB")
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Opening a collection

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
col, err := db.Collection(ctx, "myCollection")
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Checking if a collection exists

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
found, err := db.CollectionExists(ctx, "myCollection")
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Creating a collection

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
options := driver.CreateCollectionOptions{ /* ... */ }
col, err := db.CreateCollection(ctx, "myCollection", &options)
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Creating a document

{{< tabs >}}
{{% tab name="go" %}}
```go
type MyDocument struct {
    Name    string `json:"name"`
    Counter int    `json:"counter"`
}

doc := MyDocument{
    Name: "jan",
    Counter: 23,
}
ctx := context.Background()
meta, err := col.CreateDocument(ctx, doc)
if err != nil {
    // handle error 
}
fmt.Printf("Created document with key '%s', revision '%s'\n", meta.Key, meta.Rev)
```
{{% /tab %}}
{{< /tabs >}}

## Reading a document from a collection 

{{< tabs >}}
{{% tab name="go" %}}
```go
var doc MyDocument 
ctx := context.Background()
meta, err := col.ReadDocument(ctx, "myDocumentKey (meta.Key)", &doc)
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Reading a document from a collection with an explicit revision

{{< tabs >}}
{{% tab name="go" %}}
```go
var doc MyDocument 
revCtx := driver.WithRevision(ctx, "mySpecificRevision (meta.Rev)")
meta, err := col.ReadDocument(revCtx, "myDocumentKey (meta.Key)", &doc)
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Removing a document 

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
meta, err := col.RemoveDocument(ctx, myDocumentKey)
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Removing a document with an explicit revision

{{< tabs >}}
{{% tab name="go" %}}
```go
revCtx := driver.WithRevision(ctx, "mySpecificRevision")
meta, err := col.RemoveDocument(revCtx, myDocumentKey)
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Updating a document 

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
patch := map[string]interface{}{
    "name": "Frank",
}
meta, err := col.UpdateDocument(ctx, myDocumentKey, patch)
if err != nil {
    // handle error 
}
```
{{% /tab %}}
{{< /tabs >}}

## Querying documents, one document at a time 

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := context.Background()
query := "FOR d IN myCollection LIMIT 10 RETURN d"
cursor, err := db.Query(ctx, query, nil)
if err != nil {
    // handle error 
}
defer cursor.Close()
for {
    var doc MyDocument 
    meta, err := cursor.ReadDocument(ctx, &doc)
    if driver.IsNoMoreDocuments(err) {
        break
    } else if err != nil {
        // handle other errors
    }
    fmt.Printf("Got doc with key '%s' from query\n", meta.Key)
}
```
{{% /tab %}}
{{< /tabs >}}

## Querying documents, fetching total count

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := driver.WithQueryCount(context.Background())
query := "FOR d IN myCollection RETURN d"
cursor, err := db.Query(ctx, query, nil)
if err != nil {
    // handle error 
}
defer cursor.Close()
fmt.Printf("Query yields %d documents\n", cursor.Count())
```
{{% /tab %}}
{{< /tabs >}}

## Querying documents, with bind variables

{{< tabs >}}
{{% tab name="go" %}}
```go
ctx := driver.WithQueryCount(context.Background())
query := "FOR d IN myCollection FILTER d.name == @myVar RETURN d"
bindVars := map[string]interface{}{
    "myVar": "Some name",
}
cursor, err := db.Query(ctx, query, bindVars)
if err != nil {
    // handle error 
}
defer cursor.Close()
fmt.Printf("Query yields %d documents\n", cursor.Count())
```
{{% /tab %}}
{{< /tabs >}}
