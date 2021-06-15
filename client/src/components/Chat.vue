<template>
    <div id="chat" class="container-fluid">
        <div  v-if="userData.isAdmin">
            <div class="row">
                <div class="col-md-4">
                    <ul class="list-group">
                        <li v-for="onlineUser in onlineUsers" :key="onlineUser" class="list-group-item" @click="joinChat(onlineUser)">{{onlineUser}}</li>
                    </ul>
                </div>
                <div class="col-md-8">
                    <div v-for="message in messages" :key="message._id">
                        {{message.message}}
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
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
                        <input type="text" class="form-control" :class="{'errorField' : messageError}" placeholder="New message..." v-model="message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import checkLogin from "../components/CheckLogin.vue";
    import validation from "../components/Validation.vue"; 
    import io from "socket.io-client";
    var axios = require("axios");

    export default {
        name: "chatroom",
        data() {
            return {
                socket: io(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT, {transports: ["websocket", "polling", "flashsocket"]}),
                userData: {
                    userLoggedIn: false,
                    username: "",
                    isAdmin: false
                },
                messages: [],
                onlineUsers: [],
                editing: null,
                messageError: false,
                message: "",
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
            joinChat(onlineUser) {
                if(this.userData.username != "") {
                    if(onlineUser != "" && this.userData.isAdmin) {
                        this.socket.emit("adminJoining", onlineUser, this.userData.username);
                    } else {
                        this.socket.emit("userJoining", this.userData.username, this.userData.isAdmin);
                    }
                    this.listen();
                }
            },
            listen() {
                this.socket.on("userJoined", data => this.messages = data.messages);
                this.socket.on("userOnline", user => {
                    if(this.userData.isAdmin && user != this.userData.username && !Object.values(this.onlineUsers).includes(user)) {
                        this.onlineUsers = [...this.onlineUsers, user];
                    }
                });
                this.socket.on("userOffline", socketId => {
                    delete this.onlineUsers[socketId];
                    this.typing = "";
                });
                this.socket.on("messageSent", message => this.messages = [...this.messages, message]);
                this.socket.on("editMessage", editedMessage => {
                    this.messages = this.messages.map(message => message._id == editedMessage._id ? editedMessage : message);
                    this.editing = null;
                });
                this.socket.on("deleteMessage", messageId => this.messages = this.messages.filter(message => message._id != messageId));
                this.socket.on("typing", user => this.typing = user);
                this.socket.on("stopTyping", () => this.typing = "");
            },
            sendMessage(chatroomId) {
                this.clearMessageStatus();
                if(this.invalidMessage) {
                    this.messageError = true;
                    return;
                }
                if(chatroomId != "" && this.userData.isAdmin) {
                    this.socket.emit("sendMessage", chatroomId, this.userData.isAdmin, this.userData.username, this.message);
                } else {
                    this.socket.emit("sendMessage", this.userData.username, this.userData.isAdmin, "", this.message);
                }
                this.message = "";
                this.messageError = false;
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
            clearMessageStatus() { this.messageError = false; },
        },
        watch: {
            message(value) {
                if(value) {
                    this.socket.emit("typing", this.chatroomId, this.username);
                } else {
                    this.socket.emit("stopTyping", this.chatroomId);
                }
            }
        },
        computed: {
            invalidMessage() { return validation.methods.invalidMessage(this.message); }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.userData = checkLogin.methods.getUserData();
            if(this.userData.isAdmin) this.joinChat();
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
        overflow-y: scroll;
        border: 1px solid #000;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
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