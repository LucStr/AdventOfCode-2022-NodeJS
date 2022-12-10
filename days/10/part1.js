let data = require('../../get_data')(10);

const program = data.split('\n').map((line) => {
    const [name, args] = line.split(' ');
    return {
        name,
        args: parseInt(args)
    }
});

const instructions = [...program];
let registerX = 1;
let cycleCounter = 1;
let instructionCounter = 0;
let currentInstruction = instructions.shift();
const results = [];

while(currentInstruction){
    if((cycleCounter + 20) % 40 === 0){
        console.log(cycleCounter + ' adding ' + registerX)
        results.push(registerX  * cycleCounter);
    }

    cycleCounter++;
    if(currentInstruction.name === 'addx'){
        if(instructionCounter < 1){
            instructionCounter++;
            continue;
        }

        instructionCounter = 0;
        registerX += currentInstruction.args;
    }

    currentInstruction = instructions.shift();
}

const result = results.reduce((a, b) => a + b);
console.log(result);