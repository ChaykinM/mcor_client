import ApiInstance from '@/api/index'

export const Config = {
    getAllConfigs(mech_id) {
        const url = `mechanisms/${mech_id}/configs`; 
        return ApiInstance.get(url);
    }, 
    getConfig(mech_id, config_id) {
        const url = `/mechanisms/${mech_id}/configs/${config_id}`;
        return ApiInstance.get(url); 
    },
    getConfigCurrent(mech_id) {
        const url = `/mechanisms/${mech_id}/configs/current`;
        return ApiInstance.get(url); 
    },
    getConfigStandard(mech_id) {
        const url = `/mechanisms/${mech_id}/configs/standard`;
        return ApiInstance.get(url); 
    },
    setActiveConfig(mech_id, config_id) {
        const url = `/mechanisms/${mech_id}/configs/${config_id}/setActive`;
        return ApiInstance.post(url); 
    },
    editConfig(mech_id, config) {
        const url = `/mechanisms/${mech_id}/configs/${config.id}/edit`;
        return ApiInstance.post(url, config); 
    },
    addConfig(mech_id, config) {
        const url = `/mechanisms/${mech_id}/configs/add`;
        return ApiInstance.post(url, config); 
    }
}