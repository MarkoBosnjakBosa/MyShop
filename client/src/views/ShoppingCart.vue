<template>
    <div id="shoppingCart" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Shopping Cart</h1>
                <div class="row shoppingCart">
                    <div class="col-8">
                        <div v-for="product in products" :key="product._id" class="row product">
                            <div class="col-3">
                                <img :src="renderImage(product.primaryImage)" :id="product.primaryImage._id" :alt="product.title" class="rounded img-fluid image"/>
                            </div>
                            <div class="col-7">
                                <h3 class="title" data-toggle="tooltip" :title="product.title">{{product.title}}</h3>
                                <div class="ratings">
                                    <i class="fas fa-star" :class="{'checked' : getRating(1, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(2, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(3, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(4, product.rating.averageRating)}"></i>
                                    <i class="fas fa-star" :class="{'checked' : getRating(5, product.rating.averageRating)}"></i>
                                </div>
                                <div class="row margin">
                                    <label class="col-3 col-form-label">Quantity:</label>
                                    <div class="col-9">
                                        <input type="number" min="1" :max="product.quantity" onkeydown="if(event.key == '.') event.preventDefault();" class="form-control quantity" data-toggle="tooltip" :title="'Value can not be greater than ' + product.quantity + '.'" :value="product.selectedQuantity" @change="updateSelectedQuantity($event, product._id)"/>
                                    </div>
                                </div>
                                <div class="row margin">
                                    <div class="col-3">Price:</div>
                                    <div class="col-9"><b>{{formatNumber(Number(product.selectedQuantity) * Number(product.price))}}</b></div>
                                </div>
                                <div class="margin">
                                    <button type="button" class="btn btn-primary" @click="openViewProduct(product._id)">More...</button>
                                </div>
                            </div>
                            <div class="col-2">
                                <i class="fas fa-times fa-2x" @click="removeFromShoppingCart(product)"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div v-if="checkTotal()">
                            <div class="checkout">
                                <div class="checkoutInfo">
                                    <h3>Total: {{totalCost}}</h3>
                                    <button type="button" class="btn btn-primary btn-lg" @click="openCheckout()">Checkout</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="products.length">
                            <button type="button" class="btn btn-danger removeAll" @click="clearShoppingCart()">Remove all</button>
                        </div>
                    </div>
                    <div v-if="!products.length && !checkTotal()" class="mb-3 alert alert-dark" role="alert">
                        There are no products in the shopping cart!
                    </div>
                </div>
                <notification :product="{title: 'Quantity change(s)'}" :message="message" :type="'success'" @hide="hideNotification()"></notification>
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
	
    export default {
        name: "shoppingCart",
        components: {
            navigation,
            sidebar,
            notification
        },
        data() {
            return {
                message: ""
            }
        },
        methods: {
            updateSelectedQuantity(event, productId) {
                var selectedQuantity = event.target.value.replace(/^0+/, "");
                this.$store.dispatch("updateSelectedQuantity", {productId, selectedQuantity});
            },
            removeFromShoppingCart(product) {
                var confirmed = confirm("Remove product " + product.title + "?");
                if(confirmed) {
                    this.$store.dispatch("removeFromShoppingCart", product._id);
                }
            },
            clearShoppingCart() {
                var confirmed = confirm("Remove all products?");
                if(confirmed) {
                    this.$store.dispatch("clearShoppingCart");
                }
            },
            checkTotal() {
                if(Number(this.totalCost.substring(0, this.totalCost.length - 2).replaceAll(",", "")) > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            getRating(rating, averageRating) {
                if(rating <= averageRating) {
                    return true;
                } else {
                    return false;
                }
            },
            hideNotification() {
                this.message = "";
            },
            openCheckout() {
                if(this.checkTotal()) {
                    route.methods.openCheckout();
                }
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            openViewProduct(productId) {
                route.methods.openViewProduct(productId);
            }
        },
        computed: {
            products() {
                return this.$store.getters.getShoppingCart;
            },
            totalCost() {
                var totalCost = 0;
                var updatedQuantities = [];
                this.products.forEach(function(product) {
                    if(!Number.isInteger(Number(product.selectedQuantity)) || product.selectedQuantity < 1) {
                        product.selectedQuantity = 1;
                        updatedQuantities = [...updatedQuantities, product.title];
                    }
                    if(product.selectedQuantity > product.quantity) {
                        product.selectedQuantity = product.quantity;
                        updatedQuantities = [...updatedQuantities, product.title];
                    }
                    totalCost += Number(product.price) * Number(product.selectedQuantity);
                });
                if(updatedQuantities.length) this.message = "Quantity for following product(s) has been adjusted: " + updatedQuantities.join(", ") + ".";
                return this.formatNumber(totalCost);
            }
        },
        created() {
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
        margin: auto;
        max-width: 1200px;
    }
    .title {
        overflow: hidden;
        white-space: nowrap;
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
    .removeAll {
        width: 100%;
        margin-top: 20px;
    }
    .alert {
        margin: auto;
        width: 500px;
        font-weight: bold;
        text-align: center;
    }
</style>