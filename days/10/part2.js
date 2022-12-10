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
let result = '';

while(currentInstruction){
    const rowPosition = (cycleCounter - 1) % 40;
    if(rowPosition === 0){
        result += '\n';
    }

    result += registerX > rowPosition - 2 && registerX < rowPosition + 2 ? '#' : '.';

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

console.log(result);