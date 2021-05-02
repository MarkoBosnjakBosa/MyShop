<template>
     <div id="homeSettings" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <h1>Home Settings</h1>
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item"><a id="imagesNavTab" data-toggle="tab" href="#imagesTab" class="nav-link active">Images</a></li>
                    <li class="nav-item"><a id="messageNavTab" data-toggle="tab" href="#messageTab" class="nav-link">Message</a></li>
                </ul>
                <div class="tab-content">
                    <div id="imagesTab" class="tab-pane fade active show">
                        <h3>Images</h3>
                        <div class="form-group">
                            <div id="dropzone" @dragover.prevent="addDragOver()" @dragleave.prevent="removeDragOver()" @drop="removeDragOver()" @change="uploadImages($event)">
                            <div id="dropzoneDescription">
                                <i class="fas fa-upload fa-2x"></i>
                                <p>Choose more images or drag them here.</p>
                            </div>
                                <input type="file" id="images" name="images[]" class="images" multiple/>
                            </div>
                            <small v-if="errors.imagesError" class="form-text errorInput">Please provide less than 11 images!</small>
                        </div>
                        <div v-if="homeSettings.images.length" class="form-group">
                            <div class="row">
                                <div v-for="image in homeSettings.images" :key="image._id" class="col-md-3">
                                    <img :src="renderImage(image)" :alt="image.name" class="img-fluid rounded image"/>
                                    <i class="fas fa-times-circle removeImage" @click="deleteImage(image._id, image.name)"></i>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-info nextButton" @click="toggleTab('message')">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </div>
                    <div id="messageTab" class="tab-pane fade">
                        <h3>Message</h3>
                        <form autocomplete="off" @submit.prevent="saveMessage()">
                            <div class="form-group">
                                <tinymce
                                    :api-key="tinyMceEditorApiKey"
                                    :init="{
                                        height: 500,
                                        menubar: 'file edit view insert format tools table help',
                                        plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                                        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                                    }"
                                    v-model="homeSettings.message"
                                    @focus="clearMessageStatus()"
                                    @keypress="clearMessageStatus()"
                                />
                                <small v-if="errors.messageError" class="form-text errorInput">Please provide a valid message!</small>
                                <small v-if="homeSettingsSaved" class="form-text homeSettingsSaved">Message has been successfully saved!</small>
                            </div>
                            <div class="form-group">
                                <button type="button" class="btn btn-info previousButton" @click="toggleTab('images')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
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
    import helper from "../../components/Helper.vue";
    import tinymce from "@tinymce/tinymce-vue";
	var axios = require("axios");

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
                homeSettingsSaved: false,
                errors: {
                    messageError: false,
                    imagesError: false
                }
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
                var body = {id: this.homeSettings.id, message: this.homeSettings.message};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/saveHomeSettingsMessage", body).then(response => {
                    if(response.data.saved) {
                        this.errors.messageError = false;
                        this.homeSettingsSaved = true;
                    } else {
                        this.errors.messageError = true;
                        this.homeSettingsSaved = false;
                    }
                }).catch(error => console.log(error));
            },
            uploadImages(event) {
                this.clearImagesStatus();
				var files = event.target.files;
                if(files && files.length > 0 && ((files.length + this.homeSettings.images.length) < 11)) {
                    var images = [];
                    for (var i = 0, file; file = files[i]; i++) {
                        if (!file.type.match("image.*")) {
                            continue;
                        }
                        images = [...images, file];
                    }
                    var formData = new FormData();
                    formData.append("homeSettingsId", this.homeSettings.id);
                    for(var image = 0 ; image < images.length; image++) {
                        formData.append("images", images[image]);
                    }
                    axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/saveHomeSettingsImages", formData).then(response => {
                        if(response.data.saved) {
                            this.getHomeSettings();
                        } else {
                            console.log(1);
                            this.errors.imagesError = true;
                        }
                    }).catch(error => console.log(error));
                } else {
                    this.errors.imagesError = true;
                }
			},
            clearMessageStatus() { 
                this.homeSettingsSaved = false;
                this.errors.messageError = false;
            },
            clearImagesStatus() {
                this.errors.imagesError = false;
            },
            renderImage(image) {
                if(image && !(image instanceof File)) {
                    return "data:" + image.contentType + ";base64," + (new Buffer.from(image.image)).toString("base64");
                } else {
                    return "";
                }
            },
            deleteImage(imageId, imageName) {
                var confirmed = confirm("Delete selected image?");
                if(confirmed) {
                    var body = {homeSettingsId: this.homeSettings.id, imageId: imageId, imageName: imageName};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteHomeSettingsImage", body).then(response => {
                        if(response.data.deleted) {
                            this.homeSettings.images = this.homeSettings.images.filter(image => image._id != imageId);
                            this.errors.imagesError = false;
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
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
			}
        },
        computed: {
            invalidMessage() { return validation.methods.invalidMessage(this.homeSettings.message); }
        },
        created() {
			checkLogin.methods.isLoggedIn();
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
    #imagesTab, #messageTab {
        margin: 0 auto;
        max-width: 800px;
        margin-top: 20px;
    }
    .previousButton {
		float: left;
	}
    .nextButton, .submitButton  {
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
        right: 0px;
        color: #ff0000;
        background-color: #fff;
        cursor: pointer;
    }
    #dropzone:hover, #dropzone.onDragOver {
        background: #ecf0f5;
    }
    .homeSettingsSaved {
        color: #008000;
    }
    .errorInput {
        color: #ff0000;
    }
</style>