const http = require('http');
const log = require('./log.js')('httpserver');
const EventEmitter = require('events');

class HttpServer extends EventEmitter {

    constructor(opts) {
        super();
        this.opts = Object.assign({
            port: 80
        }, opts);
    }

    start() {
        return new Promise((resolve, reject) => {
            log('starting http server with options', this.opts);
            this.innerServer = http.createServer((req, res) => {
                log('request from', req.socket.remoteAddress, 'with url', req.url);
                this.emit('request', req.url);
                res.writeHead(200);
                res.end();
            });
            const errorListener = err => {
                reject(err);
            };
            this.innerServer.on('error', errorListener);
            this.innerServer.on('listening', () => {
                this.innerServer.removeListener('error', errorListener);
                resolve();
            });
            this.innerServer.listen(this.opts);
        });
    }

}

module.exports = HttpServer;