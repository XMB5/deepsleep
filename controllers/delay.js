const Controller = require('./controller.js');
const log = require('../log.js')('delay');

class DelayController extends Controller {

    stop(device) {
        return DelayController.delay(device.delay.stop || this.defaults.stop);
    }

    start(device) {
        return DelayController.delay(device.delay.start || this.defaults.start);
    }

    static delay(amount) {
        if (amount) {
            return new Promise(res => {
                log('delaying', amount, 'ms');
                setTimeout(res, amount);
            });
        } else {
            log('no delay, continuing');
            return Promise.resolve();
        }
    }

}

module.exports = DelayController;