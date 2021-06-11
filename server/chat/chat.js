module.exports = function(io, models, moment) {
    const Message = models.Message;
    var chatrooms = {};

    io.on("connection", socket => {
        socket.on("userJoining", (username) => {
            if(!chatrooms.hasOwnProperty(username)) {
                chatrooms[username] = {users: {}};
            }
            socket.join(username);
            chatrooms[username].users[socket.id] = username;
            var query = {chatroomId: username};
            Message.find(query).then(messages => {
                socket.emit("userJoined", {messages: messages, users: chatrooms[username].users});
            }).catch(error => console.log(error));
        });
        socket.on("newMessage", (chatroomId, message) => {
            if(chatroomId && message) {
                var dateFormat = "DD.MM.YYYY HH:mm";
                var date = moment().format(dateFormat);
                var username = chatrooms[chatroomId].users[socket.id];
                var newMessage = getMessageScheme(Message, chatroomId, username, message, date);
                newMessage.save().then(message => {
                    io.sockets.in(chatroomId).emit("newMessage", message);
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