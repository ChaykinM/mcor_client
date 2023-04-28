import ApiInstance from '@/api/index'

export const CustomSession = { 
    getAllHistory() {
        const url = `/history_custom_params/`; 
        return ApiInstance.get(url);
    }, 
    getHistoryById(id) {
        const url = `/history_custom_params/${id}`;
        return ApiInstance.get(url); 
    }, 
    editHistory(history) {
        const url = `/history_custom_params/${history.id}/edit`;
        return ApiInstance.post(url, history); 
    }, 
    addHistory(history) {
        const url = '/history_custom_params/add'; 
        return ApiInstance.post(url, history); 
    }, 
    deleteHistory(id) {
        const url = `/history_custom_params/${id}/del`; 
        return ApiInstance.delete(url); 
    }
}