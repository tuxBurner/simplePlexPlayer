# Installation guide

Here you can read how to setup the pi and the software on it.


## Pi Wiring

### rotary
### button
### relais
### display


## pi configuration

### Overclocking
```bash
sudo raspi-config
7 Overclock
Medium or High
```

### Memory Split
```bash
sudo raspi-config
8 Advanced Options
A3 Memory Split
128 or 256
```

### Overscan
```bash
sudo raspi-config
8 Advanced Options
A1 Overscan
Disable
```

### config.txt
If needed add some changes to the: **/boot/config.txt**

```bash
framebuffer_width=800
framebuffer_height=600
```

## Keyboard

I use pikeyd to use certain GPIO pins as Keyboard device.


To get and build pikeyd do the following:
```bash
git clone  https://github.com/tuxBurner/pikeyd.git
cd pikeyd/
git checkout rotary
make
```

Generate following config file: **/etc/pikeyd.conf**

```bash
KEY_ENTER       14
KEY_ESC         23
ROT 15 18 KEY_RIGHT KEY_LEFT 1
```

For testing call (-pu means use the pi pullup resistors):
```
sudo ./pikeyd -pu
```

## node

```bash
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
rm node_latest_armhf.deb
```

## quick2wire needed for a node module
```bash
git clone https://github.com/VipSaran/quick2wire-gpio-admin.git
cd quick2wire-gpio-admin
make
sudo make install
sudo adduser $USER gpio
```

## simplePlexPlayer

In **/home/pi** call:

```bash
git clone https://github.com/tuxBurner/simplePlexPlayer.git
```

### backend
```bash
cd simplePlexPlayer/backend
npm install
```

Edit config: **/home/pi/simplePlexPlayer/backend/config.json**

For testing start
```
cd /home/pi/simplePlexPlayer/backend
node server.js
```

### frontent

``` bash
sudo apt-get install matchbox-window-manager
sudo apt-get install unclutter
```

Edit config: **/home/pi/simplePlexPlayer/frontend/scripts/player/Config.js**

Create a **/home/pi/.xinitrc** file in your home dir

```bash
exec /home/pi/simplePlexPlayer/startPlayer.sh
```

make **/home/pi/simplePlexPlayer/startPlayer.sh** executable
```bash
chmod 0777 /home/pi/simplePlexPlayer/startPlayer.sh
```

For testing evrything call
```bash
startx
```

## sound volume

When the sound volume is to low.
I turned it to *84*
```
alsamixer
```

## usb automount

```bash
sudo apt-get install usbmount
```

## accesspoint stuff

To run the player in *accespoint mode* we need following deps

```bash
sudo apt-get install hostapd
sudo apt-get install dnsmasq
```

## autostart

Add following lines to:  **/etc/inittab** for autologin
```bash
#1:2345:respawn:/sbin/getty 115200 tty1
1:2345:respawn:/bin/login -f pi tty1 </dev/tty1 >/dev/tty1 2>&1
```

Add the following lines to: **/etc/rc.local** for starting *X* at the beginnign and  *xinit*
```bash
su -l pi -c startx
```
