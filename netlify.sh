#!/bin/sh

set -e

JEKYLL_ENV="netlify" jekyll clean
JEKYLL_ENV="netlify" jekyll build --trace
ruby sitemap.rb
rm -rf htmltest
mkdir -p htmltest
# our baseUrl is /docs so we need to create that structure for htmltest
# otherwise it would fail to find absolute links like /docs/3.9
cp -a _site htmltest/docs
cp _redirects htmltest

(cd /tmp && \
    wget -nv https://github.com/wjdp/htmltest/releases/download/v0.14.0/htmltest_0.14.0_linux_amd64.tar.gz && \
    tar xvzf htmltest_0.14.0_linux_amd64.tar.gz
)

/tmp/htmltest -s
