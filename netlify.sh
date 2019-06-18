#!/bin/sh

set -e

echo "************ INSIDE NETLIFY.SH ************"

echo "/ /docs/3.5/" > _redirects
echo "_redirects ="
echo "$(cat _redirects)"

version_stable=$(ruby -ryaml -e 'print YAML.load_file("_config.yml")["versions"]["stable"]')
version_devel=$(ruby -ryaml -e 'print YAML.load_file("_config.yml")["versions"]["devel"]')
echo "version_stable = ${version_stable}"
echo "version_devel = ${version_devel}"

jekyll build
cp -a "_site/${version_stable}/" "_site/stable/"
cp -a "_site/${version_devel}/" "_site/devel/"

rm -rf htmltest
mkdir -p htmltest
# our baseUrl is /docs so we need to create that structure for htmltest
# otherwise it would fail to find absolute links like /docs/3.5
cp -a _site htmltest/docs
cp _redirects htmltest

(cd /tmp && \
    wget -nv https://github.com/wjdp/htmltest/releases/download/v0.10.1/htmltest_0.10.1_linux_amd64.tar.gz && \
    tar xvzf htmltest_0.10.1_linux_amd64.tar.gz
)

/tmp/htmltest -s
