#!/bin/sh
unclutter &
matchbox-window-manager & :
xset -dpms
xset s off
while true; do
/usr/bin/midori -c ~/.config/midori -e Fullscreen -a /home/pi/simplePlexPlayer/index.html
done
