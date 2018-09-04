#!/bin/bash
sudo rm /usr/bin/rundb
sudo rm /usr/bin/runserver
if [ "$1" = "all" ]
then
    sudo rm /usr/bin/push
fi
