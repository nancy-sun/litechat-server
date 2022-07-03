const fs = require("fs");
const { ROOM_PATH, readFile, writeFile } = require("../utils/APIUtils");

function getRoomList(req, res) {
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data);
        res.status(200).json(rooms);
    })
}

function createNewRoom(req, res) {
    const { roomID } = req.body;
    const roomData = {
        roomID: roomID,
        users: [],
        voiceUsers: [],
        messageHistory: []
    }
    writeFile(ROOM_PATH, roomData);
    res.status(201).json(roomData);
}

function getSingleRoom(req, res) {
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data)
        const roomFound = rooms.find((room) => { return room.roomID === req.params.roomID });
        if (roomFound) {
            res.status(200).json(roomFound);
        } else {
            res.status(404).send("no room found");
        }
    })
}

function deleteRoom(req, res) {
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data);
        const roomIndexFound = rooms.findIndex((room) => { return room.roomID === req.params.roomID });
        if (roomIndexFound < 0) {
            res.status(404).send("no room found");
        } else {
            rooms.splice(roomIndexFound, 1);
            fs.writeFile(ROOM_PATH, JSON.stringify(rooms), (err) => { err ? console.log(err) : console.log("file written") });
            res.status(200).json(rooms);
        }
    })
}


function newUserJoin(req, res) {
    const { username, userID } = req.body;
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data);
        const roomFound = rooms.find((room) => { return room.roomID === req.params.roomID });
        const newUser = {
            userID: userID,
            username: username
        };
        if (roomFound) {
            roomFound.users.push(newUser);
            fs.writeFile(ROOM_PATH, JSON.stringify(rooms), (err) => { err ? console.log(err) : console.log("file written") });
            res.status(201).json(roomFound);
        } else {
            res.status(404).send("no room found");
        }
    })
}

function newVoiceUserJoin(req, res) {
    const { username, userID } = req.body;
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data);
        const roomFound = rooms.find((room) => { return room.roomID === req.params.roomID });
        const newUser = {
            userID: userID,
            username: username
        };
        if (roomFound) {
            roomFound.voiceUsers.push(newUser);
            fs.writeFile(ROOM_PATH, JSON.stringify(rooms), (err) => { err ? console.log(err) : console.log("file written") });
            res.status(201).json(roomFound);
        } else {
            res.status(404).send("no room found");
        }
    })
}

function userLeft(req, res) {
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data)
        const roomFound = rooms.find((room) => { return room.roomID === req.params.roomID });
        if (roomFound) {
            const users = roomFound.users;
            const userIndxFound = users.findIndex((user) => { return user.userID === req.params.userID });
            const voiceUsers = roomFound.voiceUsers;
            const voiceUserIndexFound = voiceUsers.findIndex((user) => { return user.userID === req.params.userID });
            if (userIndxFound < 0) {
                res.status(404).send("no user found");
            } else {
                users.splice(userIndxFound, 1);
                if (voiceUserIndexFound >= 0) {
                    voiceUsers.splice(voiceUserIndexFound, 1);
                }
                fs.writeFile(ROOM_PATH, JSON.stringify(rooms), (err) => { err ? console.log(err) : console.log("file written") });
                res.status(200).json(roomFound);
            }
        } else {
            res.status(404).send("no room found");
        }
    })
}

function postMessage(req, res) {
    const { username, message, time, messageID } = req.body;
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data);
        const roomFound = rooms.find((room) => { return room.roomID === req.params.roomID });
        if (roomFound) {
            let messages = roomFound.messageHistory;
            const newMessage = {
                messageID,
                message: message,
                username: username,
                time
            }
            messages.push(newMessage);
            fs.writeFile(ROOM_PATH, JSON.stringify(rooms), (err) => { err ? console.log(err) : console.log("file written") });
            res.status(201).json(roomFound);
        } else {
            res.status(404).send("no room found");
        }
    })
}

function deleteMsg(req, res) {
    readFile(ROOM_PATH, (data) => {
        if (!data) {
            res.status(404).send("data not found");
        }
        const rooms = JSON.parse(data)
        const roomFound = rooms.find((room) => { return room.roomID === req.params.roomID });
        if (roomFound) {
            const msgs = roomFound.messageHistory;
            const msgIndxFound = msgs.findIndex((msg) => { return msg.messageID === req.params.msgID });

            if (msgIndxFound < 0) {
                res.status(404).send("no message found");
            } else {
                msgs.splice(msgIndxFound, 1);
                fs.writeFile(ROOM_PATH, JSON.stringify(rooms), (err) => { err ? console.log(err) : console.log("file written") });
                res.status(200).json(roomFound);
            }
        } else {
            res.status(404).send("no room found");
        }
    })
}



module.exports = { newVoiceUserJoin, getRoomList, createNewRoom, getSingleRoom, newUserJoin, deleteRoom, userLeft, postMessage, deleteMsg };