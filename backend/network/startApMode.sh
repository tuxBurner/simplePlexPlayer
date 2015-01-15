#!/bin/bash

SCRIPTPATH=`dirname $0`
cd $SCRIPTPATH

# already in ap mode ?  well do nothing
if [ -f ./apMode ]
then
    echo "Already in AP mode"
    exit;
fi

# we need the parameter which is the destination file
if [ -z "$1" ]
then
        cat <<EOF
Missing parameter for destination file
EOF
exit
fi

# mar that the maschine is in the ap mode
touch ./apMode

# copy the correct cfg
cp networkConfAp.cfg $1

/usr/sbin/dnsmasq -u dnsmasq -C ./dnsmasq.conf
/usr/sbin/hostapd -B ./hostapd.conf
/etc/init.d/networking restart
