let data = require('../../get_data')(7);

const root = {path: '/', isDir: true, size: 0};
const records = [root];
const current = [];
data.split('\n').forEach((line) => {
    const args = line.split(' ');
    if(args[0] === '$'){
        executeCommand(args);
    } else {
        addRecord(args);
    }
});

function executeCommand(args){
    if(args[1] === 'cd'){
        if(args[2] === '..'){
            current.pop();
        } else {
            current.push(args[2]);
        }
    }
}

function addRecord(args){
    const path = current.join('');
    const isDir = args[0] === 'dir'
    const record = {
        path: path + args[1],
        isDir: isDir,
        size: isDir ? 0 : parseInt(args[0])
    }

    records.push(record);
}

records.sort((a, b) => b.path.length - a.path.length).forEach((record) => {
    if(record.isDir){
        record.size = records.filter((r) => !r.isDir && r.path.startsWith(record.path)).reduce((acc, r) => acc + r.size, 0);
    }
});

const currentSize = root.size;
const freeSpace = 70000000 - currentSize;
const delta = 30000000 - freeSpace;

const result = records.filter((r) => r.isDir && r.size >= delta).sort((a, b) => a.size - b.size)[0].size;
console.log(result);