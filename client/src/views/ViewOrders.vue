<template>
    <div id="viewOrders" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Orders</h1>
                <div class="orders">
                    <div v-for="order in orders" :key="order._id" class="accordion-item">
                        <h2 class="accordion-header" :id="'heading_' + order._id">
                            <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + order._id" aria-expanded="false">
                                Order #: {{order.orderNumber}}
                            </button>
                        </h2>
                        <div id="orders" class="accordion">
                            <div :id="'collapse_' + order._id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + order._id" data-bs-parent="#orders">
                                <div class="row">
                                    <div class="col-md-8">
                                        Created: <b>{{order.created}}</b><br>
                                        Payment type: <b>{{order.paymentType}}</b>
                                    </div>
                                    <div class="col-md-4">
                                        <i class="fas fa-external-link-square-alt icon" @click="openViewOrder(order._id)"></i>
                                        <i class="fas fa-file-download icon" @click="downloadInvoice(order.orderNumber)"></i>
                                    </div>
                                </div>
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
                                            <th colspan="4" class="total">Total</th>
                                            <th class="total">{{order.totalPrice}}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="pages">
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
            downloadInvoice(orderNumber) {
                route.methods.downloadInvoice(orderNumber);
            },
            openViewOrder(orderNumber) {
                route.methods.openViewOrder(orderNumber);
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
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
    .orders {
        margin: auto;
        max-width: 800px;
        margin-top: 20px;
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
        table-layout: fixed;
        width: 100%;
        margin-top: 10px;
    }
    .title {
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
    }
    .total {
        border-bottom: 0px;
    }
    .pages {
        margin: 10px auto;
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
</style>