let data = require('../../get_data')(20);

const numbers = data.split('\n').map((e, i, a) => {
    return {
        number: Number(e) * 811589153
    }
});

const unordered = [...numbers];

for(let i = 0; i < 10; i++){
    for(let j = 0; j < numbers.length; j++){
        const currentIndex = unordered.indexOf(numbers[j]);
        let newIndex = (numbers.length - 1 + currentIndex + numbers[j].number) % (numbers.length - 1);
        unordered.splice(newIndex, 0, unordered.splice(currentIndex, 1)[0]);
    }
    
}

const result = new Array(3).fill(0).map((e, i) => {
    return unordered[((i + 1) * 1000 + unordered.findIndex(e => e.number === 0)) % unordered.length].number;
}).reduce((a, b) => a + b);

console.log(result);