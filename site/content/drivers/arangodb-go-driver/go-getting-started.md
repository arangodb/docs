---
fileID: go-getting-started
title: ArangoDB GO Driver - Getting Started
weight: 4005
description: 
layout: default
---
## Supported versions

- ArangoDB versions 3.1 and up.
    - Single server & cluster setups
    - With or without authentication
- Go 1.7 and up.

## Go dependencies 

- None (Additional error libraries are supported).

## Usage

To use the Go driver, import it as a Go package into your program
using the `import` statement, then open a client connection to a URL,
with username and password, using the API. This results in a handle
with which to create and edit objects for collections, documents,
nodes, and edges. These database objects are mapped to types in
Go. The methods for these types are used to read and write data.

Some operations (like deleting a database) cannot easily be done using
the API, as they are too dangerous.

## Go idioms

Go uses package names as datatypes, and datatypes as qualifiers, to invoke 
member functions:

```go
package.Member()
var myvariable package.Typename 
```

Moreover, the package name becomes an object reference to all types and unclassified
functions defined within it: e.g.

```go
driver.Function()    // package driver
fmt.Println("hello") // package fmt
os.Exit(0)           // package os
```

There are two Go package components needed for the Go driver.
The main go-driver name contains an illegal character however, so we need to map
it to an alias, say `driver` for the Arango driver (or something shorter),
by importing it as

```go
import (
	"github.com/arangodb/go-driver/http"
	driver "github.com/arangodb/go-driver"
)
```

Now we refer to the member functions and types as: 

```go
http.NewConnection(..)
driver.NewClient(..)
driver.Database
driver.Collection
```

## Configuration

To use the driver, first fetch the sources into your `GOPATH`.

```sh
go get github.com/arangodb/go-driver
```

Using the driver, you always need to create a `Client`.
The following example shows how to create a `Client` for a single server 
running on localhost.

```go
import (
	"fmt"
	driver "github.com/arangodb/go-driver"
	"github.com/arangodb/go-driver/http"
)


...

conn, err := http.NewConnection(http.ConnectionConfig{
    Endpoints: []string{"http://localhost:8529"},
})
if err != nil {
    // Handle error
}
client, err := driver.NewClient(driver.ClientConfig{
    Connection: conn,
})
if err != nil {
    // Handle error
}
```

Once you have a `Client` you can access/create databases on the server, 
access/create collections, graphs, documents and so on.

### Important types

Key types you’ll need to know about to work with
Arango using the Go driver are:

- `Database` - to maintain a handle to an open database
- `Collection` - as a handle for a collection of records
  (vertex, edge, or document) within a database
- `Graph` - as a handle for a graph overlay containing vertices and edges
  (nodes and links)
- `EdgeDefinition` - a named collection of edges used to help a graph in
  distributed searching

These are declared as in the following examples:

```go
var err error
var client driver.Client
var conn   driver.Connection
var db     driver.Database
var col    driver.Collection
```

etc. We can now see them in action: the following example shows how to open an
existing collection in an existing database and create a new document in that
collection.

```go

// Open a client connection 
conn, err = http.NewConnection(http.ConnectionConfig{
	Endpoints: []string{"https://5a812333269f.arangodb.cloud:8529/"},
})
if err != nil {
    // Handle error
}

// Client object
client, err = driver.NewClient(driver.ClientConfig{
	Connection: conn,
	Authentication: driver.BasicAuthentication("root", "wnbGnPpCXHwbP"),
})
if err != nil {
    // Handle error
}

// Open "examples_books" database
db, err := client.Database(nil, "examples_books")
if err != nil {
    // Handle error
}

// Open "books" collection
col, err := db.Collection(nil, "books")
if err != nil {
    // Handle error
}

// Create document
book := Book{
    Title:   "ArangoDB Cookbook",
    NoPages: 257,
}

meta, err := col.CreateDocument(nil, book)
if err != nil {
    // Handle error
}
fmt.Printf("Created document in collection '%s' in database '%s'\n", col.Name(), db.Name())
```

