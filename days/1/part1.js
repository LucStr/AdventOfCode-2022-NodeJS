let data = require('../../get_data')(1);

const elves = data.split('\n\n').map(e => e.split('\n').map(Number).reduce((a, b) => a + b));
console.log(elves.sort((a, b) => b - a)[0]);