auto lo
iface lo inet loopback

auto wlan0
allow-hotplug wlan0
iface wlan0 inet dhcp
wpa-ssid "<ssidGoesHere>"
wpa-psk "<wpaGoesHere>"

iface eth0 inet dhcp
