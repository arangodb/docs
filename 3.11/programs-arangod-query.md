---
layout: default
description: ArangoDB Server Query Options
---
# ArangoDB Server Query Options


## AQL Query with spilling input data to disk 

<small>Introduced in: v3.10.0 </small>

With the parameters mentioned below, queries can execute with storing input 
and intermediate results temporarily on disk to decrease the memory usage 
a specified threshold is reached. 

{% hint 'info' %}
This feature is experimental and is turned off by default.
Also, the query results are still built up entirely in RAM on coordinators
and single servers for non-streaming queries. To avoid the buildup of
the entire query result in RAM, a streaming query should be used.
{% endhint %}

The threshold value to start spilling data onto disk is either 
a number of rows in the query input or an amount of memory used in bytes, 
which are both set as query options.

The main parameter that must be provided for this feature to be active is 
`--temp.intermediate-results-path`. This parameter specifies a path to a directory
used to store temporary data. If such path is not provided, the feature of spilling data 
onto the disk will not be activated.

Hence, the following parameters do not have any effect, unless the parameter 
mentioned above is provided with a directory path.
The directory specified here must not be located underneath the instance's 
database directory.


- `--temp.-intermediate-results-encryption-hardware-acceleration`

  Use Intel intrinsics-based encryption, requiring a CPU with the AES-NI 
  instruction set. If turned off, then OpenSSL is used, which may use hardware-
  accelarated encryption too. 
  Default: `true`.

- `--temp.intermediate-results-capacity`

  Maximum capacity, in bytes, to use for ephemeral, intermediate results, meaning 
  the maximum size allowed for the mentioned temporary storage. 
  Default: 0 (unlimited).

- `--temp.intermediate-results-encryption` 

  Encrypt ephemeral, intermediate results on disk.
  Default: `false`.


- `--temp.intermediate-results-spillover-threshold-num-rows`

  A number of result rows from which on a spillover from RAM to disk will happen.
  Default: 5000000.

- `--temp.intermediate-results-spillover-threshold-memory-usage`

  Memory usage, in bytes, after which a spillover from RAM to disk will happen.
  Default: 128MB.
