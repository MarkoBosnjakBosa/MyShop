<template>
    <div id="checkout" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Checkout</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link active" role="tab">Address</button>
                    <button type="button" id="paymentNavTab" data-bs-toggle="tab" data-bs-target="#paymentTab" class="nav-link" role="tab">Payment</button>
                </div>
                <div class="tab-content">
                    <div id="addressTab" class="tab-pane fade active show" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Street:</label>
                            <div class="col-9">
                                <input type="text" id="street" class="form-control" v-model="address.street" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">House number:</label>
                            <div class="col-9">
                                <input type="text" id="houseNumber" class="form-control" v-model="address.houseNumber" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">City:</label>
                            <div class="col-9">
                                <input type="text" id="city" class="form-control" v-model="address.city" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">ZIP code:</label>
                            <div class="col-9">
                                <input type="text" id="zipCode" class="form-control" v-model="address.zipCode" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Country:</label>
                            <div class="col-9">
                                <input type="text" id="country" class="form-control" v-model="address.country" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Mobile number:</label>
                            <div class="col-9">
                                <div class="input-group">
                                    <div class="input-group-text countryCodePrefix">+</div>
                                    <input type="text" id="mobileNumber" class="form-control" v-model="address.mobileNumber" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Email:</label>
                            <div class="col-9">
                                <input type="text" id="email" class="form-control" v-model="address.email" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 alert alert-dark" role="alert">
                            If your address has changed, please update it.<br>
                            If everything fits, you can proceed with your payment.
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-secondary" @click="openProfile()">Update <i class="fas fa-pencil-alt"></i> </button>
                            <button type="button" class="btn btn-secondary payment" @click="toggleTab('payment')">Payment <i class="fas fa-cart-arrow-down"></i></button>
                        </div>
                    </div>
                    <div id="paymentTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 row">
                            <div class="col stripe">
                                <h3>Credit card <i class="fab fa-cc-stripe"></i></h3>
                                <button id="stripeCheckout" class="btn btn-primary" @click="openStripeCheckout()">Pay {{totalCost}}</button>
                            </div>
                            <div class="col payPal">
                                <h3>PayPal <i class="fab fa-cc-paypal"></i></h3>
                                <div ref="paypal"></div>
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
                products: this.$store.getters.getShoppingCart,
                address: {
                    street: "",
                    houseNumber: 0,
                    city: "",
                    zipCode: 0,
                    country: "",
                    mobileNumber: "",
                    email: ""
                },
                totalCost: "0.00 €",
                stripe: ""
            }
        },
        methods: {
            checkShoppingCart() {
                if(!this.products.length) {
                    this.openCheckoutCancel();
                } else {
                    this.getUser();
                    this.getTotalCost();
                    this.includeStripeAndPayPal();
                }
            },
            getUser() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUser/" + this.username).then(response => {
                    this.address = response.data.address;
                    this.address.mobileNumber = response.data.account.mobileNumber;
                    this.address.email = response.data.account.email;
                }).catch(error => console.log(error));
            },
            getTotalCost() {
                var products = this.$store.getters.getShoppingCart;
                var totalCost = 0;
                products.forEach(function(product) {
                    totalCost += Number(product.price) * Number(product.selectedQuantity);
                });
                this.totalCost = this.formatNumber(totalCost);
            },
            openStripeCheckout() {
                document.getElementById("stripeCheckout").innerHTML = "<i class='fas fa-spinner fa-spin'></i>";
                var line_items = this.products.map(product => {
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
                    this.$store.dispatch("setCheckout", "Credit card");
                    return this.stripe.redirectToCheckout({sessionId: response.data.sessionId});
                }).catch(error => console.log(error));
            },
            includeStripeAndPayPal() {
                var stripeScript = document.createElement("script");
                stripeScript.src = "https://js.stripe.com/v3/";
                stripeScript.addEventListener("load", this.configureStripe);
                document.body.appendChild(stripeScript);
                var payPalScript = document.createElement("script");
                payPalScript.src = "https://www.paypal.com/sdk/js?client-id=" + process.env.VUE_APP_PAYPAL_CLIENT_ID + "&currency=EUR";
                payPalScript.addEventListener("load", this.configurePayPal);
                document.body.appendChild(payPalScript);
            },
            configureStripe(){
                this.stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);            
            },
            configurePayPal() {
                var purchase_units = [];
                var amount = {};
                amount.currency_code = "EUR";
                var value = 0;
                this.products.forEach(product => {
                    value += product.price * product.selectedQuantity;
                });
                amount.value = value.toFixed(2);
                var breakdown = {};
                var item_total = {};
                item_total.currency_code = "EUR";
                item_total.value = value.toFixed(2);
                breakdown.item_total = item_total;
                amount.breakdown = breakdown;
                var items = this.products.map(product => {
                    var item = {};
                    item.name = product.title;
                    var unit_amount = {};
                    unit_amount.currency_code = "EUR";
                    unit_amount.value = product.price;
                    item.unit_amount = unit_amount;
                    item.quantity = product.selectedQuantity;
                    return item;
                });
                var purchase_unit = {};
                purchase_unit.description = "Purchase at MyShop";
                purchase_unit.amount = amount;
                purchase_unit.items = items;
                purchase_units = [...purchase_units, purchase_unit];
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({purchase_units: purchase_units});
                    },
                    onApprove: async(data, actions, response) => {
                        const payment = await actions.order.capture();
                        this.$store.dispatch("setCheckout", "PayPal");
                        this.openCheckoutSuccess();
                    },
                    onError: (error) => {
                        this.openCheckoutCancel();
                    }
                }).render(this.$refs.paypal);
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
            },
            openProfile() {
                route.methods.openProfile();
            },
            openCheckoutSuccess() {
                route.methods.openCheckoutSuccess();
            },
            openCheckoutCancel() {
                route.methods.openCheckoutCancel();
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            this.checkShoppingCart();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .nav-tabs, #addressTab, #paymentTab {
        margin: auto;
        max-width: 600px;
        margin-top: 20px;
    }
    .countryCodePrefix {
        background-color: #fff;
    }
    .stripe, .payPal {
        background-color: #f4f4f2;
        border-radius: 10px;
        padding: 20px;
        margin-right: 10px;
        text-align: center;
    }
    h3 {
        margin-bottom: 10px;
    }
    .payment {
        float: right;
    }
</style>