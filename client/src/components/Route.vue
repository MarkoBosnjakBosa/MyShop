<script>
    import router from "../router/index.js";
    import store from "../store/index.js";

    export default {
        name: "route",
        methods: {
            openHome() {
                router.push("/home");
            },
            openContact() {
                router.push("/contact");
            },
            openRegistration() {
                router.push("/registration");
            },
            openForgotCredentials() {
				router.push("/forgot/credentials");
			},
            openProfile() {
                router.push("/profile");
            },
            openSetup() {
                router.push("/setup");
            },
            openOrders() {
                router.push("/orders");
            },
            openLogin() {
                router.push("/login");
            },
            openAuthentication() {
                router.push("/authentication");
            },
            openHomeSettings() {
                router.push("/admin/home/settings");
            },
            openProducts() {
                router.push("/admin/products");
            },
            openCreateProduct() {
                router.push("/admin/create/product");
            },
            openCategories() {
                router.push("/admin/categories");
            },
            openTechnicalData() {
                router.push("/admin/technical/data");
            },
            openEditProduct(productId) {
                router.push("/admin/edit/product/" + productId);
            },
            logout() {
                store.dispatch("logout");
                router.push("/login");
            }
        }
    }
</script>