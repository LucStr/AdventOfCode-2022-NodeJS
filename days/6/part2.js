let data = require('../../get_data')(6);

data = [...data];
let result = 14;
let current = data.splice(0, 14);
while(data.length){
    if(new Set(current).size === current.length){
        break;
    }
    current.shift();
    current.push(data.shift());
    result++;
}

console.log(result);