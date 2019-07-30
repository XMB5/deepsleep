const Controller = require('./controller.js');
const phin = require('phin');
const qs = require('querystring');
const log = require('../log.js')('tasmota');

class TasmotaController extends Controller {

    commandDevice(device, command) {
        log('send command', command, 'to', device.ip);
        const queryString = qs.encode(Object.assign({
            cmnd: command
        }, this.defaults));
        return phin({
            url: `http://${device.ip}/cm?${queryString}`
        });
    }

    async stop(device) {
        await this.commandDevice(device, 'Power off');
    }

    async start(device) {
        await this.commandDevice(device, 'Power on');
    }

}

module.exports = TasmotaController;