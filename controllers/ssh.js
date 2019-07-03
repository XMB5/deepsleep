const Controller = require('./controller.js');
const log = require('../log.js')('ssh');
const ssh2 = require('ssh2');

class SSHController extends Controller {

    stop(device) {
        return new Promise((res, rej) => {
            const conn = new ssh2.Client();
            conn.on('error', rej);
            conn.on('ready', () => {
                log('connected');
                conn.exec('shutdown now');
            });
            conn.on('end', () => {
                res();
            });
            const opts = Object.assign({}, this.defaults, {host: device.ip}, device.ssh);
            if (opts.hashedKey) {
                opts.hostVerifier = hashedKey => opts.hashedKey === hashedKey;
            }
            conn.connect(opts);
        });
    }

    async start(device) {
        log('doing nothing to start device', device.name);
    }

    static get globalDefaults() {
        return {
            hostHash: 'sha256'
        }
    }

}

module.exports = SSHController;