let data = require('../../get_data')(8);

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        height: parseInt(char),
        x: x,
        y: y,
        visible: []
    }
})).reduce((acc, row) => acc.concat(row), []);

const directions = [[1, 0], [0, -1], [-1, 0], [0, 1]];
map.forEach(tree => {
    tree.neighbors = directions.map((dir, index) => {
        let neighbor = map.find((other) => other.x === tree.x + dir[0] && other.y === tree.y + dir[1]);
        if(!neighbor){
            tree.visible[index] = true;
        }
        return neighbor;
    });
});

map.forEach(tree => {
    tree.score = directions.map((direction, index) => {
        let score = 0;
        let current = tree;
        
        while(current.neighbors[index] !== undefined){
            score++;

            if(current.neighbors[index].height >= tree.height){
                break;
            }
            
            current = current.neighbors[index];
        }

        return score;
    }).reduce((a, b) => a * b, 1);
})


const result = map.sort((a,b) => b.score - a.score)[0].score;
console.log(result)