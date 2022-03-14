<template>
    <div id="viewOrders" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Orders</h1>
                <div class="orders">
                    <div v-if="!orders.length" class="mb-3 alert alert-dark" role="alert">
                        There are no orders!
                    </div>
                    <div v-for="order in orders" :key="order._id" class="accordion-item">
                        <h2 class="accordion-header" :id="'heading_' + order._id">
                            <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + order._id" aria-expanded="false">
                                Order #<b>{{order.orderNumber}}</b>
                                <span v-if="order.isDispatched" class="badge bg-success text-light dispatch">Dispatched: {{new Date(order.dispatchedAt).toLocaleString("en-US")}}</span>
                                <span v-else class="badge bg-danger text-light dispatch">Not dispatched</span>
                            </button>
                        </h2>
                        <div :id="'order_' + order._id" class="accordion">
                            <div :id="'collapse_' + order._id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + order._id" :data-bs-parent="'#order_' + order._id">
                                <div class="row">
                                    <div class="col-8">
                                        Created at: <b>{{new Date(order.createdAt).toLocaleString("en-US")}}</b><br>
                                        Payment type: <b>{{order.paymentType}}</b>
                                    </div>
                                    <div class="col-4">
                                        <i class="fas fa-external-link-square-alt icon" @click="openViewOrder(order._id)"></i>
                                        <i :id="'download_' + order._id" class="fas fa-file-download icon" @click="downloadInvoice(order._id)"></i><br>
                                        <span v-if="order.isDispatched" class="badge bg-success text-light dispatchAccordion">Dispatched: {{new Date(order.dispatchedAt).toLocaleString("en-US")}}</span>
                                        <span v-else class="badge bg-danger text-light dispatchAccordion">Not dispatched</span>
                                    </div>
                                </div>
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
                                            <th colspan="4" class="total">Total</th>
                                            <th class="total">{{order.totalPrice}}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3 pages">
                        <button v-if="page - 1 > 0" type="button" class="btn btn-dark page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                        <button type="button" class="btn btn-dark page">{{page}}</button>
                        <button v-if="page < pagesNumber" type="button" class="btn btn-dark page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
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
        name: "viewOrders",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                username: this.$store.getters.getUser,
                orders: [],
                page: 1,
                pagesNumber: 1
            }
        },
        methods: {
            getOrders() {
                var body = {username: this.username, page: this.page};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUserOrders", body).then(response => {
                    this.orders = response.data.orders;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getOrders();
                }
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            downloadInvoice(orderId) {
                document.getElementById("download_" + orderId).classList.remove("fa-file-download");
                document.getElementById("download_" + orderId).classList.add("fa-spinner", "fa-spin");
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/downloadInvoice/" + orderId).then(response => {
                    if(response.data.downloaded) {
                        document.getElementById("download_" + orderId).classList.remove("fa-spinner", "fa-spin");
                        document.getElementById("download_" + orderId).classList.add("fa-file-download");
                        route.methods.downloadFile(response.data.fileName);
                    }
                }).catch(error => console.log(error));
            },
            openViewOrder(orderId) {
                route.methods.openViewOrder(orderId);
            }
        },
        created() {
            var temp = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) temp.getOrders();
                else route.methods.openLogin();
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
    .alert {
        font-weight: bold;
        text-align: center;
    }
    .orders {
        margin: auto;
        max-width: 800px;
        margin-top: 20px;
    }
    .dispatch {
        margin-left: 10px;
    }
    .dispatchAccordion {
        float: right;
    }
    .accordion-collapse {
        padding: 20px;
    }
    .icon {
        float: right;
        margin-right: 5px;
        cursor: pointer;
    }
    table {
        margin-top: 10px;
    }
    .total {
        border-bottom: 0px;
    }
    .pages {
        text-align: center;
        margin-top: 10px;
    }
    .page {
        margin-left: 10px;
    }
</style>