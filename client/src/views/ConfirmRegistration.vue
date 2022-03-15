<template>
    <div id="confirmRegistration" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <div v-if="registrationConfirmed" class="confirmation">
                    <div class="alert alert-success" role="alert">Your registration has been confirmed!</div>
                    <button type="button" class="btn btn-dark" @click="openLogin()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
                </div>
                <div v-if="emailSent" class="confirmation">
                    <div class="alert alert-success" role="alert">Confirmation email sent!</div>
                </div>
                <div v-if="!registrationConfirmed && !emailSent" class="confirmation">
                    <div class="alert alert-danger" role="alert">Your registration could not be confirmed!</div>
                    <button type="button" class="btn btn-dark"  @click="sendConfirmationEmail()">Send confirmation email <i class="fas fa-envelope"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue";
    import sidebar from "../components/Sidebar.vue";
    import route from "../components/Route.vue"; 
    const axios = require("axios");

    export default {
        name: "confirmRegistration",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                username: "",
                confirmationToken: "",
                registrationConfirmed: false,
                emailSent: false
            }
        },
        methods: {
            getRegistrationConfirmation() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/confirm/registration?username=" + this.username + "&confirmationToken=" + this.confirmationToken).then(response => {
                    this.registrationConfirmed = response.data.confirmed;
                }).catch(error => console.log(error));
            },
            sendConfirmationEmail() {
                var body = {username: this.username};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/sendConfirmationEmail", body).then(response => {
                    this.emailSent = response.data.emailSent;
                }).catch(error => console.log(error));
            },
            openLogin() {
                route.methods.openLogin();
            }
        },
        created() {
            this.username = this.$route.query.username;
            this.confirmationToken = this.$route.query.confirmationToken;
            this.getRegistrationConfirmation();
        }
    }   
</script>

<style scoped>
    .confirmation {
        margin: auto;
        max-width: 600px;
        text-align: center;
        margin-top: 20px;
    }
</style>