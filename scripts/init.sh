#!/bin/bash

wget https://go.dev/dl/go1.19.2.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.19.2.linux-amd64.tar.gz
wget https://github.com/gohugoio/hugo/releases/download/v0.104.3/hugo_0.104.3_linux-amd64.deb
sudo apt install ./hugo*

echo "PATH=$PATH:/usr/local/go/bin" >> /home/vagrant/.profile
source /home/vagrant/.profile


rm go*
rm hugo*
