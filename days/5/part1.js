let data = require('../../get_data')(5);

const split = data.split('\n\n');
const layout = split[0].split('\n').reduce((stack, line) => {
    [...line].forEach((char, index) => {
        if(!((index - 1) % 4 === 0 && char !== ' ' && isNaN(Number(char)))){
            return;   
        }

        const column = (index - 1) / 4 + 1;
        stack[column].push(char);
    });

    return stack;
}, new Array(10).fill(0).map(() => []));

split[1].split('\n').map(line => {
    const [amount, start, destination] = line.match(/\d+/g).map(Number);

    for(let i = 0; i < amount; i++){
        layout[destination].unshift(layout[start].shift());
    }
});

const result = layout.slice(1).reduce((res, stack) => {
    return res + stack[0];
}, '');

console.log(result);