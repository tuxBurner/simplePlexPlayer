#!/bin/bash
# this can be called to press a key in the x window
export DISPLAY=:0
echo key $1 | xte