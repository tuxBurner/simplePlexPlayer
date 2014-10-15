#!/bin/sh
unclutter &
matchbox-window-manager & :
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

/usr/bin/midori -c ~/.config/midori -e Fullscreen -a ./index.html
done
