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
            openInvoices() {
                router.push("/invoices");
            },
            openInvoice(invoiceId) {
                router.push("/invoice/" + invoiceId);
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
            openCreateProduct() {
                router.push("/admin/create/product");
            },
            openEditProduct(productId) {
                router.push("/admin/edit/product/" + productId);
            },
            openCategories() {
                router.push("/admin/categories");
            },
            openTechnicalData() {
                router.push("/admin/technical/data");
            },
            openHomeSettings() {
                router.push("/admin/home/settings");
            },
            openContacts() {
                router.push("/admin/contacts");
            },
            openContactSettings() {
                router.push("/admin/contact/settings");
            },
            openChats() {
                router.push("/admin/chats");
            },
            openUsers() {
                router.push("/admin/users");
            },
            openViewProfile(userId) {
                router.push("/admin/view/profile/" + userId);
            },
            openShop() {
                router.push("/shop");
            },
            openShopCategory(categoryId) {
                router.push("/shop/category/" + categoryId);
            },
            openViewProduct(productId) {
                router.push("/view/product/" + productId);
            },
            openShoppingCart() {
                router.push("/shopping/cart");
            },
            openCheckout() {
                router.push("/checkout");
            },
            openCheckoutSuccess() {
                router.push("/checkout/success");
            },
            openCheckoutCancel() {
                router.push("/checkout/cancel");
            },
            openPageNotFound() {
                router.push("/pageNotFound");
            },
            downloadInvoice(invoiceNumber) {
                window.open(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/downloadInvoice/" + invoiceNumber, "_blank");
            },
            logout() {
                store.dispatch("logout");
                router.push("/login");
            }
        }
    }
</script>