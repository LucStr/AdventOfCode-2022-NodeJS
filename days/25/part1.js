let data = require('../../get_data')(25);

const VALUES = {
    '=': -2,
    '-': -1,
    '0': 0,
    '1': 1,
    '2': 2
}

let requirement = data.split('\n').map(line => {
    const chars = line.trim().split('').reverse();
    const value = chars.reduce((sum, char, index) => {
        return sum + VALUES[char] * Math.pow(5, index);
    }, 0);

    return value;
}).reduce((a, b) => a+b, 0);

let result = '';
while(requirement > 0){
    let remainder = requirement % 5;
    requirement = Math.floor(requirement / 5);
    if(remainder > 2){
        remainder -= 5;
        requirement++
    }
    
    result = Object.keys(VALUES).find(key => VALUES[key] === remainder) + result;
}

console.log(result);