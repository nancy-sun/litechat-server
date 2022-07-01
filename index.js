const express = require("express");
const app = express();
const room = require("./routes/room");
const axios = require("axios");

const cors = require("cors");
require("dotenv").config();
const { PORT } = process.env;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        // origin: "https://lite-chat-react.herokuapp.com", //react frontend url
        origin: "http://localhost:3000", //react frontend url
        methods: ["GET", "POST", "DELETE"]
    }
});

// const APIURL = "https://litechat-server.herokuapp.com";
const APIURL = "http://localhost:5050";

app.use(express.json());
app.use(cors());
app.use("/room", room);


io.on("connection", (socket) => {
    socket.on("join", (data, callback) => {
        socket.join(data);
        console.log(`${socket.id} joined room ${data}`);
        callback(socket.id);
    })

    socket.on("sendMsg", (data) => {
        socket.broadcast.to(data.room).emit("receiveMsg", data.msg);
    })

    socket.on("disconnect", () => {
        let roomFound;
        axios.get(`${APIURL}/room`).then(response => {
            let rooms = response.data;
            for (let room of rooms) {
                let users = room.users;
                for (let user of users) {
                    if (user === socket.id) {
                        roomFound = room.roomID;
                    }
                }
            }
        }).catch((e) => {
            console.log(e);
        })
        if (roomFound) {
            axios.delete(`${APIURL}/room/${roomFound}/${socket.id}`).then(() => {
                return;
            }).catch(e => console.log(e));
        }
    });

    /* webRTC connections */
    socket.on("joinVoice", (roomID) => {
        axios.get(`${APIURL}/room/${roomID}`).then(response => {
            let voiceUsers = response.data.voiceUsers;
            console.log(voiceUsers)
            let users = voiceUsers.filter(user => user.userID !== socket.id);
            socket.emit("allUsers", users);
        }).catch((e) => {
            console.log(e);
        })
    });

    socket.on("sendSgn", (payload) => {
        io.to(payload.userToSignal).emit("voiceJoined", { signal: payload.signal, caller: payload.caller });
        // socket.broadcast.to(payload.room).emit("voiceJoined", { signal: payload.signal, caller: payload.caller });
    });

    socket.on("returnSgn", (payload) => {
        io.to(payload.caller).emit("receiveSgn", { signal: payload.signal, id: socket.id });
        // socket.broadcast.to(payload.room).emit("receiveSgn", { signal: payload.signal, id: socket.id });
    });
})

server.listen(PORT, () => console.log(`listening on ${PORT}`));