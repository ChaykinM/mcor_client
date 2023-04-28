import ApiInstance from '@/api/index'

export const Motors = {
    getMotors(mech_id) {
        const url = `/mechanisms/${mech_id}/motors`;
        return ApiInstance.get(url);
    },
    getMotor(mech_id, mech_motor_id) {
        const url = `/mechanisms/${mech_id}/motors/${mech_motor_id}`;
        return ApiInstance.get(url); 
    }, 
    editMotor(mech_id, editMotorRequest) {
        const url = `/mechanisms/${mech_id}/motors/${editMotorRequest.mech_motor_id}/edit`;
        return ApiInstance.post(url, editMotorRequest);
    },
    addMotor(mech_id, motor) {
        const url = `/mechanisms/${mech_id}/motors/add`;
        return ApiInstance.post(url, motor); 
    }, 
    deleteMotor(mec_id, mech_motor_id) {
        const url = `/mechanisms/${mec_id}/motors/${mech_motor_id}/del`;
        return ApiInstance.delete(url); 
    }
}