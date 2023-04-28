import ApiInstance from '@/api/index'

export const Motors = {
    getMotors() {
        const url = '/motors/';
        return ApiInstance.get(url); 
    },
    getMotorById(id) {
        const url = `/motors/${id}`; 
        return ApiInstance.get(url); 
    }, 
    addMotor(motor) {
        const url = `/motors/add`; 
        return ApiInstance.post(url, motor); 
    }, 
    editMotor(motor) {
        const url = `/motors/${motor.id}/edit`;
        return ApiInstance.post(url, motor); 
    },
    uploadImgMotor(motor_id, formData) {
        const url = `/motors/${motor_id}/uploadImg`;
        return ApiInstance.post(url, formData,   {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }); 
    }
};