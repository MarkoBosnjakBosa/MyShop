<template>
    <div id="invoice" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Invoice #: {{invoice.invoiceNumber}}</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="invoiceNavTab" data-bs-toggle="tab" data-bs-target="#invoiceTab" class="nav-link active" role="tab">Invoice</button>
                    <button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link" role="tab">Address</button>
                </div>
                <div class="tab-content">
                    <div id="invoiceTab" class="tab-pane fade active show" role="tabpanel">
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
                                <tr v-for="(product, index) in invoice.products" :key="product._id">
                                    <th>{{++index}}</th>
                                    <td class="title">{{product.title}}</td>
                                    <td>{{formatNumber(product.price)}}</td>
                                    <td>{{product.selectedQuantity}}</td>
                                    <td>{{formatNumber(Number(product.selectedQuantity) * Number(product.price))}}</td>
                                </tr>
                                <tr>
                                    <th colspan="4" class="total">Total</th>
                                    <th class="total">{{invoice.totalPrice}}</th>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <button type="button" class="btn btn-dark" @click="downloadInvoice()">Download <i class="fas fa-file-download"></i></button>
                            <button type="button" class="btn btn-dark nextButton" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="addressTab" class="tab-pane fade" role="tabpanel">
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Street:</label>
                            <div class="col-md-9">
                                <input type="text" id="street" class="form-control" v-model="address.street" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">House number:</label>
                            <div class="col-md-9">
                                <input type="text" id="houseNumber" class="form-control" v-model="address.houseNumber" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">City:</label>
                            <div class="col-md-9">
                                <input type="text" id="city" class="form-control" v-model="address.city" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">ZIP code:</label>
                            <div class="col-md-9">
                                <input type="text" id="zipCode" class="form-control" v-model="address.zipCode" disabled>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-md-3 col-form-label">Country:</label>
                            <div class="col-md-9">
                                <input type="text" id="country" class="form-control" v-model="address.country" disabled>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="btn btn-dark" @click="toggleTab('invoice')"><i class="fas fa-angle-double-left"></i> Previous</button>
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
        name: "invoice",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                invoiceId: "",
                username: this.$store.getters.getUser,
                invoice: {
                    invoiceNumber: 0,
                    date: "",
                    paymentType: "",
                    products: [],
                    totalPrice: 0
                },
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
            getInvoice() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getInvoice/" + this.invoiceId + "/" + this.username).then(response => {
                    this.invoice = response.data.invoice;
                    this.address = response.data.address;
                }).catch(error => console.log(error));
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
            },
            downloadInvoice() {
                route.methods.downloadInvoice(this.invoice.invoiceNumber);
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            this.invoiceId = this.$route.params.invoiceId;
            this.getInvoice();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #invoiceTab, #addressTab {
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
    }
    .nextButton {
        float: right;
        margin-left: 5px;
    }
</style>