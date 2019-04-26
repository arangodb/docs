---
layout: default
description: The implementation tries to follow the CommonJS specification where possible
---
Module "fs"
===========

The implementation tries to follow the CommonJS specification where possible.
[Filesystem/A/0](http://wiki.commonjs.org/wiki/Filesystem/A/0){:target="_blank"}.

Single File Directory Manipulation
----------------------------------

#### exists
{% docublock JS_Exists %}

#### isFile
{% docublock JS_IsFile %}

#### isDirectory
{% docublock JS_IsDirectory %}

#### size
{% docublock JS_Size %}

#### mtime
{% docublock JS_MTime %}

#### pathSeparator
`fs.pathSeparator`

If you want to combine two paths you can use fs.pathSeparator instead of */* or *\\*.

#### join
`fs.join(path, filename)`

The function returns the combination of the path and filename, e.g. fs.join(Hello/World, foo.bar) would return Hello/World/foo.bar.

#### getTempFile
{% docublock JS_GetTempFile %}

#### getTempPath
{% docublock JS_GetTempPath %}

#### makeAbsolute
{% docublock JS_MakeAbsolute %}

#### chmod
{% docublock JS_Chmod %}

#### list
{% docublock JS_List %}

#### listTree
{% docublock JS_ListTree %}

#### makeDirectory
{% docublock JS_MakeDirectory %}

#### makeDirectoryRecursive
{% docublock JS_MakeDirectoryRecursive %}

#### remove
{% docublock JS_Remove %}

#### removeDirectory
{% docublock JS_RemoveDirectory %}

#### removeDirectoryRecursive
{% docublock JS_RemoveDirectoryRecursive %}

File IO
-------

#### read
{% docublock JS_Read %}

#### read64
{% docublock JS_Read64 %}

#### readBuffer
{% docublock JS_ReadBuffer %}

#### readFileSync
`fs.readFileSync(filename, encoding)`

Reads the contents of the file specified in `filename`. If `encoding` is specified,
the file contents will be returned as a string. Supported encodings are:
- `utf8` or `utf-8`
- `ascii`
- `base64`
- `ucs2` or `ucs-2`
- `utf16le` or `utf16be`
- `hex`

If no `encoding` is specified, the file contents will be returned in a Buffer
object.


#### save
{% docublock JS_Save %}

#### writeFileSync
`fs.writeFileSync(filename, content)`

This is an alias for `fs.write(filename, content)`.

Recursive Manipulation
----------------------

#### copyRecursive
{% docublock JS_CopyDirectoryRecursive %}

#### CopyFile
{% docublock JS_CopyFile %}

#### move
{% docublock JS_MoveFile %}

ZIP
---

#### unzipFile
{% docublock JS_Unzip %}

#### zipFile
{% docublock JS_Zip %}

