#!/bin/sh

set -e

bundler install
bundler exec jekyll build
ruby sitemap.rb
rm -rf htmltest
mkdir -p htmltest
# our baseUrl is /docs so we need to create that structure for htmltest
# otherwise it would fail to find absolute links like /docs/3.5
cp -a _site htmltest/docs
htmltest -s
(cd htmltest && tar cvzf docs.tar.gz docs)