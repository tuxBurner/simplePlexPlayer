#!/bin/sh

# check if we have to start the ap mode
if [ -f /home/pi/simplePlexPlayer/backend/network/apMode ]
then
    echo "Start the ap mode for the pi"
    sudo /usr/sbin/hostapd -B /home/pi/simplePlexPlayer/backend/network  /hostapd.conf
    sudo /usr/sbin/dnsmasq -u dnsmasq -C /home/pi/simplePlexPlayer/backend/network/dnsmasq.conf
fi

# start the backend
cd /home/pi/simplePlexPlayer/backend
node server.js &


# start the pikeyd
cd /home/pi/pikeyd
sudo ./pikeyd -k
sudo ./pikeyd -pu -d


# prep some x stuff
unclutter &
matchbox-window-manager -use_titlebar no & :
xset -dpms
xset s off

while true; do
  # start the frontend
  cd /home/pi/simplePlexPlayer/frontend

  if [ ! -d ephy-profile ]; then
    mkdir ephy-profile
  fi
  epiphany-browser --profile=./ephy-profile -a ./index.html
done
