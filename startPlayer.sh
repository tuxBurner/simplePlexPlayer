#!/bin/sh
unclutter &
matchbox-window-manager -use_titlebar no & :
xset -dpms
xset s off
while true; do
cd backend
/home/pi/.nvm/current/bin/node server.js &
cd ..

cd backend/pikeyd
./pikeyd -k
./pikeyd -pu -d
cd ../..

cd frontend
#/usr/bin/midori -c ~/.config/midori -e Fullscreen -a ./index.html
mkdir ephy-profile
epiphany-browser --profile=./ephy-profile -a ./index.html
cd ../
done
