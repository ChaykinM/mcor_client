<template>
    <v-dialog v-model="showDialog" activator="parent">
        <v-card width="600">
            <v-card-title class="ma-0 pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Редактировать привод
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                {{ motorEditRequest }}
                <v-form ref="form" v-model="valid" lazy-validation>
                    <input :rules="[v => !!v || 'Обязательное поле']"  type="file" ref="imgFile" class="mb-2" accept="image/png, image/jpeg, image/bmp" @change="uploadImg">
                    <v-text-field v-model="motorEditRequest.name" label="Название"
                        :rules="[v => !!v || 'Обязательное поле']"></v-text-field>
                    <v-textarea v-model="motorEditRequest.description" counter label="Описание"
                        :rules="[v => !!v || 'Обязательное поле']"></v-textarea>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="cancel">Отмена</v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save()">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "EditMotor", 
    props: {
        motor: {
            type: Object, 
            required: true, 
        }
    }, 
    emits: [
        "editMotor"
    ], 
    data() {
        return {
            showDialog: false, 
            motorEditRequest: {
                id: null, 
                img_url: '', 
                imgFormData: null, 
                name: '',
                description: '', 
            },
        }; 
    }, 
    mounted() {
        this.motorEditRequest = this.motor;
    },
    methods: {
        uploadImg() {
            let file = this.$refs.imgFile.files[0];
            const formData = new FormData();
            formData.append('file', file);
            this.motorEditRequest.imgFormData = formData; 
        },

        cancel() {
            this.showDialog = false;
        },

        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit('editMotor', this.motorEditRequest); 
                this.showDialog = false; 
            } 
        }
    }
}
</script>