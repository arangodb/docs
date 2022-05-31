---
layout: default
---
# ArangoDB Server Pregel Options

## Pregel job parallelism

Pregel jobs have configurable minimum, maximum and default parallelism values.
These parallelism options can be used by administrators to set concurrency defaults and bounds 
for Pregel jobs on an instance level. Each individual Pregel job can set its own parallelism 
value using the job's `parallelism` option, but the job's effective parallelism will be clamped 
to the bounds defined by `--pregel,min-parallelism` and `--pregel.max-parallelism`. 
If a job does not set its `parallelism` value, it will default to the parallelism value
configured via `--pregel.parallelism`.

### Pregel job minimum parallelism

<small>Introduced in: v3.10.0</small>

`--pregel.min-parallelism`

Minimum parallelism usable in Pregel jobs. Defaults to `1`.
Increasing the value of this option forces each Pregel job to run with at least this
level of parallelism.

### Pregel job maximum parallelism

<small>Introduced in: v3.10.0</small>

`--pregel.max-parallelism`

Maximum parallelism usable in Pregel jobs. Defaults to the number of available cores.
This option effectively limits the parallelism of each Pregel job to the specified value.

### Pregel job default parallelism

<small>Introduced in: v3.10.0</small>

`--pregel.parallelism`

Default parallelism to use in Pregel jobs. Defaults to the number of available cores
divided by 4. The result will be clamped to a value between 1 and 16.
The default parallelism for a Pregel job will be used only if the job does not set its
`parallelism` attribute.

## Pregel memory-mapped files

Pregel will store its temporary data in memory-mapped files on disk by default.
Storing temporary data in memory-mapped files rather than in RAM has the advantage that
the RAM usage can be kept lower, which reduces the likelihood of out-of-memory situations.
However, storing the files on disk requires disk capacity, so that instead of running out
of RAM it is possible to run out of disk space.
Therefore it is necessary to use a suitable storage location for Pregel's memory-mapped
files.

### Pregel memory-mapped files usage

<small>Introduced in: v3.10.0</small>

`--pregel.memory-mapped-files`

if set to `true`, Pregel jobs will by default store their temporary data in disk-backed 
memory-mapped files. If set to `false`, the temporary data of Pregel jobs will be buffered 
in RAM. 
The default value is `true`, meaning that memory-mapped files will be used. 
The option can be overriden for each Pregel job by setting the `useMemoryMaps` attribute
of the job.

### Pregel memory-mapped files storage location type

<small>Introduced in: v3.10.0</small>

`--pregel.memory-mapped-files-location-type`

This option configures the location for the memory-mapped files written by Pregel. 
This option is only meaningful if memory-mapped files are actually used. 
The option can have one of the following values:

- `temp-directory`: store memory-mapped files in the temporary directory,
  as configured via `--temp.path`. If `--temp.path` is not set, the
  system's temporary directory will be used.
- `database-directory`: store memory-mapped files in a separate directory
  underneath the database directory.
- `custom`: use a custom directory location for memory-mapped files. The
  exact location must be set via the configuration parameter
  `--pregel.memory-mapped-files-custom-path`.

The default location for Pregel's memory-mapped files is the temporary directory 
(`temp-directory`), which may not provide enough capacity for larger Pregel jobs.
It may be more sensible to configure a custom directory for memory-mapped files
and provide the necessary disk space there (`custom`). 
Such custom directory can be mounted on ephemeral storage, as the files are only 
needed temporarily. If a custom directory location is used, the actual location
needs to be provided via the option `--pregel.memory-mapped-files-custom-path`.

There is also the option to use a subdirectory of the database directory
as the storage location for the memory-mapped files (`database-directory`).
The database directory often provides a lot of disk space capacity, but when 
Pregel's temporary files are stored in there too, it has to provide enough capacity 
to store both the regular database data and the Pregel files.

### Pregel memory-mapped files custom storage location

<small>Introduced in: v3.10.0</small>

`--pregel.memory-mapped-files-custom-path`

Specifies a custom directory location for Pregel's memory-mapped files.
This setting can only be used if the option `--pregel.memory-mapped-files-location-type` 
is set to `custom`. When used, the option has to contain the storage directory
location as an absolute path.
