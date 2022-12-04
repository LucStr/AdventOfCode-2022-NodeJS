let data = require('../../get_data')(4);

const result = data.split('\n').map(line => {
    return line.match(/\d+/g).map(Number);
}).filter(numbers => {
    return (numbers[0] <= numbers[2] && numbers[1] >= numbers[3]) || 
        (numbers[2] <= numbers[0] && numbers[3] >= numbers[1]); 
}).length;

console.log(result);