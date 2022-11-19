const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = 3001;
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
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

app.use(cors());


server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})