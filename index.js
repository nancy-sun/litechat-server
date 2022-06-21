const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const { PORT } = process.env;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: `http://localhost:3000`, //react frontend url
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
    // socket.on("join room", (roomID, username) => {
    //     // socket.join(roomID);
    //     // socketRoom[socket.id]=roooID
    //     // console.log("user disconnected")
    //     io.emit("connected");
    //     console.log(socket.id)
    // })
    console.log("user connected", socket.id);
    socket.on("sendMsg", (data) => {
        socket.broadcast.emit("receiveMsg", data);
        socket.emit("receiveMsg", data);
    })
})

app.get('/', (req, res) => {
    res.send("hello world");
});

server.listen(PORT, () => console.log(`listening on ${PORT}`));