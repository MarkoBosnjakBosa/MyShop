<template>
    <div id="shopCategory" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Shop By Category: {{category.title}}</h1>
                <form autocomplete="off" class="row productsForm" @submit.prevent="getProducts()">
                    <div class="mb-3 col-md-6">
                        <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                    </div>
                    <div class="mb-3 col-md-2">
                        <input type="number" id="limit" min="1" class="form-control" placeholder="Limit" v-model="limit"/>
                    </div>
                    <div class="mb-3 col-md-2">
                        <select id="orderBy" class="form-control" v-model="orderBy">
                            <option value="" selected>Order by</option>
                            <option value="titleAsc">Title &#129045;</option>
                            <option value="titleDesc">Title &#129047;</option>
                            <option value="priceAsc">Price &#129045;</option>
                            <option value="priceDesc">Price &#129047;</option>
                            <option value="ratingAsc">Rating &#129045;</option>
                            <option value="ratingDesc">Rating &#129047;</option>
                        </select>
                    </div>
                    <div class="mb-3 col-md-1">
                        <button type="submit" class="btn btn-primary md-1">Search</button>
                    </div>
                    <div class="mb-3 col-md-1">
                        <button type="button" class="btn btn-dark" data-toggle="tooltip" :title="'Total: ' + total">{{total}}</button>
                    </div>
                </form>
                <div class="mb-3 row products">
                    <div v-for="product in products" :key="product._id" class="col-md-3">
                        <div class="card">
                            <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="card-img-top" @click="openModal($event)">
                            <div class="card-body">
                                <h5 class="card-title" data-toggle="tooltip" :title="product.title">{{product.title}}</h5>
                                <p class="card-text">Price: {{formatNumber(product.price)}}</p>
                                <button type="button" class="btn btn-primary" @click="openViewProduct(product._id)">More...</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pages">
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
    import navigation from "../components/Navigation.vue";
    import sidebar from "../components/Sidebar.vue";
    import helper from "../components/Helper.vue";
    import route from "../components/Route.vue";
    import modal from "../components/Modal.vue";
    const axios = require("axios");
	
    export default {
        name: "shopCategory",
        components: {
            navigation,
            sidebar,
            modal
        },
        data() {
            return {
                category: {
                    _id: "",
                    title: "",
                    icon: ""
                },
                products: [],
                search: "",
                page: 1,
                limit: 12,
                orderBy: "",
                total: 0,
                pagesNumber: 1
            }
        },
        methods: {
            getCategory() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getCategory/" + this.category._id).then(response => {
                    this.category = response.data.category;
                }).catch(error => console.log(error));
            },
            getProducts() {
                var body = {search: this.search, category: this.category._id, page: this.page, limit: this.limit, orderBy: this.orderBy};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProducts", body).then(response => {
                    this.products = response.data.products;
                    this.total = response.data.total;
                    this.pagesNumber = response.data.pagesNumber;
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
            this.category._id = this.$route.params.categoryId;
            this.getCategory();
            this.getProducts();
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
    .productsForm, .products {
        margin: auto;
        max-width: 1000px;
    }
    .card {
        margin-bottom: 10px;
    }
    .card-title {
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
    }
    .card-img-top {
        height: 200px;
        cursor: pointer;
    }
    .pages {
        margin: auto;
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
</style>