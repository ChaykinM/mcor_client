<template>
    <v-dialog v-model="showDialog" activator="parent" scrollable persistent>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Сохранить траекторию 
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field v-model="trajectoryInfo.name" label="Название"
                        :rules="[v => !!v || 'Обязательное поле']"></v-text-field>
                    <v-textarea v-model="trajectoryInfo.description" counter label="Описание"
                        :rules="[v => !!v || 'Обязательное поле']"></v-textarea>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="close">
                    Отмена
                </v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save()">
                    Сохранить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "TrajectorySave", 
    emits: ["saveTrajectory"], 
    data() {
        return {
            showDialog: false, 
            trajectoryInfo: {
                name: '', 
                description: '', 
            }
        }
    }, 
    methods: {
        close() {
            this.showDialog = false;  
        }, 
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit("saveTrajectory", this.trajectoryInfo); 
                this.close(); 
            }
        }
    }
}
</script>