import ApiInstance from '@/api/index'
import { Config } from '@/api/MechanismsAPI/config';
import { Motors } from '@/api/MechanismsAPI/motors'; 
import { Encoders } from '@/api/MechanismsAPI/encoders';
import { Params } from '@/api/MechanismsAPI/params';
import { Kinematics } from '@/api/MechanismsAPI/kinematics';
import { Trajectories } from '@/api/MechanismsAPI/trajectories';

export const MechanismsAPI = {
    Config, 
    Motors,
    Encoders, 
    Params, 
    Kinematics,
    Trajectories, 
    getMechanisms() {
        const url = '/mechanisms/';
        return ApiInstance.get(url);
    }, 
    getMechanismById(id) {
        const url = `/mechanisms/${id}`;
        return ApiInstance.get(url); 
    }, 
    getMechanismsInfo() {
        const url = '/mechanisms/info';
        return ApiInstance.get(url);
    }, 
    getMechanismInfoById(id) {
        const url = `/mechanisms/${id}/info`;
        return ApiInstance.get(url); 
    }, 
    editMechanismInfo(mechanismInfo) {
        const url = `/mechanisms/${mechanismInfo.id}/info/edit`;
        return ApiInstance.post(url, mechanismInfo);
    },
}