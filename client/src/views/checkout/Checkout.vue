<template>
    <div id="checkout" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Checkout</h1>
                 <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link active" role="tab">Address</button>
                    <button type="button" id="paymentNavTab" data-bs-toggle="tab" data-bs-target="#paymentTab" class="nav-link" role="tab">Payment</button>
                </div>
                <div class="tab-content">
                    <div id="addressTab" class="tab-pane fade active show" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Street:</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" v-model="address.street" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">House number:</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" v-model="address.houseNumber" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">City:</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" v-model="address.city" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">ZIP code:</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" v-model="address.zipCode" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Country:</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" v-model="address.country" disabled>
                            </div>
                        </div>
                        <div class="mb-3 alert alert-dark" role="alert">
                            If your address has changed, please update it.<br>
                            If everything fits, you can proceed with your payment.
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-secondary" @click="openProfile()">Update <i class="fas fa-pencil-alt"></i> </button>
                            <button type="button" class="btn btn-secondary paymentButton" @click="toggleTab('payment')">Payment <i class="fas fa-cart-arrow-down"></i></button>
                        </div>
                    </div>
                    <div id="paymentTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 row">
                            <div class="col stripe">
                                <h3>Credit card <i class="fab fa-cc-stripe"></i></h3>
                                <button class="btn btn-primary" @click="openStripeCheckout()">Pay {{totalCost}}</button>
                            </div>
                            <div class="col payPal">
                                <h3>PayPal <i class="fab fa-cc-paypal"></i></h3>
                                <button class="btn btn-primary" @click="openPayPalCheckout()">Pay {{totalCost}}</button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-secondary" @click="toggleTab('address')">Address <i class="fas fa-address-book"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import checkLogin from "../../components/CheckLogin.vue";
	import navigation from "../../components/Navigation.vue";
	import sidebar from "../../components/Sidebar.vue";
    import helper from "../../components/Helper.vue";
    import route from "../../components/Route.vue";
	const axios = require("axios");
	
	export default {
		name: "checkout",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                username: this.$store.getters.getUser,
                address: {
                    street: "",
					houseNumber: "",
					city: "",
					zipCode: "",
					country: ""
                },
                totalCost: "0.00 €",
                stripe: "",
                stripePublishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
			}
		},
        methods: {
            getUser() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUser/" + this.username).then(response => {
					this.address = response.data.address;
				}).catch(error => console.log(error));
            },
            getTotalCost() {
                var products = this.$store.getters.getShoppingCart;
                var totalCost = 0;
                products.forEach(function(product) {
                    totalCost += Number(product.price) * Number(product.selectedQuantity);
                });
                this.totalCost = this.formatNumber(totalCost) + " €";
            },
            openProfile() {
                route.methods.openProfile();
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
			},
            formatNumber(number) {
                return helper.methods.formatNumber(number.toString());
            },
            openStripeCheckout() {
                var products = this.$store.getters.getShoppingCart;
                var line_items = products.map(product => {
                    var line_item = {};
                    line_item.quantity = Number(product.selectedQuantity);
                    var price_data = {};
                    price_data.currency = "eur";
                    price_data.unit_amount = Number(product.price.split(".").join(""));
                    var product_data = {};
                    product_data.name = product.title;
                    price_data.product_data = product_data;
                    line_item.price_data = price_data;
                    return line_item;
                });
                var body = {line_items: JSON.stringify(line_items)};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/stripe/checkout", body).then(response => {
                    return this.stripe.redirectToCheckout({sessionId: response.data.sessionId});
                }).catch(error => console.log(error));
            },
            includeStripe(stripeUrl, callback) {
                var script = "script";
                var element = document.createElement(script);
                var scriptTag = document.getElementsByTagName(script)[0];
                element.src = stripeUrl;
                if(callback) element.addEventListener("load", function(event) {callback(null, event);}, false);
                scriptTag.parentNode.insertBefore(element, scriptTag);
            },
            configureStripe(){
                this.stripe = Stripe(this.stripePublishableKey);            
            }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.getUser();
            this.getTotalCost();
            this.includeStripe("https://js.stripe.com/v3/", function() {this.configureStripe();}.bind(this));
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #addressTab, #paymentTab {
        margin: 0 auto;
        margin-top: 20px;
        max-width: 600px;
    }
    .stripe, .payPal {
        background-color: #f4f4f2;
        border-radius: 10px;
        padding: 20px;
        margin-right: 10px;
        text-align: center;
    }
    .paymentButton {
        float: right;
    }
</style>