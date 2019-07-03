#!/bin/bash

DEEPSLEEP_DIR="$(readlink -f "${0%/*}")"
# https://stackoverflow.com/a/45857196
sed "s:DEEPSLEEP_DIR:${DEEPSLEEP_DIR//:/\:}:g" "${DEEPSLEEP_DIR}/deepsleep.service" | \
sudo tee /etc/systemd/system/deepsleep.service > /dev/null
sudo systemctl enable --now deepsleep