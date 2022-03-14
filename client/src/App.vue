<template>
	<router-view :key="($route.EditProduct + $route.params.productId) || ($route.ViewProduct + $route.params.productId) || ($route.ShopCategory + $route.params.categoryId) || ($route.Order + $route.params.orderId) || ($route.ViewOrder + $route.params.orderId) || ($route.ViewProfile + $route.params.userId) || ''"></router-view>
</template>
