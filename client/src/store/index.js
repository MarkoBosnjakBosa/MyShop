import Vuex from "vuex";
import Axios from "axios";
import createPersistedState from "vuex-persistedstate";

const getDefaultState = () => {
	return {
		login: {
			user: "",
			token: "",
			isAdmin: false
		},
		authentication: {
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
		getUser: state => { return state.login.user; },
		isLoggedIn: state => { return state.login.token; },
		isAdmin: state => { return state.login.isAdmin; },
		isAuthenticated: state => { return state.authentication.username; },
		getShoppingCart: state => { return state.products; },
		getCheckout: state => { return state.checkout; }
	},
	mutations: {
		SET_USER: (state, user) => { state.login.user = user; },
		SET_TOKEN: (state, token) => { state.login.token = token; },
		SET_ADMIN: (state, isAdmin) => { state.login.isAdmin = isAdmin; },
		SET_USERNAME: (state, username) => { state.authentication.username = username; },
		CLEAR_USERNAME: state => { state.authentication.username = ""; },
		ADD_TO_SHOPPING_CART: (state, product) => {
			var foundIndex = state.products.findIndex(foundProduct => foundProduct._id === product._id);
			if(foundIndex > -1) {
				state.products[foundIndex].selectedQuantity = Number(state.products[foundIndex].selectedQuantity) + Number(product.selectedQuantity);
			} else {
				state.products = [...state.products, product]; 
			}
		},
		UPDATE_SELECTED_QUANTITY: (state, {productId, selectedQuantity}) => {
			var foundIndex = state.products.findIndex(foundProduct => foundProduct._id === productId);
			if(foundIndex > -1) {
				state.products[foundIndex].selectedQuantity = selectedQuantity;
			}
		},
		REMOVE_FROM_SHOPPING_CART: (state, productId) => { state.products = state.products.filter(product => product._id !== productId); },
		CLEAR_SHOPPING_CART: state => { state.products = []; },
		SET_CHECKOUT: (state, checkout) => { state.checkout = checkout; },
		RESET: state => { Object.assign(state, getDefaultState()); }
	},
	actions: {
		login: ({commit}, {user, token, isAdmin}) => {
			commit("SET_USER", user);
			commit("SET_TOKEN", token);
			commit("SET_ADMIN", isAdmin);
			Axios.defaults.headers.common["Application-User"] = user;
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
			window.location.href = process.env.VUE_APP_BASE_URL + process.env.VUE_APP_CLIENT_PORT + "/login";
		}
	}
});