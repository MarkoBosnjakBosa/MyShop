<template>
    <div id="contacts" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Contacts</h1>
                <form autocomplete="off" @submit.prevent="getContacts()" novalidate>
                    <div class="row">
                        <div class="mb-3 col-5">
                            <input type="text" id="search" class="form-control" placeholder="Search..." v-model="search"/>
                        </div>
                        <div class="mb-3 col-3">
                            <input type="number" id="limit" min="1" class="form-control" v-model="limit"/>
                        </div>
                        <div class="mb-3 col-2">
                            <select id="orderBy" class="form-control" v-model="orderBy">
                                <option value="" selected>Order by</option>
                                <option value="dateAsc">Date &#129045;</option>
                                <option value="dateDesc">Date &#129047;</option>
                            </select>
                        </div>
                        <div class="btn-group mb-3 col-2">
                            <button type="submit" class="btn btn-primary">Search</button>
                            <button type="button" class="btn btn-dark" data-toggle="tooltip" :title="'Total: ' + total">{{total}}</button>
                        </div>
                    </div>
                </form>
                <div class="contacts">
                    <div v-if="!contacts.length" class="noContacts">No contacts found!</div>
                    <div class="card contact" v-for="contact in contacts" :key="contact._id">
                        <div class="card-header">
                            {{contact.firstName}} {{contact.lastName}} <div class="date">{{new Date(contact.date).toLocaleString("de-DE").replace(",", ".")}}</div>
                        </div>
                        <div class="card-body">
                            {{contact.message}}
                        </div>
                        <div class="card-footer">
                            <div class="email">{{contact.email}}</div> 
                            <div class="action">
                                <button type="button" class="btn btn-success"><i class="fas fa-phone"></i> +{{contact.mobileNumber}}</button>
                                <a :href="'mailto:' + contact.email + '?subject=MyShop - Answer to ' + contact.firstName + ' ' + contact.lastName + ' (' + new Date(contact.date).toLocaleString('en-US') + ')'" class="btn btn-primary answer"><i class="far fa-envelope"></i> Answer</a>
                                <button type="button" class="btn btn-danger delete" @click="deleteContact(contact._id, contact.firstName + ' ' + contact.lastName)">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-3 pages">
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
    const axios = require("axios");

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
                orderBy: "",
                total: 0,
                pagesNumber: 1
            }
        },
        methods: {
            getContacts() {
                if(!Number.isInteger(this.limit) || this.limit < 1) this.limit = 1;
                var body = {search: this.search, page: this.page, limit: this.limit, orderBy: this.orderBy};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getContacts", body).then(response => {
                    this.contacts = response.data.contacts;
                    this.total = response.data.total;
                    this.pagesNumber = response.data.pagesNumber;
                }).catch(error => console.log(error));
            },
            deleteContact(contactId, fullName) {
                var confirmed = confirm("Delete contact: " + fullName + "?");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteContact/" + contactId).then(response => {
                        this.contacts = this.contacts.filter(contact => contact._id != contactId);
                        this.total = this.total - 1;
                    }).catch(error => console.log(error));
                }
            },
            loadPage(page) {
                if(page > 0 && page <= this.pagesNumber) {
                    this.page = page;
                    this.getContacts();
                }
            }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
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
    form, .contacts {
        margin: auto;
        max-width: 900px;
    }
    .contact {
        margin-bottom: 10px;
    }
    .date, .action {
        float: right;
    }
    .email {
        float: left;
        padding-top: 5px;
    }
    .answer, .delete {
        margin-left: 5px;
    }
    .noContacts {
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .pages {
        text-align: center;
    }
    .page {
        margin-left: 10px;
    }
</style>