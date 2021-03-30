import {createRouter, createWebHistory} from "vue-router";
import Registration from "../views/Registration.vue";
import PageNotFound from "../views/PageNotFound.vue";

const routes = [
	{
		path: "/registration",
		name: "Registration",
		component: Registration
	},
	{
		path: "/:catchAll(.*)",
		name: "PageNotFound",
		component: PageNotFound
	}
]

const router = createRouter({history: createWebHistory(process.env.BASE_URL), routes});

export default router;