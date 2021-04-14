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
                <button type="button" class="btn btn-danger" @click="setAuthentication(false)">Disable authentication</button>
                <small class="form-text">
                    Disable 2fa authentication.<br>
                    SMS authentication will not be required, when logging in.
                </small>
            </div>
            <div v-else>
                <button type="button" class="btn btn-primary" @click="setAuthentication(true)">Enable authentication</button>
                <small class="form-text">
                    Enable 2fa authentication.<br>
                    SMS authentication will be required, when logging in.
                </small>
                <form autocomplete="off" @submit.prevent="testAuthenticationToken()">
                    <div class="input-group">
                        <input type="text" id="authenticationTestToken" class="form-control" :class="{'errorField' : newMessageError}" placeholder="New message..." v-model="authenticationTestToken" @focus="clearNewMessageStatus()" @keypress="clearNewMessageStatus()"/>
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </div>
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
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/setAuthentication/", body).then(response => {
                    this.authenticationEnabled = response.data.authenticationEnabled;
                }).catch(error => console.log(error));
            },
            testAuthenticationToken() {
                var body = {username: this.username, authenticationTestToken: this.authenticationTestToken};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/testAuthenticationToken/", body).then(response => {
                    this.authenticationEnabled = response.data.authenticationEnabled;
                }).catch(error => console.log(error));
            },
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
</style>