let data = require('../../get_data')(22);

const [grid, instructionText] = data.split('\n\n');
const map = grid.split('\n').map((line, y) => line.split('').map((type, x) => ({x: x + 1, y: y + 1, type}))).flat().filter(e => e.type && e.type !== ' ');

const directions = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 0, y: -1}
];

const minX = map.reduce((acc, e) => {
    acc[e.y] = Math.min(acc[e.y] || Infinity, e.x);
    return acc;
}, []);
const maxX = map.reduce((acc, e) => {
    acc[e.y] = Math.max(acc[e.y] || -Infinity, e.x);
    return acc;
}, []); 
const minY = map.reduce((acc, e) => {
    acc[e.x] = Math.min(acc[e.x] || Infinity, e.y);
    return acc;
}, []);
const maxY = map.reduce((acc, e) => {
    acc[e.x] = Math.max(acc[e.x] || -Infinity, e.y);
    return acc;
}, []); 



map.forEach(node => {
    node.connections = directions.map(d => {
        let dy = node.y + d.y;
        let dx = node.x + d.x; 
        if(d.y !== 0 && dy < minY[dx]){
            dy = maxY[dx];
        } else if(d.y !== 0 && dy > maxY[dx]){
            dy = minY[dx];
        } else if(d.x !== 0 && dx > maxX[dy]){
            dx = minX[dy];
        } else if(d.x !== 0 && dx < minX[dy]){
            dx = maxX[dy];
        }

        const connection = map.find(e => e.x === dx && e.y === dy);
        return connection;
    });
});

const instructions = instructionText.match(/(\d+)?([A-Z])?/g).filter(e => e).reduce((acc, e) => {
    const match = e.match(/\d+/)
    const number = Number(match && match[0]);
    const letter = match != null ? e.split(match[0])[1] : e;
    acc.push(number, letter);
    return acc;
}, []).filter(e => e);

let currentDirection = 0;
let currentTile = map[0];
for(let i = 0; i < instructions.length; i++){
    if(instructions[i] === 'R'){
        currentDirection = (currentDirection + 1) % 4;
    } else if(instructions[i] === 'L'){
        currentDirection = (currentDirection + 3) % 4;
    } else if(!isNaN(instructions[i])){
        for(let j = 0; j < instructions[i]; j++){
            const destination = currentTile.connections[currentDirection];
            if(destination.type === '#'){
                break;
            }
            currentTile = destination;
        }
    } else {
        console.log('CRY!')
    }
}

const result = (currentTile.y) * 1000 + (currentTile.x) * 4 + currentDirection;
console.log(result);

