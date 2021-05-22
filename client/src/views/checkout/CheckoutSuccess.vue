<template>
    <div id="checkoutSuccess" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <div class="alert alert-success" role="alert">
                    Your payment has been successfully processed.<br>
                    Thank you for buying at MyShop.
                </div>
                <table class="table table-success table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Product price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in products" :key="product._id">
                            <td>{{++index}}</td>
                            <td>{{product.title}}</td>
                            <td>{{formatNumber(product.price)}}</td>
                            <td>{{product.selectedQuantity}}</td>
                            <td>{{formatNumber(Number(product.selectedQuantity) * Number(product.price))}}</td>
                            <td><i class="fas fa-external-link-alt" @click="openViewProduct(product._id)"></i></td>
                        </tr>
                        <tr>
                            <th colspan="4">Total</th>
                            <th>{{getTotalCost()}}</th>
                            <td><i class="fas fa-file-download" @click="downloadInvoice()"></i></td>
                        </tr>
                    </tbody>
                </table>
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
                products: this.$store.getters.getShoppingCart
			}
		},
        methods: {
            finalizePayment() {
                var productIds = this.products.map(product => {
                    return product._id;
                });
                var body = {username: this.username, products: productIds};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/finalizePayment", body).then(response => {
                    if(response.data.finalized) {

                    }
				}).catch(error => console.log(error));
            },
            getTotalCost() {
                var totalCost = 0;
                this.products.forEach(function(product) {
                    totalCost += Number(product.price) * Number(product.selectedQuantity);
                });
                return this.formatNumber(totalCost);
            },
            downloadInvoice() {

            },
            formatNumber(number) {
                return helper.methods.formatNumber(number.toString()) + " €";
            },
            openViewProduct(productId) {
                route.methods.openViewProduct(productId);
            }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.finalizePayment();
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
</style>