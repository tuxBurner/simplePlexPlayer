auto lo
iface lo inet loopback

auto wlan0
allow-hotplug wlan0
iface wlan0 inet static
address 192.168.9.1
netmask 255.255.255.0

auto eth0
iface eth0 inet dhcp
