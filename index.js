const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is runinng on the port ${port}`);

});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

//tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    console.log('user connected');
    socket.on('message', (msg) => {
        console.log(`message: ${msg}`);
        tech.emit('message', msg);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected");
        tech.emit('message', 'user disconnected');
    });

});

//anime namespace
const anime = io.of('/javascript');

anime.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        anime.in(data.room).emit('message' , `New user joined the ${data.room} room`);
    });
    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        anime.in(data.room).emit('message', data.msg);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected");
        anime.emit('message', 'user disconnected');
    });

});