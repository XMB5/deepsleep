const Controller = require('./controller.js');
const log = require('../log.js')('ssh');
const ssh2 = require('ssh2');
const fs = require('fs');
const {promisify} = require('util');
const readFilePromise = promisify(fs.readFile);

class SSHController extends Controller {

    async stop(device) {
        const opts = Object.assign({}, this.defaults, {host: device.ip}, device.ssh);
        if (opts.privateKeyFile) {
            opts.privateKey = await readFilePromise(opts.privateKeyFile);
            delete opts.privateKeyFile;
        }
        if (opts.hashedKey) {
            const trustedKeyBuf = Buffer.from(opts.hashedKey, 'base64');
            opts.hostVerifier = hashedKey => {
                const remoteHostKeyBuf = Buffer.from(hashedKey, 'hex');
                return trustedKeyBuf.compare(remoteHostKeyBuf) === 0;
            };
            delete opts.hashedKey;
        }

        const conn = new ssh2.Client();
        conn.on('ready', () => {
            log('connected');
            conn.exec('sudo shutdown now', {}, () => {});
        });

        return new Promise((res, rej) => {
            conn.on('error', e => {
                if (e.code === 'EHOSTUNREACH') {
                    log('assuming host is already down because we received EHOSTUNREACH');
                    res();
                } else {
                    rej(e);
                }
            });
            conn.on('end', () => {
                log('connection closed');
                res();
            });
            log('connecting to', opts.host, 'port', opts.port || 22);
            conn.connect(opts);
        });
    }

    async start(device) {
        log('doing nothing to start device, continuing');
    }

    static get globalDefaults() {
        return {
            hostHash: 'sha256',
            algorithms: {
                serverHostKey: ['ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-rsa']
            },
            //debug: message => log('ssh2', message),
            tryKeyboard: true
        }
    }

}

module.exports = SSHController;