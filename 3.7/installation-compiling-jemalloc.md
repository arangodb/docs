---
layout: default
description: Resolving 
redirect_from:
  - /3.7/cookbook/compiling-jemalloc.html # 3.5 -> 3.5
---
Jemalloc
========

{% hint 'info' %}
This article is only relevant if you intend to compile ArangoDB on Ubuntu 16.10
or Debian testing
{% endhint %}

On more modern linux systems (development/floating at the time of this writing)
you may get compile / link errors with ArangoDB regarding jemalloc.
This is due to compilers switching their default behavior regarding the
`PIC` - Position Independend Code. It seems common that jemalloc remains in a
stage where this change isn't followed and causes ArangoDB to error out during
the linking phase.

From now on cmake will detect this and give you this hint:

    the static system jemalloc isn't suitable! Recompile with the current compiler or disable using `-DCMAKE_CXX_FLAGS=-no-pie -DCMAKE_C_FLAGS=-no-pie`

Now you've got three choices.

- **Doing without jemalloc**

  Fixes the compilation issue, but you will get problems with the glibcs heap
  fragmentation behavior which in the longer run will lead to an ever
  increasing memory consumption of ArangoDB.

  While this may be suitable for development / testing systems, its definitely
  not for production.

- **Disabling PIC altogether**

  This will build an arangod which doesn't use this compiler feature. It may
  be not so nice for development builds. It can be achieved by specifying
  these options on cmake:

      -DCMAKE_CXX_FLAGS=-no-pie -DCMAKE_C_FLAGS=-no-pie

- **Recompile jemalloc**

  The smartest way is to fix the jemalloc libraries packages on your system so
  its reflecting that new behavior. On Debian / Ubuntu systems it can be
  achieved like this:

      apt-get install automake debhelper docbook-xsl xsltproc dpkg-dev
      apt source jemalloc
      cd jemalloc*
      dpkg-buildpackage
      cd ..
      dpkg -i *jemalloc*deb
