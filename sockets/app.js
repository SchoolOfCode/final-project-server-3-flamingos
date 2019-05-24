var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const config = require("./config");

app.get("/", function(req, res) {
    res.redirect("https://watu.netlify.com/");
});

// start sockets and log connection/disconnection
io.on("connection", function(socket) {
    console.log("SOCKET /posts user connected");

    // re-emit posts on recieving from faas
    socket.on("post", function(post) {
        io.emit("post", post);
    });

    // re-emit comments on recieving from faas
    socket.on("comment", function(comment) {
        io.emit("comment", comment);
    });
    socket.on("disconnect", function() {
        console.log("SOCKET /posts user disconnected");
    });
});

http.listen(config.PORT, function() {
    console.log(`listening on *: ${config.PORT}`);
});
