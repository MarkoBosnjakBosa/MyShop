<template>
    <div id="contact" class="container-fluid">
		<div class="d-flex" id="barsStyle">
			<div id="pageStyle">
				<navigation></navigation>
                <h1>Contact</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="messageNavTab" data-bs-toggle="tab" data-bs-target="#messageTab" class="nav-link active" role="tab">Message</button>
                    <button type="button" id="mapNavTab" data-bs-toggle="tab" data-bs-target="#mapTab" class="nav-link" role="tab">Map</button>
                </div>
                <div class="tab-content">
                    <div id="messageTab" class="tab-pane fade active show" role="tabpanel">
                        <form autocomplete="off" @submit.prevent="sendMessage()">
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="firstName" class="input-group-text">Full name</label>
                                    <input type="text" id="firstName" class="form-control" :class="{'errorField' : errors.firstNameError && submitting}" v-model="contact.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()">
                                    <input type="text" id="lastName" class="form-control" :class="{'errorField' : errors.lastNameError && submitting}" v-model="contact.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()">
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
                                    <label for="message" class="input-group-text">Message</label>
                                    <textarea id="message" class="form-control" :class="{'errorField' : errors.messageError && submitting}" v-model="contact.message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()"></textarea>
                                </div>
                                <small v-if="errors.messageError && submitting" class="form-text errorInput">Please provide a valid message!</small>
                            </div>
                            <div v-if="messageSubmitted" class="mb-3 submissionSuccessful">Your message has been successfully submitted!</div>
                            <div>
                                <button type="button" class="btn btn-danger" @click="resetMessage()">Reset</button>
                                <button type="button" class="btn btn-primary submitButton" @click="submitMessage()">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div id="mapTab" class="tab-pane fade" role="tabpanel">
                        <div id="map"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import navigation from "../components/Navigation.vue";
    import validation from "../components/Validation.vue"; 
	const axios = require("axios");
	
	export default {
		name: "contact",
		components: {
            navigation
        },
        data() {
			return {
                submitting: false,
                contact: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    message: "",
                },
                errors: {
                    firstNameError: false,
                    lastNameError: false,
                    emailError: false,
                    messageError: false
                },
                messageSubmitted: false,
                map: null,
                coordinates: {
                    lat: 50.932980,
                    lng: 7.040375
                }
			}
		},
        methods: {
            submitMessage() {
                this.submitting = true;
                this.clearFirstNameStatus();
                this.clearLastNameStatus();
                this.clearEmailStatus();
                this.clearMessageStatus();
                var allowSubmit = true;
                if(this.invalidFirstName) {
                    this.errors.firstNameError = true;
                    allowSubmit = false;
                }
                if(this.invalidLastName) {
                    this.errors.lastNameError = true;
                    allowSubmit = false;
                }
                if(this.invalidEmail) {
                    this.errors.emailError = true;
                    allowSubmit = false;
                }
                if(this.invalidMessage) {
                    this.errors.messageError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.messageSubmitted = false;
                    return;
                }
                var body = {contact: this.contact};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/contact", body).then(response => {
                    if(response.data.submitted) {
                        this.messageSubmitted = true;
                        this.contact = {firstName: "", lastName: "", email: "", message: ""};
                        this.errors = {firstNameError: false, lastNameError: false, emailError: false, messageError: false};
                    } else {
                        var errorFields = response.data.errorFields;
                        if(errorFields.includes("firstName")) this.errors.firstNameError = true;
                        if(errorFields.includes("lastName")) this.errors.lastNameError = true;
                        if(errorFields.includes("email")) this.errors.emailError = true;
                        if(errorFields.includes("message")) this.errors.messageError = true;
                        this.messageSubmitted = false;
                    }
                }).catch(error => console.log(error));
            },
            resetMessage() {
                this.contact = {firstName: "", lastName: "", email: "", message: ""};
                this.errors = {firstNameError: false, lastNameError: false, emailError: false, messageError: false};
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
                this.map = new google.maps.Map(document.getElementById("map"), {center: this.coordinates, zoom: 10});
                this.map.addListener("tilesloaded", function() {
                    var removableElements = document.querySelectorAll("#map div[style*='background-color: white']");
                    removableElements.forEach(removableElement => removableElement.remove());
                });
            },
            setLocation() {
                var icon = {url: require("../assets/images/GoogleMapsIcon.png"), scaledSize: new google.maps.Size(50, 50)};
                var location = new google.maps.Marker({position: this.coordinates, map: this.map, icon: icon});
                var infoWindow = new google.maps.InfoWindow({content: "<h3 style='text-align: center'>MyShop</h3><div>Henri-Dunant-Str. 71, Ostheim, Köln, Deutschland</div>"});
                location.addListener("mouseover", function() {
                    infoWindow.open(this.map, location);
                });
                location.addListener("mouseout", function() {
                    infoWindow.close();
                });
            },
            clearFirstNameStatus() { this.errors.firstNameError = false },
            clearLastNameStatus() { this.errors.lastNameError = false },
            clearEmailStatus() { this.errors.emailError = false },
            clearMessageStatus() { this.errors.messageError = false },
        },
        computed: {
            invalidFirstName() { return validation.methods.invalidFirstName(this.contact.firstName); },
            invalidLastName() { return validation.methods.invalidLastName(this.contact.lastName); },
            invalidEmail() { return validation.methods.invalidEmail(this.contact.email); },
            invalidMessage() { return validation.methods.invalidMessage(this.contact.message); }
        },
        mounted() {
            this.loadGoogleMaps();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #messageTab, #mapTab, .nav-tabs {
        margin: auto;
        max-width: 700px;
        margin-top: 20px;
    }
    #map {
        height: 700px;
    }
    .submitButton {
        float: right;
    }
    .submissionSuccessful {
        color: #008000;
        margin-bottom: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>