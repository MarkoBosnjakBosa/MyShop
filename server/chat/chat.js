module.exports = function(io, app, models, moment, validation) {
    const Message = models.Message;
    var admin = {};
    var users = [];

    io.on("connection", socket => {
        socket.on("userJoining", (user, isAdmin) => {
            if(isAdmin) {
                if(Object.keys(admin).length < 1) {
                    admin = {socketId: socket.id, user: user};
                    socket.emit("adminJoined", {isAdmin: true, users: users});
                    users.forEach(user => socket.broadcast.to(user.socketId).emit("adminJoined", {isAdmin: false, users: []}));
                }
            } else {
                var query = {chatId: user};
                Message.find(query).then(messages => {
                    users = [...users, {socketId: socket.id, user: user, messages: messages}];
                    var adminOnline;
                    if(Object.keys(admin).length) {
                        adminOnline = true;
                    } else {
                        adminOnline = false;
                    }
                    socket.emit("userJoined", {adminOnline: adminOnline, messages: messages});
                    socket.broadcast.emit("userOnline", {user: {user: user, messages: messages}});
                });
            }
        });
        socket.on("sendMessage", (chatId, isAdmin, user, message) => {
            if(chatId && message) {
                var newMessage;
                var dateFormat = "DD.MM.YYYY HH:mm";
                var date = moment().format(dateFormat);
                newMessage = getMessageScheme(Message, chatId, user, message, date);
                newMessage.save().then(message => {
                    var foundIndex = users.findIndex(foundUser => foundUser.user == chatId);
                    if(foundIndex > -1) {
                        users[foundIndex].messages = [...users[foundIndex].messages, message];
                        if(isAdmin) {
                            socket.emit("messageSent", {user: chatId, isAdmin: true, message: message, myself: true});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageSent", {user: "", isAdmin: false, message: message, myself: false});
                        } else {
                            if(Object.keys(admin).length) {
                                socket.broadcast.to(admin.socketId).emit("messageSent", {user: chatId, isAdmin: true, message: message, myself: false});
                            }
                            socket.emit("messageSent", {user: "", isAdmin: false, message: message, myself: true});
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("editMessage", (chatId, message) => {
            if(message._id && message.message) {
                var query = {_id: message._id};
                var update = {message: message.message};
                Message.findOneAndUpdate(query, update, {new: true}).then(foundMessage => {
                    if(!validation.isEmpty(foundMessage)) {
                        var foundIndex = users.findIndex(foundUser => foundUser.user == chatId);
                        if(foundIndex > -1) {
                            users[foundIndex].messages = users[foundIndex].messages.map(message => String(message._id) == String(foundMessage._id) ? foundMessage : message);
                            socket.emit("messageEdited", {user: chatId, isAdmin: true, message: message});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageEdited", {user: "", isAdmin: false, message: message});
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("deleteMessage", (chatId, isAdmin, messageId) => {
            if(messageId) {
                var query = {_id: messageId};
                Message.findOneAndRemove(query).then(message => {
                    if(!validation.isEmpty(message)) {
                        var foundIndex = users.findIndex(foundUser => foundUser.user == chatId);
                        if(foundIndex > -1) {
                            users[foundIndex].messages = users[foundIndex].messages.filter(message => message._id != messageId);
                            if(isAdmin) {
                                socket.emit("messageDeleted", {user: chatId, isAdmin: true, messageId: messageId});
                                socket.broadcast.to(users[foundIndex].socketId).emit("messageDeleted", {user: "", isAdmin: false, messageId: messageId});
                            } else {
                                if(Object.keys(admin).length) {
                                    socket.broadcast.to(admin.socketId).emit("messageDeleted", {user: chatId, isAdmin: true, messageId: messageId});
                                }
                                socket.emit("messageDeleted", {user: "", isAdmin: false, messageId: messageId});
                            }
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("readMessage", (chatId, isAdmin, username) => {
            var foundIndex = users.findIndex(foundUser => foundUser.user == chatId);
            if(foundIndex > -1) {
                if(isAdmin) {
                    socket.broadcast.to(users[foundIndex].socketId).emit("messageRead", {user: username});
                } else {
                    socket.broadcast.to(admin.socketId).emit("messageRead", {user: username});
                }
            }
        });
        socket.on("startTyping", (chatId, isAdmin, username) => {
            var foundIndex = users.findIndex(foundUser => foundUser.user == chatId);
            if(foundIndex > -1) {
                if(isAdmin) {
                    socket.broadcast.to(users[foundIndex].socketId).emit("typingStarted", {user: username});
                } else {
                    socket.broadcast.to(admin.socketId).emit("typingStarted", {user: username});
                }
            }
        });
        socket.on("stopTyping", (chatId, isAdmin, username) => {
            var foundIndex = users.findIndex(foundUser => foundUser.user == chatId);
            if(foundIndex > -1) {
                if(isAdmin) {
                    socket.broadcast.to(users[foundIndex].socketId).emit("typingStopped", {user: username});
                } else {
                    socket.broadcast.to(admin.socketId).emit("typingStopped", {user: username});
                }
            }
        });
        socket.on("userLeaving", () => socket.disconnect());
        socket.on("disconnect", () => {
            if(admin.socketId == socket.id) {
                admin = {};
                users.forEach(user => socket.broadcast.to(user.socketId).emit("adminOffline"));
            } else {
                var userOffline = users.filter(user => user.socketId == socket.id);
                users = users.filter(user => user.socketId != socket.id);
                if(Object.keys(admin).length && Object.keys(userOffline).length) {
                    socket.broadcast.to(admin.socketId).emit("userOffline", {user: userOffline.user});
                }
            }
        });
    });

    app.post("/findUser", (request, response) => {
    });
    app.get("/getMessages", (request, response) => {
    })
    app.post("/sendMessage", (request, response) => {
    });
    app.put("/editMessage", (request, response) => {
    });
    app.delete("/deleteMessage/:messageId", (request, response) => {
    });

    function getMessageScheme(Message, chatId, username, message, date) {
        return new Message({chatId: chatId, username: username, message: message, date: date});
    }
}