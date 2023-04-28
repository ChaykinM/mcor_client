import ApiInstance from '@/api/index'

export const UsersAPI = {
    getUsers() {
        const url = '/users/';
        return ApiInstance.get(url);
    }, 
    getUserById(id) {
        const url = `/users/${id}`;
        return ApiInstance.get(url);
    }, 
    editUser(userUpdate) {
        const url = `/users/${userUpdate.id}/edit`;
        return ApiInstance.post(url, userUpdate);
    },
    deleteUser(id) {
        const url = `/users/${id}/del`;
        return ApiInstance.delete(url); 
    },
    updateUserPassword(userUpdPass) {
        const url = `/users/${userUpdPass.id}/updPass`;
        return ApiInstance.post(url, userUpdPass); 
    }
}