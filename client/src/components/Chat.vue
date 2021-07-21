<template>
    <div id="chat" class="container-fluid">
        <div v-if="userData.isAdmin">
            <div class="row">
                <div class="col-md-4">
                    <h3 v-if="onlineUsers.length" class="onlineUsers">Online</h3>
                    <ul class="list-group">
                        <li v-for="onlineUser in onlineUsers" :key="onlineUser" class="list-group-item d-flex justify-content-between align-items-center" @click="loadMessages(onlineUser.user)">
                            <span :id="'user_' + onlineUser.user">{{onlineUser.user}}</span><i :id="'messageStatus_'  + onlineUser.user" class="fa fa-eye"></i>
                        </li>
                    </ul>
                    <h3 class="findUser">Find user</h3>
                    <form autocomplete="off" @submit.prevent="findUser()">
                        <div class="input-group">
                            <input type="text" id="findUser" class="form-control" :class="{'errorField' : errors.foundUserError}" placeholder="Find user..." v-model="foundUser" @focus="clearFoundUserStatus()" @keypress="clearFoundUserStatus()">
                            <button type="submit" class="btn btn-primary">Find</button>
                        </div>
                    </form>
                    <ul class="list-group offlineUsers">
                        <li v-for="offlineUser in offlineUsers" :key="offlineUser" class="list-group-item d-flex justify-content-between align-items-center" @click="loadMessages(offlineUser.user)">
                            {{offlineUser.user}}<i class="fa fa-times" @click="removeUser(offlineUser.user)"></i>
                        </li>
                    </ul>
                </div>
                <div v-if="displayMessages" class="col-md-8">
                    <h3 class="chat">{{chatId}}</h3>
                    <div id="adminMessages" @click="readMessage()">
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
                                <div v-else>{{message.message}}</div>
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
                    <form autocomplete="off" @submit.prevent="sendMessage()" @click="readMessage()">
                        <div class="input-group">
                            <input type="text" id="message" class="form-control" :class="{'errorField' : errors.messageError}" placeholder="New message..." v-model="message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()">
                            <button type="submit" class="btn btn-primary">Send</button>
                            <button type="button" class="btn btn-dark" @click="scrollDown('adminMessages')"><i id="adminScrollDownIcon" class="fas fa-arrow-down"></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-else>
            <i id="chatIcon" class="fas fa-comments fa-2x" @click="displayChatBox()"></i>
            <div id="chatBox" style="display: none;">
                <div class="row informationRow">
                    <div class="col-md-10">
                        <h3 class="informationTitle">Admin</h3>
                        <small v-if="typing" class="typing"><b>{{typing}}</b> is typing...</small>
                    </div>
                    <div class="col-md-2">
                        <i class="fas fa-times fa-2x hideChatBox" @click="hideChatBox()"></i>
                    </div>
                </div>
                <hr>
                <div id="messages" @click="readMessage()">
                    <div v-if="!messages.length" class="noMessages">No messages yet.</div>
                    <div v-for="message in messages" :key="message._id" class="message" :class="message.username == userData.username ? 'myMessage' : 'otherMessage'">
                        <div>{{message.message}}</div>
                        <div class="userDate">{{renderDate(message.date)}}<i v-if="message.username == userData.username" class="fas fa-times deleteMessage" @click="deleteMessage(message._id)"></i></div>
                    </div>
                </div>
                <form v-if="adminOnline" autocomplete="off" @submit.prevent="sendMessage()" @click="readMessage()">
                    <div class="input-group">
                        <input type="text" id="message" class="form-control" :class="{'errorField' : errors.messageError}" placeholder="New message..." v-model="message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()">
                        <button type="submit" class="btn btn-primary">Send</button>
                        <button type="button" class="btn btn-secondary"><i id="messageStatus" class="fa fa-eye"></i></button>
                        <button type="button" class="btn btn-dark" @click="scrollDown('messages')"><i id="scrollDownIcon" class="fas fa-arrow-down"></i></button>
                    </div>
                </form>
                <div v-else>The admin is not online.</div>
            </div>
        </div>
    </div>
</template>

