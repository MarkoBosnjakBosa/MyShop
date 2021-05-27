<template>
    <div id="contact" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Contact</h1>
                <div id="map"></div>
            </div>
        </div>
    </div>
</template>

<script>
	import navigation from "../components/Navigation.vue";
	import sidebar from "../components/Sidebar.vue";
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
                coordinates: {
                    lat: 50.932980,
                    lng: 7.040375
                }
			}
		},
        methods: {
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
            }
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
    #map {
        margin: auto;
        max-width: 800px;
        height: 800px;
    }
</style>