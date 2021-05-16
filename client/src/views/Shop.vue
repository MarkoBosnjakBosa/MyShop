<template>
    <div id="shop" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Shop</h1>
                <form autocomplete="off" class="row productsForm" @submit.prevent="getProducts()">
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
                        </select>
                    </div>
                    <div class="mb-3 col-md-1">
                        <button type="submit" class="btn btn-primary md-1">Search</button>
                    </div>
                    <div class="mb-3 col-md-1">
                        <button type="button" class="btn btn-info">{{total}}</button>
                    </div>
                </form>
                <div class="row products">
                    <div v-for="product in products" :key="product._id" class="col-md-3">
                        <div class="card">
                            <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="card-img-top" @click="openModal($event)">
                            <div class="card-body">
                                <h5 class="card-title">{{product.title}}</h5>
                                <p class="card-text">Price: {{product.price}} €</p>
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
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import navigation from "../components/Navigation.vue";
	import sidebar from "../components/Sidebar.vue";
    import route from "../components/Route.vue";
    import modal from "../components/Modal.vue";
	const axios = require("axios");
	
	export default {
		name: "shop",
		components: {
            navigation,
			sidebar,
            modal
        },
        data() {
			return {
                products: [],
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
            getProducts() {
                var body = {search: this.search, page: this.page, limit: this.limit, orderBy: this.orderBy, category: this.category};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProducts", body).then(response => {
                    this.products = response.data.products;
                    this.total = response.data.total;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            getCategories() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getCategories").then(response => {
                    this.categories = response.data.categories;
                }).catch(error => console.log(error));
            },
            renderImage(image) {
                if(image && !(image instanceof File)) {
                    return "data:" + image.contentType + ";base64," + (new Buffer.from(image.image)).toString("base64");
                } else {
                    return "";
                }
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getProducts();
                }
            },
            openViewProduct(productId) {
                route.methods.openViewProduct(productId);
            },
            openModal(event) {
                modal.methods.openModal(event);
            }
        },
        mounted() {
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
    .productsForm, .products {
        margin: 0 auto;
		max-width: 1000px;
    }
    .card {
        margin-bottom: 10px;
    }
    .card-img-top {
        height: 200px;
        cursor: pointer;
    }
    .pages {
        margin: 0 auto;
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
</style>