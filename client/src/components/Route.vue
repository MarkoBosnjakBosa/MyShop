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
            openProducts() {
                router.push("/admin/products");
            },
            openCategories() {
                router.push("/admin/categories");
            },
            openTechnicalData() {
                router.push("/admin/technical/data");
            },
            logout() {
                store.dispatch("logout");
                router.push("/login");
            }
        }
    }
</script>