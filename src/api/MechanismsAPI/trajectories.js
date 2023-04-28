import ApiInstance from '@/api/index'

export const Trajectories = {
    getTrajectories(mech_id) {
        const url = `/mechanisms/${mech_id}/trajectories`;
        return ApiInstance.get(url); 
    }, 
    addTrajectory(mech_id, trajectory) {
        const url = `/mechanisms/${mech_id}/trajectories/save`; 
        return ApiInstance.post(url, trajectory); 
    }
}