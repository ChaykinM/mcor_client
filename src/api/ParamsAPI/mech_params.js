import ApiInstance from '@/api/index'

export const MechanismsSession = {
    getParams() {
        const url = '/params/';
        return ApiInstance.get(url);
    }, 
    getParamById(id) {
        const url = `/params/${id}`;
        return ApiInstance.get(url);
    }, 
    addParam(param) {
        const url = '/params/add';
        return ApiInstance.post(url, param);
    }, 
    editParam(param) {
        const url = `/params/${param.param_id}/edit`;
        return ApiInstance.post(url, param);
    },
    deleteParam(id) {
        const url = `/params/${id}/del`;
        return ApiInstance.delete(url); 
    }
}