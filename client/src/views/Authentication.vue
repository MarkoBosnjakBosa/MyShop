<template>
    <div id="authentication" class="container-fluid">
        <navigation></navigation>
        <div class="authenticationForm">
            <form autocomplete="off" @submit.prevent="authenticateUser()">
                <div class="authenticationTitle">
					<h1>Authenticate</h1>
					<p>Please insert the authentication token to log in.</p>
					<hr>
				</div>
                <div class="mb-3">
                    <input type="text" id="authenticationToken" class="form-control" :class="{'errorField' : authenticationTokenError}" placeholder="Authentication token" v-model="authenticationToken" @focus="clearAuthenticationTokenStatus()" @keypress="clearAuthenticationTokenStatus()"/>
                    <small v-if="authenticationTokenError" class="errorInput">Please provide a valid authentication token!</small>
                </div>
                <div class="mb-3">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
                <div class="mb-3">
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue";
    import validation from "../components/Validation.vue";
    import route from "../components/Route.vue";
    var axios = require("axios");
	
    export default {
        name: "authentication",
        components: {
            navigation
        },
        data() {
            return {
                authenticationToken: "",
                authenticationTokenError: false
            }
        },
        methods: {
            authenticateUser() {
                this.clearAuthenticationTokenStatus();
                if(this.invalidAuthenticationToken) {
                    this.authenticationTokenError = true;
                    return;
                }
                var options = {headers: {["authentication"]: this.authenticationToken}};
                var username = this.$store.getters.isAuthenticated;
                var body = {username: username};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/authenticate", body, options).then(response => {
                    if(response.data.authenticated) {
                        this.authenticationToken = "";
                        this.authenticationTokenError = false;
                        var token = response.data.token;
                        var user = response.data.user;
                        var isAdmin = response.data.isAdmin;
                        this.$store.dispatch("login", {token, user, isAdmin});
                        this.$store.dispatch("clearAuthentication");
                        this.openHome();
                    } else {
                        this.authenticationTokenError = true;
                    }
                }).catch(error => console.log(error));
            },
            openHome() { 
                console.log("test");
				var isAdmin = this.$store.getters.isAdmin;
                console.log("isAdmin: " + isAdmin);
				if(isAdmin) route.methods.openProducts();
				else route.methods.openHome();
			},
            clearAuthenticationTokenStatus() { this.authenticationTokenError = false; }
        },
        computed: {
            invalidAuthenticationToken() { return validation.methods.invalidAuthenticationToken(this.authenticationToken); }
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