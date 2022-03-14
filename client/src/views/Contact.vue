<template>
    <div id="contact" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Contact</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="messageNavTab" data-bs-toggle="tab" data-bs-target="#messageTab" class="nav-link active" role="tab">Message</button>
                    <button type="button" id="mapNavTab" data-bs-toggle="tab" data-bs-target="#mapTab" class="nav-link" role="tab">Map</button>
                </div>
                <div class="tab-content">
                    <div id="messageTab" class="tab-pane fade active show" role="tabpanel">
                        <form autocomplete="off" @submit.prevent="sendMessage()" novalidate>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="firstName" class="input-group-text">Full name</label>
                                    <input type="text" id="firstName" class="form-control" :class="{'errorField' : errors.firstNameError && submitting}" v-model="contact.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()"/>
                                    <input type="text" id="lastName" class="form-control" :class="{'errorField' : errors.lastNameError && submitting}" v-model="contact.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()"/>
                                </div>
                                <small v-if="(errors.firstNameError || errors.lastNameError) && submitting" class="form-text errorInput">Please provide a valid full name!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="email" class="input-group-text">Email</label>
                                    <input type="text" id="email" class="form-control" :class="{'errorField' : errors.emailError && submitting}" v-model="contact.email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
                                </div>
                                <small v-if="errors.emailError && submitting" class="form-text errorInput">Please provide a valid email!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="mobileNumber" class="input-group-text">Mobile number:</label>
                                    <span class="input-group-text countryCodePrefix">+</span>
                                    <input type="text" id="mobileNumber" class="form-control" :class="{'errorField' : errors.mobileNumberError && submitting}" v-model="contact.mobileNumber" @focus="clearMobileNumberStatus()" @keypress="clearMobileNumberStatus()"/>
                                </div>
                                <small class="form-text text-muted">Please insert your mobile number with the country calling code.</small><br>
                                <small v-if="errors.mobileNumberError && submitting" class="form-text errorInput">Please provide a valid mobile number!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="message" class="input-group-text">Message</label>
                                    <textarea id="message" class="form-control" :class="{'errorField' : errors.messageError && submitting}" v-model="contact.message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()"></textarea>
                                </div>
                                <small v-if="errors.messageError && submitting" class="form-text errorInput">Please provide a valid message!</small>
                            </div>
                            <div v-if="messageSubmitted" class="mb-3 submissionSuccessful">Your message has been successfully submitted!</div>
                            <div class="mb-3">
                                <button type="button" class="btn btn-danger" @click="resetMessage()">Reset</button>
                                <button type="button" class="btn btn-dark next" @click="toggleTab('map')">Next <i class="fas fa-angle-double-right"></i></button>               
                                <button type="button" class="btn btn-primary submit" @click="submitMessage()">Submit</button>
                            </div>
                        </form>
                        <div class="mb-3">
                            <h3>My Shop</h3>
                            <div v-if="contactSettings.street && contactSettings.houseNumber && contactSettings.zipCode && contactSettings.city && contactSettings.country" class="information">
                                <i class="fas fa-address-book"></i> {{contactSettings.street}} {{contactSettings.houseNumber}}, {{contactSettings.zipCode}} {{contactSettings.city}}, {{contactSettings.country}}
                            </div>
                            <div v-if="contactSettings.mobileNumber" class="information">
                                <i class="fas fa-phone"></i> +{{contactSettings.mobileNumber}}
                            </div>
                            <div v-if="contactSettings.email">
                                <i class="fas fa-envelope"></i> {{contactSettings.email}}
                            </div>
                        </div>
                    </div>
                    <div id="mapTab" class="tab-pane fade" role="tabpanel">
                        <div id="map" class="mb-3"></div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-dark" @click="toggleTab('message')"><i class="fas fa-angle-double-left"></i> Previous</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue";
    import sidebar from "../components/Sidebar.vue";
    import helper from "../components/Helper.vue";  
    import validation from "../components/Validation.vue";
    const axios = require("axios");
	
    export default {
        name: "contact",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                map: null,
                contactSettings: {
                    _id: "",
                    coordinates: {
                        lat: 0,
                        lng: 0
                    },
                    street: "",
                    houseNumber: 0,
                    city: "",
                    zipCode: 0,
                    country: "",
                    mobileNumber: "",
                    email: ""
                },
                submitting: false,
                contact: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    mobileNumber: "",
                    message: "",
                },
                errors: {
                    firstNameError: false,
                    lastNameError: false,
                    emailError: false,
                    mobileNumberError: false,
                    messageError: false
                },
                messageSubmitted: false
            }
        },
        methods: {
            getContactSettings() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getContactSettings").then(response => {
                    this.contactSettings = response.data.contactSettings;
                    this.loadGoogleMaps();
                }).catch(error => console.log(error));
            },
            submitMessage() {
                this.submitting = true;
                this.clearFirstNameStatus();
                this.clearLastNameStatus();
                this.clearEmailStatus();
                this.clearMobileNumberStatus();
                this.clearMessageStatus();
                var allowSubmission = true;
                if(this.invalidFirstName) {
                    this.errors.firstNameError = true;
                    allowSubmission = false;
                }
                if(this.invalidLastName) {
                    this.errors.lastNameError = true;
                    allowSubmission = false;
                }
                if(this.invalidEmail) {
                    this.errors.emailError = true;
                    allowSubmission = false;
                }
                if(this.invalidMobileNumber) {
                    this.errors.mobileNumberError = true;
                    allowSubmission = false;
                }
                if(this.invalidMessage) {
                    this.errors.messageError = true;
                    allowSubmission = false;
                }
                if(!allowSubmission) {
                    this.messageSubmitted = false;
                    return;
                }
                var body = {contact: this.contact};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/newContact", body).then(response => {
                    if(response.data.submitted) {
                        this.contact = {firstName: "", lastName: "", email: "", mobileNumber: "", message: ""};
                        this.errors = {firstNameError: false, lastNameError: false, emailError: false, mobileNumberError: false, messageError: false};
                        this.submitting = false;
                        this.messageSubmitted = true;
                    } else {
                        var errors = response.data.errors;
                        errors.forEach(element => {
                            this.errors[element + "Error"] = true;
                        });
                        this.messageSubmitted = false;
                    }
                }).catch(error => console.log(error));
            },
            resetMessage() {
                this.contact = {firstName: "", lastName: "", email: "", mobileNumber: "", message: ""};
                this.errors = {firstNameError: false, lastNameError: false, emailError: false, mobileNumberError: false, messageError: false};
                this.messageSubmitted = false;
            },
            loadGoogleMaps() {
                var googleMapsScript = document.createElement("script");
                googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=" + process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
                googleMapsScript.addEventListener("load", this.initializeMap);
                googleMapsScript.addEventListener("load", this.setLocation);
                document.head.appendChild(googleMapsScript);
            },
            initializeMap() {
                this.map = new google.maps.Map(document.getElementById("map"), {center: this.contactSettings.coordinates, zoom: 10});
                this.map.addListener("tilesloaded", function() {
                    var removableElements = document.querySelectorAll("#map div[style*='background-color: white']");
                    removableElements.forEach(removableElement => removableElement.remove());
                });
            },
            setLocation() {
                var icon = {url: require("../assets/images/GoogleMapsIcon.png"), scaledSize: new google.maps.Size(50, 50)};
                var location = new google.maps.Marker({position: this.contactSettings.coordinates, map: this.map, icon: icon});
                var infoWindow = new google.maps.InfoWindow({content: (this.contactSettings.street && this.contactSettings.houseNumber && this.contactSettings.city && this.contactSettings.zipCode && this.contactSettings.country) ? ("<h3 style='text-align: center'>MyShop</h3><div>" + this.contactSettings.street + " " + this.contactSettings.houseNumber + ", " + this.contactSettings.zipCode + " " + this.contactSettings.city + ", " + this.contactSettings.country + "</div>") : ("<h3 style='text-align: center'>MyShop</h3>")});
                location.addListener("mouseover", function() {
                    infoWindow.open(this.map, location);
                });
                location.addListener("mouseout", function() {
                    infoWindow.close();
                });
            },
            toggleTab(tab) { helper.methods.toggleTab(tab); },
            clearFirstNameStatus() { this.errors.firstNameError = false, this.messageSubmitted = false },
            clearLastNameStatus() { this.errors.lastNameError = false, this.messageSubmitted = false },
            clearEmailStatus() { this.errors.emailError = false, this.messageSubmitted = false },
            clearMobileNumberStatus() { this.errors.mobileNumberError = false, this.messageSubmitted = false },
            clearMessageStatus() { this.errors.messageError = false, this.messageSubmitted = false }
        },
        computed: {
            invalidFirstName() { return validation.methods.invalidFirstName(this.contact.firstName); },
            invalidLastName() { return validation.methods.invalidLastName(this.contact.lastName); },
            invalidEmail() { return validation.methods.invalidEmail(this.contact.email); },
            invalidMobileNumber() { return validation.methods.invalidMobileNumber(this.contact.mobileNumber); },
            invalidMessage() { return validation.methods.invalidMessage(this.contact.message); }
        },
        created() {
            this.getContactSettings();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .nav-tabs, #messageTab, #mapTab {
        margin: auto;
        max-width: 700px;
        margin-top: 20px;
    }
    .countryCodePrefix {
        background-color: #fff;
    }
    .next, .submit {
        float: right;
        margin-left: 5px;
    }
    .information {
        margin-bottom: 5px;
    }
    #map {
        height: 500px;
        margin-bottom: 20px;
    }
    .submissionSuccessful {
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