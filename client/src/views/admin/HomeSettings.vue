<template>
    <div id="homeSettings" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Home Settings</h1>
                <div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="imagesNavTab" data-bs-toggle="tab" data-bs-target="#imagesTab" class="nav-link active" role="tab">Images</button>
                    <button type="button" id="messageNavTab" data-bs-toggle="tab" data-bs-target="#messageTab" class="nav-link" role="tab">Message</button>
                </div>
                <div class="tab-content">
                    <div id="imagesTab" class="tab-pane fade active show" role="tabpanel">
                        <h3>Images</h3>
                        <form enctype="multipart/form-data">
                            <div class="mb-3">
                                <div id="dropzone" @dragover.prevent="addDragOver()" @dragleave.prevent="removeDragOver()" @drop="removeDragOver()" @change="uploadImages($event)">
                                    <div id="dropzoneDescription">
                                        <i class="fas fa-upload fa-2x"></i>
                                        <p>Choose more images or drag them here.</p>
                                    </div>
                                    <input type="file" id="images" name="images[]" class="images" multiple/>
                                </div>
                                <small v-if="errors.imagesError" class="form-text errorInput">Please provide less than 5 images!</small>
                            </div>
                        </form>
                        <div v-if="homeSettings.images.length" class="mb-3">
                            <div class="row">
                                <div v-for="image in homeSettings.images" :key="image._id" class="col-3 position">
                                    <img :src="renderImage(image)" :alt="image.name" class="img-fluid rounded image"/>
                                    <i class="fas fa-times-circle removeImage" @click="deleteImage(image._id)"></i>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-dark nextButton" @click="toggleTab('message')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="messageTab" class="tab-pane fade" role="tabpanel">
                        <h3>Message</h3>
                        <form autocomplete="off" @submit.prevent="saveMessage()" novalidate>
                            <div class="mb-3">
                                <tinymce :api-key="tinyMceEditorApiKey" :init="{
                                    height: 500,
                                    menubar: 'file edit view insert format tools table help',
                                    plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                                    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                                }"
                                v-model="homeSettings.message" @focus="clearMessageStatus()" @keypress="clearMessageStatus()"/>
                                <small v-if="errors.messageError" class="form-text errorInput">Please provide a valid message!</small>
                                <small v-if="messageSaved" class="form-text messageSaved">Message has been successfully saved!</small>
                            </div>
                            <div class="mb-3">
                                <button type="button" class="btn btn-dark" @click="toggleTab('images')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="submit" class="btn btn-primary saveButton">Save <i class="fas fa-check"></i></button>
                            </div>
                        </form>
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
    import helper from "../../components/Helper.vue";
    import validation from "../../components/Validation.vue";
    import tinymce from "@tinymce/tinymce-vue";
    const axios = require("axios");

    export default {
        name: "homeSettings",
        components: {
            navigation,
            sidebar,
            tinymce
        },
        data() {
            return {
                tinyMceEditorApiKey: process.env.VUE_APP_TINY_MCE_EDITOR_API_KEY,
                homeSettings: {
                    id: "",
                    message: "",
                    images: []
                },
                errors: {
                    messageError: false,
                    imagesError: false
                },
                messageSaved: false
            }
        },
        methods: {
            getHomeSettings() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getHomeSettings").then(response => {
                    this.homeSettings.id = response.data.id;
                    this.homeSettings.message = response.data.message;
                    this.homeSettings.images = response.data.images;
                }).catch(error => console.log(error));
            },
            saveMessage() {
                this.clearMessageStatus();
                if(this.invalidMessage) {
                    this.errors.messageError = true;
                    return;
                }
                var body = {homeSettingsId: this.homeSettings.id, message: this.homeSettings.message};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/saveHomeSettingsMessage", body).then(response => {
                    if(response.data.saved) {
                        this.homeSettings.id = response.data.homeSettingsId;
                        this.errors.messageError = false;
                        this.messageSaved = true;
                    } else {
                        this.errors.messageError = true;
                        this.messageSaved = false;
                    }
                }).catch(error => console.log(error));
            },
            uploadImages(event) {
                this.errors.imagesError = false;
                var files = event.target.files;
                if(files && files.length && ((files.length + this.homeSettings.images.length) < 5)) {
                    var images = [];
                    for (var i = 0, file; file = files[i]; i++) {
                        if (!file.type.match("image.*")) {
                            continue;
                        }
                        images = [...images, file];
                    }
                    if(images.length > 0) {
                        var formData = new FormData();
                        formData.append("homeSettingsId", this.homeSettings.id);
                        for(var image = 0 ; image < images.length; image++) {
                            formData.append("images", images[image]);
                        }
                        axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/saveHomeSettingsImages", formData).then(response => {
                            if(response.data.saved) {
                                this.homeSettings.id = response.data.homeSettingsId;
                                this.homeSettings.images = [];
                                for(var image = 0; image < response.data.images.length; image++) {
                                    this.homeSettings.images = [...this.homeSettings.images, response.data.images[image]];
                                }
                            } else {
                                this.errors.imagesError = true;
                            }
                        }).catch(error => console.log(error));
                    } else {
                        this.errors.imagesError = true;
                    }
                } else {
                    this.errors.imagesError = true;
                }
                document.getElementById("images").value = "";
            },
            deleteImage(imageId) {
                var confirmed = confirm("Delete selected image?");
                if(confirmed) {
                    var body = {homeSettingsId: this.homeSettings.id, imageId: imageId};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteHomeSettingsImage", body).then(response => {
                        if(response.data.deleted) {
                            this.homeSettings.images = this.homeSettings.images.filter(image => image._id != imageId);
                            this.errors.imagesError = false;
                        } else {
                            this.errors.imagesError = true;
                        }
                    }).catch(error => console.log(error));
                }
            },
            addDragOver() {
                document.getElementById("dropzone").className = "onDragOver";
            },
            removeDragOver() {
                document.getElementById("dropzone").classList.remove("onDragOver");
            },
            renderImage(image) {
                return helper.methods.renderImage(image);
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
            },
            clearMessageStatus() {
                this.errors.messageError = false;
                this.messageSaved = false;
            }
        },
        computed: {
            invalidMessage() { return validation.methods.invalidMessage(this.homeSettings.message); }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
            this.getHomeSettings();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .nav-tabs, #imagesTab, #messageTab {
        margin: auto;
        max-width: 800px;
        margin-top: 20px;
    }
    .nextButton, .saveButton  {
        float: right;
    }
    #dropzone {
        border: 2px dashed #91b0b3;
        color: #92b0b3;
        position: relative;
        height: 150px;
        margin-bottom: 20px;
    }
    #dropzoneDescription {
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        text-align: center;
        width: 40%;
        top: 50px;
        font-size: 16px;
    }
    #images, #images:focus {
        position: absolute;
        outline: none !important;
        width: 100%;
        height: 150px;
        cursor: pointer;
        opacity: 0;
    }
    .image {
        width: 100%;
        height: 150px;
        margin-bottom: 5px;
    }
    .removeImage {
        position: absolute;
        top: 0px;
        right: -5px;
        color: #ff0000;
        background-color: #fff;
        cursor: pointer;
    }
    #dropzone:hover, #dropzone.onDragOver {
        background: #ecf0f5;
    }
    .position {
        position: relative;
    }
    .messageSaved {
        color: #008000;
    }
    .errorInput {
        color: #ff0000;
    }
</style>