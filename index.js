var day = new Date().getDate();
var part = 1;

if(process.argv.length == 3){
    part = process.argv[2];
}
if(process.argv.length > 3){
    day = process.argv[2];
    part = process.argv[3];
}

console.time('solve');

require(`./days/${day}/part${part}`);    

console.timeEnd('solve');