<template>
    <div id="home" class="container-fluid">
        <div class="d-flex" id="barsDiv">
            <sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <div id="imagesCarousel" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li v-for="(image, index) in homeSettings.images" :key="image._id" data-target="#imagesCarousel" :data-slide-to="index" :class="{'active' : index == 0}" data-interval="2000"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div v-for="(image, index) in homeSettings.images" :key="image._id" class="carousel-item" :class="{'active' : index == 0}">
                            <img :src="renderImage(image)" :alt="image.name" class="d-block w-100">
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#imagesCarousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </a>
                    <a class="carousel-control-next" href="#imagesCarousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </a>
                </div>
                <div class="container-fluid introductionText">
                    <h1>MyShop</h1>
                    <h3 v-html="homeSettings.message"></h3>
                </div>
                <!--<div>
                    <a href="https://www.facebook.com/" target="_blank" class="fab fa-facebook"></a>
                    <a href="https://twitter.com/" target="_blank" class="fab fa-twitter"></a>
                    <a href="https://www.instagram.com/" target="_blank" class="fab fa-instagram"></a>
                </div>-->
                <div>
                    <p class="footer">Copyright © 2021 | Marko Bošnjak | All rights reserved</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    import navigation from "../components/Navigation.vue"; 
    import sidebar from "../components/Sidebar.vue";
    var axios = require("axios");

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
                if(image && !(image instanceof File)) {
                    return "data:" + image.contentType + ";base64," + (new Buffer.from(image.image)).toString("base64");
                } else {
                    return "";
                }
            }
        },
        mounted() {
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
        margin-bottom: 50px;
    }
    h1 {
        margin-bottom: 10px;
    }
    .footer {
        text-align: center;
        background: #000;
        color: #fff;
        padding: 10px;
        font-size: 12px;
    }
</style>