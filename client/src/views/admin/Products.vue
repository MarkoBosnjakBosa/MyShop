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
		name: "products",
		components: {
            navigation,
			sidebar
        },
        data() {
			return {
                products: [],
                categories: [],
                technicalData: [],
                submitting: false,
                titleError: false,
                descriptionError: false,
                priceError: false,
                quantityError: false,
                product: {
                    title: "",
                    description: "",
                    price: "",
                    quantity: "",
                    category: "",
                    technicalData: [],
                    primaryImage: "",
                    images: []
                },
                productCreated: false,
                editing: null
			}
		},
        methods: {
            getProducts() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getProducts").then(response => {
                    this.products = response.data.products;
                }).catch(error => console.log(error));
            },
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
            createCategory() {
                this.submitting = true;
                this.clearTitleStatus();
                this.clearIconStatus();
                var allowSubmit = true;
                if(this.invalidTitle) {
                    this.titleError = true;
                    allowSubmit = false;
                }
                if(this.invalidIcon) {
                    this.iconError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.categoryCreated = false;
                    return;
                }
                var body = {title: this.category.title, icon: this.category.icon};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createCategory", body).then(response => {
                    if(response.data.created) {
                        var newCategory = response.data.category;
                        this.categories = [...this.categories, newCategory];
                        this.categoryCreated = true;
                        this.category = {title: "", icon: ""};
                        this.titleError = false, this.iconError = false, this.submitting = false;
                    } else {
                        var errorFields = response.data.errorFields;
                        if(errorFields.includes("title")) this.titleError = true;
                        if(errorFields.includes("icon")) this.iconError = true;
                        this.categoryCreated = false;
                    }
                }).catch(error => console.log(error));
            },
            enableEditing(category) {
                this.cachedCategory = Object.assign({}, category);
                this.editing = category._id;
            },
            disableEditing(category) {
                Object.assign(category, this.cachedCategory);
                this.editing = null;
            },
            editCategory(updatedCategory) {
                if(!validation.methods.invalidTitle(updatedCategory.title) && !validation.methods.invalidIcon(updatedCategory.icon)) {
                    var body = {categoryId: updatedCategory._id, title: updatedCategory.title, icon: updatedCategory.icon};
                    axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editCategory", body).then(response => {
                        if(response.data.edited) {
                            this.categories = this.categories.map(category => category._id == updatedCategory._id ? updatedCategory : category);
                            this.editing = null;
                        }
                    }).catch(error => console.log(error));
                }
            },
            deleteCategory(categoryId, categoryTitle) {
                var confirmed = confirm("Delete category " + categoryTitle + "!");
                if(confirmed) {
                    axios.delete(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/deleteCategory/" + categoryId).then(response => {
                        if(response.data.deleted) {
                            this.categories = this.categories.filter(category => category._id != categoryId);
                        }
                    }).catch(error => console.log(error));
                }
            },
            clearTitleStatus() { this.titleError = false, this.categoryCreated = false; },
            clearIconStatus() { this.iconError = false, this.categoryCreated = false; },
            selectTechnicalData() {
                var technicalInformationTitle = document.getElementById("technicalData").value;
                var newTechnicalInformation = {title: technicalInformationTitle};
                this.product.technicalData = [...this.product.technicalData, newTechnicalInformation];
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
                        var file = files[0];
                        var fileReader = new FileReader();
                        fileReader.onload = function(e) {
                            var previewPrimaryImage = document.getElementById("previewPrimaryImage");
                            previewPrimaryImage.innerHTML = "<img src='" + e.target.result + "' class='rounded mx-auto d-block' alt='" + file.name + "'/>";
                        }
                        this.product.primaryImage = file;
                        document.getElementById("dropzone").classList.remove("onDragOver");
					    //this.clearPrimaryImageStatus();
                        fileReader.readAsDataURL(file);
                    } else {
                        for (var i = 0, file; file = files[i]; i++) {
                            if (!file.type.match("image.*")) {
                                continue;
                            }
                            var fileReader = new FileReader();
                            fileReader.onload = (function(theFile) {
                                return function(e) {
                                    var newImage = {name: theFile.name, src: e.target.result, file: theFile};
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
            },
            addDragOver(event) {
                document.getElementById("dropzone").className = "onDragOver";
            },
            removeDragOver(event) {
                document.getElementById("dropzone").classList.remove("onDragOver");
            },
            toggleTab(tab) {
                helper.methods.toggleTab(tab);
			}
        },
        computed: {
            invalidTitle() { return validation.methods.invalidTitle(this.category.title); },
            invalidIcon() { return validation.methods.invalidIcon(this.category.icon); }
        },
        created() {
			checkLogin.methods.isLoggedIn();
            this.getProducts();
            this.getCategories();
            this.getTechnicalData();
        }
    }
</script>