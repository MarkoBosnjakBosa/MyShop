module.exports = function(io, models, moment, validation) {
    const Message = models.Message;
    var admin = {};
    var users = [];

    io.on("connection", socket => {
        socket.on("userJoining", (user, isAdmin) => {
            if(isAdmin) {
                if(Object.keys(admin).length < 1) {
                    admin = {socketId: socket.id, user: user};
                    socket.emit("adminJoined", {users: users});
                }
            } else {
                var query = {chatId: user};
                Message.find(query).then(messages => {
                    users = [...users, {socketId: socket.id, user: user, messages: messages}];
                    socket.emit("userJoined", {messages: messages});
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
                            socket.emit("messageSentToAdmin", {user: chatId, message: message, myself: true});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageSentToUser", {message: message, myself: false});
                        } else {
                            if(Object.keys(admin).length) {
                                socket.broadcast.to(admin.socketId).emit("messageSentToAdmin", {user: chatId, message: message, myself: false});
                            }
                            socket.emit("messageSentToUser", {message: message, myself: true});
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
                            socket.emit("messageEditedToAdmin", {user: chatId, message: message});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageEditedToUser", {message: message});
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
                                socket.emit("messageDeletedToAdmin", {user: chatId, messageId: messageId});
                                socket.broadcast.to(users[foundIndex].socketId).emit("messageDeletedToUser", {messageId: messageId});
                            } else {
                                if(Object.keys(admin).length) {
                                    socket.broadcast.to(admin.socketId).emit("messageDeletedToAdmin", {user: chatId, messageId: messageId});
                                }
                                socket.emit("messageDeletedToUser", {messageId: messageId});
                            }
                        }
                    }
                }).catch(error => console.log(error));
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
            } else {
                var userOffline = users.filter(user => user.socketId == socket.id);
                users = users.filter(user => user.socketId != socket.id);
                if(Object.keys(admin).length && Object.keys(userOffline).length) {
                    socket.broadcast.to(admin.socketId).emit("userOffline", {user: userOffline.user});
                }
            }
        });
    });

    function getMessageScheme(Message, chatId, username, message, date) {
        return new Message({chatId: chatId, username: username, message: message, date: date});
    }
}