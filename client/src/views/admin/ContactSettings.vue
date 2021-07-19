<template>
    <div id="contactSettings" class="container-fluid">
		<div class="d-flex" id="barsStyle">
			<sidebar></sidebar>
			<div id="pageStyle">
				<navigation></navigation>
                <h1>Contact Settings</h1>
                <form autocomplete="off" class="contactSettings" @submit.prevent="saveContactSettings()">
                    <div class="row">
                        <div class="mb-3 col-md-5">
                            <label for="latitude">Latitude:</label>
                            <input type="text" id="latitude" step="any" class="form-control" :class="{'errorField' : errors.latitudeError && submitting}" v-model="contactSettings.coordinates.lat" @focus="clearLatitudeStatus()" @keypress="clearLatitudeStatus()"/>
                            <small v-if="(errors.latitudeError || errors.longitudeError) && submitting" class="form-text errorInput">Please provide valid coordinates!</small>
                            <small v-if="errors.geolocationError" class="form-text errorInput">Geolocation is not provided by this browser!</small>
                        </div>
                        <div class="mb-3 col-md-5">
                            <label for="longitude">Longitude:</label>
                            <input type="number" id="longitude" step="any" class="form-control" :class="{'errorField' : errors.longitudeError && submitting}" v-model="contactSettings.coordinates.lng" @focus="clearLongitudeStatus()" @keypress="clearLongitudeStatus()"/>
                        </div>
                        <div class="mb-3 col-md-2">
                            <button type="button" class="btn btn-secondary coordinates" @click="getCoordinates()">Coordinates</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="mb-3 col-md-8">
                            <label for="street">Street:</label>
                            <input type="text" id="street" class="form-control" :class="{'errorField' : errors.streetError && submitting}" v-model="contactSettings.street" @focus="clearStreetAndHouseNumberStatus()" @keypress="clearStreetAndHouseNumberStatus()"/>
                            <small v-if="(errors.streetError || errors.houseNumberError) && submitting" class="form-text errorInput">Please provide a valid street / house number!</small>
                        </div>
                        <div class="mb-3 col-md-4">
                            <label for="houseNumber">House number:</label>
                            <input type="number" id="houseNumber" class="form-control" :class="{'errorField' : errors.houseNumberError && submitting}" v-model="contactSettings.houseNumber" @focus="clearStreetAndHouseNumberStatus()" @keypress="clearStreetAndHouseNumberStatus()"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="mb-3 col-md-8">
                            <label for="city">City:</label>
                            <input type="text" id="city" class="form-control" :class="{'errorField' : errors.cityError && submitting}" v-model="contactSettings.city" @focus="clearCityAndZipCodeStatus()" @keypress="clearCityAndZipCodeStatus()"/>
                            <small v-if="(errors.cityError || errors.zipCodeError) && submitting" class="form-text errorInput">Please provide a valid city / zip code!</small>
                        </div>
                        <div class="mb-3 col-md-4">
                            <label for="zipCode">Zip code:</label>
                            <input type="number" id="zipCode" class="form-control" :class="{'errorField' : errors.zipCodeError && submitting}" v-model="contactSettings.zipCode" @focus="clearCityAndZipCodeStatus()" @keypress="clearCityAndZipCodeStatus()"/>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="country" class="form-label">Country:</label>
                        <input type="text" id="country" class="form-control" :class="{'errorField' : errors.countryError && submitting}" v-model="contactSettings.country" @focus="clearCountryStatus()" @keypress="clearCountryStatus()"/>
                        <small v-if="errors.countryError && submitting" class="form-text errorInput">Please provide a valid country!</small>
                    </div>
                    <div v-if="contactSettingsSaved" class="mb-3 contactSettingsSaved">Contact settings have been successfully saved!</div>
                    <div>
                        <button type="submit" class="btn btn-primary submitButton">Submit</button>
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
	var axios = require("axios");
	
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
                    country: ""
                },
                errors: {
                    latitudeError: false,
                    longitudeError: false,
                    geolocationError: false,
                    streetError: false,
                    houseNumberError: false,
                    cityError: false,
                    zipCodeError: false,
                    countryError: false
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
                this.clearStreetAndHouseNumberStatus();
                this.clearCityAndZipCodeStatus();
                this.clearCountryStatus();
                var allowSubmit = true;
                if(this.invalidLatitude) {
                    this.errors.latitudeError = true;
                    allowSubmit = false;
                }
                if(this.invalidLongitude) {
                    this.errors.longitudeError = true;
                    allowSubmit = false;
                }
                if(this.invalidStreet) {
                    this.errors.streetError = true;
                    allowSubmit = false;
                }
                if(this.invalidHouseNumber) {
                    this.errors.houseNumberError = true;
                    allowSubmit = false;
                }
                if(this.invalidCity) {
                    this.errors.cityError = true;
                    allowSubmit = false;
                }
                if(this.invalidZipCode) {
                    this.errors.zipCodeError = true;
                    allowSubmit = false;
                }
                if(this.invalidCountry) {
                    this.errors.countryError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.contactSettingsSaved = false;
                    return;
                }
                var body = {contactSettings: this.contactSettings};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/saveContactSettings", body).then(response => {
                    if(response.data.saved) {
                        this.contactSettingsSaved = true;
                        this.contactSettings._id = response.data.id;
                        this.errors = {latitudeError: false, longitudeError: false, geolocationError: false, streetError: false, houseNumberError: false, cityError: false, zipCodeError: false, countryError: false};
						this.submitting = false;
                    } else {
                        var errorFields = response.data.errorFields;
                        if(errorFields.includes("latitude")) this.errors.latitudeError = true;
                        if(errorFields.includes("longitude")) this.errors.longitudeError = true;
                        if(errorFields.includes("street")) this.errors.streetError = true;
                        if(errorFields.includes("houseNumber")) this.errors.houseNumberError = true;
                        if(errorFields.includes("city")) this.errors.cityError = true;
                        if(errorFields.includes("zipCode")) this.errors.zipCodeError = true;
                        if(errorFields.includes("country")) this.errors.countryError = true;
                        this.contactSettingsSaved = false;
                    }
                }).catch(error => console.log(error));
            },
            getCoordinates() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        this.contactSettings.coordinates.lat = position.coords.latitude;
                        this.contactSettings.coordinates.lng = position.coords.longitude;
                    });
                } else {
                    this.errors.geolocationError = true;
                }
            },
            clearLatitudeStatus() { this.errors.latitudeError = false, this.contactSettingsSaved = false; },
            clearLongitudeStatus() { this.errors.longitudeError = false, this.contactSettingsSaved = false; },
            clearStreetAndHouseNumberStatus() { 
				this.errors.streetError = false; 
				this.errors.houseNumberError = false;
                this.contactSettingsSaved = false;
			},
			clearCityAndZipCodeStatus() { 
				this.errors.cityError = false; 
				this.errors.zipCodeError = false;
                this.contactSettingsSaved = false;
			},
			clearCountryStatus() { this.errors.countryError = false, this.contactSettingsSaved = false; }
        },
        computed: {
			invalidLatitude() { return validation.methods.invalidLatitude(this.contactSettings.coordinates.lat); },
			invalidLongitude() { return validation.methods.invalidLongitude(this.contactSettings.coordinates.lng); },
			invalidStreet() { return validation.methods.invalidStreet(this.contactSettings.street); },
			invalidHouseNumber() { return validation.methods.invalidHouseNumber(this.contactSettings.houseNumber); },
			invalidCity() { return validation.methods.invalidCity(this.contactSettings.city); },
			invalidZipCode() { return validation.methods.invalidZipCode(this.contactSettings.zipCode); },
			invalidCountry() { return validation.methods.invalidCountry(this.contactSettings.country); }
		},
        mounted() {
            checkLogin.methods.isLoggedIn();
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
        margin: 0 auto;
        max-width: 800px;
    }
    .coordinates {
        margin-top: 23px;
        width: 100%;
    }
    .submitButton {
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