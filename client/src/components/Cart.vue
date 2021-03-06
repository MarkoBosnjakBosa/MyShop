<template>
    <div id="cart">
        <a id="cartProducts" href="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"><i class="fas fa-shopping-cart"></i><span class="badge bg-dark">{{totalQuantity}}</span></a>
        <ul class="dropdown-menu dropdown-menu-end scrollable" aria-labelledby="cartProducts">
            <li v-for="(product, index) in products" :key="product._id" class="row product dropdownDivider" :class="{'lowerProduct' : index > 0}">
                <div class="col-4">
                    <img :src="renderImage(product.primaryImage)" :alt="product.primaryImage.name" class="rounded img-fluid" @click="openProduct(product._id)"/>
                </div>
                <div class="col-7">
                    <h3 data-toggle="tooltip" :title="product.title" @click="openProduct(product._id)">{{product.title}}</h3>
                    <b>{{product.selectedQuantity}} x {{formatNumber(product.price)}} = {{formatNumber(Number(product.selectedQuantity) * Number(product.price))}}</b><br>
                    <i class="fas fa-external-link-square-alt" @click="openViewProduct(product._id)"></i>
                </div>
                <i class="fas fa-times productRemoval" :class="index === 0 ? 'firstRemoval' : 'otherRemovals'" @click="removeFromShoppingCart(product._id)"></i>
            </li>
            <li v-if="products.length" class="container product lowerProduct">
                <div class="totalCost">
                    <b>Total: {{totalCost}}</b>
                    <i class="fas fa-times totalRemoval" @click="clearShoppingCart()"></i>
                </div>
                <button type="button" class="btn btn-primary checkout" @click="openShoppingCart()">Go to shopping cart</button>
            </li>
            <li v-else class="container noProducts">
                Your shopping cart is empty!
            </li>
        </ul>
    </div>
</template>

<script>
    import helper from "./Helper.vue";
    import route from "./Route.vue";

    export default {
        name: "cart",
        methods: {
            removeFromShoppingCart(productId) {
                this.$store.dispatch("removeFromShoppingCart", productId);
            },
            clearShoppingCart() {
                this.$store.dispatch("clearShoppingCart");
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
            openShoppingCart() {
                route.methods.openShoppingCart();
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
                return this.formatNumber(totalCost);
            }
        }
    }
</script>

<style scoped>
    .badge {
        margin-left: 5px;
    }
    .dropdown-menu {
        margin-top: 8px !important;
        width: 400px;
    }
    .scrollable {
        max-height: 650px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .row {
        margin: 0px;
        cursor: default;
    }
    .img-fluid {
        height: 85px;
    }
    h3 {
        overflow: hidden;
        white-space: nowrap;
    }
    .product {
        position: relative;
    }
    .lowerProduct {
        padding-top: 10px;
        cursor: default;
    }
    .dropdownDivider { 
        padding-bottom: 10px;
        border-bottom: 1px #000 solid;
    }
    .fas.fa-times {
        position: absolute;
        color: red;
        cursor: pointer;
    }
    .productRemoval {
        left: 355px;
    }
    .totalRemoval {
        left: 365px;
    }
    .firstRemoval {
        top: 0px;
    }
    .otherRemovals {
        top: 10px;
    }
    .fas.fa-external-link-square-alt {
        cursor: pointer;
    }
    a {
        color: #000;
        text-decoration: none;
    }
    .totalCost {
        width: 100%;
    }
    .checkout {
        width: 100%;
        margin-top: 10px;
    }
    .noProducts {
        text-align: center;
        font-weight: bold;
    }
</style>