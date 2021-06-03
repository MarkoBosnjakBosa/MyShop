<script>
    import router from "../router/index.js";
    import store from "../store/index.js";
    var axios = require("axios");
    
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
            getUserData() {
                if(store.getters.isLoggedIn) {
                    return {userLoggedIn: true, username: store.getters.getUser, isAdmin: store.getters.isAdmin};
                } else {
                    return {userLoggedIn: false, username: "", isAdmin: false};
                }
            }
        }
    }
</script>