Note that Go's `:=` operator declares and assigns with the automatic type of the
function in one operation, so the type returned appear mysterious. It's also
acceptable to declare variables explicitly using `var myvariable type` when
learning these types. 
Note also that Edge collections and Vertex collections use different methods
from ordinary document collections, as they are contained by a Graph
model and EdgeDefinitions.

## Relationship between Go types and JSON

A basic principle of the integration between Go and ArangoDB is the
mapping from Go types to JSON documents. Data in the database map to
types in Go through JSON. You will need at least two types in a Golang
program to work with graphs

Go uses a special syntax to map values like struct members like Key,
Weight, Data, etc into JSON fields. Remember that member names should
start with a capital letter to be accessible outside a packaged
scope. You declare types and their JSON mappings once as in the
examples below.

```go
// A typical document type

type IntKeyValue struct {

    Key    string  `json:"_key"`   // mandatory field (handle) - short name
    Value  int     `json:"value"`
}

// A typical vertex type must have field matching _key

type MyVertexNode struct {

    Key     string    `json:"_key"` // mandatory field (handle) - short name
 
      // other fields … e.g.

    Data    string `json: "data"`   // Longer description or bulk string data
    Weight float64 `json:"weight"`  // importance rank
}

// A typical edge type must have fields matching _from and _to

type MyEdgeLink struct {

    Key       string `json:"_key"`      // mandatory field (handle)
    From      string `json:"_from"`     // mandatory field
    To        string `json:"_to"`       // mandatory field

       // other fields … e.g.

    Weight  float64 `json:"weight"`
    
}
```

When reading data from ArangoDB with, say, `ReadDocument()`, the API
asks you to submit a variable of some type, say `MyDocumentType`, by reference
using the `&` operator:

```go
 var variable MyDocumentType
 mycollection.ReadDocument(nil, rawkey, &variable)
```

This submitted type is not necessarily a fixed type, but it must be a type whose members
map (at least partially) to the named fields in the database's JSON
document representation. Only matching fields will be filled in. This
means you could create several different Go types to read the same
documents in the database, as long as they have some type fields that
match JSON fields. In other words, the mapping need not be unique or
one to one, so there is great flexibility in making new types to
extract a subset of the fields in a document.

The document model in ArangoDB does not require all documents in a
collection to have the same fields. You can choose to have ad hoc
schemas, and extract only a consistent set of fields in a query, or
rigidly check that all documents have the same schema. This is a user
choice. 

## Complete example

