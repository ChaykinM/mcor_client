<template>
    <v-dialog v-model="showDialog" activator="parent">
        <v-card width="600px">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    <v-icon> mdi-alert </v-icon>
                    Предупреждение
                </v-toolbar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                </template>
            </v-toolbar>
            <v-card-text>
                {{ msg }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="cancel">
                    Отмена
                </v-btn>
                <v-btn variant="flat" color="indigo-darken-2" text @click="confirm">
                    Подтвердить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "ConfirmationDlg",
    props: {
        msg: {
            type: String, 
            required: true, 
        }
    }, 
    emits: [
        "cancel", 
        "confirm"
    ], 
    data() {
        return {
            showDialog: false, 
        }
    }, 
    methods: {
        cancel() {
            this.showDialog = false; 
            this.$emit("cancel"); 
        }, 
        confirm() {
            this.showDialog = false; 
            this.$emit("confirm"); 
        }
    }
}
</script>
