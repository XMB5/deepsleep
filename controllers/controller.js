class Controller {

    constructor(configDefaults) {
        this.defaults = Object.assign({}, this.constructor.globalDefaults, configDefaults);
    }

    static get globalDefaults() {
        return {};
    }

    async init() {}

    async stop(device) {
        throw new Error(this.constructor.name + '.stop() not implemented');
    }

    async start(device) {
        throw new Error(this.constructor.name + '.start() not implemented');
    }

}

module.exports = Controller;