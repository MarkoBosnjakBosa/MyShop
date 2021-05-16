<template>
    <div id="notification">
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
            <div id="notificationPanel" class="toast" :class="isNotificationDisplayed ? 'show' : 'hide'" role="alert">
                <div class="toast-header">
                    <strong class="me-auto">{{product.title}}</strong>
                    <button type="button" class="btn-close" @click="hideNotification()"></button>
                </div>
                <div class="toast-body">{{notificationMessage}}</div>
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
                quantity: "",
                category: "",
                technicalData: [],
                primaryImage: "",
                images: [],
                rating: {},
                selectedQuantity: 1
            },
            notificationMessage: "",
            isNotificationDisplayed: false
		},
        methods: {
            hideNotification()  { this.$emit("hide"); }
        }
    }
</script>

<style scoped>
    .toast-body {
        color: #008000;
    }
</style>