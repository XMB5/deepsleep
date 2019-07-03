const fsPromises = require('fs').promises;
const yaml = require('js-yaml');
const log = require('./log.js')('main');
const controllerMap = require('./controllers/index.js');
const HttpServer = require('./httpserver.js');
const CronJob = require('cron').CronJob;

const commonDeviceProperties = ['ip'];

class DeepsleepRPI {

    constructor(config) {
        this.config = config;
        this.devices = this.config.devices.map(deviceObj => {
            const deviceName = Object.keys(deviceObj)[0];
            const deviceRaw = deviceObj[deviceName];
            return Object.assign({
                name: deviceName,
                controllerName: Object.keys(deviceRaw).filter(key => !commonDeviceProperties.includes(key))[0]
            }, deviceRaw);
        });
    }

    async init() {
        await this.initControllers();
        await this.initHttpServer();
        await this.initSchedule();
    }

    async initControllers() {
        log('init controllers');
        this.controllers = {};
        for (let controllerName of Object.keys(controllerMap)) {
            const ControllerClass = controllerMap[controllerName];
            const configDefaults = this.config[controllerName];
            const controller = new ControllerClass(configDefaults);
            await controller.init();
            this.controllers[controllerName] = controller;
        }
    }

    async initHttpServer() {
        if (!this.config.http || !this.config.http.disabled) {
            log('init http server');
            this.httpServer = new HttpServer(this.config.http);
            await this.httpServer.start();
        } else {
            log('http server disabled');
        }
    }

    initSchedule() {
        log('init schedule');
        for (let action of ['start', 'stop']) {
            if (this.config.schedule[action]) {
                log('schedule', action, 'at', this.config.schedule[action]);
                new CronJob(this.config.schedule[action], () => {
                    this[`${action}All`]().catch(err => {
                        console.error('error running action', action, err);
                    });
                }, null, true);
            }
        }
    }

    async stopAll() {
        log('stop all');
        for (let device of this.devices) {
            try {
                log('stop device', device.name, 'with controller', device.controllerName);
                await this.controllers[device.controllerName].stop(device);
            } catch (e) {
                console.error('error stopping device', device.name, e);
            }
        }
    }

    async startAll() {
        log('start all');
        for (let i = this.devices.length - 1; i >= 0; i--) {
            const device = this.devices[i];
            log('start device', device.name, 'with controller', device.controllerName);
            await this.controllers[device.controllerName][action](device);
        }
    }

    static async loadConfig() {
        const configLoc = process.argv[2];
        if (!configLoc) {
            throw new Error('blank config location');
        }
        log('read config file');
        const configStr = await fsPromises.readFile(process.argv[2], 'utf8');
        log('parse config file');
        const config = yaml.safeLoad(configStr);
        log('config', JSON.stringify(config));
        return config;
    }

    static async main() {
        log('start');
        const config = await this.loadConfig();
        const deepsleepRpi = new DeepsleepRPI(config);
        await deepsleepRpi.init();
    }

}

DeepsleepRPI.main().catch(e => {
    console.error(e);
    process.exit(1);
});