<template>
    <div id="contacts" class="container-fluid">
		<div class="d-flex" id="barsStyle">
			<sidebar></sidebar>
			<div id="pageStyle">
				<navigation></navigation>
                <h1>Contacts</h1>
                <form autocomplete="off" class="contactsForm" @submit.prevent="getContacts()">
                    <div class="row">
                        <div class="mb-3 col-md-7">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="mb-3 col-md-3">
                            <input type="number" id="limit" min="1" class="form-control" v-model="limit"/>
                        </div>
                        <div class="mb-3 col-md-1">
                            <button type="submit" class="btn btn-primary md-1">Search</button>
                        </div>
                        <div class="mb-3 col-md-1">
                            <button type="button" class="btn btn-dark" data-toggle="tooltip" title="Total">{{total}}</button>
                        </div>
                    </div>
                </form>
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
                <div class="form-group pages">
                    <button v-if="page - 1 > 0" type="button" class="btn btn-dark page" @click="loadPage(page - 1)"><i class="fas fa-angle-double-left"></i></button>
                    <button type="button" class="btn btn-dark page">{{page}}</button>
                    <button v-if="page < pagesNumber" type="button" class="btn btn-dark page" @click="loadPage(page + 1)"><i class="fas fa-angle-double-right"></i></button>
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
                contacts: [],
                search: "",
                page: 1,
                limit: 10,
                total: 0,
                pagesNumber: 1
            }
        },
        methods: {
            getContacts() {
                var body = {search: this.search, page: this.page, limit: this.limit};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getContacts", body).then(response => {
                    this.contacts = response.data.contacts;
                    this.total = response.data.total;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getContacts();
                }
            },
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
    .contactsForm, .contacts {
        margin: 0 auto;
        max-width: 900px;
    }
    .contact {
        margin-bottom: 10px;
    }
    .date, .email {
        float: right;
    }
    .pages {
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
</style>