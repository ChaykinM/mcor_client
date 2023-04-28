<template>
    <v-dialog v-model="showDialog" persistent activator="parent">
        <v-card width="600px">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Редактирование параметра
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field v-model.trim="paramLocal.name" :rules="[v => !!v || 'Обязательное поле']"
                        label="Название">
                    </v-text-field>
                    <v-text-field v-model.trim="paramLocal.tag" :rules="[v => !!v || 'Обязательное поле']"
                        label="Идентификатор">
                    </v-text-field>
                    <v-textarea v-model="paramLocal.description" :rules="[v => !!v || 'Обязательное поле']"
                        label="Описание">
                    </v-textarea>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="showDialog = false">Отмена</v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save()">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "EditParamControl",
    props: {
        param: {
            type: Object,
            required: true,
        },
        paramTypeId: {
            type: Number,
            required: true,
        }
    },
    emits: ["editParam"],
    data() {
        return {
            showDialog: null,
            valid: true,
            paramLocal: {},
        }
    },
    mounted() {
        this.paramLocal = JSON.parse(JSON.stringify(this.param)); 
    },
    methods: {
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit('editParam', {
                    paramTypeId: this.paramTypeId, 
                    paramData: this.paramLocal, 
                })
                this.showDialog = false; 
            }
        }
    }
}
</script>