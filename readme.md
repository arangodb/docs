# ArangoDB Docs Toolchain

## How it works

The hugo build command will generate static html content from the markdown files.

The resulting static html is then deployed to Netlify.

While in the hugo build phase, some special files called Render Hooks, trigger special functions when some kind of content is found in a file. These are divided in:

### Link Render Hook

Defined in `layouts/_default/_markup/render-link.html`.

The following hook scans all the hrefs in a file, and tries to retrieve the page from that link, if the page is not found, the build fails for broken link.

### Image Render Hook

Defined in `layouts/_default/_markup/render-image.html`.

Transform the style attributes defined in the image link as {path.png?{attribute1=value1&attribute2=value2&..}} in a style attribute inside the `img` html tag

### Codeblock Render Hook

Defined in `layouts/_default/_markup/render-codeblock-*.html`.

This hook triggers a remote call to the arangoproxy webserver for examples generation.

The following codeblocks are supported:

- `` ```js ``
- `` ```aql ``
- `` ```http-spec ``
- `` ```http-example ``

## Examples generation

### JS/AQL/HTTP Examples

Triggered by the `render-codeblock-js.html`, `render-codeblock-aql.html` and `render-codeblock-http-example.html` hooks.

The content inside the codeblock is made of 2 parts:

- options, written as yaml
- code

The yaml front matter defines all the metadata regarding the example, like the example name, version, bindVars, datasets and more.

Example:

```js
```js
---
name: analyzerByName
version: 3.10
render: input/output
---
    var analyzers = require("@arangodb/analyzers");
    analyzers.analyzer("text_en");
```

#### Flow

The hook triggers a `POST` call to the dedicated arangoproxy endpoint (/js, /aql, /http-example) with the entire codeblock as request body.

The Arangoproxy endpoint parses the request, checks if the examples is cached, otherwise executes the code against the ArangoDB instance with the version defined in the yaml front matter and saves the example output in the cache.

The input/output (as defined in the render yaml option) is returned as json to Hugo in the render hook, which will generate html replacing the codeblock in the file with the input/output of the example.

### OpenApi

Used to describe an HTTP Api using the OpenApi standard format. 

Triggered by the `render-codeblock-http-spec.html` hook.

The content inside the codeblock is a standard OpenApi yaml endpoint description.

Example:
```http-spec
```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/readme:
    get:
      description: |+
        Fetches the service's README or README.md file's contents if any.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |2+
          Mount path of the installed service.
        in: query
      responses:
        '200':
          description: Returned if the request was successful.
        '204':
          description: Returned if no README file was found.
      tags:
      - Foxx
```

#### Flow

The hook triggers a `POST` call to the /http-spec arangoproxy endpoint with the entire codeblock as request body.

The Arangoproxy endpoint parses the request and converts the yaml text in json.

The output json is written in the arangoproxy's api-docs.json file needed by the WebUI Team and returns the json to Hugo in the render hook, which will generate a rapi-doc html element with inside the json specification which will load it as OpenApi Specification


