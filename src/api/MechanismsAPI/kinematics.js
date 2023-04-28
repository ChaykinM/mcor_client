import ApiInstance from '@/api/index'

export const Kinematics = {
    DKTsolver(mech_id, task) {
        const url = `/mechanisms/${mech_id}/kinematics/dkt_solver`; 
        return ApiInstance.post(url, task); 
    }, 
    IKTsolver(mech_id, task) {
        const url = `/mechanisms/${mech_id}/kinematics/ikt_solver`; 
        return ApiInstance.post(url, task); 
    }, 
    Interpolation(mech_id, task) {
        const url = `/mechanisms/${mech_id}/kinematics/interpolation`; 
        return ApiInstance.post(url, task); 
    }

    // validate 

}