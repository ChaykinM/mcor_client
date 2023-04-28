import ApiInstance from '@/api/index'

export const Encoders = {
    getAllEncoders(mech_id) {
        const url = `/mechanisms/${mech_id}/motors/encoders`
        return ApiInstance.get(url); 
    }, 
    getMotorEncoders(mech_id, mech_motor_id) {
        const url = `/mechanisms/${mech_id}/motors/${mech_motor_id}/encoders`
        return ApiInstance.get(url); 
    }, 
    addEncoder(mech_id, mech_motor_id, mech_motor_enc_id) {
        const url = `/mechanisms/${mech_id}/motors/${mech_motor_id}/encoders/add`
        return ApiInstance.post(url, {"enc_id": mech_motor_enc_id}); 
    }, 
    delEncoder(mech_id, mech_motor_id, mech_motor_enc_id) {
        const url = `/mechanisms/${mech_id}/motors/${mech_motor_id}/encoders/${mech_motor_enc_id}/del`
        return ApiInstance.delete(url); 
    },
}