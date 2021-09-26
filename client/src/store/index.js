import Vuex from "vuex";
import Axios from "axios";
import createPersistedState from "vuex-persistedstate";

const getDefaultState = () => {
	return {
		jwtData: {
			token: "",
			user: "",
			isAdmin: false
		},
		authenticationData: {
			username: ""
		},
		products: [],
		checkout: ""
	};
};

export default new Vuex.Store({
	strict: false,
	plugins: [createPersistedState()],
	state: getDefaultState(),
	getters: {
		isLoggedIn: state => { return state.jwtData.token; },
		getUser: state => { return state.jwtData.user; },
		isAdmin: state => { return state.jwtData.isAdmin; },
		isAuthenticated: state => { return state.authenticationData.username; },
		getShoppingCart: state => { return state.products; },
		getCheckout: state => { return state.checkout; }
	},
	mutations: {
		SET_TOKEN: (state, token) => { state.jwtData.token = token; },
		SET_USER: (state, user) => { state.jwtData.user = user; },
		SET_ADMIN: (state, isAdmin) => { state.jwtData.isAdmin = isAdmin; },
		SET_USERNAME: (state, username) => { state.authenticationData.username = username; },
		CLEAR_USERNAME: state => { state.authenticationData.username = ""; },
		ADD_TO_SHOPPING_CART: (state, product) => {
			var foundIndex = state.products.findIndex(foundProduct => foundProduct._id == product._id);
			if(foundIndex > -1) {
				state.products[foundIndex].selectedQuantity = Number(state.products[foundIndex].selectedQuantity) + Number(product.selectedQuantity);
			} else {
				state.products = [...state.products, product]; 
			}
		},
		UPDATE_SELECTED_QUANTITY: (state, {productId, selectedQuantity}) => {
			var foundIndex = state.products.findIndex(foundProduct => foundProduct._id == productId);
			if(foundIndex > -1) {
				state.products[foundIndex].selectedQuantity = selectedQuantity;
			}
		},
		REMOVE_FROM_SHOPPING_CART: (state, productId) => { state.products = state.products.filter(product => product._id != productId); },
		CLEAR_SHOPPING_CART: state => { state.products = []; },
		SET_CHECKOUT: (state, checkout) => { state.checkout = checkout; },
		RESET: state => { Object.assign(state, getDefaultState()); }
	},
	actions: {
		login: ({commit}, {token, user, isAdmin}) => {
			commit("SET_TOKEN", token);
			commit("SET_USER", user);
			commit("SET_ADMIN", isAdmin);
			Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		},
		authenticate: ({commit}, username) => {
			commit("SET_USERNAME", username);
		},
		clearAuthentication: ({commit}) => {
			commit("CLEAR_USERNAME");
		},
		addToShoppingCart: ({commit}, product) => {
			commit("ADD_TO_SHOPPING_CART", product);
		},
		updateSelectedQuantity: ({commit}, {productId, selectedQuantity}) => {
			commit("UPDATE_SELECTED_QUANTITY", {productId, selectedQuantity});
		},
		removeFromShoppingCart: ({commit}, productId) => {
			commit("REMOVE_FROM_SHOPPING_CART", productId);
		},
		clearShoppingCart: ({commit}) => {
			commit("CLEAR_SHOPPING_CART");
		},
		setCheckout: ({commit}, checkout) => {
			commit("SET_CHECKOUT", checkout);
		},
		logout: ({commit}) => {
			commit("RESET");
			location.reload();
		}
	}
});