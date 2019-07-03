const map = {};

for (let controllerName of ['ssh', 'tasmota']) {
    map[controllerName] = require(`./${controllerName}.js`);
}

module.exports = map;