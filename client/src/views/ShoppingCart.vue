<template>
    <div id="viewProduct" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Shopping Cart</h1>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in products" :key="product._id">
                            <th class="textPadding">{{index + 1}}</th>
                            <td><img :src="renderImage(product.primaryImage)" :id="product.primaryImage._id" :alt="product.title" class="rounded img-fluid image"></td>
                            <td class="textPadding">{{product.title}}</td>
                            <td class="textPadding">
                                <div class="ratings">
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 0}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 1}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 2}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 3}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 4}"></i>
                                </div>
                            </td>
                            <td class="inputPadding"><input type="number" min="1" class="form-control" :value="product.selectedQuantity" @change="updateSelectedQuantity($event, product._id)"/></td>
                            <td class="textPadding">{{formatNumber(Number(product.selectedQuantity) * Number(product.price))}} €</td>
                            <td class="textPadding">
                                <i class="fas fa-external-link-alt" @click="openViewProduct(product._id)"></i>
                                <i class="fas fa-trash" @click="removeFromShoppingCart(product)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
	const axios = require("axios");
	
	export default {
		name: "shoppingCart",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                
            }
        },
        methods: {
            renderImage(image) {
                return helper.methods.renderImage(image);
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number.toString());
            },
            updateSelectedQuantity(event, productId) {
                var selectedQuantity = event.target.value;
                this.$store.dispatch("updateSelectedQuantity", {productId, selectedQuantity});
            },
            openViewProduct(productId) {
                route.methods.openViewProduct(productId);
            },
            removeFromShoppingCart(product) {
                var confirmed = confirm("Remove product " + product.title + "?");
                if(confirmed) {
                    this.$store.dispatch("removeFromShoppingCart", product._id);
                }
            }
        },
        computed: {
            products() {
                return this.$store.getters.getShoppingCart;
            },
            totalCost() {
                var totalCost = 0;
                this.products.forEach(function(product) {
                    totalCost += Number(product.price) * Number(product.selectedQuantity);
                });
                return totalCost;
            }
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .image {
        height: 50px;
        width: 50px;
        cursor: pointer;
    }
    .checked {
        color: #ffa500;
    }
    .fas.fa-external-link-alt, .fas.fa-trash {
        cursor: pointer;
        margin-right: 5px;
    }
    .textPadding {
        padding-top: 20px;
    }
    .inputPadding {
        padding-top: 12px;
    }
</style>