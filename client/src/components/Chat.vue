<template>
    <div id="chat" class="container-fluid">
        <div v-if="userData.isAdmin">
            <div class="row">
                <div class="col-md-4">
                    <ul class="list-group">
                        <li v-for="onlineUser in onlineUsers" :key="onlineUser" :id="'user_' + onlineUser.user" class="list-group-item" @click="loadMessages(onlineUser.user)">{{onlineUser.user}}</li>
                    </ul>
                </div>
                <div v-if="displayMessages" class="col-md-8">
                    <div id="adminMessages">
                        <div v-if="!displayMessages.length" class="noMessages">No messages yet.</div>
                        <div v-for="message in displayMessages" :key="message._id" class="card" :class="message.username == userData.username ? 'adminMessage' : 'userMessage'">
                            <div class="card-header">
                                <div v-if="message.username != userData.username" class="username">{{message.username}}</div>
                                <div class="date">{{renderDate(message.date)}}</div>
                            </div>
                            <div class="card-body">
                                <div v-if="editing == message._id">
                                    <input type="text" class="form-control" v-model="message.message"/>	
                                </div>
                                <div v-else>
                                    {{message.message}}
                                </div>
                            </div>
                            <div v-if="message.username == userData.username" class="card-footer">
                                <div v-if="editing != message._id">
                                    <i class="fas fa-pencil-alt enableEditing" @click="enableEditing(message)"></i>
                                    <i class="fas fa-times-circle deleteMessage" @click="deleteMessage(message._id)"></i>
                                </div>
                                <div v-else>
                                    <i class="far fa-check-circle editMessage" @click="editMessage(message)"></i>
                                    <i class="far fa-times-circle disableEditing" @click="disableEditing(message)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <small v-if="typing" class="typing"><b>{{typing}}</b> is typing...</small>
                    <form autocomplete="off" @submit.prevent="sendMessage()">
                        <div class="input-group">
                            <input type="text" class="form-control" :class="{'errorField' : messageError}" placeholder="New message..." v-model="message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()">
                            <button type="submit" class="btn btn-primary">Send</button>
                            <button type="button" id="adminScrollDownButton" class="btn btn-light" @click="scrollDown('adminMessages')"><i id="adminScrollDownIcon" class="fas fa-arrow-down"></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-else>
            <i id="chatIcon" class="fas fa-comments fa-2x chat" @click="displayChatBox()"></i>
            <div id="chatBox" style="display: none;">
                <div class="row">
                    <div class="col-md-10">
                        <h3>Admin</h3>
                        <small v-if="typing" class="typing"><b>{{typing}}</b> is typing...</small>
                    </div>
                    <div class="col-md-2">
                        <i class="fas fa-times fa-2x hideChatBox" @click="hideChatBox()"></i>
                    </div>
                </div>
                <hr>
                <div id="messages">
                    <div v-if="!messages.length" class="noMessages">No messages yet.</div>
                    <div v-for="message in messages" :key="message._id" class="message" :class="message.username == userData.username ? 'myMessage' : 'otherMessage'">
                        <div>{{message.message}}</div>
                        <div class="userDate">{{renderDate(message.date)}}<i v-if="message.username == userData.username" class="fas fa-times deleteMessage" @click="deleteMessage(message._id)"></i></div>
                    </div>
                </div>
                <form autocomplete="off" @submit.prevent="sendMessage()">
                    <div class="input-group">
                        <input type="text" class="form-control" :class="{'errorField' : messageError}" placeholder="New message..." v-model="message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()">
                        <button type="submit" class="btn btn-primary">Send</button>
                        <button type="button" id="scrollDownButton" class="btn btn-light" @click="scrollDown('messages')"><i id="scrollDownIcon" class="fas fa-arrow-down"></i></button>
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
                onlineUsers: [],
                messages: [],
                chatId: "",
                editing: null,
                message: "",
                messageError: false,
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
                this.chatId = user;
                document.getElementById("user_" + this.chatId).classList.remove("unreadMessageList");
            },
            listen() {
                this.socket.on("adminJoined", (data) => this.onlineUsers = data.users);
                this.socket.on("userJoined", (data) => this.messages = data.messages);
                this.socket.on("userOnline", (data) => this.onlineUsers = [...this.onlineUsers, data.user]);
                this.socket.on("userOffline", (data) => this.onlineUsers = this.onlineUsers.filter(onlineUser => onlineUser.user = data.user));
                this.socket.on("messageSentToAdmin", (data) => {
                    var foundIndex = this.onlineUsers.findIndex(foundUser => foundUser.user == data.user);
                    if(foundIndex > -1) {
                        this.onlineUsers[foundIndex].messages = [...this.onlineUsers[foundIndex].messages, data.message];
                    } else {
                        this.onlineUsers = [...this.onlineUsers, data];
                    }
                    if(!data.myself) {
                        document.getElementById("user_" + data.user).classList.add("unreadMessageList");
                        if(document.getElementById("adminScrollDownButton")) {
                            document.getElementById("adminScrollDownButton").classList.add("unreadMessageButton");
                        }
                        if(document.getElementById("adminScrollDownIcon")) {
                            document.getElementById("adminScrollDownIcon").classList.add("unreadMessageIcon");
                        }
                    }
                });
                this.socket.on("messageSentToUser", (data) => {
                    this.messages = [...this.messages, data.message];
                    if(!data.myself) {
                        document.getElementById("chatIcon").classList.add("unreadMessageChat");
                        document.getElementById("scrollDownButton").classList.add("unreadMessageButton");
                        document.getElementById("scrollDownIcon").classList.add("unreadMessageIcon");
                    }
                });
                this.socket.on("messageEditedToAdmin", (data) => {
                    var foundIndex = this.onlineUsers.findIndex(foundUser => foundUser.user == data.user);
                    if(foundIndex > -1) {
                        this.onlineUsers[foundIndex].messages = this.onlineUsers[foundIndex].messages.map(message => message._id == data.message._id ? data.message : message);
                        this.editing = null;
                    }
                });
                this.socket.on("messageEditedToUser", (data) => {
                    this.messages = this.messages.map(message => message._id == data.message._id ? data.message : message);
                });
                this.socket.on("messageDeletedToAdmin", (data) => {
                    var foundIndex = this.onlineUsers.findIndex(foundUser => foundUser.user == data.user);
                    if(foundIndex > -1) {
                        this.onlineUsers[foundIndex].messages = this.onlineUsers[foundIndex].messages.filter(message => message._id != data.messageId);
                    }
                });
                this.socket.on("messageDeletedToUser", (data) => {
                    this.messages = this.messages.filter(message => message._id != data.messageId);
                });
                this.socket.on("typingStarted", (data) => {
                    if(this.userData.isAdmin) {
                        if(this.chatId == data.user) {
                            this.typing = data.user;
                        }
                    } else {
                        this.typing = data.user;
                    }
                });
                this.socket.on("typingStopped", (data) => {
                    if(this.userData.isAdmin) {
                        if(this.chatId == data.user) {
                            this.typing = "";
                        }
                    } else {
                        this.typing = "";
                    }
                });
            },
            sendMessage() {
                this.clearMessageStatus();
                if(this.invalidMessage) {
                    this.messageError = true;
                    return;
                }
                if(this.userData.isAdmin) {
                    this.socket.emit("sendMessage", this.chatId, this.userData.isAdmin, this.userData.username, this.message);
                } else {
                    this.socket.emit("sendMessage", this.userData.username, this.userData.isAdmin, this.userData.username, this.message);
                }
                this.message = "";
                this.messageError = false;
            },
            editMessage(message) {
                if(message._id && message.message) {
                    this.socket.emit("editMessage", this.chatId, message);
                }
            },
            deleteMessage(messageId) {
                var confirmed = confirm("Delete message?");
                if(confirmed) {
                    if(this.userData.isAdmin) {
                        this.socket.emit("deleteMessage", this.chatId, this.userData.isAdmin, messageId);
                    } else {
                        this.socket.emit("deleteMessage", this.userData.username, this.userData.isAdmin, messageId);
                    }
                }
            },
            scrollDown(type) {
                document.getElementById(type).scrollTop = document.getElementById(type).scrollHeight;
                if(type == "adminMessages") {
                    document.getElementById("user_" + this.chatId).classList.remove("unreadMessageList");
                    document.getElementById("adminScrollDownButton").classList.remove("unreadMessageButton");
                    document.getElementById("adminScrollDownIcon").classList.remove("unreadMessageIcon");
                } else {
                    document.getElementById("chatIcon").classList.remove("unreadMessageChat");
                    document.getElementById("scrollDownButton").classList.remove("unreadMessageButton");
                    document.getElementById("scrollDownIcon").classList.remove("unreadMessageIcon");
                }
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
            clearMessageStatus() { this.messageError = false; },
        },
        watch: {
            message(value) {
                if(value) {
                    if(this.userData.isAdmin) {
                        this.socket.emit("startTyping", this.chatId, this.userData.isAdmin, this.userData.username);
                    } else {
                        this.socket.emit("startTyping", this.userData.username, this.userData.isAdmin, this.userData.username);
                    }
                } else {
                    if(this.userData.isAdmin) {
                        this.socket.emit("stopTyping", this.chatId, this.userData.isAdmin, this.userData.username);
                    } else {
                        this.socket.emit("stopTyping", this.userData.username, this.userData.isAdmin, this.userData.username);
                    }
                }
            }
        },
        computed: {
            displayMessages() {
                if(this.chatId) {
                    var foundIndex = this.onlineUsers.findIndex(foundUser => foundUser.user == this.chatId);
                    if(foundIndex > -1) {
                        return this.onlineUsers[foundIndex].messages;
                    }
                }
            },
            invalidMessage() { return validation.methods.invalidMessage(this.message); }
        },
        beforeUnmount() {
            this.socket.emit("userLeaving");
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.userData = checkLogin.methods.getUserData();
            this.joinChat();
        }
    }
</script>

<style scoped>
    #adminMessages {
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
    .noMessages {
        text-align: center;
        margin-top: 10px;
    }
    .message {
        margin: 5px;
        padding: 5px;
        border-radius: 10px;
    }
    .adminMessage {
        text-align: right;
    }
    .myMessage {
        background-color: #f2f2f2;
        text-align: right;
    }
    .userMessage > .card-header, .otherMessage {
        background-color: #4d4dff;
        color: #fff;
    }
    .userDate {
        text-align: right;
        font-size: 10px;
    }
    .enableEditing, .editMessage {
        color: #008000;
        cursor: pointer;
    }
    .deleteMessage, .disableEditing {
        color: #ff0000;
        margin-left: 5px;
        cursor: pointer;
    }
    .unreadMessageList, .unreadMessageButton {
        border-color: #ff0000;
    }
    .unreadMessageChat, .unreadMessageIcon {
        color: #ff0000;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
</style>