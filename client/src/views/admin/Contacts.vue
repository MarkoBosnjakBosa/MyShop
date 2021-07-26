<template>
    <div id="contacts" class="container-fluid">
		<div class="d-flex" id="barsStyle">
			<sidebar></sidebar>
			<div id="pageStyle">
				<navigation></navigation>
                <h1>Contacts</h1>
                <div class="contacts">
                    <div class="card contact" v-for="contact in contacts" :key="contact._id">
                        <div class="card-header">
                            {{contact.firstName}} {{contact.lastName}} <div class="date">{{contact.date}}</div>
                        </div>
                        <div class="card-body">
                            {{contact.message}}
                        </div>
                        <div class="card-footer">
                            {{contact.email}} <a :href="'mailto:' + contact.email" class="btn btn-primary email">Answer</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import checkLogin from "../../components/CheckLogin.vue";
	import navigation from "../../components/Navigation.vue";
	import sidebar from "../../components/Sidebar.vue";
	var axios = require("axios");

    export default {
		name: "contacts",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                contacts: []
            }
        },
        methods: {
            getContacts() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getContacts").then(response => {
                    this.contacts = response.data.contacts;
                }).catch(error => console.log(error));
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            this.getContacts();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .contacts {
        margin: 0 auto;
        max-width: 800px;
    }
    .contact {
        margin-bottom: 10px;
    }
    .date, .email {
        float: right;
    }
</style>