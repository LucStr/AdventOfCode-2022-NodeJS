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

monkeys.find(e => e.name === 'root').operator = '=';
map.delete('humn');

while(!map.has('humn')){
    const monkey = monkeys.shift();
    const { name, left, operator, right } = monkey;
    if(operator === '=' && (map.has(left) || map.has(right))) {
        const value = map.get(left) || map.get(right);
        if(value !== undefined) {
            map.set(left, value);
            map.set(right, value);
        }
    } else if (map.has(left) && map.has(right)) {
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
    } else  if(map.has(name) && map.has(left)){
        const leftValue = map.get(left);
        const mainValue = map.get(name);
        let value;
        switch (operator) {
            case '+':
                value = mainValue - leftValue;
                break;
            case '-':
                value = leftValue - mainValue;
                break;
            case '*':
                value = mainValue / leftValue;
                break;
            case '/':
                value = leftValue / mainValue;
                break;
        }
        map.set(right, value);
    } else if(map.has(name) && map.has(right)){
        const rightValue = map.get(right);
        const mainValue = map.get(name);
        let value;
        switch (operator) {
            case '+':
                value = mainValue - rightValue;
                break;
            case '-':
                value = mainValue + rightValue;
                break;
            case '*':
                value = mainValue / rightValue;
                break;
            case '/':
                value = mainValue * rightValue;
                break;
        }
        map.set(left, value);
    } else {
        monkeys.push(monkey);
    }
}

const result = map.get('humn');
console.log(result);