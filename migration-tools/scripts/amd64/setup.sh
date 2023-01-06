#!/bin/bash

wget https://download.arangodb.com/nightly/3.10/Linux/x86_64/arangodb3-client-linux-3.10.3-nightly_x86_64.tar.gz
tar -xf arangodb3-client-linux-3.10.3-nightly_x86_64.tar.gz
mv arangodb3-client-linux-3.10.3-nightly_x86_64 /home/arangodb3.10

wget https://download.arangodb.com/nightly/3.11/Linux/x86_64/arangodb3-client-linux-3.11.0-nightly_x86_64.tar.gz
tar -xf arangodb3-client-linux-3.11.0-nightly_x86_64.tar.gz
mv arangodb3-client-linux-3.11.0-nightly_x86_64 /home/arangodb3.11