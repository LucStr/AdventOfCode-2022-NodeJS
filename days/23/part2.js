let data = require('../../get_data')(23);

const map = []; 
data.split('\n').forEach((line, y) => line.split('').forEach((type, x) => {
    if(type === '#'){
        map.push({x, y});
    }
}));

const directions = {
    'NW': {x: -1, y: -1},
    'N': {x: 0, y: -1}, 
    'NE': {x: 1, y: -1},
    'E': {x: 1, y: 0},
    'SE': {x: 1, y: 1},
    'S': {x: 0, y: 1},
    'SW': {x: -1, y: 1},
    'W': {x: -1, y: 0}
};

const considerations = [
    ['N', 'NW', 'NE'],
    ['S', 'SW', 'SE'],
    ['W', 'NW', 'SW'],
    ['E', 'NE', 'SE']
];

let propositions = new Map();
let noMove = false;
let count = 0;
while(!noMove){
    for(let elf of map){
        const neighbors = Object.keys(directions).reduce((acc, direction) => {
            const {x: dx, y: dy} = directions[direction];
            const neighbour = map.find(e => e.x === elf.x + dx && e.y === elf.y + dy);
            acc[direction] = neighbour;
            return acc;
        }, {});

        if(Object.values(neighbors).every(n => n === undefined)){
            continue;
        }

        for(let neighborToCheck of considerations){
            const shouldMove = neighborToCheck.every(direction => neighbors[direction] === undefined)
            if(shouldMove){
                let destination = directions[neighborToCheck[0]]; 
                const x = elf.x + destination.x;
                const y = elf.y + destination.y;
                const key = `${x},${y}`;
                if(propositions.has(key)){
                    propositions.get(key).push({elf, x, y});
                } else {
                    propositions.set(key, [{elf, x, y}]);
                }
                break;
            }
        }
    }

    noMove = propositions.size === 0;
    for(let [key, elves] of propositions){
        if(elves.length > 1){
            continue;
        }
        const [elf] = elves;
        elf.elf.x = elf.x;
        elf.elf.y = elf.y;
    }

    propositions.clear();
    considerations.push(considerations.shift());
    count++;
}

const result = count;
console.log(result);
