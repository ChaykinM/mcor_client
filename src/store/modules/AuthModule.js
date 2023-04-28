import { AuthAPI } from "@/api/AuthAPI"

export const AuthModule = {
    namespaced: true,

    state() {
        return {
            jwtToken: localStorage.getItem("token") || '',
        };
    },

    mutations: {
        SET_AUTH_TOKEN: (state, token) => {
            localStorage.setItem("token", token);
            state.jwtToken = token;
        },
        DELETE_TOKEN: (state) => {
            localStorage.removeItem("token");
            state.jwtToken = '';
        }
    },

    actions: {
        onLogin({ commit }, { login, password }) {
            return new Promise((resolve, reject) => {
                AuthAPI.login(login, password).then(
                    (res) => {
                        commit('SET_AUTH_TOKEN', res.data.Token);
                        resolve();
                    },
                    (error) => {
                        reject(error);
                    });
            })
        },

        onRegister({ commit }, { time, login, email, password }) {
            return new Promise((resolve, reject) => {
                commit('CLEAR_REGISTR_ERROR');
                AuthAPI.register(time, login, email, password).then(
                    (res) => {
                        commit('SET_AUTH_TOKEN', res.data.Token);
                        resolve();
                    },
                    (error) => {
                        reject(error.response.data.error);
                    }
                )
            })
        },

        onRecoveryPassword({ email }) {
            return new Promise((resolve, reject) => {
                AuthAPI.recovery(email).then(
                    () => {
                        resolve();
                    },
                    (err) => {
                        reject(err);
                    }
                );
            })
        },

        onLogout({commit}) {
            commit("DELETE_TOKEN"); 
        }
    }
}