<template>
    <div id="checkoutSuccess" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <div v-if="paymentType" class="alert alert-success" role="alert">
                    Your payment has been successfully processed.<br>
                    Thank you for buying at MyShop.
                </div>
                <table v-if="paymentType" class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in products" :key="product._id">
                            <th>{{++index}}</th>
                            <td>{{product.title}}</td>
                            <td>{{formatNumber(product.price)}}</td>
                            <td>{{product.selectedQuantity}}</td>
                            <td>{{formatNumber(Number(product.selectedQuantity) * Number(product.price))}}</td>
                            <td><i class="fas fa-external-link-square-alt" @click="openViewProduct(product._id)"></i></td>
                        </tr>
                        <tr>
                            <th colspan="4">Total</th>
                            <th>{{getTotalCost()}}</th>
                            <td><i v-if="orderId" id="download" class="fas fa-file-download" @click="downloadInvoice()"></i></td>
                        </tr>
                    </tbody>
                </table>
                <div class="mb-3 home">
                    <button type="button" class="btn btn-dark" @click="openHome()">Home <i class="fas fa-home"></i></button>
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
        name: "checkoutSuccess",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                username: this.$store.getters.getUser,
                orderId: "",
                paymentType: this.$store.getters.getCheckout,
                products: []
            }
        },
        methods: {
            finalizePayment() {
                if(this.paymentType) {
                    this.products = this.$store.getters.getShoppingCart;
                    var products = this.products.map(product => {
                        var productObject = {};
                        productObject._id = product._id;
                        productObject.title = product.title;
                        productObject.price = product.price;
                        productObject.selectedQuantity = product.selectedQuantity;
                        return productObject;
                    });
                    this.$store.dispatch("clearShoppingCart");
                    var body = {username: this.username, paymentType: this.paymentType, products: products, totalPrice: this.getTotalCost()};
                    axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/finalizePayment", body).then(response => {
                        if(response.data.finalized) {
                            this.orderId = response.data.orderId;
                            this.$store.dispatch("setCheckout", "");
                        }
                    }).catch(error => console.log(error));
                }
            },
            getTotalCost() {
                var totalCost = 0;
                this.products.forEach(function(product) {
                    totalCost += Number(product.price) * Number(product.selectedQuantity);
                });
                return this.formatNumber(totalCost);
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            downloadInvoice() {
                document.getElementById("download").classList.remove("fa-file-download");
                document.getElementById("download").classList.add("fa-spinner", "fa-spin");
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/downloadInvoice/" + this.orderId).then(response => {
                    if(response.data.downloaded) {
                        document.getElementById("download").classList.remove("fa-spinner", "fa-spin");
                        document.getElementById("download").classList.add("fa-file-download");
                        route.methods.downloadFile(response.data.fileName);
                    }
                }).catch(error => console.log(error));
            },
            openViewProduct(productId) {
                route.methods.openViewProduct(productId);
            },
            openHome() {
                route.methods.openHome();
            }
        },
        created() {
            var temp = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) temp.finalizePayment();
                else route.methods.openLogin();
            });
        }
    }
</script>

<style scoped>
    .alert {
        margin: auto;
        margin-top: 20px;
        max-width: 500px;
        text-align: center;
    }
    .table {
        margin: auto;
        margin-top: 20px;
        max-width: 800px;
    }
    .fas {
        cursor: pointer;
    }
    .home {
        margin-top: 20px;
        text-align: center;
    }
</style>