<template>
    <div id="chat" class="container-fluid">
        <i class="fas fa-comments fa-2x chat" @click="displayChatBox()"></i>
        <div id="chatBox" style="display: none;">
            <div class="row">
                <div class="col-md-10">
                    <h3>Admin</h3>
                </div>
                <div class="col-md-2">
                    <i class="fas fa-times fa-2x hideChatBox" @click="hideChatBox()"></i>
                </div>
            </div>
            <hr>
            <div class="messages">
                <div v-for="message in messages" :key="message._id" class="message myMessage">
                    {{message.message}}
                </div>
            </div>
            <form autocomplete="off" @submit.prevent="sendMessage()">
                <div class="input-group">
                    <input type="text" class="form-control" :class="{'errorField' : newMessageError}" placeholder="New message..." v-model="newMessage" ref="first" @focus="clearNewMessageStatus()" @keypress="clearNewMessageStatus()">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import io from "socket.io-client";
    var axios = require("axios");

    export default {
        name: "chatroom",
        data() {
            return {
                socket: io(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT, {transports: ["websocket", "polling", "flashsocket"]}),
                username: this.$store.getters.getUser,
                isAdmin: false,
                messages: [],
                editing: null,
                onlineUsers: {},
                newMessageError: false,
                newMessage: "",
                typing: "",
            }
        },
        methods: {
            displayChatBox() {
                var chatBox = document.getElementById("chatBox");
                if (chatBox.style.display == "none") {
                    chatBox.style.display = "block";
                    this.joinChat();
                } else {
                    chatBox.style.display = "none";
                }
            },
            hideChatBox() {
                var chatBox = document.getElementById("chatBox");
                chatBox.style.display = "none";
            },
            joinChat() {
                if(this.username != "") {
                    this.socket.emit("userJoining", this.username);
                    this.socket.on("userJoined", data => {
                        this.messages = data.messages;
                        //this.onlineUsers = Object.fromEntries(Object.entries(data.users).filter(([socketId, username]) => username != this.username));
                        //this.socket.emit("newUser", this.chatroomId, this.username);
                    });
                    this.listen();
                }
            },
            listen() {
                this.socket.on("userOnline", user => {
                    if(user.username != this.username && !Object.values(this.onlineUsers).includes(user.username)) {
                        this.onlineUsers[user.socketId] = user.username;
                    }
                });
                this.socket.on("userOffline", socketId => {
                    delete this.onlineUsers[socketId];
                    this.typing = "";
                });
                this.socket.on("newMessage", message => this.messages = [...this.messages, message]);
                this.socket.on("editMessage", editedMessage => {
                    this.messages = this.messages.map(message => message._id == editedMessage._id ? editedMessage : message);
                    this.editing = null;
                });
                this.socket.on("deleteMessage", messageId => this.messages = this.messages.filter(message => message._id != messageId));
                this.socket.on("typing", user => this.typing = user);
                this.socket.on("stopTyping", () => this.typing = "");
            },
            sendMessage() {
                console.log("123");
                this.clearNewMessageStatus();
                if(this.invalidNewMessage) {
                    this.newMessageError = true;
                    return;
                }
                console.log("fsdfsd");
                this.socket.emit("newMessage", this.username, this.newMessage);
                this.newMessage = "";
                this.newMessageError = false;
            },
            enableEditing(message) {
                this.cachedMessage = Object.assign({}, message);
                this.editing = message._id;
            },
            disableEditing(message) { 
                Object.assign(message, this.cachedMessage);
                this.editing = null;
            },
            editMessage(messageId, message) {
                if(message) {
                    this.socket.emit("editMessage", messageId, message);
                }
            },
            deleteMessage(messageId) {
                this.socket.emit("deleteMessage", messageId);
            },
            isMyMessage(username) {
                if(username == this.username) {
                    return true;
                } else {
                    return false;
                }
            },
            scrollDown() {
                window.scroll({top: document.body.scrollHeight, behavior: "smooth"});
            },
            clearNewMessageStatus() { this.newMessageError = false; },
        },
        watch: {
            newMessage(value) {
                if(value) {
                    this.socket.emit("typing", this.chatroomId, this.username);
                } else {
                    this.socket.emit("stopTyping", this.chatroomId);
                }
            }
        },
        computed: {
            invalidNewMessage() { return this.newMessage == ""; }
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .chat {
        position: absolute;
        right: 20px;
        bottom: 20px;
        cursor: pointer;
    }
    #chatBox {
        position: fixed;
        bottom: 55px;
        right: 20px;
        padding: 10px;
        border: 1px solid #000;
        border-radius: 10px;
        background-color: #f2f2f2;
        z-index: 10;
    }
    .row {
        margin-bottom: -15px;
    }
    .hideChatBox {
        cursor: pointer;
    }
    .messages {
        width: 100%;
        min-height: 300px;
        border: 1px solid #000;
        border-radius: 10px;
        background-color: #fff;
        margin-bottom: 10px;
    }
    .message {
        margin: 5px;
        padding: 5px;
        border-radius: 10px;
    }
    .myMessage {
        background-color: #f2f2f2;
        text-align: right;
    }
    .otherMessage {
        background-color: #9999ff;
        color: #fff;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
</style>