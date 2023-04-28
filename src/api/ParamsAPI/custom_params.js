import ApiInstance from '@/api/index'

export const CustomSession = {
    getParams() {
        const url = '/custom_params/';
        return ApiInstance.get(url);
    }, 
    getParamById(id) {
        const url = `/custom_params/${id}`;
        return ApiInstance.get(url);
    }, 
    addParam(param) {
        const url = '/custom_params/add';
        return ApiInstance.post(url, param);
    }, 
    editParam(param) {
        const url = `/custom_params/${param.param_id}/edit`;
        return ApiInstance.post(url, param);
    },
    deleteParam(id) {
        const url = `/custom_params/${id}/del`;
        return ApiInstance.delete(url); 
    }
}