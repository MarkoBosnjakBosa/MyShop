import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Registration from "../views/Registration.vue";
import ConfirmRegistration from "../views/ConfirmRegistration.vue";
import Login from "../views/Login.vue";
import Authentication from "../views/Authentication.vue";
import ForgotCredentials from "../views/ForgotCredentials.vue";
import ResetPassword from "../views/ResetPassword.vue";
import Profile from "../views/Profile.vue";
import Setup from "../views/Setup.vue";
import Categories from "../views/admin/Categories.vue";
import TechnicalData from "../views/admin/TechnicalData.vue";
import Products from "../views/admin/Products.vue";
import CreateProduct from "../views/admin/CreateProduct.vue";
import EditProduct from "../views/admin/EditProduct.vue";
import PageNotFound from "../views/PageNotFound.vue";

const routes = [
	{path: "/home", name: "Home", component: Home},
	{path: "/registration", name: "Registration", component: Registration},
	{path: "/confirm/registration", name: "ConfirmRegistration", component: ConfirmRegistration},
	{path: "/login", name: "Login", component: Login},
	{path: "/authentication", name: "Authentication", component: Authentication},
	{path: "/forgot/credentials", name: "ForgotCredentials", component: ForgotCredentials},
	{path: "/reset/password", name: "ResetPassword", component: ResetPassword},
	{path: "/profile", name: "Profile", component: Profile},
	{path: "/setup", name: "Setup", component: Setup},
	{path: "/admin/categories", name: "Categories", component: Categories},
	{path: "/admin/technical/data", name: "TechnicalData", component: TechnicalData},
	{path: "/admin/products", name: "Products", component: Products},
	{path: "/admin/create/product", name: "CreateProduct", component: CreateProduct},
	{path: "/admin/edit/product/:productId", name: "EditProduct", component: EditProduct},
	{path: "/:catchAll(.*)", name: "PageNotFound", component: PageNotFound}
]

const router = createRouter({history: createWebHistory(process.env.BASE_URL), routes});
export default router;