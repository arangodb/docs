---
layout: default
description: >-
   Quick start guide on how to set up a connection to the ArangoGraph API
---
# Getting Started with the ArangoGraph API

The instructions below are a quick start guide on how to set up a connection to the ArangoGraph API.

All examples below will use the Go programming language.
Since the ArangoGraph API is using gRPC with protocol buffers,
all examples can be easily translated to many different languages.

## Prerequisites

Make sure that you have already [signed up for ArangoGraph](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic).

## Creating an API key

1. Go to [cloud.arangodb.com](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic){:target="_blank"} and login.
2. Click the user icon in the top-right of the dashboard.
3. Select __My API keys__
4. Click __New API key__
5. Click __Create__ to select the default settings.
6. You'll now see a dialog showing the __API key ID__ and
   the __API key Secret__. This is the only time you will see
   the secret, so make sure to store it in a safe place.

## Create an access token with your API key

```go
import (
   "context"

   "google.golang.org/grpc"
   "google.golang.org/grpc/credentials"
   "github.com/arangodb-managed/apis/common/auth"
   common "github.com/arangodb-managed/apis/common/v1"
   data "github.com/arangodb-managed/apis/data/v1"
   iam "github.com/arangodb-managed/apis/iam/v1"
)

...

// Set up a connection to the API.
tc := credentials.NewTLS(&tls.Config{})
conn, err := grpc.Dial("https://api.cloud.arangodb.com",
   grpc.WithTransportCredentials(tc))
if err != nil {
   // handle error
}

// Create client for IAM service
iamc := iam.NewIAMServiceClient(conn)

// Call AuthenticateAPIKey to create token
resp, err := iamc.AuthenticateAPIKey(ctx,
   &iam.AuthenticateAPIKeyRequest{
   Id:     keyID,
   Secret: keySecret,
})
if err != nil {
   // handle error
}
token := resp.GetToken()
```

## Make an authenticated API call

We're going to list all deployments in a project.
The connection and token created in the previous sample is re-used.

The authentication token is passed as standard `bearer` token to the call.
If Go, there is a helper method (`WithAccessToken`) to create a context using
an authentication token.

```go
// Create client for Data service
datac := data.NewDataServiceClient(conn)

// Prepare context with authentication token
ctx := auth.WithAccessToken(context.Background(), token)

// Call list deployments
list, err := datac.ListDeployments(ctx,
   &common.ListOptions{ContextId: myProjectID})
if err != nil {
   // handle error
}
for _, depl := range list.GetItems() {
   fmt.Printf("Found deployment with id %s\n", depl.GetId())
}

```

## API Errors

All API methods return errors as gRPC error codes.

The `github.com/arangodb-managed/apis/common/v1` package contains several helpers to check for common errors.

```go
if common.IsNotFound(err) {
   // Error is caused by a not-found situation
}
```
