import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Axios from "axios";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

Axios.defaults.headers.common["Authorization"] = "Bearer " + store.state.login.token;

createApp(App).use(store).use(router).mount("#app");