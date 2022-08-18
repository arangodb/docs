---
layout: default
---
# ArangoDB Server Pregel Options

## Pregel job parallelism

Pregel jobs have configurable minimum, maximum, and default parallelism values.
Administrators can use these parallelism options to set concurrency defaults and bounds 
for Pregel jobs on an instance level. Each individual Pregel job can set its own parallelism 
value using the job's `parallelism` option, but the job's effective parallelism is limited by 
the bounds defined by `--pregel.min-parallelism` and `--pregel.max-parallelism`. 
If a job does not set its `parallelism` value, it defaults to the parallelism value
configured via `--pregel.parallelism`.

### Minimum parallelism

<small>Introduced in: v3.10.0</small>

`--pregel.min-parallelism`

Minimum parallelism usable in Pregel jobs. Defaults to `1`.
Increasing the value of this option forces each Pregel job to run with at least this
level of parallelism.

### Maximum parallelism

<small>Introduced in: v3.10.0</small>

`--pregel.max-parallelism`

Maximum parallelism usable in Pregel jobs. Defaults to the number of available cores.
This option effectively limits the parallelism of each Pregel job to the specified value.

### Default parallelism

<small>Introduced in: v3.10.0</small>

`--pregel.parallelism`

Default parallelism to use in Pregel jobs. Defaults to the number of available cores
divided by 4. The result will be limited to a value between 1 and 16.
The default parallelism for a Pregel job is used only if the job does not set its
`parallelism` attribute.

## Pregel memory-mapped files

By default, Pregel stores its temporary data in memory-mapped files on disk.
Storing temporary data in memory-mapped files rather than in RAM has the advantage of
lowering the RAM usage, which reduces the likelihood of out-of-memory situations.
However, storing the files on disk requires a certain disk capacity, so that instead of running out
of RAM, it is possible to run out of a disk space.

{% hint 'info' %}
Please make sure to use a suitable storage location for Pregel's memory-mapped
files.
{% endhint %}

### Pregel memory-mapped files usage

<small>Introduced in: v3.10.0</small>

`--pregel.memory-mapped-files`

If set to `true`, Pregel jobs store their temporary data in disk-backed 
memory-mapped files. If set to `false`, the temporary data of Pregel jobs is buffered 
in RAM. 
The default value is `true`, meaning that memory-mapped files are used. 
You can override this option for each Pregel job by setting the `useMemoryMaps` attribute
of the job.

### Pregel memory-mapped files storage location type

<small>Introduced in: v3.10.0</small>

`--pregel.memory-mapped-files-location-type`

This option configures the location for the memory-mapped files written by Pregel. 
This option is only meaningful, if memory-mapped files are used. 
The option can have one of the following values:

- `temp-directory`: store memory-mapped files in the temporary directory,
  as configured via `--temp.path`. If `--temp.path` is not set, the
  system's temporary directory is used.
- `database-directory`: store memory-mapped files in a separate directory
  underneath the database directory.
- `custom`: use a custom directory location for memory-mapped files. The
  exact location must be set via the `--pregel.memory-mapped-files-custom-path`
  configuration parameter.

The default location for Pregel's memory-mapped files is the temporary directory 
(`temp-directory`), which may not provide enough capacity for larger Pregel jobs.
It may be more sensible to configure a custom directory for memory-mapped files
and provide the necessary disk space there (`custom`). 
Such custom directory can be mounted on ephemeral storage, as the files are only 
needed temporarily. If a custom directory location is used, you need to specify 
the actual location via the `--pregel.memory-mapped-files-custom-path` parameter.

You can also use a subdirectory of the database directory
as the storage location for the memory-mapped files (`database-directory`).
The database directory often provides a lot of disk space capacity, but when 
Pregel's temporary files are stored in there too, it has to provide enough capacity 
to store both the regular database data and the Pregel files.

### Pregel memory-mapped files custom storage location

<small>Introduced in: v3.10.0</small>

`--pregel.memory-mapped-files-custom-path`

Specifies a custom directory location for Pregel's memory-mapped files.
This setting can only be used, if the option `--pregel.memory-mapped-files-location-type` 
is set to `custom`. When used, the option has to contain the storage directory
location as an absolute path.
