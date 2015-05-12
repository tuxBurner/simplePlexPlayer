# Installation guide

Here you can read how to setup the pi and the software on it.


## Pi Wiring

### rotary
### button
### relais
### display

## Keyboard

I use pikeyd to use certain GPIO pins as Keyboard device.


To get and build pikeyd do the following:
```
git clone  https://github.com/tuxBurner/pikeyd.git
cd pikeyd/
git checkout rotary
make
```

Generate following config file: */etc/pikeyd.conf*

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

## simplePlexPlayer

```bash
git clone https://github.com/tuxBurner/simplePlexPlayer.git
cd simplePlexPlayer/backend
npm install
```

## usb automoun

```bash
sudo apt-get install usbmount
```

## Accesspoint stuff

```bash
sudo apt-get install hostapd
sudo apt-get install dnsmasq
```
