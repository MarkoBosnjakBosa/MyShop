<template>
    <div id="technicalData" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <div id="technicalDataForm">
                    <form autocomplete="off" @submit.prevent="createTechnicalInformation()">
                        <h1>Technical Data</h1>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <input type="text" id="title" class="form-control" :class="{'errorField' : titleError && submitting}" placeholder="Title" v-model="technicalInformation.title" @focus="clearTitleStatus()" @keyPress="clearTitleStatus()"/>
                                <small v-if="titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                            </div>
                            <div class="form-group col-md-4">
                                <select id="type" class="form-control" :class="{'errorField' : typeError && submitting}" v-model="technicalInformation.type" @focus="clearTypeStatus()" @keypress="clearTypeStatus()">
                                    <option value="" disabled selected>Select type...</option>
                                    <option value="textfield">Textfield</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="number">Number</option>
                                </select>
                                <small v-if="typeError && submitting" class="form-text errorInput">Please provide a valid type!</small>
                            </div>
                            <div class="form-group col-md-1">
                                <button type="submit" class="btn btn-primary">Create</button>
                            </div>
                        </div>
                        <div v-if="technicalInformationCreated" class="form-group creationSuccessful">Technical information has been successfully created!</div>
                    </form>
                </div>
                <table id="technicalDataTable" class="table">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Type</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(technicalInformation, index) in technicalData" :key="technicalInformation._id">
                            <th scope="row">{{++index}}</th>
                            <td v-if="editing == technicalInformation._id"><input type="text" class="form-control" v-model="technicalInformation.title"/></td>
                            <td v-else>{{technicalInformation.title}}</td>
                            <td v-if="editing == technicalInformation._id">
                                <select class="form-control" v-model="technicalInformation.type">
                                    <option value="textfield">Textfield</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="number">Number</option>
                                </select>
                            </td>
                            <td v-else style="text-transform: capitalize">{{technicalInformation.type}}</td>
                            <td v-if="editing == technicalInformation._id" class="padded">
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
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import checkLogin from "../../components/CheckLogin.vue";
	import navigation from "../../components/Navigation.vue";
	import sidebar from "../../components/Sidebar.vue";
	import validation from "../../components/Validation.vue";
	var axios = require("axios");
	
	export default {
		name: "categories",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                technicalData: [],
                submitting: false,
                titleError: false,
                typeError: false,
                technicalInformation: {
                    title: "",
                    type: ""
                },
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
                this.submitting = true;
                this.clearTitleStatus();
                this.clearTypeStatus();
                var allowSubmit = true;
                if(this.invalidTitle) {
                    this.titleError = true;
                    allowSubmit = false;
                }
                if(this.invalidType) {
                    this.typeError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.technicalInformationCreated = false;
                    return;
                }
                var body = {title: this.technicalInformation.title, type: this.technicalInformation.type};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createTechnicalInformation", body).then(response => {
                    if(response.data.created) {
                        var newTechnicalInformation = response.data.technicalInformation;
                        this.technicalData = [...this.technicalData, newTechnicalInformation];
                        this.technicalInformationCreated = true;
                        this.technicalInformation = {title: "", type: ""};
                        this.titleError = false, this.typeError = false, this.submitting = false;
                    } else {
                        var errorFields = response.data.errorFields;
                        if(errorFields.includes("title")) this.titleError = true;
                        if(errorFields.includes("type")) this.typeError = true;
                        this.technicalInformationCreated = false;
                    }
                }).catch(error => console.log(error));
            },
            enableEditing(technicalInformation) {
                this.cachedTechnicalInformation = Object.assign({}, technicalInformation);
                this.editing = technicalInformation._id;
            },
            disableEditing(technicalInformation) {
                Object.assign(technicalInformation, this.cachedTechnicalInformation);
                this.editing = null;
            },
            editTechnicalInformation(updatedTechnicalInformation) {
                if(!validation.methods.invalidTitle(updatedTechnicalInformation.title) && !validation.methods.invalidType(updatedTechnicalInformation.type)) {
                    var body = {technicalInformationId: updatedTechnicalInformation._id, title: updatedTechnicalInformation.title, type: updatedTechnicalInformation.type};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editTechnicalInformation", body).then(response => {
                        if(response.data.edited) {
                            this.technicalData = this.technicalData.map(technicalInformation => technicalInformation._id == updatedTechnicalInformation._id ? updatedTechnicalInformation : technicalInformation);
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
                            this.technicalData = this.technicalData.filter(technicalInformation => technicalInformation._id != technicalInformationId);
                        }
                    }).catch(error => console.log(error));
                }
            },
            clearTitleStatus() { this.titleError = false, this.technicalInformationCreated = false; },
            clearTypeStatus() { this.typeError = false, this.technicalInformationCreated = false; },
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.technicalInformation.title); },
            invalidType() { return validation.methods.invalidType(this.technicalInformation.type); }
        },
        created() {
			checkLogin.methods.isLoggedIn();
            this.getTechnicalData();
        }
    }
</script>

<style scoped>
    #technicalDataForm, #technicalDataTable {
        margin: 0 auto;
        max-width: 900px;
    }
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    tbody .fas, tbody .far {
        cursor: pointer;
        margin-right: 5px;
    }
    .padded {
        padding-top: 20px;
    }
    .editTechnicalInformation {
        color: #008000;
    }
    .disableEditing {
        color: #ff0000;
    }
    .creationSuccessful {
        color: #008000;
        margin-bottom: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>