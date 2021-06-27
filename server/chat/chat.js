module.exports = function(io, models, moment) {
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
                if(isAdmin) {
                    newMessage = getMessageScheme(Message, chatroomId, user, message, date);
                    newMessage.save().then(message => {
                        socket.emit("messageSentToAdmin", {user: chatroomId, message: message, myself: true});
                        var foundIndex = users.findIndex(foundUser => foundUser.user == chatroomId);
                        if(foundIndex > -1) {
                            users[foundIndex].messages = [...users[foundIndex].messages, message];
                            socket.broadcast.to(users[foundIndex].socketId).emit("messageSentToUser", {message: message, myself: false});
                        }
                    });
                } else {
                    newMessage = getMessageScheme(Message, chatroomId, chatroomId, message, date);
                    newMessage.save().then(message => {
                        var foundIndex = users.findIndex(foundUser => foundUser.user == chatroomId);
                        if(foundIndex > -1) {
                            users[foundIndex].messages = [...users[foundIndex].messages, message];
                            socket.emit("messageSentToUser", {message: message, myself: true});
                        }
                        if(Object.keys(admin).length) {
                            socket.broadcast.to(admin.socketId).emit("messageSentToAdmin", {user: chatroomId, message: message, myself: false});
                        }
                    }).catch(error => console.log(error));
                }
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