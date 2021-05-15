<template>
    <div id="viewProduct" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>{{product.title}}</h1>
                <div id="imagesCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#imagesCarousel" data-bs-slide-to="0" class="active" data-bs-interval="2000"></button>
                        <button v-for="(image, index) in product.images" :key="image._id" type="button" data-bs-target="#imagesCarousel" :data-bs-slide-to="++index" data-bs-interval="2000"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="d-block w-100">
                        </div>
                        <div v-for="image in product.images" :key="image._id" class="carousel-item">
                            <img :src="renderImage(image)" :alt="image.name" class="d-block w-100">
                        </div>
                    </div>
                    <button type="button" class="carousel-control-prev" data-bs-target="#imagesCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="carousel-control-next" data-bs-target="#imagesCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
                <div id="productData">
                    <div class="nav nav-tabs justify-content-center" role="tablist">
                        <button type="button" id="mainNavTab" data-bs-toggle="tab" data-bs-target="#mainTab" class="nav-link active" role="tab">Main</button>
                        <button type="button" id="reviewsNavTab" data-bs-toggle="tab" data-bs-target="#reviewsTab" class="nav-link" role="tab">Reviews</button>
                    </div>
                    <div class="tab-content">
                        <div id="mainTab" class="tab-pane fade active show" role="tabpanel">
                            <div class="row">
                                <div class="col-md-6 price"><b>Price: {{product.price}} €</b></div>
                                <div class="col-md-6">
                                    <div class="mb-3 input-group">
                                        <input type="number" id="selectedQuantity" min="1" class="form-control" v-model="product.selectedQuantity"/>
                                        <div class="input-group-append">
                                            <button type="button" class="btn btn-primary" @click="addToShoppingCart()">Add to cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 titleColumn"><b>Description</b></div>
                                <div class="col-md-6 valueColumn">{{product.description}}</div>
                            </div>
                            <div v-for="technicalInformation in product.technicalData" :key="technicalInformation._id" class="row">
                                <div class="col-md-6 titleColumn"><b>{{technicalInformation.title}}</b></div>
                                <div class="col-md-6 valueColumn">{{technicalInformation.value}}</div>
                            </div>
                        </div>
                        <div id="reviewsTab" class="tab-pane fade" role="tabpanel">
                            <div class="addReview" @click="toggleReview()">Add review <i id="reviewIcon" class="fas fa-plus"></i></div>
                            <div id="review" class="hide">
                                <textarea class="form-control" rows="5" v-model="comment"></textarea>
                                <button type="button" class="btn btn-primary reviewButton">Add review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
                    _id: "",
                    title: "",
                    description: "",
                    price: "",
                    quantity: "",
                    category: "",
                    technicalData: [],
                    primaryImage: "",
                    images: [],
                    selectedQuantity: 1
                }
			}
		},
        methods: {
            getProduct() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProduct/" + this.productId).then(response => {
                    this.product._id = response.data.product._id;
                    this.product.title = response.data.product.title;
                    this.product.description = response.data.product.description;
                    this.product.price = helper.methods.formatNumber(response.data.product.price.toString());
                    this.product.quantity = response.data.product.quantity;
                    this.product.category = response.data.product.category;
                    this.product.technicalData = response.data.product.technicalData;
                    this.product.primaryImage = response.data.product.primaryImage;
                    this.product.images = response.data.product.images;
                    this.product.selectedQuantity = 1;
                }).catch(error => console.log(error));
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            },
            addToShoppingCart() {
                var product = this.product;
                if(product.selectedQuantity > 0) {
                    this.$store.dispatch("addToShoppingCart", product);
                    this.product.selectedQuantity = 1;
                }
            },
            toggleReview() {
                var review = document.getElementById("review");
                var reviewIcon = document.getElementById("reviewIcon"); 
                if(review.classList.contains("hide")) {
                    review.classList.remove("hide");
                    review.classList.add("show");
                    reviewIcon.classList.remove("fa-plus");
                    reviewIcon.classList.add("fa-minus");
                } else {
                    review.classList.remove("show");
                    review.classList.add("hide");
                    reviewIcon.classList.remove("fa-minus");
                    reviewIcon.classList.add("fa-plus");
                }
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
    #imagesCarousel {
        margin: 0 auto;
        max-width: 800px;
    }
    .d-block {
        height: 400px;
    }
    #productData {
        margin: 0 auto;
        max-width: 600px;
        margin-top: 20px;
    }
    .tab-content {
        margin-top: 20px;
    }
    .price {
        padding-top: 7px;
        text-align: right;
    }
    .titleColumn {
        border: 1px #808080 solid;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: right;
        word-wrap: break-word;
    }
    .valueColumn {
        border: 1px #808080 solid;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .addReview {
        border: 1px #808080 solid;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
    }
    .fas.fa-plus, .fas.fa-minus {
        float: right;
        padding-top: 5px;
    }
    #review {
        margin-top: 10px;
    }
    .reviewButton {
        float: right;
        margin-top: 10px;
    }
    .hide {
        display: none;
    }
    .show {
        display: block;
    }
</style>