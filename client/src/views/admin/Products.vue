<template>
    <div id="categories" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
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
                            <td><img :src="renderPrimaryImage(product.primaryImage)" :alt="product.title" class="rounded img-fluid primaryImage"></td>
                            <td>
                                <i class="fas fa-external-link-alt" @click="openEditProduct(product._id)"></i>
                                <i class="fas fa-trash" @click="deleteProduct(index)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import checkLogin from "../../components/CheckLogin.vue";
	import navigation from "../../components/Navigation.vue";
	import sidebar from "../../components/Sidebar.vue";
    import route from "../../components/Route.vue";
	var axios = require("axios");
	
	export default {
		name: "products",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                products: []
			}
		},
        methods: {
            getProducts() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProducts").then(response => {
                    this.products = response.data.products;
                }).catch(error => console.log(error));
            },
            renderPrimaryImage(primaryImage) {
                if(primaryImage && !(primaryImage instanceof File)) {
                    return "data:" + primaryImage.contentType + ";base64," + (new Buffer.from(primaryImage.image)).toString("base64");
                } else {
                    return "";
                }
            },
            openEditProduct(productId) {
                route.methods.openEditProduct(productId);
            }
        },
        created() {
			checkLogin.methods.isLoggedIn();
            this.getProducts();
        }
    }
</script>

<style scoped>
    tbody .fas {
        cursor: pointer;
        margin-right: 5px;
    }
    .primaryImage {
        height: 50px;
        width: 50px;
    }
</style>