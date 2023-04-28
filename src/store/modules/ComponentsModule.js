import { ComponentsAPI } from "@/api/ComponentsAPI";

export const ComponentsModule = {
    namespaced: true,
    state() {
        return {
            motors: [],
            encoders: [],
        }
    },

    mutations: {
        SET_MOTORS: (state, motors) => {
            state.motors = motors;
        },
        EDIT_MOTOR: (state, motor) => {
            let index = state.motors.findIndex(m => m.id == motor.id);
            state.motors[index] = motor;
        },
        ADD_MOTOR: (state, motor) => {
            state.motors.push(motor);
        },

        SET_ENCODERS: (state, encoders) => {
            state.encoders = encoders;
        }, 
        EDIT_ENCODER: (state, encoder) => {
            let index = state.encoders.findIndex(e => e.id == encoder.id);
            state.encoders[index] = encoder;
        }, 
        ADD_ENCODER: (state, encoder) => {
            state.encoders.push(encoder); 
        }
    },

    getters: {
        GET_MOTORS: (state) => {
            return state.motors;
        },
        GET_ENCODERS: (state) => {
            return state.encoders;
        }
    },

    actions: {
        onGetMotors({ commit }) {
            return new Promise((resolve, reject) => {
                ComponentsAPI.Motors.getMotors().then(
                    (result) => {
                        let motors = result.data.motors;
                        commit('SET_MOTORS', motors);
                        resolve();
                    },
                    (error) => {
                        reject(error);
                    }
                )
            })
        },

        onEditMotor({ commit }, { motorEditRequest }) {
            return new Promise((resolve, reject) => {
                let motor = {
                    id: motorEditRequest.id, 
                    name: motorEditRequest.name, 
                    description: motorEditRequest.description, 
                    img_url: motorEditRequest.img_url
                }

                if (motorEditRequest.imgFormData != null) {
                    // пользователь обновил изображение привода 
                    ComponentsAPI.Motors.uploadImgMotor(motorEditRequest.id, motorEditRequest.imgFormData).then(
                        (result) => {
                            motor.img_url = result.data.img_url; 
                        }, 
                        (error) => {
                            reject(error); 
                        }
                    )
                }

                ComponentsAPI.Motors.editMotor(motor).then(
                    () => {
                        commit('EDIT_MOTOR', motor);
                        resolve();
                    },
                    (error) => {
                        reject(error);
                    }
                )
            })
        },

        onAddMotor({ commit }, { motorAddRequest }) {
            return new Promise((resolve, reject) => {
                ComponentsAPI.Motors.addMotor({name: motorAddRequest.name, description: motorAddRequest.description}).then(
                    (result) => {
                        let motor_id = result.data.id; 
                        let newMotor = {
                            id: motor_id, 
                            img_url: '', 
                            name: motorAddRequest.name, 
                            description: motorAddRequest.description, 
                        }
                        if (motorAddRequest.imgFormData != null) { 
                            ComponentsAPI.Motors.uploadImgMotor(motor_id, motorAddRequest.imgFormData).then( 
                                (result) => {
                                    newMotor.img_url = result.data.img_url; 
                                    commit('ADD_MOTOR', newMotor); 
                                    resolve();
                                },
                                (error) => {
                                    commit('ADD_MOTOR', newMotor); // изображение не загрузили, но данные о приводе загрузились 
                                    reject(error); 
                                }
                            )
                        } else {
                            commit('ADD_MOTOR', newMotor); 
                            resolve();
                        }
                    },
                    (error) => {
                        reject(error); 
                    }
                )
            })
        },

        onGetEncoders({ commit }) {
            return new Promise((resolve, reject) => {
                ComponentsAPI.Encoders.getEncoders().then(
                    (result) => {
                        let encoders = result.data.encoders;
                        commit('SET_ENCODERS', encoders);
                        resolve();
                    },
                    (error) => {
                        reject(error);
                    }
                )
            })
        },

        onEditEncoder({ commit }, { encoderEditRequest }) {
            return new Promise((resolve, reject) => {
                let encoder = {
                    id: encoderEditRequest.id, 
                    name: encoderEditRequest.name, 
                    description: encoderEditRequest.description, 
                    img_url: encoderEditRequest.img_url
                }

                if (encoderEditRequest.imgFormData != null) {
                    ComponentsAPI.Encoders.uploadImgEncoder(encoderEditRequest.id, encoderEditRequest.imgFormData).then(
                        (result) => {
                            encoder.img_url = result.data.img_url; 
                        }, 
                        (error) => {
                            reject(error); 
                        }
                    )
                }

                ComponentsAPI.Encoders.editEncoder(encoder).then(
                    () => {
                        commit('EDIT_ENCODER', encoder);
                        resolve();
                    },
                    (error) => {
                        reject(error);
                    }
                )
            })
        },

        onAddEncoder({ commit }, { encoderAddRequest }) {
            return new Promise((resolve, reject) => {
                ComponentsAPI.Encoders.addEncoder({name: encoderAddRequest.name, description: encoderAddRequest.description}).then(
                    (result) => {
                        let enc_id = result.data.id; 
                        let newEncoder = {
                            id: enc_id, 
                            img_url: '', 
                            name: encoderAddRequest.name, 
                            description: encoderAddRequest.description, 
                        }
                        if (encoderAddRequest.imgFormData != null) { 
                            ComponentsAPI.Encoders.uploadImgEncoder(enc_id, encoderAddRequest.imgFormData).then( 
                                (result) => {
                                    newEncoder.img_url = result.data.img_url; 
                                    commit('ADD_ENCODER', newEncoder); 
                                    resolve();
                                },
                                (error) => {
                                    commit('ADD_ENCODER', newEncoder); // изображение не загрузили, но данные о приводе загрузились 
                                    reject(error); 
                                }
                            )
                        } else {
                            commit('ADD_ENCODER', newEncoder); 
                            resolve();
                        }
                    },
                    (error) => {
                        console.log(error)
                        reject(error); 
                    }
                )
            })
        }
    }
}

