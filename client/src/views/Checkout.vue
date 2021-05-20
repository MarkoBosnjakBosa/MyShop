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
                        <div id="payment" class="mb-3 accordion">
                            <div class="accordion-item">
                                <h2 id="stripe" class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseStripe" aria-expanded="false">
                                       Credit card
                                    </button>
                                </h2>
                                <div id="collapseStripe" class="accordion-collapse collapse" aria-labelledby="stripe" data-bs-parent="#payment">
                                    <div class="accordion-body">
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 id="payPal" class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePayPal" aria-expanded="false">
                                       PayPal
                                    </button>
                                </h2>
                                <div id="collapsePayPal" class="accordion-collapse collapse" aria-labelledby="payPal" data-bs-parent="#payment">
                                    <div class="accordion-body">
                                    </div>
                                </div>
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
	import checkLogin from "../components/CheckLogin.vue";
	import navigation from "../components/Navigation.vue";
	import sidebar from "../components/Sidebar.vue";
    import helper from "../components/Helper.vue";
    import route from "../components/Route.vue";
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
                }
			}
		},
        methods: {
            getUser() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUser/" + this.username).then(response => {
					this.address = response.data.address;
				}).catch(error => console.log(error));
            },
            openProfile() {
                route.methods.openProfile();
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
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
            this.getUser();
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
    .paymentButton {
        float: right;
    }
</style>