<template>
    <div id="authentication" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <form autocomplete="off" @submit.prevent="authenticateUser()">
                    <h1>Authenticate</h1>
                    <p>Please insert the authentication token to log in.</p>
                    <hr>
                    <div class="mb-3">
                        <input type="text" id="authenticationToken" class="form-control" :class="{'errorField' : authenticationTokenError}" placeholder="Authentication token" v-model="authenticationToken" @focus="clearAuthenticationTokenStatus()" @keypress="clearAuthenticationTokenStatus()"/>
                        <small v-if="authenticationTokenError" class="errorInput">Please provide a valid authentication token!</small>
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-dark" @click="sendAuthenticationToken()">Send token</button>
                        <button type="submit" class="btn btn-primary submit">Submit</button>
                    </div>
                    <div v-if="authenticationTokenSent" class="authenticationTokenSent">The authentication token has been sccessfully sent.</div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue";
    import sidebar from "../components/Sidebar.vue";
    import route from "../components/Route.vue";
    import validation from "../components/Validation.vue";
    const axios = require("axios");
	
    export default {
        name: "authentication",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                username: this.$store.getters.isAuthenticated,
                authenticationToken: "",
                authenticationTokenError: false,
                authenticationTokenSent: false
            }
        },
        methods: {
            checkLogin() {
                if(!this.username) route.methods.openLogin(); 
            },
            authenticateUser() {
                this.clearAuthenticationTokenStatus();
                if(this.invalidAuthenticationToken) {
                    this.authenticationTokenError = true;
                    return;
                }
                var options = {headers: {["authentication"]: this.authenticationToken}};
                var body = {username: this.username};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/authenticate", body, options).then(response => {
                    if(response.data.authenticated) {
                        this.authenticationToken = "";
                        this.authenticationTokenError = false, this.authenticationTokenSent = false;
                        var user = response.data.user;
                        var token = response.data.token;
                        var isAdmin = response.data.isAdmin;
                        this.$store.dispatch("login", {user, token, isAdmin});
                        this.$store.dispatch("clearAuthentication");
                        this.openHome();
                    } else {
                        this.authenticationTokenError = true;
                    }
                }).catch(error => console.log(error));
            },
            sendAuthenticationToken() {
                var body = {username: this.username};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/sendAuthenticationToken", body).then(response => {
                    if(response.data.sent) {
                        this.authenticationTokenSent = true;
                    }
                }).catch(error => console.log(error));
            },
            openHome() { 
                var isAdmin = this.$store.getters.isAdmin;
                if(isAdmin) route.methods.openProducts();
                else route.methods.openHome();
            },
            clearAuthenticationTokenStatus() { this.authenticationTokenError = false, this.authenticationTokenSent = false; }
        },
        computed: {
            invalidAuthenticationToken() { return validation.methods.invalidAuthenticationToken(this.authenticationToken); }
        },
        created() {
            this.checkLogin();
        }
    }
</script>

<style scoped>
    form {
        margin: auto;
        max-width: 500px;
        margin-top: 20px;
    }
    .submit {
        float: right;
    }
    .authenticationTokenSent {
        color: #008000;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>