#!/bin/bash

function help() {
    echo "Usage: docs.sh [CMD]"
    echo "start()       Start docs toolchain"
    echo "clean()"
    echo "build()"
}

function start() {
    docker compose up
}


function clean() {
    docker container stop $(docker ps -aq)
    docker container rm $(docker ps -aq)
    docker image prune -a
}

function build() {
    clean()
    docker compose build
}

# main

if [ $# -eq 0 ]
  then
    help()
fi

case $1 in
"start":
    start()
;;
"clean":
    clean()
;;
"build":
    build()
;;
*)
    help()
;;
esac

