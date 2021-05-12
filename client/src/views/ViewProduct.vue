<template>
    <div id="viewProduct" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>{{product.title}}</h1>
                <div id="imagesCarousel" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#imagesCarousel" data-slide-to="0" class="active" data-interval="2000"></li>
                        <li v-for="(image, index) in product.images" :key="image._id" data-target="#imagesCarousel" :data-slide-to="index++" data-interval="2000"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="d-block w-100">
                        </div>
                        <div v-for="image in product.images" :key="image._id" class="carousel-item">
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
                <div id="productData">
                    <ul class="nav nav-tabs justify-content-center">
                        <li class="nav-item"><a id="mainNavTab" data-toggle="tab" href="#mainTab" class="nav-link active">Main</a></li>
                        <li class="nav-item"><a id="technicalDataNavTab" data-toggle="tab" href="#technicalDataTab" class="nav-link">Technical Data</a></li>
                        <li class="nav-item"><a id="reviewsNavTab" data-toggle="tab" href="#reviewsTab" class="nav-link">Reviews</a></li>
                    </ul>
                    <div class="tab-content">
                        <div id="mainTab" class="tab-pane fade active show">
                            <div class="row">
                                <div class="col-md-3">Description</div>
                                <div class="col-md-9">{{product.description}}</div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">Price</div>
                                <div class="col-md-9">{{product.price}} €</div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="number" id="selectedQuantity" min="1" class="form-control" v-model="selectedQuantity"/>
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-primary">Add to cart</button>
                                </div>
                            </div>
                        </div>
                        <div id="technicalDataTab" class="tab-pane fade">
                            <div v-for="technicalInformation in product.technicalData" :key="technicalInformation._id" class="row">
                                <div class="col-md-3">{{technicalInformation.title}}</div>
                                <div class="col-md-9">{{technicalInformation.value}}</div>
                            </div>
                        </div>
                        <div id="reviewsTab" class="tab-pane fade">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import checkLogin from "../components/CheckLogin.vue";
	import navigation from "../components/Navigation.vue";
	import sidebar from "../components/Sidebar.vue";
    import helper from "../components/Helper.vue"; 
	const axios = require("axios");
	
	export default {
		name: "viewProduct",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                productId: "",
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: "",
                    category: "",
                    technicalData: [],
                    primaryImage: "",
                    images: []
                },
                selectedQuantity: 1
			}
		},
        methods: {
            getProduct() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProduct/" + this.productId).then(response => {
                    this.product.title = response.data.product.title;
                    this.product.description = response.data.product.description;
                    this.product.price = helper.methods.createDecimalNumber(response.data.product.price.toString());
                    this.product.quantity = response.data.product.quantity;
                    this.product.category = response.data.product.category;
                    this.product.technicalData = response.data.product.technicalData;
                    this.product.primaryImage = response.data.product.primaryImage;
                    this.product.images = response.data.product.images;
                }).catch(error => console.log(error));
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.productId = this.$route.params.productId;
            this.getProduct();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #imagesCarousel, #productData {
        margin: 0 auto;
        max-width: 800px;
    }
    .d-block {
        height: 400px;
    }
    #technicalDataTab {
        word-wrap: break-word;
    }
</style>