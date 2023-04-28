<template>
    <v-dialog v-model="showDialog" activator="parent">
        <v-card width="600">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    Редактирование истории
                </v-toolbar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                </template>
            </v-toolbar>

            <v-card-text>
                <v-form ref="form" v-model="formValid" lazy-validation>
                    <v-text-field v-model="historyLocal.name" label="Название"
                        :rules="[v => !!v || 'Обязательное поле']"></v-text-field>
                    <v-textarea v-model="historyLocal.description" :rules="[v => !!v || 'Обязательное поле']" label="Описание"></v-textarea>
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
    name: "EditHistory",
    props: {
        history: Object,
    },
    emits: ['saveHistory'], 
    data() {
        return {
            showDialog: null,
            formValid: true,
            historyLocal: {},
        };
    },
    mounted() {
        this.historyLocal = JSON.parse(JSON.stringify(this.history));
    },
    methods: {
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit('saveHistory', this.historyLocal);    
                this.showDialog = false; 
            }
        }
    }
}
</script>