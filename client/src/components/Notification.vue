<template>
    <div id="notification">
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
            <div class="toast" :class="message != '' ? 'show' : 'hide'" role="alert">
                <div class="toast-header">
                    <strong class="me-auto title">{{product.title}}</strong>
                    <button type="button" class="btn-close" @click="hideNotification()"></button>
                </div>
                <div class="toast-body">{{message}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "notification",
        props: {
            product: {
                _id: "",
                title: "",
                description: "",
                price: "",
                quantity: 0,
                category: "",
                technicalData: [],
                primaryImage: "",
                images: [],
                rating: {},
                selectedQuantity: 1
            },
            message: ""
        },
        methods: {
            hideNotification() { this.$emit("hide"); }
        }
    }
</script>

<style scoped>
    .toast-body {
        color: #008000;
    }
    .title {
        overflow: hidden;
        white-space: nowrap;
    }
</style>