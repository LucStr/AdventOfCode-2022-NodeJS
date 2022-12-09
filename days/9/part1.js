let data = require('../../get_data')(9);

const directions = {
    'U': [0, 1],
    'L': [-1, 0],
    'D': [0, -1],
    'R': [1, 0]
};

const start = {x: 0, y: 0, visited: true};
const map = [start];
let head = start;
let tail = start;

data.split('\n').forEach(line => {
    const [direction, distanceString] = line.split(' ');
    const [x, y] = directions[direction];
    const distance = parseInt(distanceString);

    for(let i = 0; i < distance; i++){
        let next = map.find((node) => node.x === head.x + x && node.y === head.y + y);
        if(!next){
            next = {x: head.x + x, y: head.y + y, visited: false};
            map.push(next);
        }

        head = next;

        if(Math.abs(head.x - tail.x) > 1 || Math.abs(head.y - tail.y) > 1){
            let target = map.find((node) => node.x === head.x - x && node.y === head.y - y);
            if(!target){
                target = {x: head.x - x, y: head.y - y, visited: false};
                map.push(target);
            }

            target.visited = true;
            tail = target;
        }
    }
})

const result = map.filter((node) => node.visited).length;
console.log(result);
