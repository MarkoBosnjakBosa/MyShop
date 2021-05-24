<template>
    <div id="invoice" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Invoice #: {{invoice.invoiceNumber}}</h1>
                
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
                var body = {invoiceId: this.invoiceId, username: this.username};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getInvoice", body).then(response => {
					this.invoice = response.data.invoice;
                    this.address = resonse.data.address;
				}).catch(error => console.log(error));
            },
            formatNumber(number) {
                return helper.methods.formatNumber(number);
            },
            downloadInvoice(invoiceNumber) {
                route.methods.downloadInvoice(invoiceNumber);
            }
        },
        mounted() {
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
</style>