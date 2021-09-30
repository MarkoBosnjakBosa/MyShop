<template>
    <div id="order" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Order #{{order.orderNumber}}</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="orderNavTab" data-bs-toggle="tab" data-bs-target="#orderTab" class="nav-link active" role="tab">Order</button>
                    <button type="button" id="accountNavTab" data-bs-toggle="tab" data-bs-target="#accountTab" class="nav-link" role="tab">Account</button>
                    <button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link" role="tab">Address</button>
                </div>
                <div class="tab-content">
                    <div id="orderTab" class="tab-pane fade active show" role="tabpanel">
                        <table class="table table-secondary">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(product, index) in order.products" :key="product._id">
                                    <th>{{++index}}</th>
                                    <td class="title" data-toggle="tooltip" :title="product.title">{{product.title}}</td>
                                    <td>{{formatNumber(product.price)}}</td>
                                    <td>{{product.selectedQuantity}}</td>
                                    <td>{{formatNumber(Number(product.selectedQuantity) * Number(product.price))}}</td>
                                </tr>
                                <tr>
                                    <th colspan="4">Total</th>
                                    <th>{{order.totalPrice}}</th>
                                </tr>
                                <tr>
                                    <th colspan="4">Created at</th>
                                    <th>{{order.createdAt}}</th>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <button v-if="!order.isDispatched" type="button" class="btn btn-primary" @click="dispatchOrder()">Dispatch</button>
                            <button v-else type="button" class="btn btn-success">Dispatched: {{order.dispatchedAt}}</button>
                            <button type="button" class="btn btn-dark download" @click="downloadInvoice()">Download <i class="fas fa-file-download"></i></button>
                            <button type="button" class="btn btn-dark nextButton" @click="toggleTab('account')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="accountTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Username:</label>
                            <div class="col-md-9">
                                <input type="text" id="street" class="form-control" v-model="order.user.account.username" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Email:</label>
                            <div class="col-md-9">
                                <input type="text" id="houseNumber" class="form-control" v-model="order.user.account.email" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">First name:</label>
                            <div class="col-md-9">
                                <input type="text" id="city" class="form-control" v-model="order.user.account.firstName" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Last name:</label>
                            <div class="col-md-9">
                                <input type="text" id="zipCode" class="form-control" v-model="order.user.account.lastName" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Mobile number:</label>
                            <div class="col-md-9">
                                <input type="text" id="country" class="form-control" v-model="order.user.account.mobileNumber" disabled>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="btn btn-dark" @click="toggleTab('order')"><i class="fas fa-angle-double-left"></i> Previous</button>
                            <button type="button" class="btn btn-dark nextButton" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="addressTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Street:</label>
                            <div class="col-md-9">
                                <input type="text" id="street" class="form-control" v-model="order.user.address.street" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">House number:</label>
                            <div class="col-md-9">
                                <input type="text" id="houseNumber" class="form-control" v-model="order.user.address.houseNumber" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">City:</label>
                            <div class="col-md-9">
                                <input type="text" id="city" class="form-control" v-model="order.user.address.city" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">ZIP code:</label>
                            <div class="col-md-9">
                                <input type="text" id="zipCode" class="form-control" v-model="order.user.address.zipCode" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Country:</label>
                            <div class="col-md-9">
                                <input type="text" id="country" class="form-control" v-model="order.user.address.country" disabled>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="btn btn-dark" @click="toggleTab('account')"><i class="fas fa-angle-double-left"></i> Previous</button>
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
        name: "order",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                orderId: "",
                order: {
                    orderNumber: "",
                    userId: "",
                    paymentType: "",
                    products: [],
                    totalPrice: "",
                    createdAt: "",
                    isDispatched: false,
                    dispatchedAt: "",
                    user: {
                        account: {
                            username: "",
                            email: "",
                            firstName: "",
                            lastName: "",
                            mobileNumber: ""
                        },
                        address: {
                            street: "",
                            houseNumber: "",
                            city: "",
                            zipCode: "",
                            country: ""
                        }
                    }
                }
            }
        },
        methods: {
            getOrder() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getOrder/" + this.orderId).then(response => {
                    this.order = response.data.order;
                }).catch(error => console.log(error));
            },
            dispatchOrder() {
                var confirmed = confirm("Dispatch order #" + this.order.orderNumber + "?");
                if(confirmed) {
                    var body = {orderId: this.orderId};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/dispatchOrder", body).then(response => {
                        if(response.data.isDispatched) {
                            this.order.isDispatched = response.data.isDispatched;
                            this.order.dispatchedAt = response.data.dispatchedAt;
                        }
                    }).catch(error => console.log(error));
                }
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
            },
            downloadInvoice() {
                route.methods.downloadInvoice(this.order.orderNumber);
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
            this.orderId = this.$route.params.orderId;
            this.getOrder();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #orderTab, #accountTab, #addressTab {
        margin: auto;
        max-width: 800px;
        margin-top: 20px;
    }
    table {
        table-layout: fixed;
        width: 100%;
    }
    .title {
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
    }
    .download {
        margin-left: 5px;
    }
    .nextButton {
        float: right;
        margin-left: 5px;
    }
</style>