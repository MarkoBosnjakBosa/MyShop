<template>
    <div id="confirmRegistration" class="container-fluid">
        <navigation></navigation>
        <div v-if="registrationConfirmed" class="container confirmationDiv">
            <div class="alert alert-success" role="alert">Your registration has been confirmed!</div>
            <button type="button" class="btn btn-info"  @click="openLogin()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
        </div>
        <div v-else class="container confirmationDiv">
            <div class="alert alert-danger" role="alert">Your registration could not be confirmed!</div>
            <a :href="'mailto:' + adminEmail" class="btn btn-info" role="button">Contact the Admin team <i class="fas fa-envelope"></i></a>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    import Navigation from "@/components/Navigation.vue"; 
    var axios = require("axios");

    export default {
        name: "confirmRegistration",
        components: {
            Navigation
        },
        data() {
            return {
                adminEmail: process.env.VUE_APP_EMAIL_USER,
                registrationConfirmed: false
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
            openLogin() {
                this.$router.push("/login");
            }
        },
        mounted() {
            this.getRegistrationConfirmation();
        }
    }
</script>

<style scoped>
    .confirmationDiv {
        margin: 0 auto;
        max-width: 600px;
        text-align: center;
        margin-top: 20px;
    }
</style>