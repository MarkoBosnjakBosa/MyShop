import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Registration from "../views/Registration.vue";
import ConfirmRegistration from "../views/ConfirmRegistration.vue";
import Login from "../views/Login.vue";
import Authentication from "../views/Authentication.vue";
import ForgotCredentials from "../views/ForgotCredentials.vue";
import ResetPassword from "../views/ResetPassword.vue";
import Profile from "../views/Profile.vue";
import PageNotFound from "../views/PageNotFound.vue";

const routes = [
	{
		path: "/home",
		name: "Home",
		component: Home
	},
	{
		path: "/registration",
		name: "Registration",
		component: Registration
	},
	{
		path: "/confirm/registration",
		name: "ConfirmRegistration",
		component: ConfirmRegistration
	},
	{
		path: "/login",
		name: "Login",
		component: Login
	},
	{
		path: "/authentication",
		name: "Authentication",
		component: Authentication
	},
	{
		path: "/forgot/credentials",
		name: "ForgotCredentials",
		component: ForgotCredentials
	},
	{
		path: "/reset/password",
		name: "ResetPassword",
		component: ResetPassword
	},
	{
		path: "/profile",
		name: "Profile",
		component: Profile
	},
	{
		path: "/:catchAll(.*)",
		name: "PageNotFound",
		component: PageNotFound
	}
]

const router = createRouter({history: createWebHistory(process.env.BASE_URL), routes});

export default router;