```go
package main

import (
	"flag"
	"fmt"
	"log"
	"strings"

	driver "github.com/arangodb/go-driver"
	"github.com/arangodb/go-driver/http"
)

type User struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func main() {

	var err error
	var client driver.Client
	var conn driver.Connection

	flag.Parse()

	conn, err = http.NewConnection(http.ConnectionConfig{
		Endpoints: []string{"http://localhost:8529"},
		//Endpoints: []string{"https://5a812333269f.arangodb.cloud:8529/"},
	})
	if err != nil {
		log.Fatalf("Failed to create HTTP connection: %v", err)
	}
	client, err = driver.NewClient(driver.ClientConfig{
		Connection:     conn,
		Authentication: driver.BasicAuthentication("root", "mypassword"),
		//Authentication: driver.BasicAuthentication("root", "wnbGnPpCXHwbP"),
	})

	var db driver.Database
	var db_exists, coll_exists bool

	db_exists, err = client.DatabaseExists(nil, "example")

	if db_exists {
		fmt.Println("That db exists already")

		db, err = client.Database(nil, "example")

		if err != nil {
			log.Fatalf("Failed to open existing database: %v", err)
		}

	} else {
		db, err = client.CreateDatabase(nil, "example", nil)

		if err != nil {
			log.Fatalf("Failed to create database: %v", err)
		}
	}

	// Create collection

	coll_exists, err = db.CollectionExists(nil, "users")

	if coll_exists {
		fmt.Println("That collection exists already")
		PrintCollection(db, "users")

	} else {

		var col driver.Collection
		col, err = db.CreateCollection(nil, "users", nil)

		if err != nil {
			log.Fatalf("Failed to create collection: %v", err)
		}

		// Create documents
		users := []User{
			User{
				Name: "John",
				Age:  65,
			},
			User{
				Name: "Tina",
				Age:  25,
			},
			User{
				Name: "George",
				Age:  31,
			},
		}
		metas, errs, err := col.CreateDocuments(nil, users)

		if err != nil {
			log.Fatalf("Failed to create documents: %v", err)
		} else if err := errs.FirstNonNil(); err != nil {
			log.Fatalf("Failed to create documents: first error: %v", err)
		}

		fmt.Printf("Created documents with keys '%s' in collection '%s' in database '%s'\n", strings.Join(metas.Keys(), ","), col.Name(), db.Name())
	}
}

// **************************************************

func PrintCollection(db driver.Database, name string) {

	var err error
	var cursor driver.Cursor

	querystring := "FOR doc IN users LIMIT 10 RETURN doc"

	cursor, err = db.Query(nil, querystring, nil)

	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	defer cursor.Close()

	for {
		var doc User
		var metadata driver.DocumentMeta

		metadata, err = cursor.ReadDocument(nil, &doc)

		if driver.IsNoMoreDocuments(err) {
			break
		} else if err != nil {
			log.Fatalf("Doc returned: %v", err)
		} else {
			fmt.Print("Dot doc ", metadata, doc, "\n")
		}
	}
}

```

## API design 

### Concurrency

All functions of the driver are strictly synchronous. They operate and only return a value (or error)
when they're done. 

If you want to run operations concurrently, use a go routine. All objects in the driver are designed 
to be used from multiple concurrent go routines, except `Cursor`.

All database objects (except `Cursor`) are considered static. After their creation they won't change.
E.g. after creating a `Collection` instance you can remove the collection, but the (Go) instance 
will still be there. Calling functions on such a removed collection will of course fail.

### Structured error handling & wrapping

All functions of the driver that can fail return an `error` value. If that value is not `nil`, the 
function call is considered to be failed. In that case all other return values are set to their `zero` 
values.

All errors are structured using error checking functions named `Is<SomeErrorCategory>`.
E.g. `IsNotFound(error)` return true if the given error is of the category "not found". 
There can be multiple internal error codes that all map onto the same category.

All errors returned from any function of the driver (either internal or exposed) wrap errors 
using the `WithStack` function. This can be used to provide detail stack trackes in case of an error.
All error checking functions use the `Cause` function to get the cause of an error instead of the error wrapper.

Note that `WithStack` and `Cause` are actually variables to you can implement it using your own error 
wrapper library. 

If you for example use [github.com/pkg/errors](https://github.com/pkg/errors),
you want to initialize to go driver like this:

```go
import (
	driver "github.com/arangodb/go-driver"
	"github.com/pkg/errors"
)

func init() {
	driver.WithStack = errors.WithStack
	driver.Cause = errors.Cause
}

```

### Context aware 

All functions of the driver that involve some kind of long running operation or 
support additional options not given as function arguments, have a `context.Context` argument. 
This enables you cancel running requests, pass timeouts/deadlines and pass additional options.

In all methods that take a `context.Context` argument you can pass `nil` as value. 
This is equivalent to passing `context.Background()`.

Many functions support 1 or more optional (and infrequently used) additional options.
These can be used with a `With<OptionName>` function.
E.g. to force a create document call to wait until the data is synchronized to disk, 
use a prepared context like this:

```go
ctx := driver.WithWaitForSync(parentContext)
collection.CreateDocument(ctx, yourDocument)
```
