import ApiInstance from '@/api/index'

export const MechanismsSession = {
    getAllHistory() {
        const url = '/histories/'; 
        return ApiInstance.get(url); 
    }, 
    getHistoryById(id) {
        const url = `/histories/${id}`;
        return ApiInstance.get(url); 
    }, 
    editHistory(history) {
        const url = `/histories/${history.id}/edit`;
        return ApiInstance.post(url, history); 
    }, 
    addHistory(history) {
        const url = `/histories/add`;
        return ApiInstance.post(url, history);
    }, 
    deleteHistory(id) {
        const url = `histories/${id}/del`; 
        return ApiInstance.delete(url); 
    }, 
}