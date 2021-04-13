<script>
    import router from "../router/index.js";
    import store from "../store/index.js";
    var axios = require("axios");
    
    export default {
        name: "checkLogin",
        methods: {
            isLoggedIn() {
                if(!store.getters.isLoggedIn && !this.checkStatus()) {
                    router.push("/login");
                } else {
                    this.username = store.getters.getUser;
                    this.isAdmin = store.getters.isAdmin;
                }
            },
            checkStatus() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkStatus").then(response => {
                   if(response.data.verified) { 
                       return true;
                   } else {
                       return false;
                   }
                }).catch(error => console.log(error));
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