# Deepsleep

Deepsleep is a daemon that shuts down or turns on servers and [tasmota](https://github.com/arendst/Sonoff-Tasmota) smart plugs.
It controls servers through ssh, and it interacts with smart plugs over http.
Deepsleep can be scheduled like cron or can be triggered by an http request.

## Install

Deepsleep comes with a (systemd unit file)[deepsleep.service].
To install, enable, and start it, run `./install.sh`.
Uninstall it with `./uninstall.sh`.

```bash
git clone https://github.com/XMB5/deepsleep
cd deepsleep
npm i
./install.sh
```

## Config File

Check out the [example config file](config.yml) for details on the config file format.

By default, deepsleep looks for the config file in `/etc/deepsleep.yml`.
To use a config file stored in another location, pass the file path as the first argument to deepsleep.
For example `node deepsleep.js /home/pi/deepsleep.yml`.

## Contribute
PRs and suggestions welcomed.

## License
Deepsleep copyright 2019 Sam Foxman. Deepsleep is licensed under the [GPL version 3 or later](LICENSE).