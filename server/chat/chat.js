module.exports = function(io, models, moment) {
    const Message = models.Message;
    var admin = {};
    var users = [];

    io.on("connection", socket => {
        socket.on("userJoining", (user, isAdmin) => {
            if(isAdmin) {
                if(Object.keys(admin).length < 1) {
                    admin = {socketId: socket.id, user: user};
                }
                socket.emit("adminJoined", {users: users});
            } else {
                var foundIndex = users.findIndex(foundUser => foundUser.user == user);
                if(foundIndex < 0) {
                    users = [...users, {socketId: socket.id, user: user}];
                    socket.broadcast.emit("userOnline", {user: {socketId: socket.id, user: user}});
                }
                var query = {chatroomId: user};
                Message.find(query).then(messages => {
                    socket.emit("userJoined", {messages: messages});
                }).catch(error => console.log(error));
            }
        });
        socket.on("loadMessages", user => {
            var query = {chatroomId: user};
            Message.find(query).then(messages => {
                socket.emit("messagesLoaded", {messages: messages});
            }).catch(error => console.log(error));
        });
        socket.on("sendMessage", (chatroomId, isAdmin, user, message) => {
            if(chatroomId && message) {
                var newMessage;
                var dateFormat = "DD.MM.YYYY HH:mm";
                var date = moment().format(dateFormat);
                if(isAdmin) {
                    newMessage = getMessageScheme(Message, chatroomId, user, message, date);
                    newMessage.save().then(message => {
                        socket.emit("messageSent", {message: message});
                        var foundIndex = users.findIndex(foundUser => foundUser.user == chatroomId);
                        if(foundIndex > -1) {
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageSent", {message: message});
                        }
                    });
                } else {
                    newMessage = getMessageScheme(Message, chatroomId, chatroomId, message, date);
                    newMessage.save().then(message => {
                        socket.emit("messageSent", {message: message});
                        if(Object.keys(admin).length) {
                            socket.broadcast.to(admin.socketId).emit("messageSent", {message: message});
                        }
                    }).catch(error => console.log(error));
                }
            }
        });
        /**socket.on("disconnect", () => {
            delete chatrooms[chatroomId];
            if(admins.length) {
                socket.broadcast.to(admins[0].socketId).emit("userOffline", {message: message});
            }
        });*/

    });

    function getMessageScheme(Message, chatroomId, username, message, date) {
        return new Message({chatroomId: chatroomId, username: username, message: message, date: date});
    }
}