import { HistoryAPI } from "@/api/HistoryAPI";

export const HistoryModule = {
    namespaced: true, 
    
    state() {
        return {
            history_seans: [], 
            history_custom_params: [], 
        }; 
    },

    mutations: {
        SET_HISTORY_SEANS: (state, history_seans) => {
            state.history_seans = history_seans; 
        },
        SET_HISTORY_CUSTOM_PARAMS: (state, history_custom_params) => {
            state.history_custom_params = history_custom_params; 
        }, 

        EDIT_HISTORY_SEANS: (state, history) => {
            let index = state.history_seans.findIndex(h => h.id == history.id); 
            state.history_seans[index] = history; 
        }, 
        EDIT_HISTORY_CUSTOM_PARAMS: (state, history) => {
            let index = state.history_custom_params.findIndex(h => h.id == history.id);
            state.history_custom_params[index] = history; 
        }, 

        DELETE_HISTORY_SEANS: (state, id) => {
            let index = state.history_seans.findIndex(h => h.id == id); 
            state.history_seans.splice(index, 1); 
        }, 
        DELETE_HISTORY_CUSTOM_PARAMS: (state, id) => {
            let index = state.history_custom_params.findIndex(h => h.id == id);
            state.history_custom_params.splice(index, 1); 
        }
    }, 

    getters: {
        GET_HISTORY_SEANS: (state) => {
            return state.history_seans;
        }, 

        GET_HISTORY_CUSTOM_PARAMS: (state) => {
            return state.history_custom_params; 
        }
    }, 

    actions: {
        onGetHistorySeans({ commit }) {
            return new Promise((resolve, reject) => {
                HistoryAPI.MechanismsSession.getAllHistory().then(
                    (res) => {
                        console.log(res);

                        let history_seans = res.data.history_seans != null ? res.data.history_seans : []; 
                        commit("SET_HISTORY_SEANS", history_seans); 
                        resolve(); 
                    }, 
                    (error) => {
                        console.log(error); 
                        reject(error); 
                    }
                )
            })
        }, 

        onGetHistoryCustomParams({ commit }) {
            return new Promise((resolve, reject) => {
                HistoryAPI.CustomSession.getAllHistory().then(
                    (result) => {
                        console.log(result);
                        let history_custom_params = result.data.history_custom_params != null ? result.data.history_custom_params : []; 
                        commit("SET_HISTORY_CUSTOM_PARAMS", history_custom_params); 
                        resolve(); 
                    }, 
                    (error) => {
                        console.log(error); 
                        reject(error); 
                    }
                )
            })
        },

        onEditHistorySeans({commit}, history) {
            return new Promise((resolve, reject) => {
                HistoryAPI.MechanismsSession.editHistory(history).then(
                    () => {
                        commit("EDIT_HISTORY_SEANS", history); 
                        resolve();
                    },
                    (error) => {
                        reject(error); 
                    }
                )
            })
        }, 

        onEditHistoryCustomParams({commit}, history) {
            return new Promise((resolve, reject) => {
                HistoryAPI.CustomSession.editHistory(history).then(
                    () => {
                        commit("EDIT_HISTORY_CUSTOM_PARAMS", history);
                        resolve();
                    }, 
                    (error) => {
                        reject(error); 
                    }
                )
            })
        }, 

        onDeleteHistorySeans({ commit }, id) {
            return new Promise((resolve, reject) => {
                HistoryAPI.MechanismsSession.deleteHistory(id).then(
                    () => {
                        commit("DELETE_HISTORY_SEANS", id);
                        resolve();
                    }, 
                    (error) => {
                        reject(error);
                    }
                )
            })
        }, 

        onDeleteHistoryCustomParams({ commit }, id) {
            return new Promise((resolve, reject) => {
                HistoryAPI.CustomSession.deleteHistory(id).then(
                    () => {
                        commit("DELETE_HISTORY_CUSTOM_PARAMS", id); 
                        resolve(); 
                    },
                    (error) => {
                        reject(error); 
                    }
                )
            })
        }
    }
}