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
                var query = {chatroomId: user};
                Message.find(query).then(messages => {
                    users = [...users, {socketId: socket.id, user: user, messages: messages}];
                    socket.emit("userJoined", {messages: messages});
                    socket.broadcast.emit("userOnline", {user: {user: user, messages: messages}});
                });
            }
        });
        socket.on("sendMessage", (chatroomId, isAdmin, user, message) => {
            if(chatroomId && message) {
                var newMessage;
                var dateFormat = "DD.MM.YYYY HH:mm";
                var date = moment().format(dateFormat);
                newMessage = getMessageScheme(Message, chatroomId, user, message, date);
                newMessage.save().then(message => {
                    var foundIndex = users.findIndex(foundUser => foundUser.user == chatroomId);
                    if(foundIndex > -1) {
                        users[foundIndex].messages = [...users[foundIndex].messages, message];
                        if(isAdmin) {
                            socket.emit("messageSentToAdmin", {user: chatroomId, message: message, myself: true});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageSentToUser", {message: message, myself: false});
                        } else {
                            if(Object.keys(admin).length) {
                                socket.broadcast.to(admin.socketId).emit("messageSentToAdmin", {user: chatroomId, message: message, myself: false});
                            }
                            socket.emit("messageSentToUser", {message: message, myself: true});
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("editMessage", (chatroomId, message) => {
            if(message._id && message.message) {
                var query = {_id: message._id};
                var update = {message: message.message};
                Message.findOneAndUpdate(query, update, {new: true}).then(foundMessage => {
                    if(!validation.isEmpty(foundMessage)) {
                        var foundIndex = users.findIndex(foundUser => foundUser.user == chatroomId);
                        if(foundIndex > -1) {
                            users[foundIndex].messages = users[foundIndex].messages.map(message => String(message._id) == String(foundMessage._id) ? foundMessage : message);
                            socket.emit("messageEditedToAdmin", {user: chatroomId, message: message});
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageEditedToUser", {message: message});
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
        socket.on("deleteMessage", (chatroomId, isAdmin, messageId) => {
            if(messageId) {
                var query = {_id: messageId};
                Message.findOneAndRemove(query).then(message => {
                    if(!validation.isEmpty(message)) {
                        var foundIndex = users.findIndex(foundUser => foundUser.user == chatroomId);
                        if(foundIndex > -1) {
                            users[foundIndex].messages = users[foundIndex].messages.filter(message => message._id != messageId);
                            if(isAdmin) {
                                socket.emit("messageDeletedToAdmin", {user: chatroomId, messageId: messageId});
                                socket.broadcast.to(users[foundIndex].socketId).emit("messageDeletedToUser", {messageId: messageId});
                            } else {
                                if(Object.keys(admin).length) {
                                    socket.broadcast.to(admin.socketId).emit("messageDeletedToAdmin", {user: chatroomId, messageId: messageId});
                                }
                                socket.emit("messageDeletedToUser", {messageId: messageId});
                            }
                        }
                    }
                }).catch(error => console.log(error));
            }
        });
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

    function getMessageScheme(Message, chatroomId, username, message, date) {
        return new Message({chatroomId: chatroomId, username: username, message: message, date: date});
    }
}