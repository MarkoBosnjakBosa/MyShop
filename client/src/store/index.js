import Vuex from "vuex";
import Axios from "axios";
import createPersistedState from "vuex-persistedstate";

const getDefaultState = () => {
	return {
		jwtData: {
			token: "",
			user: ""
		},
		authenticationData: {
			username: ""
		}
	};
};

export default new Vuex.Store({
	strict: true,
	plugins: [createPersistedState()],
	state: getDefaultState(),
	getters: {
		isLoggedIn: state => { return state.jwtData.token; },
		getUser: state => { return state.jwtData.user; },
		isAuthenticated: state => { return state.authenticationData.username; }
	},
	mutations: {
		SET_TOKEN: (state, token) => { state.jwtData.token = token; },
		SET_USER: (state, user) => { state.jwtData.user = user; },
		SET_USERNAME: (state, username) => { state.authenticationData.username = username },
		CLEAR_USERNAME: state => { state.authenticationData.username = "" },
		RESET: state => { Object.assign(state, getDefaultState()); }
	},
	actions: {
		login: ({commit}, {token, user}) => {
			commit("SET_TOKEN", token);
			commit("SET_USER", user);
			Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		},
		authenticate: ({commit}, {username}) => {
			commit("SET_USERNAME", username);
		},
		clearAuthentication: ({commit}) => {
			commit("CLEAR_USERNAME");
		},
		logout: ({commit}) => {
			commit("RESET", "");
		}
	}
});