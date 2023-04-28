import ApiESPInstance from '@/api_esp/index'

export const MotorAPI = {
    setPoint(motor_id, point) {
        const url = `/setPoint?motor_id=${motor_id}`;
        return ApiESPInstance.post(url, point);  
    }
}