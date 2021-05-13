<template>
    <div id="cart">
        <a id="cartProducts" href="#" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-shopping-cart"></i><span class="badge badge-dark">{{totalQuantity}}</span></a>
        <div class="dropdown-menu dropdown-menu-right cartProducts" aria-labelledby="cartProducts">
            <div v-for="(product, index) in products" :key="product._id" class="row product dropdownDivider" :class="{'lowerProduct' : index > 0}">
                <div class="col-md-4">
                    <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="rounded img-fluid" @click="openProduct(product._id)">
                </div>
                <div class="col-md-8">
                    <h3 @click="openProduct(product._id)">{{product.title}}</h3>
                    <b>{{product.selectedQuantity}} x {{formatNumber(product.price)}} = {{formatNumber(Number(product.selectedQuantity) * Number(product.price))}} €</b>
                    <br>
                    <i class="fas fa-external-link-alt" @click="openViewProduct(product._id)"></i>
                </div>
                <i class="fas fa-times" :class="index == 0 ? 'firstRemoval' : 'otherRemovals'" @click="removeFromShoppingCart(product._id)"></i>
            </div>
            <div v-if="products.length" class="container product lowerProduct">
                <div class="totalCost">
                    <b>Total: {{formatNumber(totalCost)}} €</b>
                    <i class="fas fa-times" @click="clearShoppingCart()"></i>
                </div>
                <button type="button" class="btn btn-primary checkoutButton">Checkout</button>
            </div>
            <div v-else class="container">
                Your shopping cart is empty!
            </div>
        </div>
    </div>
</template>

<script>
    import helper from "./Helper.vue";
    import route from "./Route.vue";

    export default {
        name: "cart",
        methods: {
            addToShoppingCart(product) {
                this.$store.dispatch("addToShoppingCart", product);
            },
            removeFromShoppingCart(productId) {
                this.$store.dispatch("removeFromShoppingCart", productId);
            },
            clearShoppingCart() {
                this.$store.dispatch("clearShoppingCart");
            },
            openViewProduct(productId) {
                route.methods.openViewProduct(productId);
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number.toString());
            }
        },
        computed: {
            products() {
                return this.$store.getters.getShoppingCart;
            },
            totalQuantity() {
                var totalQuantity = 0;
                this.products.forEach(function(product) {
                    totalQuantity += Number(product.selectedQuantity);
                });
                return totalQuantity;
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
    .cartProducts {
        width: 400px;
    }
    .row {
        margin: 0px;
        cursor: default;
    }
    .product {
        position: relative;
    }
    .lowerProduct {
        padding-top: 10px;
    }
    .dropdownDivider { 
        padding-bottom: 10px;
        border-bottom: 1px #000 solid;
    }
    .img-fluid {
        height: 85px;
    }
    .fas.fa-times {
        position: absolute;
        right: 15px;
        color: red;
    }
    .firstRemoval {
        top: 0px;
    }
    .otherRemovals {
        top: 10px;
    }
    .fas.fa-external-link-alt {
        cursor: pointer;
    }
    a {
        color: #000;
        text-decoration: none;
    }
    .totalCost {
        width: 100%;
    }
    .checkoutButton {
        width: 100%;
        margin-top: 10px;
    }
</style>