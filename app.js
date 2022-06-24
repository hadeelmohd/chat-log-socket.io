const express = require('express')();
const http = require('http').Server(express);
const socket = require('socket.io');
const io = socket(http);
const MongoClient = require('mongodb').MongoClient;

express.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html");
})

//configuring socket io
let users = [];
io.on('connection', (socket) => {
    socket.on('client-username', username => {
        users[socket.id] = username;
        io.emit('welcome',({message: 'say welcome to ', name: users[socket.id]}));
    }) 

    
    socket.on('client', ({message, name}) => {
        var url = "mongodb://localhost:27017/";
        
        MongoClient.connect(url, (err, connection) => {
            if ( err ) {
                console.log("error while connecting to the db...!!!");
                console.log(err);
            }

            var db = connection.db('chatDB');
            date = new Date();
            var time = date.getHours() + ':'+ date.getMinutes();
            db.collection('chat-log').insertOne({"name": users[socket.id], "message":message, "time":time})
            })
            io.emit('server', ({message: message, name: users[socket.id]}));
        })
    });


//starting server
http.listen(3000, () => {
    console.log("server started on port 3000");
});