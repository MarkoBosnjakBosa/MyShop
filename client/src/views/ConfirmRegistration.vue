<template>
    <div id="confirmRegistration" class="container-fluid">
        <navigation></navigation>
        <div v-if="registrationConfirmed" class="container confirmation">
            <div class="alert alert-success" role="alert">Your registration has been confirmed!</div>
            <button type="button" class="btn btn-info"  @click="openLogin()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
        </div>
        <div v-if="emailSent" class="container confirmation">
            <div class="alert alert-success" role="alert">Confirmation email sent!</div>
        </div>
        <div v-if="!registrationConfirmed && !emailSent" class="container confirmation">
            <div class="alert alert-danger" role="alert">Your registration could not be confirmed!</div>
            <button type="button" class="btn btn-info"  @click="sendConfirmationEmail()">Send confirmation email <i class="fas fa-envelope"></i></button>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue";
    import route from "../components/Route.vue"; 
    var axios = require("axios");

    export default {
        name: "confirmRegistration",
        components: {
            navigation
        },
        data() {
            return {
                registrationConfirmed: false,
                emailSent: false
            }
        },
        methods: {
            getRegistrationConfirmation() {
                var username = this.$route.query.username;
                var acceptanceToken = this.$route.query.acceptanceToken;
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/confirm/registration?username=" + username + "&acceptanceToken=" + acceptanceToken).then(response => {
                    this.registrationConfirmed = response.data.confirmed;
                }).catch(error => console.log(error));
            },
            sendConfirmationEmail() {
                var username = this.$route.query.username;
                var body = {username: username};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/sendConfirmationEmail", body).then(response => {
                    this.emailSent = response.data.emailSent;
                }).catch(error => console.log(error));
            },
            openLogin() {
                route.methods.openLogin();
            }
        },
        mounted() {
            this.getRegistrationConfirmation();
        }
    }
</script>

<style scoped>
    .confirmation {
        margin: 0 auto;
        max-width: 600px;
        text-align: center;
        margin-top: 20px;
    }
</style>