#!/bin/sh

set -e

version_stable="$(ruby -ryaml -e "print YAML.load_file('_config.yml')['versions']['stable']")"
version_devel="$(ruby -ryaml -e "print YAML.load_file('_config.yml')['versions']['devel']")"
echo "  version_stable = ${version_stable}"
echo "  version_devel = ${version_devel}"

jekyll build

# Netlify does not support symlinks, breaking /docs/stable/* and /docs/devel/*
# Workaround: Copy the files of the respective versions to these folders
cd _site
echo "$(ls -la)"
rm stable
rm devel
mkdir stable
mkdir devel
cp -ar "${version_stable}/*" stable/
cp -ar "${version_devel}/*" devel/
cd ..

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
