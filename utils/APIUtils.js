const fs = require("fs");
const ROOM_PATH = "./model/room.json";
const USERS_PATH = "./model/users.json";

function readFile(file, callback) {
    fs.readFile(file, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("data read");
        }
        callback(data);
    })
}

function writeFile(file, newData) {
    readFile(file, (data) => {
        const list = JSON.parse(data);
        list.push(newData);

        fs.writeFile(file, JSON.stringify(list), (err) => { err ? console.log(err) : console.log("file written") })
    })
}

module.exports = { ROOM_PATH, USERS_PATH, readFile, writeFile };