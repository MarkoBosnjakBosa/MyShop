<template>
    <div id="invoices" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Invoices</h1>
                <div class="invoices">
                    <div v-for="invoice in invoices" :key="invoice._id" class="accordion-item">
                        <h2 class="accordion-header" :id="'heading_' + invoice._id">
                            <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + invoice._id" aria-expanded="false">
                                Invoice #: {{invoice.invoiceNumber}}
                            </button>
                        </h2>
                        <div id="invoices" class="accordion">
                            <div :id="'collapse_' + invoice._id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + invoice._id" data-bs-parent="#invoices">
                                <div class="row">
                                    <div class="col-md-8">
                                        Created: <b>{{invoice.created}}</b><br>
                                        Payment type: <b>{{invoice.paymentType}}</b>
                                    </div>
                                    <div class="col-md-4">
                                        <i class="fas fa-external-link-square-alt icon" @click="openInvoice(invoice._id)"></i>
                                        <i class="fas fa-file-download icon" @click="downloadInvoice(invoice.invoiceNumber)"></i>
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
        name: "invoices",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                username: this.$store.getters.getUser,
                invoices: [],
                page: 1,
                pagesNumber: 1
            }
        },
        methods: {
            getInvoices() {
                var body = {username: this.username, page: this.page};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getInvoices", body).then(response => {
                    this.invoices = response.data.invoices;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getInvoices();
                }
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            downloadInvoice(invoiceNumber) {
                route.methods.downloadInvoice(invoiceNumber);
            },
            openInvoice(invoiceId) {
                route.methods.openInvoice(invoiceId);
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            this.getInvoices();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .invoices {
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