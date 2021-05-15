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
                            <div class="writeReview" @click="toggleReview()">Add review <i id="reviewIcon" class="fas fa-plus"></i></div>
                            <div id="review" class="hide">
                                <textarea class="form-control" rows="5" v-model="review"></textarea>
                                <div class="ratings">
                                    <i id="rating_1" class="fas fa-star" @click="rateProduct(1)"></i>
                                    <i id="rating_2" class="fas fa-star" @click="rateProduct(2)"></i>
                                    <i id="rating_3" class="fas fa-star" @click="rateProduct(3)"></i>
                                    <i id="rating_4" class="fas fa-star" @click="rateProduct(4)"></i>
                                    <i id="rating_5" class="fas fa-star" @click="rateProduct(5)"></i>
                                </div>
                                <button type="button" class="btn btn-primary reviewButton" @click="writeReview()">Write a review</button>
                            </div>
                            <div id="reviews" class="accordion">
                                <div v-for="review in reviews" :key="review._id" class="accordion-item">
                                    <h2 class="accordion-header" :id="'heading_' + review._id">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + review._id" aria-expanded="false">
                                            {{review.username}} {{review.date}}
                                        </button>
                                    </h2>
                                    <div :id="'collapse_' + review._id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + review._id" data-bs-parent="#reviews">
                                        <div v-if="editing == review._id" class="accordion-body">
                                            <div class="row">
                                                <div class="col-md-10 editMessage">
                                                    <input type="text" class="form-control"/>
                                                </div>
                                                <div class="col-md-2 editButtons">
                                                    <i class="far fa-check-circle editReview" @click="editReview(review._id, review.review)"></i>
                                                    <i class="far fa-times-circle disableEditing" @click="disableEditing(message)"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else class="accordion-body">{{review.review}}</div>
                                        <div v-if="review.username == username">
                                            <button type="button" class="btn btn-primary" @click="enableEditing(review)">Edit</button>
                                            <button type="button" class="btn btn-danger" @click="deleteReview">Delete</button>
                                        </div>
                                    </div>
                                </div>
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
    import validation from "../components/Validation.vue"; 
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
                username: this.$store.getters.getUser,
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
                },
                reviews: [],
                review: "",
                editing: null
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
            getReviews() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getReviews/" + this.productId).then(response => {
                    this.reviews = response.data.reviews;    
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
            },
            rateProduct(rating) {
                for(var index = 1; index < 6; index ++) {
                    if(index <= rating) {
                        document.getElementById("rating_" + index).classList.add("checked");
                    } else {
                        document.getElementById("rating_" + index).classList.remove("checked");
                    }
                }

            },
            writeReview() {
                if(!validation.methods.invalidReview(this.review)) {
                    var body = {productId: this.productId, username: this.username, review: this.review};
                    axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/writeReview", body).then(response => {
                        if(response.data.written) {
                            this.review = "";
                            this.reviews = [...this.reviews, response.data.review];
                        }
                    }).catch(error => console.log(error));
                }
            },
            enableEditing(review) {
                this.cachedReview = Object.assign({}, review);
                this.editing = review._id;
            },
            disableEditing(review) { 
                Object.assign(review, this.cachedReview);
                this.editing = null;
            },
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.productId = this.$route.params.productId;
            this.getProduct();
            this.getReviews();
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
    .writeReview {
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
    .ratings {
        float: left;
        padding-top: 10px;
    }
    .checked {
        color: #ffa500;
    }
    .fas.fa-star {
        cursor: pointer;
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
    .editReview {
        color: #008000;
    }
    .disableEditing {
        color: #ff0000;
    }
    #reviews {
        clear: both;
        margin-top: 20px;
    }
</style>