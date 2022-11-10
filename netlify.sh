#!/bin/sh

set -e

JEKYLL_ENV="netlify" jekyll clean
JEKYLL_ENV="netlify" jekyll build --trace
ruby sitemap.rb
cp _redirects _site

(cd /tmp && \
    wget -nv https://github.com/wjdp/htmltest/releases/download/v0.16.0/htmltest_0.16.0_linux_amd64.tar.gz && \
    tar xvzf htmltest_0.16.0_linux_amd64.tar.gz
)

/tmp/htmltest --skip-external
