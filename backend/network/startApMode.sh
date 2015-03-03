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

ifdown wlan0
ifup wlan0

/usr/sbin/hostapd -B /home/pi/simplePlexPlayer/backend/network  /hostapd.conf
/usr/sbin/dnsmasq -u dnsmasq -C /home/pi/simplePlexPlayer/backend/network/dnsmasq.conf
