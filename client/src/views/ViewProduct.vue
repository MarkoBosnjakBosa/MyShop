<template>
    <div id="categories" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>{{product.title}}</h1>

            </div>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import checkLogin from "../components/CheckLogin.vue";
	import navigation from "../components/Navigation.vue";
	import sidebar from "../components/Sidebar.vue";
    import helper from "../components/Helper.vue"; 
	const axios = require("axios");
	
	export default {
		name: "viewProduct",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                productId: "",
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: "",
                    category: "",
                    technicalData: [],
                    primaryImage: "",
                    images: []
                }
			}
		},
        methods: {
            getProduct() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProduct/" + this.productId).then(response => {
                    this.product.title = response.data.product.title;
                    this.product.description = response.data.product.description;
                    this.product.price = helper.methods.createDecimalNumber(response.data.product.price.toString());
                    this.product.quantity = response.data.product.quantity;
                    this.product.category = response.data.product.category;
                    this.product.technicalData = response.data.product.technicalData;
                    this.product.primaryImage = response.data.product.primaryImage;
                    this.product.images = response.data.product.images;
                }).catch(error => console.log(error));
            },
            renderImage(image) {
                if(image && !(image instanceof File)) {
                    return "data:" + image.contentType + ";base64," + (new Buffer.from(image.image)).toString("base64");
                } else {
                    return "";
                }
            }
        },
        mounted() {
            checkLogin.methods.isLoggedIn();
            this.productId = this.$route.params.productId;
            this.getProduct();
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