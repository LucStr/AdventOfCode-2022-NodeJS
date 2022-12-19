let data = require('../../get_data')(19);

const blueprints = data.split('\n').map(line => {
    const [id, ore_ore_cost, clay_ore_cost, obsidian_ore_cost, obsidian_clay_cost, geode_ore_cost, geode_obsidian_cost] = line.match(/(\d+)/g).map(Number);
    return {
        id,
        robots:[
            {
                type: 'ore',
                cost: [ore_ore_cost, 0, 0, 0]
            },
            {
                type: 'clay',
                cost: [clay_ore_cost, 0, 0, 0]
            },
            {
                type: 'obsidian',
                cost: [obsidian_ore_cost, obsidian_clay_cost, 0, 0]
            },
            {
                type: 'geode',
                cost: [geode_ore_cost, 0, geode_obsidian_cost, 0]
            }
        ]
    }
});

const MAX_MINUTES = 24;
function simulate(blueprint){
    const production = [1, 0, 0, 0];
    const inventory = [0, 0, 0, 0];
    
    const queue = [[...production, ...inventory, 0]];
    const results = [];
    const memo = [];
    function isMemo(value){
        let index = 0;
        let current = memo;
        while((current = current[value[index++]]) !== undefined);
        
        return value.length + 1 === index;
    }
    function addMemo(value){
        let index = 0;
        let current = memo;
        while(index < value.length - 1){
            if(!current[value[index]]){
                current[value[index]] = [];
            }
            current = current[value[index++]];
        }

        current[value[index]] = true;
    }

    /*let a = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let b = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    addMemo(a);
    var c = isMemo(b);
*/
    while(queue.length){
        const current = queue.shift();
        if(queue.length % 1000 === 0)
        {
            console.log('1k', memo.length, queue.length, results.length)
        }

        for(let index = blueprint.robots.length - 1; index > 0; index--){
            const possibility = blueprint.robots[index];
            if(possibility.cost.some((c, i) => c > 0 && current[i] <= 0)){
                continue;
            }

            const minutesToRun = Math.max(...possibility.cost.map((e, i) => current[i] === 0 ? 0 : Math.ceil((e - current[i + 4]) / current[i])), 0) + 1;
            if(minutesToRun === 1){
                break;
            }
            if(minutesToRun + current[8] > MAX_MINUTES){
                results.push(current[3]);
                continue;
            }

            const newPosition = [];
            for(let i = 0; i < 4; i++){
                newPosition[i] = current[i];
            }
            newPosition[index] += 1;

            for(let i = 0; i < 4; i++){
                newPosition[i + 4] += current[i] * minutesToRun - possibility.cost[i];
            }
            
            if(isMemo(newPosition)){
                continue;
            } else {
                addMemo(newPosition);
            }

            queue.unshift(newPosition);
        }
    }
    
    return Math.max(...results);
}

const result = blueprints.map(e =>{
    console.log(e)
    let run = simulate(e);
    console.log(run);
    return run * e.id
}).reduce((a, b) => a + b, 0);
console.log(result);
