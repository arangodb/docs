---
layout: default
description: ArangoDB v3.9 Release Notes New Features
---
Features and Improvements in ArangoDB 3.9
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.9. ArangoDB 3.9 also contains several bug fixes that are not listed
here.

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
`--fail-on-non-json` which makes arangovpack fail when trying to emit non-JSON
types to JSON output.

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
