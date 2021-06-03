<template>
    <div id="categories" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Products</h1>
                <form autocomplete="off" class="productsForm" @submit.prevent="getProducts()">
                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="form-group col-md-2">
                            <select id="category" class="form-control" v-model="category">
                                <option value="" selected>Category</option>
                                <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                            </select>
                        </div>
                        <div class="form-group col-md-2">
                            <input type="number" id="limit" min="1" class="form-control" v-model="limit"/>
                        </div>
                        <div class="form-group col-md-2">
                            <select id="orderBy" class="form-control" v-model="orderBy">
                                <option value="" selected>Order by</option>
                                <option value="titleAsc">Title &#129045;</option>
                                <option value="titleDesc">Title &#129047;</option>
                                <option value="priceAsc">Price &#129045;</option>
                                <option value="priceDesc">Price &#129047;</option>
                            </select>
                        </div>
                        <div class="form-group col-md-1">
                            <button type="submit" class="btn btn-primary md-1">Search</button>
                        </div>
                        <div class="form-group col-md-1">
                            <button type="button" class="btn btn-info">{{total}}</button>
                        </div>
                    </div>
                </form>
                <table v-if="products.length" class="table">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Primary image</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in products" :key="product._id">
                            <td>{{index + 1}}</td>
                            <td>{{product.title}}</td>
                            <td>{{product.price}}</td>
                            <td>{{product.quantity}}</td>
                            <td><img :src="renderPrimaryImage(product.primaryImage)" :id="product.primaryImage._id" :alt="product.title" class="rounded img-fluid primaryImage" @click="openModal($event)"></td>
                            <td>
                                <i class="fas fa-external-link-alt" @click="openEditProduct(product._id)"></i>
                                <i class="fas fa-trash" @click="deleteProduct(product._id, product.title)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group pages">
                    <button v-if="page - 1 > 0" type="button" class="btn btn-info page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                    <button type="button" class="btn btn-info page">{{page}}</button>
                    <button v-if="page < pagesNumber" type="button" class="btn btn-info page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
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
    import route from "../../components/Route.vue";
    import modal from "../../components/Modal.vue";
	var axios = require("axios");
	
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
                limit: 12,
                orderBy: "",
                total: 0,
                pagesNumber: 1
			}
		},
        methods: {
            getProducts() {
                var body = {search: this.search, category: this.category, page: this.page, limit: this.limit, orderBy: this.orderBy};
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
            deleteProduct(productId, productTitle) {
                var confirmed = confirm("Delete product " + productTitle + "?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteProduct/" + productId).then(response => {
                        this.products = this.products.filter(product => product._id != productId);
                    }).catch(error => console.log(error));
                }
            },
            renderPrimaryImage(primaryImage) {
                if(primaryImage && !(primaryImage instanceof File)) {
                    return "data:" + primaryImage.contentType + ";base64," + (new Buffer.from(primaryImage.image)).toString("base64");
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
            openEditProduct(productId) {
                route.methods.openEditProduct(productId);
            },
            openModal(event) {
                modal.methods.openModal(event);
            }
        },
        mounted() {
			checkLogin.methods.isLoggedIn();
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
    .productsForm {
        margin: 0 auto;
		max-width: 1000px;
    }
    tbody .fas {
        cursor: pointer;
        margin-right: 5px;
    }
    .primaryImage {
        height: 50px;
        width: 50px;
        cursor: pointer;
    }
    .pages {
        text-align: center;
        margin: 0 auto;
    }
    .page {
        margin-left: 10px;
    }
</style>