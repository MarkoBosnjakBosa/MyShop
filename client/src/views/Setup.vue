<template>
	<div id="setup" class="container-fluid">
		<navigation></navigation>
		<div class="setupDialog">
            <div class="setupTitle">
                <h1>Setup</h1>
                <p>
                    <span>Enable / disable authentication.</span>
                    <span v-if="authenticationEnabled" class="badge bg-primary text-light">Enabled</span>
                    <span v-else class="badge bg-danger text-light">Disabled</span>
                </p>
                <hr>
            </div>
            <div v-if="authenticationEnabled">
                <small class="form-text">
                    Disable 2fa authentication.<br>
                    SMS authentication will not be required, when logging in.
                </small>
                <button type="button" class="btn btn-danger" @click="setAuthentication(false)">Disable authentication</button>
            </div>
            <div v-else>
                <small class="form-text">
                    Enable 2fa authentication.<br>
                    SMS authentication will be required, when logging in.
                </small>
                <button type="button" class="btn btn-primary" @click="setAuthentication(true)">Enable authentication</button>
                <form autocomplete="off" @submit.prevent="verifyAuthentication()">
                    <div class="input-group">
                        <input type="text" id="authenticationTestToken" class="form-control" :class="{'errorField' : authenticationTestTokenError}" placeholder="Authentication test token" v-model="authenticationTestToken" @focus="clearAuthenticationTestTokenStatus()" @keypress="clearAuthenticationTestTokenStatus()"/>
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">Verify</button>
                        </div>
                    </div>
                    <small v-if="authenticationTestTokenError" class="form-text errorInput">Please provide a valid authentication test token!</small>
                </form>
            </div>
		</div>
	</div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import navigation from "@/components/Navigation.vue"; 
	var axios = require("axios");
	
	export default {
		name: "setup",
		components: {
            navigation
        },
		data() {
			return {
                username: this.$store.getters.getUser,
                authenticationEnabled: false,
                authenticationTestTokenError: false,
                authenticationTestToken: ""
			}
		},
        methods: {
            getAuthentication() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getAuthentication/" + this.username).then(response => {
                    this.authenticationEnabled = response.data.authenticationEnabled;
                }).catch(error => console.log(error));
            },
            setAuthentication(authenticationEnabled) {
                var body = {username: this.username, authenticationEnabled: authenticationEnabled};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/setAuthentication", body).then(response => {
                    this.authenticationEnabled = response.data.authenticationEnabled;
                }).catch(error => console.log(error));
            },
            verifyAuthentication() {
                this.clearAuthenticationTokenStatus();
                if(this.invalidAuthenticationTestToken) {
                    this.authenticationTestTokenError = true;
                    return;
                }
                var body = {username: this.username, authenticationTestToken: this.authenticationTestToken};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/verifyAuthentication", body).then(response => {
                    this.authenticationEnabled = response.data.authenticationEnabled;
                }).catch(error => console.log(error));
            },
            clearAuthenticationTestTokenStatus() { this.authenticationTestTokenError = false; }
        },
        computed: {
            invalidAuthenticationTestToken() { return validation.methods.invalidAuthenticationToken(this.authenticationTestToken); }
        },
        created() {
            this.getAuthentication();
        }
    }
</script>

<style scoped>
	.setupDialog {
		margin: 0 auto;
		max-width: 400px;
	}
	.setupTitle {
		margin-top: 20px;
	}
    .badge {
        float: right;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>