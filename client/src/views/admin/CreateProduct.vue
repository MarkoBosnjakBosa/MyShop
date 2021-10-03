<template>
    <div id="createProduct" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <h1>Create Product</h1>
                <form autocomplete="off" enctype="multipart/form-data" @submit.prevent="createProduct()" novalidate>
                    <div class="nav nav-tabs justify-content-center" role="tablist">
                        <button type="button" id="mainNavTab" data-bs-toggle="tab" data-bs-target="#mainTab" class="nav-link active" role="tab">Main</button>
                        <button type="button" id="technicalDataNavTab" data-bs-toggle="tab" data-bs-target="#technicalDataTab" class="nav-link" role="tab">Technical Data</button>
                        <button type="button" id="imagesNavTab" data-bs-toggle="tab" data-bs-target="#imagesTab" class="nav-link" role="tab">Images</button>
                    </div>
                    <div class="tab-content">
                        <div id="mainTab" class="tab-pane fade active show" role="tabpanel">
                            <div v-if="productCreated" class="alert alert-success alert-dismissible" role="alert">
                                <div>Product has been successfully created!</div>
                                <button type="button" class="btn-close" @click="closeCreationAlert()"></button>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="title" class="input-group-text">Title</label>
                                    <input type="text" id="title" class="form-control" :class="{'errorField' : errors.titleError && submitting}" v-model="product.title" @focus="clearTitleStatus()" @keypress="clearTitleStatus()"/>
                                </div>
                                <small v-if="errors.titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="description" class="input-group-text">Description</label>
                                    <textarea id="description" class="form-control" :class="{'errorField' : errors.descriptionError && submitting}" v-model="product.description" @focus="clearDescriptionStatus()" @keypress="clearDescriptionStatus()"/>
                                </div>
                                <small v-if="errors.descriptionError && submitting" class="form-text errorInput">Please provide a valid description!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="price" class="input-group-text">Price</label>
                                    <input type="text" id="price" class="form-control" :class="{'errorField' : errors.priceError && submitting}" v-model="product.price" @focus="clearPriceStatus()" @keypress="clearPriceStatus()"/>
                                    <span class="input-group-text">0.00 €</span>
                                </div>
                                <small v-if="errors.priceError && submitting" class="form-text errorInput">Please provide a valid price!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="quantity" class="input-group-text">Quantity</label>
                                    <input type="number" id="quantity" min="1" class="form-control" :class="{'errorField' : errors.quantityError && submitting}" v-model="product.quantity" @focus="clearQuantityStatus()" @keypress="clearQuantityStatus()"/>
                                </div>
                                <small v-if="errors.quantityError && submitting" class="form-text errorInput">Please provide a valid quantity!</small>
                            </div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <label for="category" class="input-group-text">Category</label>
                                    <select id="category" class="form-control" :class="{'errorField' : errors.categoryError && submitting}" v-model="product.category" @focus="clearCategoryStatus()" @keypress="clearCategoryStatus()">
                                        <option value="" selected disabled>Select category...</option>
                                        <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                                    </select>
                                </div>
                                <small v-if="errors.categoryError && submitting" class="form-text errorInput">Please provide a valid category!</small>
                            </div>
                            <div>
                                <button type="button" class="btn btn-dark nextButton" @click="toggleTab('technicalData')">Next <i class="fas fa-angle-double-right"></i></button>
                            </div>
                        </div>
                        <div id="technicalDataTab" class="tab-pane fade" role="tabpanel">
                            <div class="mb-3 input-group">
                                <label for="technicalData" class="input-group-text">Technical data</label>
                                <select id="technicalData" class="form-control">
                                    <option value="" selected disabled>Select technical information...</option>
                                    <option v-for="technicalInformation in technicalData" :key="technicalInformation._id" :value="technicalInformation.title" :type="technicalInformation.type">{{technicalInformation.title}}</option>
                                </select>
                                <button type="button" class="btn btn-primary" @click="selectTechnicalInformation()">Add</button>
                            </div>
                            <table v-if="product.technicalData.length" class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Value</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(technicalInformation, index) in product.technicalData" :key="technicalInformation.title" :row="technicalInformation.title">
                                        <th class="padded">{{index + 1}}</th>
                                        <td class="padded">{{technicalInformation.title}}</td>
                                        <td><textarea rows="1" class="form-control" v-model="product.technicalData[index].value"></textarea></td>
                                        <td class="padded"><i class="fas fa-times fa-2x" @click="removeTechnicalInformation(index)"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <button type="button" class="btn btn-dark" @click="toggleTab('main')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="button" class="btn btn-dark nextButton" @click="toggleTab('images')">Next <i class="fas fa-angle-double-right"></i></button>
                            </div>
                            <notification :product="product" :message="message" :type="'error'" @hide="hideNotification()"></notification>
                        </div>
                        <div id="imagesTab" class="tab-pane fade" role="tabpanel">
                            <div v-if="errors.titleError || errors.descriptionError || errors.priceError || errors.quantityError || errors.categoryError || errors.primaryImageError" class="alert alert-danger" role="alert">Please insert missing data!</div>
                            <div class="mb-3">
                                <div class="input-group">
                                    <span for="primaryImage" class="input-group-text">Primary image</span>
                                    <input type="file" id="primaryImage" name="primaryImage" class="form-control" :class="{'errorField' : errors.primaryImageError && submitting}" @change="selectImages($event, 'primaryImage')"/>
                                </div>
                                <small v-if="errors.primaryImageError && submitting" class="form-text errorInput">Please provide a valid primary image!</small>
                            </div>
                            <div id="previewPrimaryImage"></div>
                            <h3>Images</h3>
                            <div class="mb-3">
                                <div id="dropzone" @dragover.prevent="addDragOver()" @dragleave.prevent="removeDragOver()" @drop="removeDragOver()" @change="selectImages($event, 'images')">
                                    <div id="dropzoneDescription">
                                        <i class="fas fa-upload fa-2x"></i>
                                        <p>Select images or drag them here.</p>
                                    </div>
                                    <input type="file" id="images" name="images[]" class="images" multiple/>
                                </div>
                                <small v-if="errors.imagesError" class="form-text errorInput">Please provide less than 5 valid images!</small>
                            </div>
                            <div v-if="product.images.length" class="mb-3">
                                <div class="row">
                                    <div v-for="(image, index) in product.images" :key="image.name" class="col-md-3 position">
                                        <img :src="image.src" :alt="image.name" class="img-fluid rounded image"/>
                                        <i class="fas fa-times-circle removeImage" @click="removeImage(index)"></i>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-dark" @click="toggleTab('technicalData')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                            </div>
                        </div>
                    </div>
                </form>
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
    import notification from "../../components/Notification.vue";
    const axios = require("axios");
	
    export default {
        name: "createProduct",
        components: {
            navigation,
            sidebar,
            notification
        },
        data() {
            return {
                categories: [],
                technicalData: [],
                submitting: false,
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: 1,
                    category: "",
                    technicalData: [],
                    primaryImage: "",
                    images: []
                },
                errors: {
                    titleError: false,
                    descriptionError: false,
                    priceError: false,
                    quantityError: false,
                    categoryError: false,
                    primaryImageError: false,
                    imagesError: false
                },
                productCreated: false,
                message: ""
            }
        },
        methods: {
            getCategories() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getCategories").then(response => {
                    this.categories = response.data.categories;
                }).catch(error => console.log(error));
            },
            getTechnicalData() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getTechnicalData").then(response => {
                    this.technicalData = response.data.technicalData;
                }).catch(error => console.log(error));
            },
            loadReCaptcha() {
                var reCaptchaScript = document.createElement("script");
                reCaptchaScript.setAttribute("src", "https://www.google.com/recaptcha/api.js?render=" + process.env.VUE_APP_RECAPTCHA_v3_SITE_KEY);
                document.head.appendChild(reCaptchaScript);
            },
            createProduct() {
                this.submitting = true;
                this.clearTitleStatus();
                this.clearDescriptionStatus();
                this.clearPriceStatus();
                this.clearQuantityStatus();
                this.clearCategoryStatus();
                this.clearPrimaryImageStatus();
                this.clearImagesStatus();
                var allowCreation = true;
                if(this.invalidTitle) {
                    this.errors.titleError = true;
                    allowCreation = false;
                }
                if(this.invalidDescription) {
                    this.errors.descriptionError = true;
                    allowCreation = false;
                }
                if(this.invalidPrice) {
                    this.errors.priceError = true;
                    allowCreation = false;
                }
                if(this.invalidQuantity) {
                    this.errors.quantityError = true;
                    allowCreation = false;
                }
                if(this.invalidCategory) {
                    this.errors.categoryError = true;
                    allowCreation = false;
                }
                if(this.invalidPrimaryImage) {
                    this.errors.primaryImageError = true;
                    allowCreation = false;
                }
                if(this.invalidImages) {
                    this.errors.imagesError = true;
                    allowCreation = false;
                }
                if(!allowCreation) {
                    this.productCreated = false;
                    return;
                }
                var temp = this;
                grecaptcha.ready(function() {
                    grecaptcha.execute(process.env.VUE_APP_RECAPTCHA_v3_SITE_KEY, {action: "submit"}).then(function(reCaptchaToken) {
                        if(reCaptchaToken != "" && reCaptchaToken != undefined && reCaptchaToken != null) {
                            var formData = new FormData();
                            formData.append("title", temp.product.title);
                            formData.append("description", temp.product.description);
                            formData.append("price", temp.product.price);
                            formData.append("quantity", temp.product.quantity);
                            formData.append("category", temp.product.category);
                            formData.append("technicalData", JSON.stringify(temp.product.technicalData));
                            formData.append("type", "images");
                            formData.append("primaryImage", temp.product.primaryImage);
                            for(var image = 0; image < temp.product.images.length; image++) {
                                formData.append("images", temp.product.images[image].file);
                            }
                            formData.append("reCaptchaToken", reCaptchaToken);
                            axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createProduct", formData).then(response => {
                                if(response.data.created) {
                                    temp.product = {title: "", description: "", price: "", quantity: 1, category: "", technicalData: [], primaryImage: "", images: []};
                                    document.getElementById("primaryImage").value = "";
                                    document.getElementById("previewPrimaryImage").innerText = "";
                                    document.getElementById("images").value = "";
                                    temp.errors = {titleError: false, descriptionError: false, priceError: false, quantityError: false, categoryError: false, primaryImageError: false};
                                    temp.submiting = false;
                                    temp.productCreated = true;
                                    temp.toggleTab("main");
                                } else {
                                    var errorFields = response.data.errorFields;
                                    if(errorFields.includes("title")) temp.errors.titleError = true;
                                    if(errorFields.includes("description")) temp.errors.descriptionError = true;
                                    if(errorFields.includes("price")) temp.errors.priceError = true;
                                    if(errorFields.includes("quantity")) temp.errors.quantityError = true;
                                    if(errorFields.includes("category")) temp.errors.categoryError = true;
                                    if(errorFields.includes("primaryImage")) temp.errors.primaryImageError = true;
                                    if(errorFields.includes("images")) temp.errors.imagesError = true;
                                    temp.productCreated = false;
                                }
                            }).catch(error => console.log(error));
                        }
                    });
                });
            },
            selectTechnicalInformation() {
                var technicalInformationTitle = document.getElementById("technicalData").value;
                if(technicalInformationTitle != "") {
                    if(document.getElementsByTagName("tbody")[0]) {
                        var rows = document.getElementsByTagName("tbody")[0].rows;
                        for(var row = 0; row < rows.length; row++) {
                            if(rows[row].cells[1].innerText == technicalInformationTitle) {
                                this.message = "You have already selected the technical information!";
                                return;
                            }
                        }
                    }
                    var newTechnicalInformation = {title: technicalInformationTitle, value: ""};
                    this.product.technicalData = [...this.product.technicalData, newTechnicalInformation];
                    document.getElementById("technicalData").value = "";
                }
            },
            removeTechnicalInformation(currentIndex) {
                this.product.technicalData = this.product.technicalData.filter((technicalInformation, index) => index != currentIndex);
            },
            selectImages(event, type) {
                var files = event.target.files;
                var temp = this;
                if(files && files.length > 0) {
                    if(type == "primaryImage") {
                        temp.errors.primaryImageError = false;
                        var file = files[0];
                        if(file.type.match("image.*")) {
                            var fileReader = new FileReader();
                            fileReader.onload = function(e) {
                                var previewPrimaryImage = document.getElementById("previewPrimaryImage");
                                previewPrimaryImage.innerHTML = "<img src='" + e.target.result + "' class='rounded mx-auto d-block' alt='" + file.name + "' style='height: 150px; weight: 150px;'/>";
                            }
                            this.product.primaryImage = file;
                            fileReader.readAsDataURL(file);
                        }
                    } else {
                        temp.errors.imagesError = false;
                        if((files.length + temp.product.images.length) < 5) {
                            for(var i = 0, file; file = files[i]; i++) {
                                if(!file.type.match("image.*")) {
                                    continue;
                                }
                                var fileReader = new FileReader();
                                fileReader.onload = (function(specificFile) {
                                    return function(e) {
                                        var newImage = {name: specificFile.name, src: e.target.result, file: specificFile};
                                        temp.product.images = [...temp.product.images, newImage];
                                    };
                                })(file);
                                fileReader.readAsDataURL(file);
                            }
                        } else {
                            temp.errors.imagesError = true;
                        }
                    }
                }
            },
            removeImage(currentIndex) {
                this.product.images = this.product.images.filter((image, index) => index != currentIndex);
                this.errors.imagesError = false;
            },
            addDragOver() {
                document.getElementById("dropzone").className = "onDragOver";
            },
            removeDragOver() {
                document.getElementById("dropzone").classList.remove("onDragOver");
            },
            hideNotification() {
                this.message = "";
            },
            closeCreationAlert() {
                this.productCreated = false;
            },
            toggleTab(tab) { helper.methods.toggleTab(tab); },
            clearTitleStatus() { this.errors.titleError = false },
            clearDescriptionStatus() { this.errors.descriptionError = false },
            clearPriceStatus() { this.errors.priceError = false },
            clearQuantityStatus() { this.errors.quantityError = false },
            clearCategoryStatus() { this.errors.categoryError = false },
            clearPrimaryImageStatus() { this.errors.primaryImageError = false },
            clearImagesStatus() { this.errors.imagesError = false }
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.product.title); },
            invalidDescription() { return validation.methods.invalidDescription(this.product.description); },
            invalidPrice() { return validation.methods.invalidPrice(this.product.price); },
            invalidQuantity() { return validation.methods.invalidQuantity(this.product.quantity); },
            invalidCategory() { return validation.methods.invalidCategory(this.product.category); },
            invalidPrimaryImage() { return validation.methods.invalidPrimaryImage(this.product.primaryImage); },
            invalidImages() { return validation.methods.invalidImages(this.product.images.length); }
        },
        created() {
            checkLogin.methods.isLoggedIn();
            checkLogin.methods.isAdmin();
            this.getCategories();
            this.getTechnicalData();
            this.loadReCaptcha();
        }
    }
</script>

<style scoped>
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    #mainTab, #technicalDataTab, #imagesTab {
        margin: auto;
        max-width: 800px;
        margin-top: 20px;
    }
    .padded {
        padding-top: 12px;
    }
    #previewPrimaryImage {
        text-align: center;
        margin-bottom: 10px;
    }
    .nextButton, .submitButton {
        float: right;
    }
    tbody .fas {
        cursor: pointer;
        color: #ff0000;
    }
    #dropzone {
        border: 2px dashed #91b0b3;
        color: #92b0b3;
        position: relative;
        height: 150px;
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
        margin-bottom: 10px;
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
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>