<script>
    import checkLogin from "../components/CheckLogin.vue";
    import route from "../components/Route.vue"; 
    import validation from "../components/Validation.vue"; 
    import io from "socket.io-client";
    import moment from "moment";
    var axios = require("axios");

    export default {
        name: "chat",
        data() {
            return {
                socket: io(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT, {transports: ["websocket", "polling", "flashsocket"]}),
                userData: {
                    userLoggedIn: false,
                    username: "",
                    isAdmin: false
                },
                users: [],
                adminOnline: false,
                messages: [],
                chatId: "",
                message: "",
                foundUser: "",
                editing: null,
                typing: "",
                errors: {
                    messageError: false,
                    foundUserError: false
                }
            }
        },
        methods: {
            displayChatBox() {
                var chatBox = document.getElementById("chatBox");
                if(chatBox.style.display == "none") {
                    chatBox.style.display = "block";
                    this.$forceUpdate();
                    this.readMessage();
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
                this.readMessage();
            },
            listen() {
                this.socket.on("adminOnline", (data) => {
                    if(data.isAdmin) {
                        this.users = data.users;
                    } else {
                        this.adminOnline = true;
                    }
                });
                this.socket.on("adminOffline", () => {
                    this.adminOnline = false;
                    this.message = "";
                });
                this.socket.on("userOnline", (data) => {
                    if(data.isAdmin) {
                        if(data.exists) {
                            var foundIndex = this.users.findIndex(foundUser => foundUser.user == data.user);
                            if(foundIndex > -1) {
                                this.users[foundIndex].isOnline = true;
                            }
                        } else {
                            this.users = [...this.users, data.user];
                        }
                    } else {
                        this.messages = data.messages;
                        this.adminOnline = data.adminOnline;
                    }
                });
                this.socket.on("userOffline", (data) => {
                    this.users = this.users.filter(user => user.user != data.user);
                    this.message = "";   
                });
                this.socket.on("messageSent", (data) => {
                    if(data.isAdmin) {
                        var foundIndex = this.users.findIndex(foundUser => foundUser.user == data.user);
                        if(foundIndex > -1) {
                            this.users[foundIndex].messages = [...this.users[foundIndex].messages, data.message];
                        } else {
                            this.users = [...this.users, data];
                        }
                        if(!data.myself) {
                            document.getElementById("user_" + data.user).classList.add("unreadMessage");
                        } else {
                            this.toggleMessageStatus("unread", data.user);
                        }
                    } else {
                        this.messages = [...this.messages, data.message];
                        if(!data.myself) {
                            document.getElementById("chatIcon").classList.add("unreadMessage");
                        } else {
                            this.toggleMessageStatus("unread", data.user);
                        }
                    }
                });
                this.socket.on("messageEdited", (data) => {
                    if(data.isAdmin) {
                        var foundIndex = this.users.findIndex(foundUser => foundUser.user == data.user);
                        if(foundIndex > -1) {
                            this.users[foundIndex].messages = this.users[foundIndex].messages.map(message => message._id == data.message._id ? data.message : message);
                            this.editing = null;
                        }
                    } else {
                        this.messages = this.messages.map(message => message._id == data.message._id ? data.message : message);
                    }
                });
                this.socket.on("messageDeleted", (data) => {
                    if(data.isAdmin) {
                        var foundIndex = this.users.findIndex(foundUser => foundUser.user == data.user);
                        if(foundIndex > -1) {
                            this.users[foundIndex].messages = this.users[foundIndex].messages.filter(message => message._id != data.messageId);
                        }
                    } else {
                        this.messages = this.messages.filter(message => message._id != data.messageId);
                    }
                });
                this.socket.on("messageRead", (data) => {
                     if(this.userData.isAdmin) {
                        if(this.chatId == data.user) {
                            this.toggleMessageStatus("read", data.user);
                        }
                    } else {
                        this.toggleMessageStatus("read", data.user);
                    }
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
                this.socket.on("closeTab", () => {
                    route.methods.openPageNotFound();
                });
            },
            sendMessage() {
                this.clearMessageStatus();
                if(this.invalidMessage) {
                    this.errors.messageError = true;
                    return;
                }
                if(this.userData.isAdmin) {
                    this.socket.emit("sendMessage", this.chatId, this.userData.isAdmin, this.userData.username, this.message);
                } else {
                    this.socket.emit("sendMessage", this.userData.username, this.userData.isAdmin, this.userData.username, this.message);
                }
                this.message = "";
                this.errors.messageError = false;
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
            readMessage() {
                if(this.userData.isAdmin) {
                    if(document.getElementById("user_" + this.chatId)) {
                        document.getElementById("user_" + this.chatId).classList.remove("unreadMessage");
                        this.socket.emit("readMessage", this.chatId, this.userData.isAdmin, this.userData.username);
                    }
                } else {
                    document.getElementById("chatIcon").classList.remove("unreadMessage");
                    this.socket.emit("readMessage", this.userData.username, this.userData.isAdmin, this.userData.username);
                }
            },
            findUser() {
                this.clearFoundUserStatus();
                if(this.invalidFoundUser) {
                    this.errors.foundUserError = true;
                    return;
                }
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/findUser/" + this.foundUser).then(response => {
                    if(response.data.exists) {
                        this.users = [...this.users, response.data.user];
                        this.foundUser = "";
                        this.errors.foundUserError = false;
                    } else {
                        this.errors.foundUserError = true;
                    }
                }).catch(error => console.log(error));
            },
            removeUser(user) {
                axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/removeUser/" + user).then(response => {
                    this.users = this.users.filter(user => user.user != response.data.user);
                    this.message = "";
                }).catch(error => console.log(error));
            },
            toggleMessageStatus(status, user) {
                var statusClass = "";
                if(document.getElementById("messageStatus_" + user)) {
                    statusClass = document.getElementById("messageStatus_" + user).className;
                } else {
                    if(document.getElementById("messageStatus")) {
                        statusClass = document.getElementById("messageStatus").className;
                    }
                }
                if(status == "read") {
                    if(statusClass.includes("fa-eye-slash")) {
                        if(this.userData.isAdmin) {
                            document.getElementById("messageStatus_" + user).classList.remove("fa-eye-slash");
                            document.getElementById("messageStatus_" + user).classList.add("fa-eye");
                        } else {
                            document.getElementById("messageStatus").classList.remove("fa-eye-slash");
                            document.getElementById("messageStatus").classList.add("fa-eye");
                        }
                    }
                } else {
                    if(statusClass.includes("fa-eye")) {
                        if(this.userData.isAdmin) {
                            document.getElementById("messageStatus_" + user).classList.remove("fa-eye");
                            document.getElementById("messageStatus_" + user).classList.add("fa-eye-slash");
                        } else {
                            document.getElementById("messageStatus").classList.remove("fa-eye");
                            document.getElementById("messageStatus").classList.add("fa-eye-slash");
                        }
                    }
                }
			},
            scrollDown(type) {
                document.getElementById(type).scrollTop = document.getElementById(type).scrollHeight;
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
            clearMessageStatus() { this.errors.messageError = false; },
            clearFoundUserStatus() { this.errors.foundUserError = false; }
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
            onlineUsers() {
                return this.users.filter(user => user.isOnline);
            },
            offlineUsers() {
                return this.users.filter(user => !user.isOnline);
            },
            displayMessages() {
                if(this.chatId) {
                    var foundIndex = this.users.findIndex(foundUser => foundUser.user == this.chatId);
                    if(foundIndex > -1) {
                        return this.users[foundIndex].messages;
                    }
                }
            },
            invalidMessage() { return validation.methods.invalidMessage(this.message); },
            invalidFoundUser() { return validation.methods.invalidFoundUser(this.foundUser); }
        },
        updated() {
            if(document.getElementById("adminMessages")) {
                this.scrollDown("adminMessages");
            }
            if(document.getElementById("messages")) {
                this.scrollDown("messages");
            }
        },
        beforeUnmount() {
            this.socket.emit("userLeaving");
        },
        created() {
            checkLogin.methods.isLoggedIn();
            this.userData = checkLogin.methods.getUserData();
            this.joinChat();
        }
    }
</script>

<style scoped>
    #adminMessages {
        width: 100%;
        height: 650px;
        overflow-y: scroll;
        overflow-x: hidden;
        border: 1px solid #000;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #fff;
        margin-bottom: 5px;
    }
    .adminMessage {
        float: right;
        min-width: 50%;
        max-width: 75%;
        word-wrap: break-word;
        text-align: right;
    }
    .userMessage {
        float: left;
        min-width: 50%;
        max-width: 75%;
        word-wrap: break-word;
    }
    .card {
        clear: both;
        margin: 5px;
        margin-bottom: 10px;
    }
    .userMessage > .card-header {
        background-color: #4d4dff;
        color: #fff;
    }
    .username {
        float: left;
    }
    .date {
        float: right;
    }
    #chatIcon {
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
    .hideChatBox {
        cursor: pointer;
    }  
    .informationRow {
        margin-bottom: -15px;
    }
    .informationTitle {
        margin-bottom: 0px;
    }
    #messages {
        width: 350px;
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
        float: right;
        min-width: 50%;
        max-width: 75%;
        word-wrap: break-word;
        text-align: right;
        padding: 10px;
        background-color: #f2f2f2;
    }
    .otherMessage {
        float: left;
        min-width: 50%;
        max-width: 75%;
        word-wrap: break-word;
        padding: 10px;
        background-color: #4d4dff;
        color: #fff;
    }
    .noMessages {
        text-align: center;
        margin-top: 10px;
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
    .unreadMessage {
        color: #ff0000;
    }
    .onlineUsers, .chat {
        text-align: center;
    }
    .findUser {
        text-align: center;
        margin-top: 10px;
    }
    .offlineUsers {
        margin-top: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
</style>