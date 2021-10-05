<template>
    <div id="home" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <div id="imagesCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        <button v-for="(image, index) in homeSettings.images" :key="image._id" type="button" data-bs-target="#imagesCarousel" :data-bs-slide-to="index" :class="{'active' : index == 0}" data-bs-interval="2000"></button>
                    </div>
                    <div v-if="homeSettings.images.length" class="carousel-inner">
                        <div v-for="(image, index) in homeSettings.images" :key="image._id" class="carousel-item" :class="{'active' : index == 0}">
                            <img :src="renderImage(image)" :alt="image.name" class="d-block w-100">
                        </div>
                    </div>
                    <div v-else class="carousel-inner">
                        <div class="carousel-item active">
                            <img :src="require('../assets/images/OnlineShopImage.jpg')" alt="Online shop image" class="d-block w-100">
                        </div>
                    </div>
                    <button type="button" class="carousel-control-prev" data-bs-target="#imagesCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="carousel-control-next" data-bs-target="#imagesCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
                <div class="container-fluid mb-3 introductionText">
                    <h1>MyShop</h1>
                    <h3 v-if="homeSettings.message" v-html="homeSettings.message"></h3>
                    <h3 v-else>Welcome to the best online shop in the world!</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue"; 
    import sidebar from "../components/Sidebar.vue";
    import helper from "../components/Helper.vue";
    const axios = require("axios");

    export default {
        name: "home",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                homeSettings: {
                    message: "",
                    images: []
                }
            }
        },
        methods: {
            getHomeSettings() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getHomeSettings").then(response => {
                    this.homeSettings.message = response.data.message;
                    this.homeSettings.images = response.data.images;
                }).catch(error => console.log(error));
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            }
        },
        created() {
            this.getHomeSettings();
        }
    }
</script>

<style scoped>
    #imagesCarousel {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .d-block {
        height: 500px;
    }
    .introductionText {
        text-align: center;
    }
    h1 {
        margin-bottom: 10px;
    }
</style>