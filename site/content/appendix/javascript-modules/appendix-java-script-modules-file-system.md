---
fileID: appendix-java-script-modules-file-system
title: Filesystem Module
weight: 12170
description: 
layout: default
---
### unzipFile


unzips a file
`fs.unzipFile(filename, outpath, skipPaths, overwrite, password)`

Unzips the zip file specified by *filename* into the path specified by
*outpath*. Overwrites any existing target files if *overwrite* is set
to *true*.

Returns *true* if the file was unzipped successfully.


### zipFile


zips a file
`fs.zipFile(filename, chdir, files, password)`

Stores the files specified by *files* in the zip file *filename*. If
the file *filename* already exists, an error is thrown. The list of input
files *files* must be given as a list of absolute filenames. If *chdir* is
not empty, the *chdir* prefix will be stripped from the filename in the
zip file, so when it is unzipped filenames will be relative.
Specifying a password is optional.

Returns *true* if the file was zipped successfully.


