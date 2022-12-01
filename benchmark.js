const fs = require('fs');
const path = require('path');

let day = 1;

while(fs.existsSync(path.join(__dirname, 'days/' + day))){
    console.log('\n\nDAY ' + day);
    console.time('part1');

    require(`./days/${day}/part${1}`);    
    
    console.timeEnd('part1');

    console.time('part2');

    require(`./days/${day}/part${2}`);    
    
    console.timeEnd('part2');

    day++;
}

