<script>
    import store from "../store/index.js";
    const axios = require("axios");
    
    export default {
        name: "checkLogin",
        methods: {
            isLoggedIn(callback) {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkStatus").then(response => {
                    return callback(response.data.isLoggedIn);
                }).catch(error => console.log(error));
            },
            isAdmin(callback) {
                return callback(store.getters.isAdmin);
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