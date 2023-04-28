import ApiInstance from "@/api/index";

export const Encoders = {
    getEncoders() {
        const url = '/encoders/'; 
        return ApiInstance.get(url); 
    },
    getEncoderById(id) {
        const url = `/encoders/${id}`; 
        return ApiInstance.get(url); 
    }, 

    addEncoder(encoder) {
        const url = `/encoders/add`; 
        return ApiInstance.post(url, encoder); 
    }, 
    editEncoder(encoder) {
        const url = `/encoders/${encoder.id}/edit`;
        return ApiInstance.post(url, encoder); 
    },
    uploadImgEncoder(enc_id, formData) {
        const url = `/encoders/${enc_id}/uploadImg`;
        return ApiInstance.post(url, formData,   {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }); 
    }
};
