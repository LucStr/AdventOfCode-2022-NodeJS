let data = require('../../get_data')(3);

const lowerStart = "a".charCodeAt(0) - 1;
const upperStart = "A".charCodeAt(0) - 1;

console.log(lowerStart, upperStart);

const result = data.split('\n').map(line => {
    const compartmentA = line.substring(0, line.length / 2);
    const compartmentB = line.substring(line.length / 2, line.length);

    const char = [...compartmentA].find(char => compartmentB.includes(char));
    const charCode = char.charCodeAt(0);

    return charCode > lowerStart ? charCode - lowerStart : charCode - upperStart + 26;
}).reduce((a, b) => a + b, 0);

console.log(result);