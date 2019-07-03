#!/bin/bash

sudo systemctl disable --now deepsleep
sudo rm /etc/systemd/system/deepsleep.service
sudo systemctl daemon-reload