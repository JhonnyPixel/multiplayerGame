
const express=require("express");
const app=express();
const path=require("path");
const socketIo = require('socket.io');
const http=require("http");

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
});

var players=new Object({
});

io.on("connection",(socket)=>{
    console.log("a user connected");

    socket.on("join",(player,callback)=>{
        let newPlayer={
            id:socket.id,
            position:player.position,
            color:player.color
            };
        players[newPlayer.id]=newPlayer;

        console.log(players.list);

        socket.broadcast.emit("joinPlayer",newPlayer);

        socket.emit("players",players);
        
    });

    socket.on("disconnect",()=>{
        delete players[socket.id];
        socket.broadcast.emit("playerDisconnected",socket.id);
    });

    socket.on("playerMoved",(position)=>{
        socket.broadcast.emit("updateMovementPlayer",socket.id,position);
    });

});


server.listen(3000,()=>{
    console.log("server listen on port 3000");
});