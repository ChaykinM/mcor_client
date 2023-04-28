import { UsersAPI } from "@/api/UsersAPI"; 

export const UsersModule = {
    namespaced: true,
    state() {
        return {
            users: [], 
        }
    },

    mutations: {
        SET_USERS: (state, users) => {
            state.users = users; 
        },
        
        EDIT_USER: (state, userUpdate) => {
            let index = state.users.findIndex(u => u.id == userUpdate.id);
            state.users[index] = userUpdate; 
        },

        DELETE_USER: (state, id) => {
            let index = state.users.findIndex(u => u.id == id);
            state.users.splice(index, 1); 
        }
    },

    getters: {
        GET_USERS: (state) => {
            return state.users;
        }
    }, 

    actions: {
        onGetUsers( {commit} ) {
            return new Promise((resolve, reject) => {
                UsersAPI.getUsers().then(
                    (result) => {
                        let users = result.data.users;
                        commit('SET_USERS', users);
                        resolve();
                    },
                    (error) => {
                        reject(error); 
                    }
                )
            })
        }, 

        onEditUser({commit}, {userUpdate}) {
            return new Promise((resolve, reject) => {
                UsersAPI.editUser(userUpdate).then(
                    (result) => {
                        console.log(result); 
                        commit("EDIT_USER", userUpdate); 
                        resolve(); 
                    }, 
                    (error) => {
                        reject(error); 
                    }
                )
            })
        },

        onDeleteUser({commit}, {id}) {
            return new Promise((resolve, reject) => {
                UsersAPI.deleteUser(id).then(
                    () => {
                        commit("DELETE_USER", id);
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