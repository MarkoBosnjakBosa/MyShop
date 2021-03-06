import {createApp} from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import Axios from "axios";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

Axios.defaults.headers.common["Application-User"] = store.state.login.user;
Axios.defaults.headers.common["Authorization"] = "Bearer " + store.state.login.token;

createApp(App).use(store).use(router).mount("#app");