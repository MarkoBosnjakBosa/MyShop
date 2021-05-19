<template>
    <div id="shoppingCart" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Shopping Cart</h1>
                <div class="row shoppingCart">
                    <div class="col-md-8">
                        <div v-for="product in products" :key="product._id" class="row product">
                            <div class="col-md-3">
                                <img :src="renderImage(product.primaryImage)" :id="product.primaryImage._id" :alt="product.title" class="rounded img-fluid image"/>
                            </div>
                            <div class="col-md-7">
                                <h3>{{product.title}}</h3>
                                <div class="ratings">
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 0}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 1}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 2}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 3}"></i>
                                    <i class="fas fa-star" :class="{'checked' : product.rating.averageRating > 4}"></i>
                                </div>
                                <div class="row margin">
                                    <label class="col-md-3 col-form-label">Quantity:</label>
                                    <div class="col-md-9">
                                        <input type="number" min="1" class="form-control quantity" :value="product.selectedQuantity" @change="updateSelectedQuantity($event, product._id)"/>
                                    </div>
                                </div>
                                <div class="row margin">
                                    <div class="col-md-3">Price:</div>
                                    <div class="col-md-3"><b>{{formatNumber(Number(product.selectedQuantity) * Number(product.price))}} €</b></div>
                                </div>
                                <div class="margin">
                                    <button type="button" class="btn btn-primary" @click="openViewProduct(product._id)">More...</button>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <i class="fas fa-times fa-2x" @click="removeFromShoppingCart(product)"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="checkout">
                            <div class="checkoutInfo">
                                <h3>Total: {{totalCost}}</h3>
                                <button type="button" class="btn btn-primary btn-lg checkoutButton" @click="openCheckout()">Checkout</button>
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
    import route from "../components/Route.vue";
	const axios = require("axios");
	
	export default {
		name: "shoppingCart",
		components: {
            navigation,
			sidebar
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
            },
            openCheckout(){
                route.methods.openCheckout();
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
                return this.formatNumber(totalCost) + " €";
            }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .shoppingCart {
        margin: 0 auto;
        max-width: 1200px;
    }
    .checkout {
        height: 200px;
        line-height: 200px;
        text-align: center;
        background-color: #e6e6ff;
        border-radius: 10px;
    }
    .checkoutInfo {
        display: inline-block;
        vertical-align: middle;
        line-height: normal;
    }
    .checkoutButton {
        width: 100%;
    }
    .product {
        background-color: #f4f4f2;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 10px;
    }
    .image {
        height: 200px;
    }
    .checked {
        color: #ffa500;
    }
    .quantity {
        max-width: 100px;
    }
    .fas.fa-times {
        float: right;
        color: #ff0000;
        cursor: pointer;
    }
    .margin {
        margin-top: 10px;
    }
</style>