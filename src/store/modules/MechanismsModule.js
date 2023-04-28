import { MechanismsAPI } from "@/api/MechanismsAPI";

export const MechanismsModule = {
  namespaced: true,
  state() {
    return {
      mechanisms: [],
    };
  },

  mutations: {
    SET_MECHANISMS: (state, mechanisms) => {
      state.mechanisms = mechanisms;
    },
    EDIT_MECHANISM_INFO: (state, mechanismInfo) => {
      let index = state.mechanisms.findIndex((m) => m.id == mechanismInfo.id);
      state.mechanisms[index].name = mechanismInfo.name;
      state.mechanisms[index].description = mechanismInfo.description;
    },
    SET_ACTIVE_MECH_CONFIG: (state, editRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == editRequest.mech_id);
      mechanism.configs.map((c) => (c.current = false));
      let configIndex = mechanism.configs.findIndex(
        (c) => c.id == editRequest.config_id
      );
      mechanism.configs[configIndex].current = true;
    },
    ADD_MECH_CONFIG: (state, addRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == addRequest.mech_id);
      mechanism.configs.push(addRequest.config);
    },
    EDIT_MECHANISM_CONFIG: (state, editRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == editRequest.mech_id);
      console.log(mechanism);
      console.log(mechanism.configs);
      let configIndex = mechanism.configs.findIndex(
        (c) => c.id == editRequest.config.id
      );
      console.log(configIndex);
      mechanism.configs[configIndex] = editRequest.config;
    },
    ADD_MECH_MOTOR_ENCODER: (state, addRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == addRequest.mech_id);
      let encoders = mechanism.motors.find((m) => {
        return m.mech_motor_id == addRequest.mech_motor_id;
      }).encoders;
      let newEncoder = {
        mech_motor_enc_id: addRequest.mech_motor_enc_id,
        encoder_data: addRequest.encoder,
      };
      encoders.push(newEncoder);
    },
    DELETE_MECH_MOTOR_ENCODER: (state, delRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == delRequest.mech_id);
      let encoders = mechanism.motors.find((m) => {
        return m.mech_motor_id == delRequest.mech_motor_id;
      }).encoders;
      let encIndex = encoders.findIndex(
        (e) => e.mech_motor_enc_id == delRequest.mech_motor_enc_id
      );
      encoders.splice(encIndex, 1);
    },
    ADD_MECH_MOTOR_PARAM: (state, addRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == addRequest.mech_id);
      let params = mechanism.motors.find((m) => {
        return m.mech_motor_id == addRequest.mech_motor_id;
      }).params;
      let newParam = {
        mech_motor_param_id: addRequest.mech_motor_param_id,
        param_data: addRequest.param,
      };
      params.push(newParam);
    },
    DELETE_MECH_MOTOR_PARAM: (state, delRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == delRequest.mech_id);
      let params = mechanism.motors.find((m) => {
        return m.mech_motor_id == delRequest.mech_motor_id;
      }).params;
      let paramIndex = params.findIndex(
        (p) => p.mech_motor_param_id == delRequest.mech_motor_param_id
      );
      params.splice(paramIndex, 1);
    },
    EDIT_MECH_MOTOR: (state, editRequest) => {
      console.log(editRequest);
      let mechanism = state.mechanisms.find((m) => m.id == editRequest.mech_id);
      console.log(mechanism);
      let motor = mechanism.motors.find(
        (m) => m.mech_motor_id == editRequest.mech_motor_id
      );
      console.log(motor);
      motor.motor_data = editRequest.motorData;
      motor.name = editRequest.motorName;
    },
    ADD_MECH_TRAJECTORY: (state, addRequest) => {
      let mechanism = state.mechanisms.find((m) => m.id == addRequest.mech_id);
      mechanism.trajectories.push(addRequest.trajectory);
    },
  },

  getters: {
    GET_MECHANISMS: (state) => {
      return state.mechanisms;
    },
    GET_MECH_COORD_TEMPLATES: () => {
      const templates = {
        msom: {
          dkt: [
            {
              id: 0,
              tag: "x",
              dimension: "мм",
            },
            {
              id: 1,
              tag: "y",
              dimension: "мм",
            },
            {
              id: 2,
              tag: "z",
              dimension: "мм",
            },
            {
              id: 3,
              tag: "alpha",
              dimension: "rad",
            },
            {
              id: 4,
              tag: "betta",
              dimension: "rad",
            },
          ],
          ikt: [
            {
              id: 0,
              tag: "q_1",
              dimension: "rad",
            },
            {
              id: 1,
              tag: "q_2",
              dimension: "rad",
            },
            {
              id: 2,
              tag: "q_3",
              dimension: "rad",
            },
            {
              id: 3,
              tag: "q_4",
              dimension: "rad",
            },
            {
              id: 4,
              tag: "q_5",
              dimension: "мм",
            },
            {
              id: 5,
              tag: "q_6",
              dimension: "rad",
            },
          ],
        },

        "5R": {
          dkt: [],
          ikt: [],
        },
      };

      return templates; 
    },
  },

  actions: {
    async onGetMechanisms({ commit }) {
      const mechResponse = await MechanismsAPI.getMechanismsInfo();
      let mechanisms = mechResponse.data.mechanisms;
      console.log(mechResponse);
      for (let mechanism of mechanisms) {
        let configsResponse = await MechanismsAPI.Config.getAllConfigs(
          mechanism.id
        );
        let configs = configsResponse.data.configs;
        let motorsResponse = await MechanismsAPI.Motors.getMotors(mechanism.id);
        let motors = motorsResponse.data.motors;
        let trajectoriesResponse =
          await MechanismsAPI.Trajectories.getTrajectories(mechanism.id);
        let trajectories = trajectoriesResponse.data.trajectories;
        mechanism["configs"] = configs;
        mechanism["motors"] = motors;
        mechanism["trajectories"] = trajectories;
      }
      console.log(mechanisms);
      commit("SET_MECHANISMS", mechanisms);
    },

    onEditMechanismInfo({ commit }, { mechanismInfo }) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.editMechanismInfo(mechanismInfo).then(
          (response) => {
            commit("EDIT_MECHANISM_INFO", mechanismInfo);
            resolve(response.data.message);
          },
          (error) => {
            reject(error);
          }
        );
      });
    },

    onSetActiveMechanismConfig({ commit }, { mech_id, config_id }) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Config.setActiveConfig(mech_id, config_id).then(
          () => {
            commit("SET_ACTIVE_MECH_CONFIG", { mech_id, config_id });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },

    onAddMechanismConfig({ commit }, { mech_id, config }) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Config.addConfig(mech_id, config).then(
          (res) => {
            config.id = res.data.config_id;
            commit("ADD_MECH_CONFIG", { mech_id, config });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },

    onEditMechanismConfig({ commit }, { mech_id, config }) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Config.editConfig(mech_id, config).then(
          () => {
            commit("EDIT_MECHANISM_CONFIG", { mech_id, config });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },

    onEditMechMotor({ commit }, { mech_id, editRequest }) {
      return new Promise((resolve, reject) => {
        let editMotorRequest = {
          mech_motor_id: editRequest.mech_motor_id,
          motor_id: editRequest.motorData.id,
          name: editRequest.motorName,
        };
        MechanismsAPI.Motors.editMotor(mech_id, editMotorRequest).then(
          () => {
            commit("EDIT_MECH_MOTOR", { mech_id, ...editRequest });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },

    onAddMechMotorEncoder({ commit }, { mech_id, mech_motor_id, encoder }) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Encoders.addEncoder(
          mech_id,
          mech_motor_id,
          encoder.id
        ).then(
          (res) => {
            let mech_motor_enc_id = res.data.id;
            commit("ADD_MECH_MOTOR_ENCODER", {
              mech_id,
              mech_motor_id,
              mech_motor_enc_id,
              encoder,
            });
            console.log(res);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    onDeleteMechMotorEncoder(
      { commit },
      { mech_id, mech_motor_id, mech_motor_enc_id }
    ) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Encoders.delEncoder(
          mech_id,
          mech_motor_id,
          mech_motor_enc_id
        ).then(
          () => {
            commit("DELETE_MECH_MOTOR_ENCODER", {
              mech_id,
              mech_motor_id,
              mech_motor_enc_id,
            });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    onAddMechMotorParam({ commit }, { mech_id, mech_motor_id, param }) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Params.addMotorParam(
          mech_id,
          mech_motor_id,
          param.param_id
        ).then(
          (res) => {
            let mech_motor_param_id = res.data.id;

            commit("ADD_MECH_MOTOR_PARAM", {
              mech_id,
              mech_motor_id,
              mech_motor_param_id,
              param,
            });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    onDeleteMechMotorParam(
      { commit },
      { mech_id, mech_motor_id, mech_motor_param_id }
    ) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Params.delMotorParam(
          mech_id,
          mech_motor_id,
          mech_motor_param_id
        ).then(
          () => {
            commit("DELETE_MECH_MOTOR_PARAM", {
              mech_id,
              mech_motor_id,
              mech_motor_param_id,
            });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    onAddMechTrajectory({ commit }, { mech_id, trajectory }) {
      return new Promise((resolve, reject) => {
        MechanismsAPI.Trajectories.addTrajectory(mech_id, trajectory).then(
          (res) => {
            console.log(res);
            let id = res.data.id;
            trajectory["id"] = id;
            commit("ADD_MECH_TRAJECTORY", {
              mech_id,
              trajectory,
            });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
  },
};
