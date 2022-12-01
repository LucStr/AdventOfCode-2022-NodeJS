require('dotenv').config();
const request = require('request');
const fs = require('fs-extra');
const path = require('path');
const config = process.env;

const session = config["AOC_SESSION"];
const year = config["AOC_YEAR"];

const day = process.argv[2] || new Date().getDate();
console.log({session, year, day});

if(!day)
    return console.log('please supply a day');

if(!session)
    return console.log('please supply a session-cookie in config.json file');

const part1 = path.join(__dirname, `./days/${day}/part1.js`);
const part2 = path.join(__dirname, `./days/${day}/part2.js`);

const template = `let data = require('../../get_data')(${day});\n\nvar result = data\n\nconsole.log(result);`;

const setup = fs.mkdir(path.join(__dirname, `./days/${day}`))
    .then(() => 
        Promise.all([
            fs.createFile(part1)
                .then(() => fs.writeFile(part1, template)),
            fs.createFile(part2)
                .then(() => fs.writeFile(part2, template)),
        ]));
        
request(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
        'Cookie' : 'session=' + session
    }
}, async (error, response, body) => {
    await setup;

    var inputFile = path.join(__dirname, `./days/${day}/data.in`);

    try{
        await fs.ensureFile(inputFile);
        await fs.writeFile(inputFile, body.trim());
    } catch (e){
        if(e){
            return console.log('error:' + e)
        }
    }
    console.log('done!');
})