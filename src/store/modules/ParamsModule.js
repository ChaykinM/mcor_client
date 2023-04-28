import socket from "@/socket";
import { MechanismsAPI } from "@/api/MechanismsAPI";
import { ParamsAPI } from "@/api/ParamsAPI";

export const ParamsModule = {
    namespaced: true,

    state() {
        return {
            params: [],

            custom_params: [], // [{id, name, tag, description, data}, ..., {}] без значений, т.е. data = []
            customParamsWithValues: [], 

            // customParamsData: [], 
            mechMotorsParams: [], 
        }
    },

    mutations: {
        SET_PARAMS: (state, params) => {
            state.params = params; 
        }, 
        EDIT_PARAM: (state, param) => {
            let index = state.params.findIndex(p => p.param_id == param.param_id);
            state.params[index] = param; 
        }, 
        DELETE_PARAM: (state, param_id) => {
            let index = state.params.findIndex(p => p.param_id == param_id); 
            state.params.splice(index, 1); 
        }, 
        ADD_PARAM: (state, param) => {
            state.params.push(param); 
        }, 
        
        SET_CUSTOM_PARAMS: (state, custom_params) => {
            state.custom_params = custom_params; 
            // state.customParamsData = custom_params; 
        }, 
        EDIT_CUSTOM_PARAM: (state, custom_param) => {
            let index = state.custom_params.findIndex(p => p.param_id == custom_param.param_id);
            state.custom_params[index] = custom_param; 
        }, 
        DELETE_CUSTOM_PARAM: (state, param_id) => {
            let index = state.custom_params.findIndex(p => p.param_id == param_id);
            state.custom_params.splice(index, 1); 
        }, 
        ADD_CUSTOM_PARAM: (state, custom_param) => {
            state.custom_params.push(custom_param); 
        }, 

        SET_CUSTOM_PARAMS_WITH_VALUES: (state, customParamsWithValues) => {
            state.customParamsWithValues = customParamsWithValues;
        }, 
        
        SET_MECH_MOTORS_PARAMS: (state, mechMotorsParams) => {
            mechMotorsParams.motorParams.map((motor) => {
                if (motor.params != null) {
                    motor.params.map((param) => param.param_data["data"] = []);
                }
            }); 
            state.mechMotorsParams = mechMotorsParams; 
        }, 

        ADD_CONTROL_PARAM: (state, wsMsgArr) => {
            if(state.mechMotorsParams.length != 0){
                // если параметры для контроля добавлены и сохранены в стейте, то сохраняем значение из websocket
                let mech_id = wsMsgArr.at(0); 
                if (state.mechMotorsParams.mech_id == mech_id) {
                    let mech_motor_id = wsMsgArr.at(1); 
                    let motor = state.mechMotorsParams.motorParams.find(m => {return m.mech_motor_id == mech_motor_id})
                    let paramTag = wsMsgArr.at(2); 
                    // let param = motor.params.find((param) => {return param.tag == paramTag}); 
                    let param = motor.params.map(p => p.param_data).find((param) => {return param.tag == paramTag}); 
                    if(typeof param !== 'undefined'){
                        let t = wsMsgArr.at(3); 
                        let value = wsMsgArr.at(4); 
                        param["data"].push([t, value]); 
                        // param["data"] = [t, value]; если не хочу хранить целы массивы всех данных, но как быть с историей тогда?  
                    }
                }

             }
        },
        
        ADD_CUSTOM_PARAM_WITH_VALUES: (state, wsMsgArr) => {
            if(state.customParamsWithValues.length != 0) {
                let paramTag = wsMsgArr.at(1);
                let customParam = state.customParamsWithValues.find(param => param.tag == paramTag);
                let t = wsMsgArr.at(2);
                let value = wsMsgArr.at(3); 
                customParam["data"].push([t, value]); 
            }
        },
    },

    getters: {
        GET_PARAMS: (state) => {
            return state.params;
        },
        GET_MECH_MOTORS_PARAMS: (state) => {
            return state.mechMotorsParams; 
        }, 
        GET_CUSTOM_PARAMS: (state) => {
            return state.custom_params;
        },
        GET_CUSTOM_PARAMS_WITH_VALUES: (state) => {
            return state.customParamsWithValues; 
        }, 
    },

    actions: {

        onGetParams({ commit }) {
            return new Promise((resolve, reject) => {
                ParamsAPI.MechanismsSession.getParams().then(
                    (res) => {
                        let params = res.data.params; 
                        commit("SET_PARAMS", params); 
                        resolve(params);
                    }, 
                    (error) => {
                        reject(error)
                    }
                )
            })
        }, 

        onEditParam({ commit }, { paramData }) {
            return new Promise((resolve, reject) => {
                ParamsAPI.MechanismsSession.editParam(paramData).then(
                    () => {
                        commit("EDIT_PARAM", paramData); 
                        resolve(); 
                    },
                    (error) => {
                        let message = `Ошибка ${error.response.status}. Название или идентификатор параметра должны быть уникальными.`;
                        reject(message);
                    }
                )
            })
        }, 

        onDeleteParam({ commit }, { param_id }) {
            return new Promise((resolve, reject) => {
                ParamsAPI.MechanismsSession.deleteParam(param_id).then(
                    () => {
                        commit("DELETE_PARAM", param_id); 
                        resolve(); 
                    },
                    (error) => {
                        let message = `Ошибка ${error.response.status}. Не удалось удалить параметр.`;
                        reject(message); 
                    }
                )
            })
        }, 

        onAddParam({ commit }, { paramData }) {
            return new Promise((resolve, reject) => {
                ParamsAPI.MechanismsSession.addParam(paramData).then(
                    (res) => {
                        paramData.param_id = res.data.id;
                        commit("ADD_PARAM", paramData); 
                        resolve(); 
                    },
                    (error) => {
                        let message = `Ошибка ${error.response.status}. Название или идентификатор параметра должны быть уникальными.`;
                        reject(message); 
                    }
                )
            })
        }, 

        onGetCustomParams({ commit }) {
            return new Promise((resolve, reject) => {
                ParamsAPI.CustomSession.getParams().then(
                    (res) => {
                        let custom_params = res.data.custom_params; 
                        custom_params.map(param => param["data"] = []);  
                        commit("SET_CUSTOM_PARAMS", custom_params);
                        resolve(custom_params);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            })
        },

        onEditCustomParam({commit}, {paramData}) {
            return new Promise((resolve, reject) => {
                ParamsAPI.CustomSession.editParam(paramData).then(
                    () => {
                        commit("EDIT_CUSTOM_PARAM", paramData);
                        resolve(); 
                    },
                    (error) => {
                        let message = `Ошибка ${error.response.status}. Название или идентификатор параметра должны быть уникальными.`;
                        reject(message); 
                    }
                )
            })
        },

        onDeleteCustomParam({commit}, {param_id}) {
            return new Promise((resolve, reject) => {
                ParamsAPI.CustomSession.deleteParam(param_id).then(
                    () => {
                        commit("DELETE_CUSTOM_PARAM", param_id);
                        resolve();
                    },
                    (error) => {
                        let message = `Ошибка ${error.response.status}. Не удалось удалить параметр.`;
                        reject(message);
                    }
                )
            })
        }, 

        onAddCustomParam({commit}, {paramData}) {
            return new Promise((resolve, reject) => {
                ParamsAPI.CustomSession.addParam(paramData).then(
                    (res) => {
                        paramData.param_id = res.data.id;
                        commit("ADD_CUSTOM_PARAM", paramData); 
                        resolve(); 
                    },
                    (error) => {
                        let message = `Ошибка ${error.response.status}. Название или идентификатор параметра должны быть уникальными.`;
                        reject(message); 
                    }
                )
            })
        },

        onGetMechMotorsParamsForControl({commit}, {mech_id}) {
            return new Promise((resolve, reject) => {
                MechanismsAPI.Params.getAllParams(mech_id).then(
                    (res) => {
                        let motorParams = res.data; 
                        commit("SET_MECH_MOTORS_PARAMS", motorParams); 
                        resolve()
                    }, 
                    (error) => {
                        reject(error)
                    }
                )
            })
        }, 
        onGetCustomParamsForControl( {commit} ) {
            return new Promise((resolve, reject) => {
                ParamsAPI.CustomSession.getParams().then(
                    (res) => {
                        let custom_params = res.data.custom_params; 
                        custom_params.map(param => param["data"] = []);  
                        commit("SET_CUSTOM_PARAMS_WITH_VALUES", custom_params);
                        resolve(custom_params);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            })
        },
        
        onSocketMsg({ commit }) {
            return new Promise((resolve, reject) => {
                socket.onmessage = function (event) {
                    let wsMsg = event.data;
                    let wsMsgArr = wsMsg.split(",");
                    if (wsMsgArr.at(0) == "c") {
                        commit("ADD_CUSTOM_PARAM_WITH_VALUES", wsMsgArr);
                    } else {
                        // параметр привода 
                        commit("ADD_CONTROL_PARAM", wsMsgArr); 
                    }
                    resolve();
                };

                socket.onerror = function (error) {
                    reject(error);
                };
            })
        }
    }
}