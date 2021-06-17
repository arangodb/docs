---
layout: default
description: ArangoDB v3.9 Release Notes New Features
---
Features and Improvements in ArangoDB 3.9
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.9. ArangoDB 3.9 also contains several bug fixes that are not listed
here.

AQL
---

### Decay Functions

Added three decay functions to AQL:

- [DECAY_EXP()](aql/functions-numeric.html#decay_exp)
- [DECAY_LINEAR()](aql/functions-numeric.html#decay_linear)
- [DECAY_GAUSS()](aql/functions-numeric.html#decay_gauss)

Decay functions score a document with a function that decays depending on the
distance of a numeric field value of the document from a user given origin.

```js
DECAY_GAUSS(41, 40, 5, 5, 0.5) // 1
DECAY_LINEAR(5, 0, 10, 0, 0.2) // 0.6
DECAY_EXP(2, 0, 10, 0, 0.2) // 0.7247796636776955
```

UI
--

### Configurable root redirect

Added two options to `arangod` to allow HTTP redirection customization for
root (`/`) call of the HTTP API:

- `--http.permanently-redirect-root`: if true (default), use a permanent
  redirection (use HTTP 301 code), if false fall back to temporary redirection
  (use HTTP 302 code).

- `--http.redirect-root-to`: redirect of root URL to a specified path.
  Redirects to `/_admin/aardvark/index.html` if not set (default).

Client tools
------------

### More powerful arangovpack

The _arangovpack_ utility supports more input and output formats (JSON and
VelocyPack, plain or hex-encoded). The former options `--json` and `--pretty`
have been removed and have been replaced with separate options for specifying
the input and output types:

- `--input-type` (`json`, `json-hex`, `vpack`, `vpack-hex`)
- `--output-type` (`json`, `json-pretty`, `vpack`, `vpack-hex`)

The former option `--print-non-json` has been replaced with the new option
`--fail-on-non-json` which makes [arangovpack](programs-arangovpack.html)
fail when trying to emit non-JSON types to JSON output.

Internal changes
----------------

The compiler version used to build the ArangoDB Linux executables has been
upgraded from g++ 9.3.0 to g++ 10.2.1.
g++ 10 is also the expected version of g++ when compiling ArangoDB from
source.

The minimum architecture requirements have been raised from the Westmere
architecture to the Sandy Bridge architecture. 256-bit AVX instructions are
now expected to be present on all targets that run ArangoDB 3.9 executables.
If a target does not support AVX instructions, it may fail with SIGILL at
runtime.
