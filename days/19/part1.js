let data = require('../../get_data')(19);

/*data = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore.  Each clay robot costs 3 ore.  Each obsidian robot costs 3 ore and 8 clay.  Each geode robot costs 3 ore and 12 obsidian.`*/

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
    const maxValues = blueprint.robots.map((e, i) => Math.max(...blueprint.robots.map(r => r.cost[i])));
    maxValues[3] = Infinity;

    const queue = [[...production, ...inventory, 0]];
    let result = 0;
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

    while(queue.length){
        const current = queue.shift();
        for(let index = blueprint.robots.length - 1; index >= 0; index--){
            const robot = blueprint.robots[index];
            if(maxValues[index] <= current[index] || robot.cost.some((c, i) => c > 0 && current[i] <= 0)){
                continue;
            }

            const minutesToRun = Math.max(...robot.cost.map((e, i) => current[i] === 0 ? 0 : Math.ceil((e - current[i + 4]) / current[i])), 0) + 1;
            
            if(minutesToRun + current[8] > MAX_MINUTES){
                result = Math.max(result, current[7] + (MAX_MINUTES - current[8]) * current[3]);
                continue;
            }

            const newPosition = [...current];
            newPosition[index] += 1;

            for(let i = 0; i < 4; i++){
                newPosition[i + 4] += current[i] * minutesToRun - robot.cost[i];
            }
            
            newPosition[8] += minutesToRun;
               
            if(isMemo(newPosition)){
                continue;
            } else {
                addMemo(newPosition);
            }
            queue.unshift(newPosition);
        }
    }
    
    return result;
}

const result = blueprints.map(e =>{
    let run = simulate(e);
    return run * e.id
}).reduce((a, b) => a + b, 0);
console.log(result);
