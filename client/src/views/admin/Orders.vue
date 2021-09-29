<template>
    <div id="orders" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Orders</h1>
                <form autocomplete="off" @submit.prevent="getOrders()">
                    <div class="row">
                        <div class="mb-3 col-md-6">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="mb-3 col-md-2">
                            <input type="number" id="limit" min="1" class="form-control" v-model="limit"/>
                        </div>
                        <div class="mb-3 col-md-2">
                            <select id="orderBy" class="form-control" v-model="orderBy">
                                <option value="" selected>Order by</option>
                                <option value="orderNumberAsc">Order number &#129045;</option>
                                <option value="orderNumberDesc">Order number &#129047;</option>
                                <option value="paymentTypeAsc">Payment type &#129045;</option>
                                <option value="paymentTypeDesc">Payment type &#129047;</option>
                                <option value="createdAsc">Created &#129045;</option>
                                <option value="createdDesc">Created &#129047;</option>
                            </select>
                        </div>
                        <div class="btn-group mb-3 col-md-2">
                            <button type="submit" class="btn btn-primary md-1">Search</button>
                            <button type="button" class="btn btn-dark" data-toggle="tooltip" :title="'Total: ' + total">{{total}}</button>
                            <button type="button" class="btn btn-secondary" @click="downloadOrders()"><i class="fas fa-file-csv"></i></button>
                        </div>
                    </div>
                </form>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Order number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Total</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!orders.length">
                            <td colspan="7" class="noOrders">No orders found!</td>
                        </tr>
                        <tr v-for="(order, index) in orders" :key="order._id">
                            <th>{{++index}}</th>
                            <td>{{order.orderNumber}}</td>
                            <td>{{order.user.account.firstName}} {{order.user.account.lastName}}</td>
                            <td>{{order.user.account.email}}</td>
                            <td>{{order.totalPrice}}</td>
                            <td>{{order.created}}</td>
                            <td>
                                <i class="fas fa-external-link-square-alt icon" @click="openOrder(order._id)"></i>
                                <i class="fas fa-file-download icon" @click="downloadInvoice(order.orderNumber)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group pages">
                    <button v-if="page - 1 > 0" type="button" class="btn btn-dark page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                    <button type="button" class="btn btn-dark page">{{page}}</button>
                    <button v-if="page < pagesNumber" type="button" class="btn btn-dark page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import checkLogin from "../../components/CheckLogin.vue";
    import navigation from "../../components/Navigation.vue";
    import sidebar from "../../components/Sidebar.vue";
    import route from "../../components/Route.vue";
    const axios = require("axios");
	
    export default {
        name: "orders",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                orders: [],
                search: "",
                page: 1,
                limit: 10,
                orderBy: "",
                total: 0,
                pagesNumber: 1
            }
        },
        methods: {
            getOrders() {
                var body = {search: this.search, page: this.page, limit: this.limit, orderBy: this.orderBy};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getOrders", body).then(response => {
                    this.orders = response.data.orders;
                    this.total = response.data.total;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            downloadOrders() {
                var body = {search: this.search, page: this.page, limit: this.limit, orderBy: this.orderBy};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/downloadOrders", body).then(response => {
                    if(response.data.downloaded) {
                        route.methods.downloadOrders(response.data.fileName);
                    }
                }).catch(error => console.log(error));
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getProducts();
                }
            },
            downloadInvoice(orderNumber) {
                route.methods.downloadInvoice(orderNumber);
            },
            openOrder(orderId) {
                route.methods.openOrder(orderId);
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
            this.getOrders();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    form {
        margin: auto;
        max-width: 1000px;
    }
    .noOrders {
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
    }
    .icon {
        margin-right: 5px;
        cursor: pointer;
    }
    .pages {
        text-align: center;
        margin: auto;
    }
    .page {
        margin-left: 10px;
    }
</style>