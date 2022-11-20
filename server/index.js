const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://chat-rooms-socket.netlify.app/',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send({ serverRunning: true })
});

io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room ${data}`);
    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data)
    })

    socket.on('disconnect', () => {
        console.log(`User with ID ${socket.id} disconnected`);
    })
});

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
