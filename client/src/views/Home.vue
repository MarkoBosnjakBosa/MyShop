<template>
    <div id="home" class="container-fluid">
        <navigation></navigation>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    import Navigation from "@/components/Navigation.vue"; 
    var axios = require("axios");

    export default {
        name: "home",
        components: {
            Navigation
        },
        data() {
            return {
                artists: []
            }
        },
        methods: {
            getArtists() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getArtists").then(response => {
                    this.artists = response.data.artists;
                }).catch(error => console.log(error));
            },
            openPlayer(artistId) {
                this.$router.push("/player/" + artistId);
            }
        },
        created() {
            this.getArtists();
        }
    }
</script>

<style scoped>
    .homeIcon {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
    #artistsList {
        margin: 0 auto;
        max-width: 500px;
    }
    .artist {
        margin-left: 5px;
    }
    .list-group-item {
        cursor: pointer;
    }
    .noArtists {
        text-align: center;
    }
</style>