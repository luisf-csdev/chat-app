const express = require('express');
const app = express();
const path = require('path');
const socketIO = require('socket.io');

app.use('/room1', express.static(path.join(__dirname, 'public')));
app.use('/room2', express.static(path.join(__dirname, 'public')));

const server = app.listen(3000, () => {
    console.log("Server running");
})

const messages = { room1: [], room2: [] }

const io = socketIO(server);

const room1 = io.of('/room1').on('connection', (socket) => {
    console.log('new connection');
    socket.emit('update_messages', messages.room1);

    socket.on('new_message', (data) => {
        messages.room1.push(data);
        room1.emit('update_messages', messages.room1);
    })
})

const room2 = io.of('/room2').on('connection', (socket) => {
    console.log('new connection');
    socket.emit('update_messages', messages.room2);

    socket.on('new_message', (data) => {
        messages.room2.push(data);
        room2.emit('update_messages', messages.room2);
    })
})