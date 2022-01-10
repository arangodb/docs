#!/bin/bash

# Must not set -e or ssh stuff will abort the script
#set -e

GITAUTH="$1"

if test "${GITAUTH}" == "migrate"; then
    # Fast path, migration only
    SOURCES=()
else
    SOURCES=(
        "https://@github.com/arangodb-helper/arangodb.git;arangodb-starter;master;docs/;Manual/"
        "https://@github.com/arangodb/arangosync.git;arangosync;master;docs/;Manual/"
        "https://@github.com/arangodb/kube-arangodb.git;kube-arangodb;master;docs/;Manual/"
        "https://@github.com/arangodb/arangodb-java-driver.git;arangodb-java-driver;master;docs/;Drivers/"
        "https://@github.com/arangodb/arangodb-php.git;arangodb-php;devel;docs/;Drivers/"
        "https://@github.com/arangodb/arangodb-spark-connector.git;arangodb-spark-connector;master;docs/;Drivers/"
        "https://@github.com/arangodb/arangojs.git;arangojs;main;docs/;Drivers/"
        "https://@github.com/arangodb/go-driver.git;go-driver;master;docs/;Drivers/"
        "https://@github.com/arangodb/spring-data.git;spring-data;master;docs/;Drivers/"
    )
fi

# Ensure agent is running
if test "${GITAUTH}" == "git"; then
    ssh-add -l &> /dev/null
    if [ "$?" == 2 ]; then
        # Could not open a connection to your authentication agent.

        # Load stored agent connection info
        test -r ~/.ssh-agent && eval "$(<~/.ssh-agent)" > /dev/null
        ssh-add -l &> /dev/null
        if [ "$?" == 2 ]; then
            # Start agent and store connection info
            (umask 066; ssh-agent > ~/.ssh-agent)
            eval "$(<~/.ssh-agent)" > /dev/null
        fi
    fi

    # Load identities
    ssh-add -l &> /dev/null
    if [ "$?" == 1 ]; then
        # The agent has no identities.
        ssh-add
    fi
fi

for source in "${SOURCES[@]}"; do

    REPO=$(echo     "$source" |cut -d ';' -f 1)
    CLONEDIR=$(echo "$source" |cut -d ';' -f 2)
    BRANCH=$(echo   "$source" |cut -d ';' -f 3)
    SUBDIR=$(echo   "$source" |cut -d ';' -f 4)
    DST=$(echo      "$source" |cut -d ';' -f 5)

    CODIR="repos/${CLONEDIR}"
    AUTHREPO="${REPO/@/${GITAUTH}@}"
    if test -d "${CODIR}"; then
        (
            cd "${CODIR}"
            git pull --all
        )
    else
        if test "${GITAUTH}" == "git"; then
            AUTHREPO=$(echo "${AUTHREPO}" | sed -e "s;github.com/;github.com:;" -e "s;https://;;" )
        fi
        git clone "${AUTHREPO}" "${CODIR}"
    fi

    if [ -z "${BRANCH}" ]; then
        echo "No branch specified for ${CLONEDIR}"
        exit 1
    fi

    # checkout branch and pull=merge origin
    (cd "${CODIR}" && git checkout "${BRANCH}" && git pull)

    for oneMD in $(cd "${CODIR}/${SUBDIR}/${DST}"; find "./" -type f |sed "s;\./;;"); do
        NAME=$(basename "${oneMD}")
        MDSUBDIR="${oneMD/${NAME}/}"
        DSTDIR="temp/${DST}/${MDSUBDIR}"
        if test ! -d "${DSTDIR}"; then
            mkdir -p "${DSTDIR}"
        fi
        sourcefile="${CODIR}/${SUBDIR}/${DST}/${oneMD}"
        targetfile="${DSTDIR}/${NAME}"
            cp "$sourcefile" "$targetfile"
    done
done

folder="3.5"
echo "Migrating to ${folder}"
node migrate.js temp/Drivers ../${folder}/drivers > /dev/null
node migrate.js temp/Manual ../${folder} > /dev/null
