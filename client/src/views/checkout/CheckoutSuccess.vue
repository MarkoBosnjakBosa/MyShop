<template>
    <div id="checkoutSuccess" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
            
            </div>
        </div>
    </div>
</template>

<script>
	import checkLogin from "../../components/CheckLogin.vue";
	import navigation from "../../components/Navigation.vue";
	import sidebar from "../../components/Sidebar.vue";
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
                products: this.$store.getters.getShoppingCart,
			}
		},
        methods: {
            finalizePayment() {
                var body = {username: this.username, products: JSON.stringify(this.products)};
                /*axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/finalizePayment/", body).then(response => {
                    if(response.data.finalized) {

                    }
				}).catch(error => console.log(error));*/
            }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.finalizePayment();
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