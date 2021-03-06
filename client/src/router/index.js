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
import Shop from "../views/Shop.vue";
import ShopCategory from "../views/ShopCategory.vue";
import ViewProduct from "../views/ViewProduct.vue";
import ShoppingCart from "../views/ShoppingCart.vue";
import Checkout from "../views/checkout/Checkout.vue";
import CheckoutSuccess from "../views/checkout/CheckoutSuccess.vue";
import CheckoutCancel from "../views/checkout/CheckoutCancel.vue";
import ViewOrders from "../views/ViewOrders.vue";
import ViewOrder from "../views/ViewOrder.vue";
import Contact from "../views/Contact.vue";
import HomeSettings from "../views/admin/HomeSettings.vue";
import Categories from "../views/admin/Categories.vue";
import TechnicalData from "../views/admin/TechnicalData.vue";
import Products from "../views/admin/Products.vue";
import CreateProduct from "../views/admin/CreateProduct.vue";
import EditProduct from "../views/admin/EditProduct.vue";
import Orders from "../views/admin/Orders.vue";
import Order from "../views/admin/Order.vue";
import Contacts from "../views/admin/Contacts.vue";
import ContactSettings from "../views/admin/ContactSettings.vue";
import Chats from "../views/admin/Chats.vue";
import Users from "../views/admin/Users.vue";
import ViewProfile from "../views/admin/ViewProfile.vue";
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
	{path: "/shop", name: "Shop", component: Shop},
	{path: "/shop/category/:categoryId", name: "ShopCategory", component: ShopCategory},
	{path: "/view/product/:productId", name: "ViewProduct", component: ViewProduct},
	{path: "/shopping/cart", name: "ShoppingCart", component: ShoppingCart},
	{path: "/checkout", name: "Checkout", component: Checkout},
	{path: "/checkout/success", name: "CheckoutSuccess", component: CheckoutSuccess},
	{path: "/checkout/cancel", name: "CheckoutCancel", component: CheckoutCancel},
	{path: "/view/orders", name: "ViewOrders", component: ViewOrders},
	{path: "/view/order/:orderId", name: "ViewOrder", component: ViewOrder},
	{path: "/contact", name: "Contact", component: Contact},
	{path: "/admin/home/settings", name: "HomeSettings", component: HomeSettings},
	{path: "/admin/categories", name: "Categories", component: Categories},
	{path: "/admin/technical/data", name: "TechnicalData", component: TechnicalData},
	{path: "/admin/products", name: "Products", component: Products},
	{path: "/admin/create/product", name: "CreateProduct", component: CreateProduct},
	{path: "/admin/edit/product/:productId", name: "EditProduct", component: EditProduct},
	{path: "/admin/orders", name: "Orders", component: Orders},
	{path: "/admin/order/:orderId", name: "Order", component: Order},
	{path: "/admin/contacts", name: "Contacts", component: Contacts},
	{path: "/admin/contact/settings", name: "ContactSettings", component: ContactSettings},
	{path: "/admin/chats", name: "Chats", component: Chats},
	{path: "/admin/users", name: "Users", component: Users},
	{path: "/admin/view/profile/:userId", name: "ViewProfile", component: ViewProfile},
	{path: "/:catchAll(.*)", name: "PageNotFound", component: PageNotFound}
]

const router = createRouter({history: createWebHistory(process.env.BASE_URL), routes});
export default router;