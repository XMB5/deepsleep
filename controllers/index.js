const map = {};

for (let controllerName of ['ssh', 'tasmota', 'delay']) {
    map[controllerName] = require(`./${controllerName}.js`);
}

module.exports = map;