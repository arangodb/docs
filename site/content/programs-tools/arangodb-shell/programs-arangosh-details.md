---
fileID: programs-arangosh-details
title: _arangosh_ Details
weight: 280
description: 
layout: default
---
## Interaction

You can paste multiple lines into _arangosh_, given the first line ends with an
opening brace:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: shellPaste
description: ''
render: input/output
version: '3.10'
release: stable
---
 for (var i = 0; i < 10; i ++) {
  require("@arangodb").print("Hello world " + i + "!\n");
}
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



To load your own JavaScript code into the current JavaScript interpreter context,
use the load command:

    require("internal").load("/tmp/test.js")     // <- Linux / macOS
    require("internal").load("c:\\tmp\\test.js") // <- Windows

Exiting arangosh can be done using the key combination {{< tabs >}}
{{% tab name="<CTRL> + D" %}}
```<CTRL> + D```
{{% /tab %}}
{{< /tabs >}} or by
typing {{< tabs >}}
{{% tab name="quit<CR>" %}}
```quit<CR>```
{{% /tab %}}
{{< /tabs >}}

## Shell Output

The ArangoDB shell will print the output of the last evaluated expression
by default:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: lastExpressionResult
description: ''
render: input/output
version: '3.10'
release: stable
---
42 * 23
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 

    

In order to prevent printing the result of the last evaluated expression,
the expression result can be captured in a variable, e.g.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: lastExpressionResultCaptured
description: ''
render: input/output
version: '3.10'
release: stable
---
var calculationResult = 42 * 23
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



There is also the `print` function to explicitly print out values in the
ArangoDB shell:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: printFunction
description: ''
render: input/output
version: '3.10'
release: stable
---
print({ a: "123", b: [1,2,3], c: "test" });
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



By default, the ArangoDB shell uses a pretty printer when JSON documents are
printed. This ensures documents are printed in a human-readable way:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: usingToArray
description: ''
render: input/output
version: '3.10'
release: stable
---
db._create("five")
for (i = 0; i < 5; i++) db.five.save({value:i})
db.five.toArray()
~db._drop("five");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



While the pretty-printer produces nice looking results, it will need a lot of
screen space for each document. Sometimes a more dense output might be better.
In this case, the pretty printer can be turned off using the command
*stop_pretty_print()*.

To turn on pretty printing again, use the *start_pretty_print()* command.

## Escaping

In AQL, escaping is done traditionally with the backslash character: `\`.
As seen above, this leads to double backslashes when specifying Windows paths.
_arangosh_ requires another level of escaping, also with the backslash character.
It adds up to four backslashes that need to be written in _arangosh_ for a single
literal backslash (`c:\tmp\test.js`):

    db._query('RETURN "c:\\\\tmp\\\\test.js"')

You can use [bind variables](../../aql/how-to-invoke-aql/invocation-with-arangosh) to
mitigate this:

    var somepath = "c:\\tmp\\test.js"
    db._query(aql`RETURN ${somepath}`)

## Database Wrappers

_arangosh_ provides the *db* object by default, and this object can
be used for switching to a different database and managing collections inside the
current database.

For a list of available methods for the *db* object, type

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: shellHelp
description: ''
render: input/output
version: '3.10'
release: stable
---
db._help(); 
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 

  

The [`db` object](../../appendix/references/appendix-references-dbobject) is available in *arangosh*
as well as on *arangod* i.e. if you're using [Foxx](../../foxx-microservices/). While its
interface is persistent between the *arangosh* and the *arangod* implementations,
its underpinning is not. The *arangod* implementation are JavaScript wrappers
around ArangoDB's native C++ implementation, whereas the *arangosh* implementation
wraps HTTP accesses to ArangoDB's [RESTful API](../../about-arangodb/).

So while this code may produce similar results when executed in *arangosh* and
*arangod*, the CPU usage and time required will be really different since the
*arangosh* version will be doing around 100k HTTP requests, and the
*arangod* version will directly write to the database:

{{< tabs >}}
{{% tab name="js" %}}
```js
for (i = 0; i < 100000; i++) {
    db.test.save({ name: { first: "Jan" }, count: i});
}
```
{{% /tab %}}
{{< /tabs >}}

## Using `arangosh` via unix shebang mechanisms
In unix operating systems you can start scripts by specifying the interpreter in the first line of the script.
This is commonly called `shebang` or `hash bang`. You can also do that with `arangosh`, i.e. create `~/test.js`:

    #!/usr/bin/arangosh --javascript.execute 
    require("internal").print("hello world")
    db._query("FOR x IN test RETURN x").toArray()

Note that the first line has to end with a blank in order to make it work.
Mark it executable to the OS: 

    #> chmod a+x ~/test.js

and finaly try it out:

    #> ~/test.js


## Shell Configuration

_arangosh_ will look for a user-defined startup script named *.arangosh.rc* in the
user's home directory on startup. The home directory will likely be `/home/<username>/`
on Unix/Linux, and is determined on Windows by peeking into the environment variables
`%HOMEDRIVE%` and `%HOMEPATH%`. 

If the file *.arangosh.rc* is present in the home directory, _arangosh_ will execute
the contents of this file inside the global scope.

You can use this to define your own extra variables and functions that you need often.
For example, you could put the following into the *.arangosh.rc* file in your home
directory:

{{< tabs >}}
{{% tab name="js" %}}
```js
// "var" keyword avoided intentionally...
// otherwise "timed" would not survive the scope of this script
global.timed = function (cb) {
  console.time("callback");
  cb();
  console.timeEnd("callback");
};
```
{{% /tab %}}
{{< /tabs >}}

This will make a function named *timed* available in _arangosh_ in the global scope.

You can now start _arangosh_ and invoke the function like this:

{{< tabs >}}
{{% tab name="js" %}}
```js
timed(function () { 
  for (var i = 0; i < 1000; ++i) {
    db.test.save({ value: i }); 
  }
});
```
{{% /tab %}}
{{< /tabs >}}

Please keep in mind that, if present, the *.arangosh.rc* file needs to contain valid
JavaScript code. If you want any variables in the global scope to survive you need to
omit the *var* keyword for them. Otherwise the variables will only be visible inside
the script itself, but not outside.
