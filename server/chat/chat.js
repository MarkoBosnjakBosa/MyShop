module.exports = function(io, models, moment) {
    const Message = models.Message;
    var chatrooms = {};

    io.on("connection", socket => {
        socket.on("userJoining", (username, isAdmin) => {
            if(!isAdmin) {
                if(!chatrooms.hasOwnProperty(username)) {
                    socket.join(username);
                    socket.broadcast.emit("userOnline", username);
                    chatrooms[username] = {users: {}};
                }
                chatrooms[username].users[socket.id] = username;
                var query = {chatroomId: username};
                Message.find(query).then(messages => {
                    socket.emit("userJoined", {messages: messages});
                }).catch(error => console.log(error));
            }
        });
        socket.on("adminJoining", (user, admin) => {
            if(user && admin) {
                socket.join(user);
                chatrooms[user].users[socket.id] = admin;
                var query = {chatroomId: user};
                Message.find(query).then(messages => {
                    socket.emit("userJoined", {messages: messages});
                }).catch(error => console.log(error));
            }
        });
        socket.on("sendMessage", (chatroomId, isAdmin, user, message) => {
            if(chatroomId && message) {
                var newMessage;
                if(isAdmin) {
                    newMessage = getMessageScheme(Message, chatroomId, user, message, date);
                } else {
                    newMessage = getMessageScheme(Message, chatroomId, chatroomId, message, date);
                }
                var dateFormat = "DD.MM.YYYY HH:mm";
                var date = moment().format(dateFormat);
                newMessage.save().then(message => {
                    io.sockets.in(chatroomId).emit("messageSent", message);
                }).catch(error => console.log(error));
            }
        });
        socket.on("disconnect", () => {
            getUserChatrooms(socket).forEach(chatroomId => {
                socket.leave(chatroomId);
                delete chatrooms[chatroomId];
                socket.to(chatroomId).emit("userOffline", socket.id);
            });
        });

        function getMessageScheme(Message, chatroomId, username, message, date) {
            return new Message({chatroomId: chatroomId, username: username, message: message, date: date});
        }
        function getUserChatrooms(socket) {
            return Object.entries(chatrooms).reduce((ids, [id, chatroom]) => {
                if(chatroom.users[socket.id] != null) ids.push(id);
                return ids;
            }, []);
        }
    });
}