const lcm = require('compute-lcm')
let data = require('../../get_data')(11);

const monkeys = data.split('\n\n').map(block => {
    const lines = block.split('\n');
    const [_, index] = lines.shift().match(/Monkey (\d+)/); 
    const items = lines.shift().split(': ')[1].split(', ').map(Number);
    const operationString = lines.shift().split(': ')[1].replace(/new/g, 'newValue');
    const operation = function(old){
        eval(operationString);
        return newValue;
    }
    const [__, testDivisor] = lines.shift().match(/(\d+)/);
    const [___, trueDestination] = lines.shift().match(/(\d+)/);
    const [____, falseDestination] = lines.shift().match(/(\d+)/);
    
    return {
        index: parseInt(index),
        items,
        operation,
        testDivisor: parseInt(testDivisor),
        trueDestination: parseInt(trueDestination),
        falseDestination: parseInt(falseDestination),
        inspectionCount: 0
    }
});

const LCM = lcm(monkeys.map(e => e.testDivisor));

for(let i = 0; i < 10000; i++){
    monkeys.forEach(monkey => {
        while(monkey.items.length){
            let item = monkey.items.shift();
            item = monkey.operation(item);
            item = item % LCM;
            const destination = item % monkey.testDivisor === 0 ? monkey.trueDestination : monkey.falseDestination;
            monkeys[destination].items.push(item);
            monkey.inspectionCount++;
        }
    });
}

const result = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount).slice(0, 2).reduce((a, b) => a.inspectionCount * b.inspectionCount)
console.log(result);