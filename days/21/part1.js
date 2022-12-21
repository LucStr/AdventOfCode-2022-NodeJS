let data = require('../../get_data')(21);

const map = new Map();
const monkeys = data.split('\n').reduce((values, line) => {
    const [name, calc] = line.split(': ');
    const number = Number(calc);
    if (!isNaN(number)) {
        map.set(name, number);
        return values;
    }

    const [left, operator, right] = calc.split(' ');
    values.push({ name, left, operator, right });
    return values;
}, []);

while(monkeys.length){
    const monkey = monkeys.shift();
    const { name, left, operator, right } = monkey;
    if (map.has(left) && map.has(right)) {
        const leftValue = map.get(left);
        const rightValue = map.get(right);
        let value;
        switch (operator) {
            case '+':
                value = leftValue + rightValue;
                break;
            case '-':
                value = leftValue - rightValue;
                break;
            case '*':
                value = leftValue * rightValue;
                break;
            case '/':
                value = leftValue / rightValue;
                break;
        }
        map.set(name, value);
    } else {
        monkeys.push(monkey);
    }
}

const result = map.get('root');
console.log(result);

