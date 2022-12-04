let data = require('../../get_data')(4);

const result = data.split('\n').map(line => {
    return line.match(/\d+/g).map(Number);
}).filter(numbers => {
    return numbers[2] <= numbers[1] && numbers[3] >= numbers[0];
}).length;

console.log(result);