<template>
    <div id="technicalData" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <form autocomplete="off" @submit.prevent="createTechnicalInformation()" novalidate>
                    <h1>Technical Data</h1>
                    <div class="row">
                        <div class="mb-3 col-11">
                            <input type="text" id="title" class="form-control" :class="{'errorField' : titleError}" placeholder="Title" v-model="title" @focus="clearTitleStatus()" @keyPress="clearTitleStatus()"/>
                            <small v-if="titleError" class="form-text errorInput">Please provide a valid title!</small>
                        </div>
                        <div class="mb-3 col-1">
                            <button type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </div>
                    <div v-if="technicalInformationCreated" class="mb-3 technicalInformationCreated">Technical information has been successfully created!</div>
                </form>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!technicalData.length">
                            <td colspan="3" class="noTechnicalData">No technical data found!</td>
                        </tr>
                        <tr v-for="(technicalInformation, index) in technicalData" :key="technicalInformation._id">
                            <th :class="{'padded': editing === technicalInformation._id}">{{++index}}</th>
                            <td v-if="editing === technicalInformation._id"><input type="text" class="form-control" v-model="technicalInformation.title"/></td>
                            <td v-else>{{technicalInformation.title}}</td>
                            <td v-if="editing === technicalInformation._id" class="padded">
                                <i class="far fa-check-circle editTechnicalInformation" @click="editTechnicalInformation(technicalInformation)"></i>
                                <i class="far fa-times-circle disableEditing" @click="disableEditing(technicalInformation)"></i>
                            </td>
                            <td v-else>
                                <i class="fas fa-pencil-alt" @click="enableEditing(technicalInformation)"></i>
                                <i class="fas fa-trash" @click="deleteTechnicalInformation(technicalInformation._id, technicalInformation.title)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div> 
    </div>
</template>

<script>
    import checkLogin from "../../components/CheckLogin.vue";
    import navigation from "../../components/Navigation.vue";
    import sidebar from "../../components/Sidebar.vue";
    import route from "../../components/Route.vue";
    import validation from "../../components/Validation.vue";
    const axios = require("axios");
	
    export default {
        name: "technicalData",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                technicalData: [],
                title: "",
                titleError: false,
                technicalInformationCreated: false,
                editing: null
            }
        },
        methods: {
            getTechnicalData() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getTechnicalData").then(response => {
                    this.technicalData = response.data.technicalData;
                }).catch(error => console.log(error));
            },
            createTechnicalInformation() {
                this.clearTitleStatus();
                if(this.invalidTitle) {
                    this.titleError = true;
                    this.technicalInformationCreated = false;
                    return;
                }
                var body = {title: this.title};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createTechnicalInformation", body).then(response => {
                    if(response.data.created) {
                        var newTechnicalInformation = response.data.technicalInformation;
                        this.technicalData = [...this.technicalData, newTechnicalInformation];
                        this.title = "";
                        this.titleError = false;
                        this.technicalInformationCreated = true;
                    } else {
                        var errors = response.data.errors;
                        errors.forEach(element => {
                            this[element + "Error"] = true;
                        });
                        this.technicalInformationCreated = false;
                    }
                }).catch(error => console.log(error));
            },
            enableEditing(technicalInformation) {
                if(this.editing !== null) return;
                this.cachedTechnicalInformation = Object.assign({}, technicalInformation);
                this.editing = technicalInformation._id;
            },
            disableEditing(technicalInformation) {
                Object.assign(technicalInformation, this.cachedTechnicalInformation);
                this.editing = null;
            },
            editTechnicalInformation(updatedTechnicalInformation) {
                if(!validation.methods.invalidTitle(updatedTechnicalInformation.title)) {
                    var body = {technicalInformationId: updatedTechnicalInformation._id, title: updatedTechnicalInformation.title};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editTechnicalInformation", body).then(response => {
                        if(response.data.edited) {
                            this.technicalData = this.technicalData.map(technicalInformation => technicalInformation._id === updatedTechnicalInformation._id ? updatedTechnicalInformation : technicalInformation);
                            this.editing = null;
                        }
                    }).catch(error => console.log(error));
                }
            },
            deleteTechnicalInformation(technicalInformationId, technicalInformationTitle) {
                var confirmed = confirm("Delete technical information " + technicalInformationTitle + "!");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteTechnicalInformation/" + technicalInformationId).then(response => {
                        if(response.data.deleted) {
                            this.technicalData = this.technicalData.filter(technicalInformation => technicalInformation._id !== technicalInformationId);
                        }
                    }).catch(error => console.log(error));
                }
            },
            clearTitleStatus() { this.titleError = false, this.technicalInformationCreated = false; }
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.title); }
        },
        created() {
            var vm = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) {
                    checkLogin.methods.isAdmin(function(isAdmin) {
                        if(isAdmin) vm.getTechnicalData();
                        else route.methods.openHome();
                    });
                } else {
                    route.methods.openLogin();
                }
            });
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    form, table {
        margin: auto;
        max-width: 900px;
    }
    .noTechnicalData {
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
    }
    tbody .fas, tbody .far {
        cursor: pointer;
        margin-right: 5px;
    }
    .padded {
        padding-top: 15px;
    }
    .editTechnicalInformation {
        color: #008000;
    }
    .disableEditing {
        color: #ff0000;
    }
    .technicalInformationCreated {
        color: #008000;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>