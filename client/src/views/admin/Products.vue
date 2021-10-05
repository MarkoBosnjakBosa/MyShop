<template>
    <div id="products" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Products</h1>
                <form autocomplete="off" @submit.prevent="getProducts()" novalidate>
                    <div class="row">
                        <div class="mb-3 col-md-4">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="mb-3 col-md-2">
                            <select id="category" class="form-control" v-model="category">
                                <option value="" selected>Category</option>
                                <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                            </select>
                        </div>
                        <div class="mb-3 col-md-2">
                            <input type="number" id="limit" min="1" class="form-control" v-model="limit"/>
                        </div>
                        <div class="mb-3 col-md-2">
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
                        <div class="btn-group mb-3 col-md-2">
                            <button type="submit" class="btn btn-primary md-1">Search</button>
                            <button type="button" class="btn btn-dark" data-toggle="tooltip" :title="'Total: ' + total">{{total}}</button>
                            <button type="button" class="btn btn-secondary" @click="downloadProducts()"><i class="fas fa-file-csv"></i></button>
                        </div>
                    </div>
                </form>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Rating</th>
                            <th>Primary image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!products.length">
                            <td colspan="7" class="noProducts">No products found!</td>
                        </tr>
                        <tr v-for="(product, index) in products" :key="product._id">
                            <th class="padded">{{++index}}</th>
                            <td class="padded title">{{product.title}}</td>
                            <td class="padded">{{product.price}}</td>
                            <td class="padded">{{product.quantity}}</td>
                            <td class="padded">
                                <i class="fas fa-star" :class="{'checked' : getRating(1, product.rating.averageRating)}"></i>
                                <i class="fas fa-star" :class="{'checked' : getRating(2, product.rating.averageRating)}"></i>
                                <i class="fas fa-star" :class="{'checked' : getRating(3, product.rating.averageRating)}"></i>
                                <i class="fas fa-star" :class="{'checked' : getRating(4, product.rating.averageRating)}"></i>
                                <i class="fas fa-star" :class="{'checked' : getRating(5, product.rating.averageRating)}"></i>
                            </td>
                            <td><img :src="renderImage(product.primaryImage)" :id="product.primaryImage._id" :alt="product.title" class="rounded img-fluid image" @click="openModal($event)"></td>
                            <td class="padded">
                                <i class="fas fa-external-link-square-alt" @click="openEditProduct(product._id)"></i>
                                <i class="fas fa-trash" @click="deleteProduct(product._id, product.title)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="mb-3 pages">
                    <button v-if="page - 1 > 0" type="button" class="btn btn-dark page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                    <button type="button" class="btn btn-dark page">{{page}}</button>
                    <button v-if="page < pagesNumber" type="button" class="btn btn-dark page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
                </div>
                <modal></modal>
            </div>
        </div>
    </div>
</template>

<script>
    import checkLogin from "../../components/CheckLogin.vue";
    import navigation from "../../components/Navigation.vue";
    import sidebar from "../../components/Sidebar.vue";
    import helper from "../../components/Helper.vue"; 
    import route from "../../components/Route.vue";
    import modal from "../../components/Modal.vue";
    const axios = require("axios");
	
    export default {
        name: "products",
        components: {
            navigation,
            sidebar,
            modal
        },
        data() {
            return {
                products: [],
                categories: [],
                search: "",
                category: "",
                page: 1,
                limit: 10,
                orderBy: "",
                total: 0,
                pagesNumber: 1
            }
        },
        methods: {
            getProducts() {
                if(!Number.isInteger(this.limit) || this.limit < 1) this.limit = 1;
                var body = {search: this.search, category: this.category, page: this.page, limit: this.limit, orderBy: this.orderBy};
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
            deleteProduct(productId, productTitle) {
                var confirmed = confirm("Delete product " + productTitle + "?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteProduct/" + productId).then(response => {
                        this.products = this.products.filter(product => product._id != productId);
                        this.total = this.total - 1; 
                    }).catch(error => console.log(error));
                }
            },
            downloadProducts() {
                var body = {search: this.search, category: this.category, page: this.page, limit: this.limit, orderBy: this.orderBy};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/downloadProducts", body).then(response => {
                    if(response.data.downloaded) {
                        route.methods.downloadCsvFile(response.data.fileName);
                    }
                }).catch(error => console.log(error));
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getProducts();
                }
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            },
            openEditProduct(productId) {
                route.methods.openEditProduct(productId);
            },
            openModal(event) {
                modal.methods.openModal(event);
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
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
    form {
        margin: auto;
        max-width: 1000px;
    }
    .noProducts {
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
    }
    .padded {
        padding-top: 20px;
    }
    .checked {
        color: #ffa500;
    }
    tbody .fas {
        margin-right: 5px;
        cursor: pointer;
    }
    .image {
        height: 50px;
        width: 50px;
        cursor: pointer;
    }
    .pages {
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
</style>