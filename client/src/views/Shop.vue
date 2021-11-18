<template>
    <div id="shop" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Shop</h1>
                <form autocomplete="off" @submit.prevent="getProducts()" novalidate>
                    <div class="row">
                        <div class="mb-3 col-4">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="mb-3 col-2">
                            <select id="category" class="form-control" v-model="category">
                                <option value="" selected>Category</option>
                                <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                            </select>
                        </div>
                        <div class="mb-3 col-2">
                            <input type="number" id="limit" min="1" class="form-control" v-model="limit"/>
                        </div>
                        <div class="mb-3 col-2">
                            <select id="orderBy" class="form-control" v-model="orderBy">
                                <option value="" selected>Order by</option>
                                <option value="titleAsc">Title &#129045;</option>
                                <option value="titleDesc">Title &#129047;</option>
                                <option value="priceAsc">Price &#129045;</option>
                                <option value="priceDesc">Price &#129047;</option>
                                <option value="quantityAsc">Quantity &#129045;</option>
                                <option value="quantityDesc">Quantity &#129047;</option>
                                <option value="ratingAsc">Rating &#129045;</option>
                                <option value="ratingDesc">Rating &#129047;</option>
                            </select>
                        </div>
                        <div class="btn-group mb-3 col-2">
                            <button type="submit" class="btn btn-primary">Search</button>
                            <button type="button" class="btn btn-dark" data-toggle="tooltip" :title="'Total: ' + total">{{total}}</button>
                        </div>
                    </div>
                </form>
                <div class="row mb-3 products">
                    <div v-if="!products.length" class="noProducts">
                        No products found!
                    </div>
                    <div v-for="product in products" :key="product._id" class="col-3">
                        <div class="card">
                            <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="card-img-top" @click="openModal($event)">
                            <div class="card-body">
                                <h5 class="card-title" data-toggle="tooltip" :title="product.title">{{product.title}}</h5>
                                <p class="card-text">Price: {{formatNumber(product.price)}}<br>
                                    <i class="fas fa-star" :class="{'checked' : getRating(1, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(2, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(3, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(4, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(5, product.rating.averageRating)}"></i>
                                </p>
                                <button type="button" class="btn btn-primary" @click="openViewProduct(product._id)">More...</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-3 pages">
                    <button v-if="page - 1 > 0" type="button" class="btn btn-dark page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                    <button type="button" class="btn btn-dark page">{{page}}</button>
                    <button v-if="page < pagesNumber" type="button" class="btn btn-dark page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
                </div>
                <chat v-if="userData.isLoggedIn && !userData.isAdmin"></chat>
                <modal></modal>
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
    import chat from "../components/Chat.vue";
    import modal from "../components/Modal.vue";
    const axios = require("axios");
	
    export default {
        name: "shop",
        components: {
            navigation,
            sidebar,
            chat,
            modal
        },
        data() {
            return {
                userData: {
                    isLoggedIn: false,
                    username: "",
                    isAdmin: false
                },
                products: [],
                categories: [],
                search: "",
                category: "",
                page: 1,
                limit: 12,
                orderBy: "",
                total: 0,
                pagesNumber: 1
            }
        },
        methods: {
            getUserData() {
                this.userData = checkLogin.methods.getUserData();
            },
            getProducts() {
                if(!Number.isInteger(this.limit) || this.limit < 1) this.limit = 1;
                var body = {search: this.search, page: this.page, limit: this.limit, orderBy: this.orderBy, category: this.category};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProducts", body).then(response => {
                    this.products = response.data.products;
                    this.total = response.data.total;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            getRating(rating, averageRating) {
                if(rating <= averageRating) {
                    return true;
                } else {
                    return false;
                }
            },
            getCategories() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getCategories").then(response => {
                    this.categories = response.data.categories;
                }).catch(error => console.log(error));
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getProducts();
                }
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            },
            openViewProduct(productId) {
                route.methods.openViewProduct(productId);
            },
            openModal(event) {
                modal.methods.openModal(event);
            }
        },
        created() {
            this.getUserData();
            this.getProducts();
            this.getCategories();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    form, .products {
        margin: auto;
        max-width: 1000px;
    }
    .noProducts {
        font-weight: bold;
        text-align: center;
    }
    .card {
        margin-bottom: 10px;
    }
    .card-title {
        overflow: hidden;
        white-space: nowrap;
    }
    .card-img-top {
        height: 200px;
        cursor: pointer;
    }
    .checked {
        color: #ffa500;
    }
    .pages {
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
</style>