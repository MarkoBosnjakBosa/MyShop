<script>
    import router from "../router/index.js";
    import store from "../store/index.js";
    const axios = require("axios");
    
    export default {
        name: "checkLogin",
        methods: {
            isLoggedIn() {
                if(!store.getters.isLoggedIn) {
                    axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkStatus").then(response => {
                        if(!response.data.loggedIn) {
                            router.push("/login");
                        }
                    }).catch(error => console.log(error));
                }
            },
            isAdmin() {
                if(store.getters.isLoggedIn) {
                    if(!store.getters.isAdmin) {
                        router.push("/home");
                    }
                } else {
                    router.push("/login");
                }
            },
            getUserData() {
                if(store.getters.isLoggedIn) {
                    return {isLoggedIn: true, username: store.getters.getUser, isAdmin: store.getters.isAdmin};
                } else {
                    return {isLoggedIn: false, username: "", isAdmin: false};
                }
            }
        }
    }
</script>