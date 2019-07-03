# Deepsleep

Deepsleep is a daemon that shuts down or turns on servers and [tasmota](https://github.com/arendst/Sonoff-Tasmota) smart plugs.
It controls servers through ssh, and it interacts with smart plugs over http.
Deepsleep can be scheduled like cron or can be triggered by an http request.

## Installation

Install the systemd service file, enable it, and start it.

```bash
git clone https://github.com/XMB5/deepsleep
# todo
```

## Config File

Check out the [example config file](config.yml) for details on the config file format.

By default, deepsleep looks for the config file in `/etc/deepsleep.yml`.
To use as config file stored in another location, pass the file path as the first argument to deepsleep.
For example `node deepsleep.js /home/pi/deepsleep.yml`.

## Contributing
PRs and suggestions encouraged.

## License
Deepsleep copyright 2019 Sam Foxman. Deepsleep is licensed under the [GPL version 3 or later](LICENSE).