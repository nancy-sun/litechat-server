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
        origin: "https://litechat.netlify.app", //react frontend url
        // origin: "http://localhost:3000", //react frontend url
        methods: ["GET", "POST", "DELETE"]
    }
});

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

    // socket.on("disconnect", (roomID, userID) => {
    //     axios.delete(`http://localhost:5050/room/${roomID}/${userID}`);
    // });

    /* webRTC connections */
    socket.on("joinVoice", (roomID) => {
        axios.get(`https://litechat-server.herokuapp.com/room/${roomID}/users`).then(response => {
            let users = response.data;
            socket.emit("allUsers", users);
        })
    });

    socket.on("sendSgn", (payload) => {
        io.to(payload.userToSignal).emit("voiceJoined", { signal: payload.signal, caller: payload.caller });
    });

    socket.on("returnSgn", (payload) => {
        io.to(payload.caller).emit("receiveSgn", { signal: payload.signal, id: socket.id });
    });
})

server.listen(PORT, () => console.log(`listening on ${PORT}`));