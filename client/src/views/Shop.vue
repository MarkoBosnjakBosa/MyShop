<template>
    <div id="categories" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Products</h1>
                <form autocomplete="off" class="productsForm" @submit.prevent="getProducts()">
                    <div class="form-row">
                        <div class="form-group col-md-7">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="form-group col-md-2">
                            <input type="number" id="limit" min="1" class="form-control" placeholder="Limit" v-model="limit"/>
                        </div>
                        <div class="form-group col-md-2">
                            <select id="orderBy" class="form-control" v-model="orderBy">
                                <option value="defalt">Order by</option>
                                <option value="titleAsc">Title &#129045;</option>
                                <option value="titleDesc">Title &#129047;</option>
                                <option value="priceAsc">Price &#129045;</option>
                                <option value="priceDesc">Price &#129047;</option>
                            </select>
                        </div>
                        <div class="form-group col-md-1">
                            <button type="submit" class="btn btn-primary md-1">Search</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import navigation from "../components/Navigation.vue";
	import sidebar from "../components/Sidebar.vue";
	const axios = require("axios");
	
	export default {
		name: "categories",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                products: [],
                search: "",
                page: 1,
                limit: 20,
                orderBy: ""
			}
		},
        methods: {
            getProducts() {
                var body = {search: this.search, page: this.page, limit: this.limit, orderBy: this.orderBy};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProducts", body).then(response => {
                    this.products = response.data.products;
                }).catch(error => console.log(error));
            }
        },
        mounted() {
            this.getProducts();
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
		max-width: 800px;
    }
</style>