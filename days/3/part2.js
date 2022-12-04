let data = require('../../get_data')(3);

const lowerStart = "a".charCodeAt(0) - 1;
const upperStart = "A".charCodeAt(0) - 1;

console.log(lowerStart, upperStart);
const lines = data.split('\n');

const groups = new Array(lines.length / 3).fill(0).map((line, index) => lines.slice(index * 3, index * 3 + 3));

const result = groups.map(rucksacks => {

    const char = [...rucksacks[0]].find(char => rucksacks[1].includes(char) && rucksacks[2].includes(char));
    const charCode = char.charCodeAt(0);

    return charCode > lowerStart ? charCode - lowerStart : charCode - upperStart + 26;
}).reduce((a, b) => a + b, 0);

console.log(result);