<template>
	<div>
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.0/css/all.css">
		<router-view :key="($route.EditProduct + $route.params.productId) || ($route.ViewProduct + $route.params.productId) || ($route.ShopCategory + $route.params.categoryId) || ($route.Order + $route.params.orderId) || ($route.ViewOrder + $route.params.orderId) || ($route.ViewProfile + $route.params.userId) || ''"/>
	</div>
</template>
