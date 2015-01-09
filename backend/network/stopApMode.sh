#!/bin/bash

#check if the ./networkConf.cfg  exists.
if [ ! -f ./networkConf.cfg ]
then
    echo "Missing file networkConf.cfg"
    exit;
fi

# check if we have a destination file parameter
if [ -z "$1" ]
then
        cat <<EOF
Missing parameter for destination file
EOF
exit
fi

# remove the apMode file
if [ -e ./apMode ]
then
    echo "Found apMode enabled remove the file"
    rm ./apMode;
fi

cp networkConf.cfg $1



