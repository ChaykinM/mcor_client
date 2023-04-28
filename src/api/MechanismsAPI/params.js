import ApiInstance from '@/api/index'

export const Params = {
    getAllParams(mech_id){
        const url = `/mechanisms/${mech_id}/motors/params`;
        return ApiInstance.get(url); 
    },
    getMotorParams(mech_id, mech_motor_id){
        const url = `/mechanisms/${mech_id}/motors/${mech_motor_id}/params`;
        return ApiInstance.get(url); 
    },
    addMotorParam(mech_id, mech_motor_id, param_id) {
        const url = `/mechanisms/${mech_id}/motors/${mech_motor_id}/params/add`
        return ApiInstance.post(url, {"param_id": param_id}); 
    }, 
    delMotorParam(mech_id, mech_motor_id, mech_motor_param_id) {
        const url = `/mechanisms/${mech_id}/motors/${mech_motor_id}/params/${mech_motor_param_id}/del`
        return ApiInstance.delete(url); 
    }
}