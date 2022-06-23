const express = require("express");
const app = express();
const room = require("./routes/room");

const cors = require("cors");
require("dotenv").config();
const { PORT } = process.env;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: `http://localhost:3000`, //react frontend url
        methods: ["GET", "POST", "DELETE"]
    }
});

app.use(express.json());
app.use(cors());
app.use("/room", room);

io.on("connection", (socket) => {
    // console.log('connection')

    socket.on("join", (data, callback) => {
        socket.join(data);
        console.log(`${socket.id} joined room ${data}`)
        callback(socket.id);
    })

    socket.on("sendMsg", (data) => {
        console.log("msg data", data)
        socket.broadcast.to(data.room).emit("receiveMsg", data.message);
        // socket.broadcast.emit("receiveMsg", data.message);

    })

    // socket.on("disconnect", () => {
    //     console.log("user disconnected", socket.id);
    // });
})

server.listen(PORT, () => console.log(`listening on ${PORT}`));