module.exports = function(io, models) {
    var chats = {};

    io.on("connection", socket => {
        socket.on("userJoined", (chatroomId, username) => {
            var queries = [];
            var messageQuery = {chatroomId: chatroomId};
            queries.push(function(callback) {
                Message.find(messageQuery).then(foundMessages => {
                    callback(null, foundMessages);
                }).catch(error => console.log(error));
            });
            var chatroomQuery = {_id: chatroomId};
            queries.push(function(callback) {
                Chatroom.findOne(chatroomQuery).then(chatroom => {
                    callback(null, chatroom);
                }).catch(error => console.log(error));
            });
            async.parallel(queries).then(results => {
                var messageResults = results[0];
                var chatroomResult = results[1];
                var currentChatroom = {};
                if(chatroomResult.type == "public") {
                    currentChatroom["name"] = chatroomResult.name;
                    currentChatroom["icon"] = chatroomResult.icon;
                }
                if(chatroomResult.type == "private") {
                    chatroomResult.participants.forEach(user => {
                        if(user != username) {
                            currentChatroom["name"] = user;
                            currentChatroom["icon"] = "";
                        }
                    });
                }
                if(!chatrooms.hasOwnProperty(chatroomId)) {
                    chatrooms[chatroomId] = {users: {}};
                }
                socket.emit("userJoined", {messages: messageResults, users: chatrooms[chatroomId].users, currentChatroom: currentChatroom});
            });
        });
    });
}