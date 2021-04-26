<template>
    <div id="createProduct" class="container-fluid">
		<div class="d-flex" id="barsDiv">
			<sidebar></sidebar>
			<div id="pageDiv">
				<navigation></navigation>
                <form autocomplete="off" enctype="multipart/form-data" @submit.prevent="createProduct()">
                    <h1>Create Product</h1>
                    <ul class="nav nav-tabs justify-content-center">
                        <li class="nav-item"><a id="mainNavTab" data-toggle="tab" href="#mainTab" class="nav-link active">Main</a></li>
                        <li class="nav-item"><a id="technicalDataNavTab" data-toggle="tab" href="#technicalDataTab" class="nav-link">Technical Data</a></li>
                        <li class="nav-item"><a id="imagesNavTab" data-toggle="tab" href="#imagesTab" class="nav-link">Images</a></li>
                    </ul>
                    <div class="tab-content">
                        <div id="mainTab" class="tab-pane fade active show">
                            <div v-if="productCreated" class="alert alert-success alert-dismissible" role="alert">
                                <div>Product has been successfully created!</div>
                                <button type="button" class="close" @click="closeCreationAlert()">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="title" class="input-group-text">Title</label>
                                    </div>
                                    <input type="text" id="title" class="form-control" v-model="product.title" @focus="clearTitleStatus()" @keypress="clearTitleStatus()"/>
                                </div>
                                <small v-if="errors.titleError && submitting" class="form-text errorInput">Please provide a valid title!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="description" class="input-group-text">Description</label>
                                    </div>
                                    <textarea id="email" class="form-control" v-model="product.description" @focus="clearDescriptionStatus()" @keypress="clearDescriptionStatus()"/>
                                </div>
                                <small v-if="errors.descriptionError && submitting" class="form-text errorInput">Please provide a valid description!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="price" class="input-group-text">Price</label>
                                    </div>
                                    <input type="text" id="price" class="form-control" v-model="product.price" @focus="clearPriceStatus()" @keypress="clearPriceStatus()"/>
                                    <div class="input-group-append">
                                        <span class="input-group-text">.00</span>
                                    </div>
                                </div>
                                <small v-if="errors.priceError && submitting" class="form-text errorInput">Please provide a valid price!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="quantity" class="input-group-text">Quantity</label>
                                    </div>
                                    <input type="number" id="quantity" class="form-control" v-model="product.quantity" @focus="clearQuantityStatus()" @keypress="clearQuantityStatus()"/>
                                </div>
                                <small v-if="errors.quantityError && submitting" class="form-text errorInput">Please provide a valid quantity!</small>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <label for="category" class="input-group-text">Category</label>
                                    </div>
                                    <select id="category" class="form-control" v-model="product.category" @focus="clearCategoryStatus()" @keypress="clearCategoryStatus()">
                                        <option value="" disabled selected>Select category...</option>
                                        <option v-for="category in categories" :key="category._id" :value="category._id">{{category.title}}</option>
                                    </select>
                                </div>
                                <small v-if="errors.categoryError && submitting" class="form-text errorInput">Please provide a valid category!</small>
                            </div>
                            <div class="form-group">
                                <button type="button" class="btn btn-info nextButton" @click="toggleTab('technicalData')">Next <i class="fas fa-angle-double-right"></i></button>
                            </div>
                        </div>
                        <div id="technicalDataTab" class="tab-pane fade">
                            <div class="form-group input-group">
                                <div class="input-group-prepend">
                                    <label for="technicalData" class="input-group-text">Technical Data</label>
                                </div>
                                <select id="technicalData" class="form-control">
                                    <option value="" disabled selected>Select technical information...</option>
                                    <option v-for="technicalInformation in technicalData" :key="technicalInformation._id" :value="technicalInformation.title" :type="technicalInformation.type">{{technicalInformation.title}}</option>
                                </select>
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-primary" @click="selectTechnicalData()">Add</button>
                                </div>
                            </div>
                            <table v-if="selectedTechnicalData.length" id="selectedTechnicalData" class="table">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Value</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(technicalInformation, index) in selectedTechnicalData" :key="technicalInformation.title" :row="technicalInformation.title">
                                        <td>{{index + 1}}</td>
                                        <td :id="'title_' + technicalInformation.title">{{technicalInformation.title}}</td>
                                        <td><textarea :id="'value_' + technicalInformation.title" class="form-control" rows="1"></textarea></td>
                                        <td><i class="fas fa-times fa-2x" @click="removeTechnicalInformation(index)"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="form-group">
                                <button type="button" class="btn btn-info previousButton" @click="toggleTab('main')"><i class="fas fa-angle-double-left"></i> Previous</button>
                                <button type="button" class="btn btn-info nextButton" @click="toggleTab('images')">Next <i class="fas fa-angle-double-right"></i></button>
                            </div>
                        </div>
                        <div id="imagesTab" class="tab-pane fade">
                            <div v-if="errors.titleError || errors.descriptionError || errors.priceError || errors.quantityError || errors.categoryError || errors.primaryImageError" class="alert alert-danger" role="alert">Please insert missing data!</div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Primary Image</span>
                                    </div>
                                    <div class="custom-file">
                                        <input type="file" id="primaryImage" name="primaryImage" class="custom-file-input" @change="selectImages($event, 'primaryImage')"/>
                                        <label id="primaryImageLabel" for="primaryImage" class="custom-file-label">Choose image</label>
                                    </div>
                                </div>
                                <small v-if="errors.primaryImageError && submitting" class="form-text errorInput">Please provide a valid primary image!</small>
                            </div>
                            <div id="previewPrimaryImage"></div>
                            <h3>Images</h3>
                            <div class="form-group">
                                <div id="dropzone" @dragover.prevent="addDragOver()" @dragleave.prevent="removeDragOver()" @drop="removeDragOver()" @change="selectImages($event, 'images')">
                                <div id="dropzoneDescription">
                                    <i class="fas fa-upload fa-2x"></i>
                                    <p>Choose more images or drag them here.</p>
                                </div>
                                    <input type="file" id="images" name="images[]" class="images" multiple/>
                                </div>
                                <small v-if="errors.imagesError && submitting" class="form-text errorInput">Please provide less than 10 images!</small>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div v-for="(image, index) in product.images" :key="image.name" class="col-md-3">
                                        <img :src="image.src" :alt="image.name" class="img-fluid rounded image"/>
                                        <i class="fas fa-times-circle removeImage" @click="removeImage(index)"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="button" class="btn btn-info previousButton" @click="toggleTab('technicalData')"><i class="fas fa-angle-double-left"></i> Previous</button>
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
    import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import checkLogin from "../../components/CheckLogin.vue";
	import navigation from "../../components/Navigation.vue";
	import sidebar from "../../components/Sidebar.vue";
	import validation from "../../components/Validation.vue";
    import helper from "../../components/Helper.vue"; 
	var axios = require("axios");
	
	export default {
		name: "createProduct",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                categories: [],
                technicalData: [],
                selectedTechnicalData: [],
                submitting: false,
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: "",
                    category: "",
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
                editing: null
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
            createProduct() {
                this.submitting = true;
                this.clearTitleStatus();
                this.clearDescriptionStatus();
                this.clearPriceStatus();
                this.clearQuantityStatus();
                this.clearCategoryStatus();
                this.clearPrimaryImageStatus();
                var allowSubmit = true;
                if(this.invalidTitle) {
                    this.errors.titleError = true;
                    allowSubmit = false;
                }
                if(this.invalidDescription) {
                    this.errors.descriptionError = true;
                    allowSubmit = false;
                }
                if(this.invalidPrice) {
                    this.errors.priceError = true;
                    allowSubmit = false;
                }
                if(this.invalidQuantity) {
                    this.errors.quantityError = true;
                    allowSubmit = false;
                }
                if(this.invalidCategory) {
                    this.errors.categoryError = true;
                    allowSubmit = false;
                }
                if(this.invalidPrimaryImage) {
                    this.errors.primaryImageError = true;
                    allowSubmit = false;
                }
                if(this.invalidImages) {
                    this.errors.imagesError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.productCreated = false;
                    return;
                }
                var temp = this;
                grecaptcha.ready(function() {
                    grecaptcha.execute(process.env.VUE_APP_RECAPTCHA_v3_SITE_KEY, {action: "submit"}).then(function(reCaptchaToken) {
                        if(reCaptchaToken != "" && reCaptchaToken != undefined && reCaptchaToken != null) {
                            var technicalDataRows = document.querySelectorAll("#selectedTechnicalData tbody tr");
                            var selectedTechnicalData = [];
                            for(var i = 0; i < technicalDataRows.length; i++) {
                                var row = technicalDataRows[i].getAttribute("row");
                                var newTechnicalInformation = {title: document.getElementById("title_" + row).innerText, value: document.getElementById("value_" + row).value};
                                selectedTechnicalData = [...selectedTechnicalData, newTechnicalInformation];
                            }
                            var formData = new FormData();
                            formData.append("title", temp.product.title);
                            formData.append("description", temp.product.description);
                            formData.append("price", temp.product.price);
                            formData.append("quantity", temp.product.quantity);
                            formData.append("category", temp.product.category);
                            formData.append("technicalData", JSON.stringify(selectedTechnicalData));
                            formData.append("primaryImage", temp.product.primaryImage);
                            for(var image = 0 ; image < temp.product.images.length; image++){
                                formData.append("images", temp.product.images[image].file)
                            }
                            formData.append("reCaptchaToken", reCaptchaToken);
                            axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createProduct", formData).then(response => {
                                if(response.data.created) {
                                    temp.productCreated = true;
                                    temp.product = {title: "", description: "", price: "", quantity: "", category: "", primaryImage: "", images: []};
                                    temp.selectedTechnicalData = [];
                                    document.getElementById("primaryImage").value = "";
                                    document.getElementById("primaryImageLabel").innerText = "";
                                    document.getElementById("previewPrimaryImage").innerText = "";
                                    document.getElementById("images").value = "";
                                    temp.errors = {titleError: false, descriptionError: false, priceError: false, quantityError: false, categoryError: false, primaryImageError: false};
                                    temp.toggleTab("main");
                                } else {
                                    var errorFields = response.data.errorFields;
                                    if(errorFields.includes("title")) temp.errors.titleError = true;
                                    if(errorFields.includes("description")) temp.errors.descriptionError = true;
                                    if(errorFields.includes("price")) temp.errors.priceError = true;
                                    if(errorFields.includes("quantity")) temp.errors.quantityError = true;
                                    if(errorFields.includes("category")) temp.errors.categoryError = true;
                                    if(errorFields.includes("primaryImage")) temp.errors.primaryImageError = true;
                                    temp.productCreated = false;
                                }
                            }).catch(error => console.log(error));
                        }
                    });
                });
            },
            clearTitleStatus() { this.errors.titleError = false },
            clearDescriptionStatus() { this.errors.descriptionError = false },
            clearPriceStatus() { this.errors.priceError = false },
            clearQuantityStatus() { this.errors.quantityError = false },
            clearCategoryStatus() { this.errors.categoryError = false },
            clearPrimaryImageStatus() { this.errors.primaryImageError = false },
            selectTechnicalData() {
                var technicalInformationTitle = document.getElementById("technicalData").value;
                var newTechnicalInformation = {title: technicalInformationTitle};
                this.selectedTechnicalData = [...this.selectedTechnicalData, newTechnicalInformation];
                document.getElementById("technicalData").value = "";
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
                        var fileReader = new FileReader();
                        fileReader.onload = function(e) {
                            var previewPrimaryImage = document.getElementById("previewPrimaryImage");
                            previewPrimaryImage.innerHTML = "<img src='" + e.target.result + "' class='rounded mx-auto d-block' alt='" + file.name + "' style='height: 150px; weight: 150px;'/>";
                            document.getElementById("primaryImageLabel").innerText = file.name;
                        }
                        this.product.primaryImage = file;
					    this.clearPrimaryImageStatus();
                        fileReader.readAsDataURL(file);
                    } else {
                        temp.errors.imagesError = false;
                        for (var i = 0, file; file = files[i]; i++) {
                            if (!file.type.match("image.*")) {
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
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
			},
            closeCreationAlert() {
				this.productCreated = false;
			}
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
        mounted() {
            var reCaptchaScript = document.createElement("script");
			reCaptchaScript.setAttribute("src", "https://www.google.com/recaptcha/api.js?render=" + process.env.VUE_APP_RECAPTCHA_v3_SITE_KEY);
			document.head.appendChild(reCaptchaScript);
        },
        created() {
			checkLogin.methods.isLoggedIn();
            this.getCategories();
            this.getTechnicalData();
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
        margin: 0 auto;
        max-width: 800px;
        margin-top: 20px;
    }
    #previewPrimaryImage {
		text-align: center;
		margin-bottom: 10px;
	}
    .previousButton {
		float: left;
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