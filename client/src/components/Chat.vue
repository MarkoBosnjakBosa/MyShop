<template>
    <div id="chat" class="container-fluid">
        <div  v-if="userData.isAdmin">
            <div class="row">
                <div class="col-md-4">
                    <ul class="list-group">
                        <li v-for="onlineUser in onlineUsers" :key="onlineUser" class="list-group-item" @click="loadMessages(onlineUser.user)">{{onlineUser.user}}</li>
                    </ul>
                </div>
                <div v-if="messages.length" class="col-md-8">
                    <div class="adminMessages">
                        <div v-for="message in messages" :key="message._id" class="card">
                            <div class="card-header">
                                <div class="username">{{message.username}}</div>
                                <div class="date">{{message.date}}</div>
                            </div>
                            <div class="card-body">
                                {{message.message}}
                            </div>
                            <div class="card-footer"></div>
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
                <div id="messages">
                    <div v-for="message in messages" :key="message._id" class="message" :class="message.username == userData.username ? 'myMessage' : 'otherMessage'">
                        <div>{{message.message}}</div>
                        <div class="userDate">{{renderDate(message.date)}}</div>
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
    import moment from "moment";
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
                chatroomId: "",
                editing: null,
                messageError: false,
                message: "",
                typing: ""
            }
        },
        methods: {
            displayChatBox() {
                var chatBox = document.getElementById("chatBox");
                if (chatBox.style.display == "none") {
                    chatBox.style.display = "block";
                } else {
                    chatBox.style.display = "none";
                }
            },
            hideChatBox() {
                var chatBox = document.getElementById("chatBox");
                chatBox.style.display = "none";
            },
            joinChat() {
                if(this.userData.username != "") {
                    this.socket.emit("userJoining", this.userData.username, this.userData.isAdmin);
                    this.listen();
                }
            },
            loadMessages(user) {
                this.chatroomId = user;
                this.socket.emit("loadMessages", user);
            },
            listen() {
                this.socket.on("adminJoined", data => this.onlineUsers = data.users);
                this.socket.on("userJoined", data => this.messages = data.messages);
                this.socket.on("userOnline", data => this.onlineUsers = [...this.onlineUsers, data.user]);
                this.socket.on("messagesLoaded", data => this.messages = data.messages);
                this.socket.on("messageSent", data => this.messages = [...this.messages, data.message]);
                this.socket.on("editMessage", editedMessage => {
                    this.messages = this.messages.map(message => message._id == editedMessage._id ? editedMessage : message);
                    this.editing = null;
                });
                this.socket.on("deleteMessage", messageId => this.messages = this.messages.filter(message => message._id != messageId));
                this.socket.on("typing", user => this.typing = user);
                this.socket.on("stopTyping", () => this.typing = "");
            },
            sendMessage() {
                this.clearMessageStatus();
                if(this.invalidMessage) {
                    this.messageError = true;
                    return;
                }
                if(this.userData.isAdmin) {
                    this.socket.emit("sendMessage", this.chatroomId, this.userData.isAdmin, this.userData.username, this.message);
                } else {
                    this.socket.emit("sendMessage", this.userData.username, this.userData.isAdmin, "", this.message);
                }
                this.message = "";
                this.messageError = false;
            },
            renderDate(date) {
                if(date) {
                    var dateAndTime = date.split(" ");
                    var temporaryDateArray = dateAndTime[0].split(".");
                    var temporaryDate = temporaryDateArray[2] + "-" + temporaryDateArray[1] + "-" + temporaryDateArray[0];
                    var parsedDate = moment(temporaryDate);
                    var currentDate = moment().startOf("day");
                    if(parsedDate.isBefore(currentDate)) {
                        return dateAndTime[0];
                    } else {
                        return dateAndTime[1];
                    }
                } else {
                    return moment().format("HH:mm");
                }
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
            this.joinChat();
        }
    }
</script>

<style scoped>
    .adminMessages {
        width: 100%;
        height: 700px;
        overflow-y: scroll;
        overflow-x: hidden;
        border: 1px solid #000;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #fff;
        margin-bottom: 10px;
    }
    .card {
        margin-bottom: 10px;
    }
    .username {
        float: left;
    }
    .date {
        float: right;
    }
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
    #messages {
        width: 100%;
        height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
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
        background-color: #4d4dff;
        color: #fff;
    }
    .userDate {
        text-align: right;
        font-size: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
</style>