<template>
    <div id="contactSettings" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Contact Settings</h1>
                <form autocomplete="off" class="contactSettings" @submit.prevent="saveContactSettings()">
                    <div class="row">
                        <div class="mb-3 col-md-5">
                            <label for="latitude" class="form-label">Latitude:</label>
                            <input type="number" id="latitude" step="any" class="form-control" :class="{'errorField' : errors.latitudeError && submitting}" v-model="contactSettings.coordinates.lat" @focus="clearLatitudeStatus()" @keypress="clearLatitudeStatus()"/>
                            <small v-if="(errors.latitudeError || errors.longitudeError) && submitting" class="form-text errorInput">Please provide valid coordinates!</small>
                            <small v-if="errors.geolocationError" class="form-text errorInput">Geolocation is not provided by this browser!</small>
                        </div>
                        <div class="mb-3 col-md-5">
                            <label for="longitude" class="form-label">Longitude:</label>
                            <input type="number" id="longitude" step="any" class="form-control" :class="{'errorField' : errors.longitudeError && submitting}" v-model="contactSettings.coordinates.lng" @focus="clearLongitudeStatus()" @keypress="clearLongitudeStatus()"/>
                        </div>
                        <div class="mb-3 col-md-2">
                            <button type="button" class="btn btn-dark coordinates" @click="getCoordinates()">Coordinates</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="mb-3 col-md-8">
                            <label for="street" class="form-label">Street:</label>
                            <input type="text" id="street" class="form-control" :class="{'errorField' : errors.streetError && submitting}" v-model="contactSettings.street" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
                            <small v-if="(errors.streetError || errors.houseNumberError) && submitting" class="form-text errorInput">Please provide a valid street / house number!</small>
                        </div>
                        <div class="mb-3 col-md-4">
                            <label for="houseNumber" class="form-label">House number:</label>
                            <input type="number" id="houseNumber" min="0" class="form-control" :class="{'errorField' : errors.houseNumberError && submitting}" v-model="contactSettings.houseNumber" @focus="clearHouseNumberStatus()" @keypress="clearHouseNumberStatus()"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="mb-3 col-md-8">
                            <label for="city" class="form-label">City:</label>
                            <input type="text" id="city" class="form-control" :class="{'errorField' : errors.cityError && submitting}" v-model="contactSettings.city" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
                            <small v-if="(errors.cityError || errors.zipCodeError) && submitting" class="form-text errorInput">Please provide a valid city / zip code!</small>
                        </div>
                        <div class="mb-3 col-md-4">
                            <label for="zipCode" class="form-label">Zip code:</label>
                            <input type="number" id="zipCode" min="0" class="form-control" :class="{'errorField' : errors.zipCodeError && submitting}" v-model="contactSettings.zipCode" @focus="clearZipCodeStatus()" @keypress="clearZipCodeStatus()"/>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="country" class="form-label">Country:</label>
                        <input type="text" id="country" class="form-control" :class="{'errorField' : errors.countryError && submitting}" v-model="contactSettings.country" @focus="clearCountryStatus()" @keypress="clearCountryStatus()"/>
                        <small v-if="errors.countryError && submitting" class="form-text errorInput">Please provide a valid country!</small>
                    </div>
                    <div class="row">
                        <div class="mb-3 col-md-6">
                            <label for="mobileNumber" class="form-label">Mobile number:</label>
                            <div class="input-group">
                                <span class="input-group-text countryCodePrefix">+</span>
                                <input type="text" id="mobileNumber" class="form-control" :class="{'errorField' : errors.mobileNumberError && submitting}" v-model="contactSettings.mobileNumber" @focus="clearMobileNumberStatus()" @keypress="clearMobileNumberStatus()"/>
                            </div>
                            <small class="form-text text-muted">Please insert your mobile number with the country calling code.</small><br>
                            <small v-if="(errors.mobileNumberError || errors.emailError) && submitting" class="form-text errorInput">Please provide a valid mobile number / email!</small>
                        </div>
                        <div class="mb-3 col-md-6">
                            <label for="email" class="form-label">Email:</label>
                            <input type="text" id="email" class="form-control" :class="{'errorField' : errors.emailError && submitting}" v-model="contactSettings.email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
                        </div>
                    </div>
                    <div v-if="contactSettingsSaved" class="mb-3 contactSettingsSaved">Contact settings have been successfully saved!</div>
                    <div>
                        <button type="submit" class="btn btn-primary saveButton">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import checkLogin from "../../components/CheckLogin.vue";
    import navigation from "../../components/Navigation.vue";
    import sidebar from "../../components/Sidebar.vue";
    import validation from "../../components/Validation.vue";
    const axios = require("axios");
	
    export default {
        name: "contactSettings",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                submitting: false,
                contactSettings: {
                    _id: "",
                    coordinates: {
                        lat: "",
                        lng: ""
                    },
                    street: "",
                    houseNumber: "",
                    city: "",
                    zipCode: "",
                    country: "",
                    mobileNumber: "",
                    email: ""
                },
                errors: {
                    latitudeError: false,
                    longitudeError: false,
                    geolocationError: false,
                    streetError: false,
                    houseNumberError: false,
                    cityError: false,
                    zipCodeError: false,
                    countryError: false,
                    mobileNumberError: false,
                    emailError: false
                },
                contactSettingsSaved: false
            }
        },
        methods: {
            getContactSettings() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getContactSettings").then(response => {
                    this.contactSettings = response.data.contactSettings;
                }).catch(error => console.log(error));
            },
            saveContactSettings() {
                this.submitting = true;
                this.clearLatitudeStatus();
                this.clearLongitudeStatus();
                this.clearStreetStatus();
                this.clearHouseNumberStatus();
                this.clearCityStatus();
                this.clearZipCodeStatus();
                this.clearCountryStatus();
                this.clearEmailStatus();
                this.clearMobileNumberStatus();
                var allowSaving = true;
                if(this.invalidLatitude) {
                    this.errors.latitudeError = true;
                    allowSaving = false;
                }
                if(this.invalidLongitude) {
                    this.errors.longitudeError = true;
                    allowSaving = false;
                }
                if(this.invalidStreet) {
                    this.errors.streetError = true;
                    allowSaving = false;
                }
                if(this.invalidHouseNumber) {
                    this.errors.houseNumberError = true;
                    allowSaving = false;
                }
                if(this.invalidCity) {
                    this.errors.cityError = true;
                    allowSaving = false;
                }
                if(this.invalidZipCode) {
                    this.errors.zipCodeError = true;
                    allowSaving = false;
                }
                if(this.invalidCountry) {
                    this.errors.countryError = true;
                    allowSaving = false;
                }
                if(this.invalidMobileNumber) {
                    this.errors.mobileNumberError = true;
                    allowSaving = false;
                }
                if(this.invalidEmail) {
                    this.errors.emailError = true;
                    allowSaving = false;
                }
                if(!allowSaving) {
                    this.contactSettingsSaved = false;
                    return;
                }
                var body = {contactSettings: this.contactSettings};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/saveContactSettings", body).then(response => {
                    if(response.data.saved) {
                        this.contactSettings._id = response.data.id;
                        this.errors = {latitudeError: false, longitudeError: false, geolocationError: false, streetError: false, houseNumberError: false, cityError: false, zipCodeError: false, countryError: false, mobileNumberError: false, emailError: false};
                        this.submitting = false;
                        this.contactSettingsSaved = true;
                    } else {
                        var errorFields = response.data.errorFields;
                        if(errorFields.includes("latitude")) this.errors.latitudeError = true;
                        if(errorFields.includes("longitude")) this.errors.longitudeError = true;
                        if(errorFields.includes("street")) this.errors.streetError = true;
                        if(errorFields.includes("houseNumber")) this.errors.houseNumberError = true;
                        if(errorFields.includes("city")) this.errors.cityError = true;
                        if(errorFields.includes("zipCode")) this.errors.zipCodeError = true;
                        if(errorFields.includes("country")) this.errors.countryError = true;
                        if(errorFields.includes("mobileNumber")) this.errors.mobileNumberError = true;
                        if(errorFields.includes("email")) this.errors.emailError = true;
                        this.contactSettingsSaved = false;
                    }
                }).catch(error => console.log(error));
            },
            getCoordinates() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        this.contactSettings.coordinates.lat = position.coords.latitude;
                        this.contactSettings.coordinates.lng = position.coords.longitude;
                        this.errors.latitudeError = false;
                        this.errors.longitudeError = false
                    });
                } else {
                    this.errors.geolocationError = true;
                }
            },
            clearLatitudeStatus() { this.errors.latitudeError = false, this.contactSettingsSaved = false; },
            clearLongitudeStatus() { this.errors.longitudeError = false, this.contactSettingsSaved = false; },
            clearStreetStatus() { this.errors.streetError = false, this.contactSettingsSaved = false; },
            clearHouseNumberStatus() { this.errors.houseNumberError = false, this.contactSettingsSaved = false; },
            clearCityStatus() { this.errors.cityError = false; this.contactSettingsSaved = false; },
            clearZipCodeStatus() { this.errors.zipCodeError = false, this.contactSettingsSaved = false; },
            clearCountryStatus() { this.errors.countryError = false, this.contactSettingsSaved = false; },
            clearMobileNumberStatus() { this.errors.mobileNumberError = false, this.contactSettingsSaved = false; },
            clearEmailStatus() { this.errors.emailError = false, this.contactSettingsSaved = false; } 
        },
        computed: {
            invalidLatitude() { return validation.methods.invalidLatitude(this.contactSettings.coordinates.lat); },
            invalidLongitude() { return validation.methods.invalidLongitude(this.contactSettings.coordinates.lng); },
            invalidStreet() { return validation.methods.invalidStreet(this.contactSettings.street); },
            invalidHouseNumber() { return validation.methods.invalidHouseNumber(this.contactSettings.houseNumber); },
            invalidCity() { return validation.methods.invalidCity(this.contactSettings.city); },
            invalidZipCode() { return validation.methods.invalidZipCode(this.contactSettings.zipCode); },
            invalidCountry() { return validation.methods.invalidCountry(this.contactSettings.country); },
            invalidMobileNumber() { return validation.methods.invalidMobileNumber(this.contactSettings.mobileNumber); },
            invalidEmail() { return validation.methods.invalidEmail(this.contactSettings.email); }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
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
    .contactSettings {
        margin: auto;
        max-width: 900px;
    }
    .coordinates {
        margin-top: 30px;
        width: 100%;
    }
    .countryCodePrefix {
        background-color: #fff;
    }
    .saveButton {
        float: right;
    }
    .contactSettingsSaved {
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