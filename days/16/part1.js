let data = require('../../get_data')(16);

const valves = data.split('\n').reduce((valves, line) => {
    const [name, ...tunnels] = line.match(/([A-Z]{2})/g);
    const flowRate = Number(line.match(/flow rate=(-?\d+)/)[1]);  
    valves[name] = {name, flowRate, tunnels, connections: tunnels.map(t => {
        return {
            name: t,
            distance: 2
        }
    })};

    return valves;
}, {});

Object.values(valves).forEach(valve => {
    if(valve.name === 'AA' || valve.flowRate > 0){
        const queue = [...valve.connections];
        const visited = [];
        while(queue.length > 0){
            const tunnel = queue.shift();
            if(visited.find(e => e.name === tunnel.name)){
                continue;
            }
            visited.push(tunnel);

            const nextValve = valves[tunnel.name];

            nextValve.tunnels.forEach(t => {
                queue.push({
                    name: t,
                    distance: tunnel.distance + 1
                });
            });
        }

        valve.connections = visited.filter(e => e.name !== valve.name && valves[e.name].flowRate > 0);
    }
});

const start = valves['AA'];
const queue = [{minutes: 0, tail: [start], flow: 0, flowRate: 0}];
const results = [];
const MAX_TAIL_LENGTH = Object.values(valves).filter(valve => valve.name === 'AA' || valve.flowRate > 0).length;
const MAX_MINUTES = 30;
while(queue.length){
    const {minutes, tail, flow, flowRate} = queue.shift();
    const current = tail[tail.length - 1];

    if(tail.length === MAX_TAIL_LENGTH || minutes === MAX_MINUTES){
        results.push({tail, flow: flow + (MAX_MINUTES - minutes) * flowRate, flowRate, minutes});
        continue;
    }

    for(let destination of current.connections){
        if(tail.find(e => e.name === destination.name) || destination.distance + minutes > 30){
            if(destination.distance + minutes > 30){
                results.push({tail, flow: flow + (MAX_MINUTES - minutes) * flowRate, flowRate, minutes});
            }
            continue;
        }

        const newTail = [...tail, valves[destination.name]];
        const newFlow = flow + flowRate * destination.distance;
        const newFlowRate = flowRate + valves[destination.name].flowRate;
        queue.push({minutes: minutes + destination.distance, tail: newTail, flow: newFlow, flowRate: newFlowRate});
    }
}

const result = results.sort((a, b) => b.flow - a.flow)[0];
console.log(result.flow);
