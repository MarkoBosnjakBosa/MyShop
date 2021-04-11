<template>
    <div id="authentication" class="container-fluid">
        <navigation></navigation>
        <div class="authenticationForm">
            <form autocomplete="off" @submit.prevent="loginUser()">
                <div class="authenticationTitle">
					<h1>Authenticate</h1>
					<p>Please insert the authentication token to log in.</p>
					<hr>
				</div>
                <div class="form-group">
                    <input type="text" id="authenticationToken" class="form-control" :class="{'errorField' : authenticationTokenError}" placeholder="Authentication token" v-model="authenticationToken" @focus="clearAuthenticationTokenStatus()" @keypress="clearAuthenticationTokenStatus()"/>
                    <small v-if="authenticationTokenError" class="form-text errorInput">Please provide a valid authentication token!</small>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
                <div class="form-group">
                    <a :href="'mailto:' + adminEmail" class="btn btn-info" role="button">Contact the Admin team <i class="fas fa-envelope"></i></a>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    import Navigation from "@/components/Navigation.vue";
    var axios = require("axios");
	
    export default {
        name: "authentication",
        components: {
            Navigation
        },
        data() {
            return {
                adminEmail: process.env.VUE_APP_ADMIN_EMAIL,
                authenticationTokenError: false,
                authenticationToken: ""
            }
        },
        methods: {
            loginUser() {
                this.clearAuthenticationTokenStatus();
                if(this.invalidAuthenticationToken) {
                    this.authenticationTokenError = true;
                    return;
                }
                var options = {headers: {["authentication"]: this.authenticationToken}};
                var username = this.$store.getters.isAuthenticated;
                var body = {username: username, authenticationToken: this.authenticationToken};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/login", body, options).then(response => {
                    if(response.data.authentication && response.data.valid) {
                        const token = response.data.token;
                        const user = response.data.user;
                        const isAdmin = response.data.isAdmin;
                        this.$store.dispatch("login", {token, user, isAdmin});
                        this.$store.dispatch("clearAuthentication");
                        this.$router.push("/home");
                    } else {
                        this.authenticationTokenError = true;
                    }
                }).catch(error => console.log(error));
            },
            clearAuthenticationTokenStatus() { this.authenticationTokenError = false; }
        },
        computed: {
            invalidAuthenticationToken() { return this.authenticationToken === ""; }
        }
    }
</script>

<style scoped>
    .authenticationForm {
        margin: 0 auto;
        max-width: 500px;
        text-align: center;
    }
    .authenticationTitle {
        margin-top: 20px;
        text-align: left;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>