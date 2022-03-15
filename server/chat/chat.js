module.exports = function(app, io, models, validations) {
    const User = models.User;
    const Message = models.Message;
    var admin = {};
    var users = [];

    io.on("connection", socket => {
        socket.on("userJoining", (user, isAdmin) => {
            if(isAdmin) {
                if(Object.keys(admin).length) {
                    socket.broadcast.to(admin.socketId).emit("closeTab");
                }
                admin = {socketId: socket.id, user: user};
                socket.emit("adminOnline", {isAdmin: true, users: users});
                users.forEach(user => socket.broadcast.to(user.socketId).emit("adminOnline", {isAdmin: false, users: []}));
            } else {
                var adminOnline;
                if(Object.keys(admin).length) {
                    adminOnline = true;
                } else {
                    adminOnline = false;
                }
                var query = {chatId: user};
                Message.find(query).then(messages => {
                    socket.emit("userOnline", {isAdmin: false, adminOnline: adminOnline, messages: messages});
                    var foundIndex = users.findIndex(foundUser => foundUser.user === user);
                    if(foundIndex > -1) {
                        socket.broadcast.to(users[foundIndex].socketId).emit("closeTab");
                        users[foundIndex].socketId = socket.id;
                        users[foundIndex].isOnline = true;
                        socket.broadcast.emit("userOnline", {isAdmin: true, exists: true, user: user});
                    } else {
                        users = [...users, {socketId: socket.id, user: user, messages: messages, isOnline: true}];
                        socket.broadcast.emit("userOnline", {isAdmin: true, exists: false, user: {user: user, messages: messages, isOnline: true}});
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("sendMessage", (chatId, isAdmin, user, message) => {
            if(chatId && validations.validateMessage(message)) {
                var date = new Date().getTime();
                var newMessage = getMessageScheme(Message, chatId, user, message, date);
                newMessage.save().then(createdMessage => {
                    var foundIndex = users.findIndex(foundUser => foundUser.user === chatId);
                    if(foundIndex > -1) {
                        users[foundIndex].messages = [...users[foundIndex].messages, createdMessage];
                        if(isAdmin) {
                            socket.emit("messageSent", {user: chatId, isAdmin: true, message: createdMessage, myself: true});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageSent", {user: "", isAdmin: false, message: createdMessage, myself: false});
                        } else {
                            if(Object.keys(admin).length) {
                                socket.broadcast.to(admin.socketId).emit("messageSent", {user: chatId, isAdmin: true, message: createdMessage, myself: false});
                            }
                            socket.emit("messageSent", {user: "", isAdmin: false, message: createdMessage, myself: true});
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("editMessage", (chatId, message) => {
            if(validations.validateMessage(message.message)) {
                var query = {_id: message._id};
                var update = {message: message.message};
                var options = {new: true};
                Message.findOneAndUpdate(query, update, options).then(foundMessage => {
                    if(!validations.isEmpty(foundMessage)) {
                        var foundIndex = users.findIndex(foundUser => foundUser.user === chatId);
                        if(foundIndex > -1) {
                            users[foundIndex].messages = users[foundIndex].messages.map(message => String(message._id) === String(foundMessage._id) ? foundMessage : message);
                            socket.emit("messageEdited", {user: chatId, isAdmin: true, message: message});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageEdited", {user: "", isAdmin: false, message: message});
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("deleteMessage", (chatId, isAdmin, messageId) => {
            var query = {_id: messageId};
            Message.findOneAndDelete(query).then(message => {
                if(!validations.isEmpty(message)) {
                    var foundIndex = users.findIndex(foundUser => foundUser.user === chatId);
                    if(foundIndex > -1) {
                        users[foundIndex].messages = users[foundIndex].messages.filter(message => message._id !== messageId);
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
        });
        socket.on("readMessage", (chatId, isAdmin, username) => {
            var foundIndex = users.findIndex(foundUser => foundUser.user === chatId);
            if(foundIndex > -1) {
                if(isAdmin) {
                    socket.broadcast.to(users[foundIndex].socketId).emit("messageRead", {user: username});
                } else {
                    socket.broadcast.to(admin.socketId).emit("messageRead", {user: username});
                }
            }
        });
        socket.on("startTyping", (chatId, isAdmin, username) => {
            var foundIndex = users.findIndex(foundUser => foundUser.user === chatId);
            if(foundIndex > -1) {
                if(isAdmin) {
                    socket.broadcast.to(users[foundIndex].socketId).emit("typingStarted", {user: username});
                } else {
                    socket.broadcast.to(admin.socketId).emit("typingStarted", {user: username});
                }
            }
        });
        socket.on("stopTyping", (chatId, isAdmin, username) => {
            var foundIndex = users.findIndex(foundUser => foundUser.user === chatId);
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
            if(admin.socketId === socket.id) {
                admin = {};
                users.forEach(user => socket.broadcast.to(user.socketId).emit("adminOffline"));
            } else {
                var userOffline = users.filter(user => user.socketId === socket.id);
                users = users.filter(user => user.socketId !== socket.id);
                if(Object.keys(admin).length && Object.keys(userOffline).length) {
                    socket.broadcast.to(admin.socketId).emit("userOffline", {user: userOffline[0].user});
                }
            }
        });
    });

    app.get("/findUser/:username", (request, response) => {
        var username = request.params.username;
        var userQuery = {"account.username": username};
        User.findOne(userQuery).then(user => {
            if(!validations.isEmpty(user)) {
                var messageQuery = {chatId: user.account.username};
                Message.find(messageQuery).then(messages => {
                    users = [...users, {socketId: "socketId_" + user.account.username, user: user.account.username, messages: messages, isOnline: false}];
                    response.status(200).json({exists: true, user: {user: user.account.username, messages: messages, isOnline: false}}).end();
                });
            } else {
                response.status(200).json({exists: false}).end();
            }
        }).catch(error => console.log(error));
    });
    app.delete("/removeUser/:username", (request, response) => {
        var username = request.params.username;
        users = users.filter(user => user.socketId !== "socketId_" + username);
        response.status(200).json({user: username}).end();
    });

    function getMessageScheme(Message, chatId, username, message, date) {
        return new Message({chatId: chatId, username: username, message: message, date: date});
    }
}