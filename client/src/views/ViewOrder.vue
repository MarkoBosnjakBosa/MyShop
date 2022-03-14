<template>
    <div id="viewOrder" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Order #{{order.orderNumber}}</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="orderNavTab" data-bs-toggle="tab" data-bs-target="#orderTab" class="nav-link active" role="tab">Order</button>
                    <button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link" role="tab">Address</button>
                </div>
                <div class="tab-content">
                    <div id="orderTab" class="tab-pane fade active show" role="tabpanel">
                        <table class="table">
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
                                    <td>{{product.title}}</td>
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
                                    <th>{{new Date(order.createdAt).toLocaleString("en-US")}}</th>
                                </tr>
                            </tbody>
                        </table>
                        <div class="mb-3">
                            <button v-if="order.isDispatched" type="button" class="btn btn-success">Dispatched {{new Date(order.dispatchedAt).toLocaleString("en-US")}}</button>
                            <button v-else type="button" class="btn btn-danger">Not dispatched</button>
                            <button type="button" class="btn btn-dark download" @click="downloadInvoice()">Download <i id="download" class="fas fa-file-download"></i></button>
                            <button type="button" class="btn btn-dark next" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="addressTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Street:</label>
                            <div class="col-9">
                                <input type="text" id="street" class="form-control" v-model="order.user.address.street" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">House number:</label>
                            <div class="col-9">
                                <input type="text" id="houseNumber" class="form-control" v-model="order.user.address.houseNumber" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">City:</label>
                            <div class="col-9">
                                <input type="text" id="city" class="form-control" v-model="order.user.address.city" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">ZIP code:</label>
                            <div class="col-9">
                                <input type="text" id="zipCode" class="form-control" v-model="order.user.address.zipCode" disabled/>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-3 col-form-label">Country:</label>
                            <div class="col-9">
                                <input type="text" id="country" class="form-control" v-model="order.user.address.country" disabled/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-dark" @click="toggleTab('order')"><i class="fas fa-angle-double-left"></i> Previous</button>
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
        name: "viewOrder",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                order: {
                    _id: "",
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
                            houseNumber: 0,
                            city: "",
                            zipCode: 0,
                            country: ""
                        }
                    }
                }
            }
        },
        methods: {
            getOrder() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getOrder/" + this.order._id).then(response => {
                    this.order = response.data.order;
                }).catch(error => route.methods.openPageNotFound());
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
            },
            downloadInvoice() {
                document.getElementById("download").classList.remove("fa-file-download");
                document.getElementById("download").classList.add("fa-spinner", "fa-spin");
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/downloadInvoice/" + this.order._id).then(response => {
                    if(response.data.downloaded) {
                        document.getElementById("download").classList.remove("fa-spinner", "fa-spin");
                        document.getElementById("download").classList.add("fa-file-download");
                        route.methods.downloadFile(response.data.fileName);
                    }
                }).catch(error => console.log(error));
            }
        },
        created() {
            var temp = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) {
                    temp.order._id = temp.$route.params.orderId;
                    temp.getOrder();
                } else {
                    route.methods.openLogin();
                }
            });
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .nav-tabs, #orderTab, #addressTab {
        margin: auto;
        max-width: 800px;
        margin-top: 20px;
    }
    .download {
        margin-left: 5px;
    }
    .next {
        float: right;
        margin-left: 5px;
    }
</style>