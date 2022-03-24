<template>
    <div id="viewProduct" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1 data-toggle="tooltip" :title="product.title">{{product.title}}</h1>
                <div id="imagesCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#imagesCarousel" data-bs-slide-to="0" class="active" data-bs-interval="2000"></button>
                        <button v-for="(image, index) in product.images" :key="image._id" type="button" data-bs-target="#imagesCarousel" :data-bs-slide-to="++index" data-bs-interval="2000"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="d-block w-100"/>
                        </div>
                        <div v-for="image in product.images" :key="image._id" class="carousel-item">
                            <img :src="renderImage(image)" :alt="image.name" class="d-block w-100"/>
                        </div>
                    </div>
                    <button type="button" class="carousel-control-prev" data-bs-target="#imagesCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="carousel-control-next" data-bs-target="#imagesCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
                <div class="productData">
                    <div class="nav nav-tabs justify-content-center" role="tablist">
                        <button type="button" id="mainNavTab" data-bs-toggle="tab" data-bs-target="#mainTab" class="nav-link active" role="tab">Main</button>
                        <button type="button" id="reviewsNavTab" data-bs-toggle="tab" data-bs-target="#reviewsTab" class="nav-link" role="tab">Reviews</button>
                    </div>
                    <div class="tab-content">
                        <div id="mainTab" class="tab-pane fade active show" role="tabpanel">
                            <div class="row">
                                <div class="col-6 price"><b>Price: {{formatNumber(product.price)}}</b></div>
                                <div v-if="product.quantity" class="col-6">
                                    <form autocomplete="off" @submit.prevent="addToShoppingCart()" novalidate>
                                        <div class="mb-3 input-group">
                                            <input type="number" id="selectedQuantity" min="1" :max="product.quantity" onkeydown="if(event.key === '.') event.preventDefault();" class="form-control" :class="{'errorField' : !Number.isInteger(product.selectedQuantity) || product.selectedQuantity < 1 || product.selectedQuantity > product.quantity}" v-model="product.selectedQuantity"/>
                                            <div class="input-group-append">
                                                <button type="submit" class="btn btn-primary" data-toggle="tooltip" :title="'Value can not be greater than ' + product.quantity + '.'">Add to cart</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div v-else class="col-6">
                                    <div class="mb-3 soldOut">Sold out</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 titleColumn"><b>Rating</b></div>
                                <div class="col-6 valueColumn">
                                    <i class="fas fa-star" :class="{'checked' : getRating(1, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(2, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(3, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(4, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(5, product.rating.averageRating)}"></i>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 titleColumn"><b>Description</b></div>
                                <div class="col-6 valueColumn">{{product.description}}</div>
                            </div>
                            <div class="row">
                                <div class="col-6 titleColumn"><b>Quantity</b></div>
                                <div class="col-6 valueColumn">{{product.quantity}}</div>
                            </div>
                            <div v-for="technicalInformation in product.technicalData" :key="technicalInformation._id" class="row">
                                <div class="col-6 titleColumn"><b>{{technicalInformation.title}}</b></div>
                                <div class="col-6 valueColumn">{{technicalInformation.value}}</div>
                            </div>
                            <div class="mb-3"></div>
                        </div>
                        <div id="reviewsTab" class="tab-pane fade" role="tabpanel">
                            <div class="writeReview" @click="toggleReview()">Add review <i id="reviewIcon" class="fas fa-plus"></i></div>
                            <div id="review" class="hide">
                                <textarea class="form-control" rows="5" v-model="review"></textarea>
                                <div class="ratings">
                                    <i id="rating_1" class="fas fa-star" @click="rateProduct(1, 'rate')"></i>
                                    <i id="rating_2" class="fas fa-star" @click="rateProduct(2, 'rate')"></i>
                                    <i id="rating_3" class="fas fa-star" @click="rateProduct(3, 'rate')"></i>
                                    <i id="rating_4" class="fas fa-star" @click="rateProduct(4, 'rate')"></i>
                                    <i id="rating_5" class="fas fa-star" @click="rateProduct(5, 'rate')"></i>
                                </div>
                                <button type="button" class="btn btn-primary review" @click="writeReview()">Write a review</button>
                            </div>
                            <div id="reviews" class="accordion">
                                <div v-for="(review, index) in reviews" :key="review._id" class="accordion-item" style="clear: both">
                                    <h2 class="accordion-header" :id="'heading_' + review._id">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + review._id" aria-expanded="false">
                                            {{review.username}} - {{new Date(review.date).toLocaleString("en-US")}}
                                        </button>
                                    </h2>
                                    <div :id="'collapse_' + review._id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + review._id" data-bs-parent="#reviews">
                                        <div v-if="editing === review._id" class="accordion-body">
                                            <div class="row">
                                                <div class="editMessage">
                                                    <textarea class="form-control" rows="5" v-model="reviews[index].review"></textarea>
                                                </div>
                                            </div>
                                            <div class="actions">
                                                <i class="fas fa-check action editReview" @click="editReview(review)"></i>
                                                <i class="fas fa-times action disableEditing" @click="disableEditing(review)"></i>
                                            </div>
                                        </div>
                                        <div v-else class="accordion-body">{{review.review}}
                                            <div v-if="review.username === username && editing !== review._id" class="action">
                                                <i class="fas fa-edit action" @click="enableEditing(review)"></i>
                                                <i class="fas fa-trash action" @click="deleteReview(review._id)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 pages">
                                <button v-if="page - 1 > 0" type="button" class="btn btn-dark page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                                <button type="button" class="btn btn-dark page">{{page}}</button>
                                <button v-if="page < pagesNumber" type="button" class="btn btn-dark page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
                            </div>
                        </div>
                        <notification :product="product" :message="message" :type="'success'" @hide="hideNotification"></notification>
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
    import route from "../components/Route.vue";
    import notification from "../components/Notification.vue";
    const axios = require("axios");
	
    export default {
        name: "viewProduct",
        components: {
            navigation,
            sidebar,
            notification
        },
        data() {
            return {
                username: this.$store.getters.getUser,
                product: {
                    _id: "",
                    title: "",
                    description: "",
                    price: "",
                    quantity: 0,
                    category: "",
                    technicalData: [],
                    primaryImage: "",
                    images: [],
                    rating: {},
                    selectedQuantity: 1
                },
                reviews: [],
                page: 1,
                pagesNumber: 1,
                review: "",
                editing: null,
                message: ""
            }
        },
        methods: {
            getProduct() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProduct/" + this.product._id).then(response => {
                    this.product = response.data.product;
                    if(this.product.quantity < 1) this.product.quantity = 0;
                    this.product.selectedQuantity = 1;
                    this.getUserRating(this.product.rating.usersRatings);
                }).catch(error => route.methods.openPageNotFound());
            },
            getRating(rating, averageRating) {
                if(rating <= averageRating) {
                    return true;
                } else {
                    return false;
                }
            },
            getUserRating(usersRatings) {
                var foundIndex = usersRatings.findIndex(userRating => userRating.username === this.username);
                if(foundIndex > -1) {
                    this.rateProduct(usersRatings[foundIndex].rating, "load");
                }
            },
            rateProduct(rating, type) {
                if((rating && rating < 6)) {
                    if(type === "load") {
                        for(var index = 1; index < 6; index ++) {
                            if(index <= rating) {
                                document.getElementById("rating_" + index).classList.add("checked");
                            } else {
                                document.getElementById("rating_" + index).classList.remove("checked");
                            }
                        }
                    } else {
                        var body = {productId: this.product._id, username: this.username, rating: rating};
                        axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/rateProduct", body).then(response => {
                            if(response.data.rated) {
                                for(var index = 1; index < 6; index ++) {
                                    if(index <= rating) {
                                        document.getElementById("rating_" + index).classList.add("checked");
                                    } else {
                                        document.getElementById("rating_" + index).classList.remove("checked");
                                    }
                                }
                                this.product.rating = response.data.rating;
                                this.message = "You have successfully rated this product!";
                            }
                        }).catch(error => console.log(error));
                    }
                }
            },
            getReviews() {
                var body = {productId: this.product._id, page: this.page};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getReviews", body).then(response => {
                    this.reviews = response.data.reviews;  
                    this.pagesNumber = response.data.pagesNumber;  
                }).catch(error => console.log(error));
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
            writeReview() {
                if(this.review) {
                    var body = {productId: this.product._id, username: this.username, review: this.review};
                    axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/writeReview", body).then(response => {
                        if(response.data.written) {
                            this.review = "";
                            this.reviews = [...this.reviews, response.data.review];
                            this.toggleReview();
                            this.getReviews();
                            this.message = "You have successfully written a review for this product!";
                        }
                    }).catch(error => console.log(error));
                }
            },
            editReview(updatedReview) {
                if(updatedReview.review) {
                    var body = {reviewId: updatedReview._id, username: this.username, review: updatedReview.review};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editReview", body).then(response => {
                        if(response.data.edited) {
                            this.reviews = this.reviews.map(review => review._id === response.data.review._id ? response.data.review : review);
                            this.editing = null;
                            this.message = "You have successfully edited a review for this product!";
                        }
                    }).catch(error => console.log(error));
                }
            },
            deleteReview(reviewId) {
                var confirmed = confirm("Delete review?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteReview/" + reviewId + "/" + this.username).then(response => {
                        if(response.data.deleted) {
                            this.reviews = this.reviews.filter(review => review._id !== reviewId);
                            this.page = 1;
                            this.getReviews();
                            this.message = "You have successfully deleted a review for this product!";
                        }
                    }).catch(error => console.log(error));
                }
            },
            addToShoppingCart() {
                if(Number.isInteger(this.product.selectedQuantity) && this.product.selectedQuantity > 0 && this.product.selectedQuantity <= this.product.quantity) {
                    var product = {};
                    product._id = this.product._id;
                    product.title = this.product.title;
                    product.price = this.product.price;
                    product.quantity = this.product.quantity;
                    product.selectedQuantity = this.product.selectedQuantity;
                    product.primaryImage = this.product.primaryImage;
                    product.rating = this.product.rating;
                    this.$store.dispatch("addToShoppingCart", product);
                    this.product.selectedQuantity = 1;
                    this.message = "This product has been successfully added to your cart!";
                }
            },
            enableEditing(review) {
                if(this.editing !== null) return; 
                this.cachedReview = Object.assign({}, review);
                this.editing = review._id;
            },
            disableEditing(review) {
                Object.assign(review, this.cachedReview);
                this.editing = null;
            },
            loadPage(page) {
                if(page > 0) {
                    this.page = page;
                    this.getReviews();
                }
            },
            hideNotification() {
                this.message = "";
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            }
        },
        created() {
            var vm = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) {
                    vm.product._id = vm.$route.params.productId;
                    vm.getProduct();
                    vm.getReviews();
                } else {
                    route.methods.openLogin();
                }
            });
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
        overflow: hidden;
        white-space: nowrap;
    }
    #imagesCarousel {
        margin: auto;
        max-width: 800px;
    }
    .d-block {
        height: 400px;
    }
    .productData {
        margin: auto;
        max-width: 600px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .tab-content {
        margin-top: 20px;
    }
    .price {
        padding-top: 7px;
        text-align: right;
    }
    .soldOut {
        padding-top: 7px;
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
        word-wrap: break-word;
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
        padding-top: 15px;
    }
    .fas.fa-star {
        cursor: pointer;
    }
    .valueColumn .fas.fa-star {
        cursor: auto;
    }
    .checked {
        color: #ffa500;
    }
    .review {
        float: right;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .hide {
        display: none;
    }
    .show {
        display: block;
    }
    #reviews {
        clear: both;
        margin-top: 10px;
    }
    .actions {
        text-align: right;
        margin-top: 5px;
    }
    .action {
        margin-right: 5px;
        cursor: pointer;
    }
    .editReview {
        color: #008000;
    }
    .disableEditing {
        color: #ff0000;
    }
    .pages {
        margin-top: 10px;
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
</style>