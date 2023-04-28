<template>
    <v-dialog v-model="showDialog" >
        <v-card width="600px">
            <v-alert v-model="showDialog" border="start" variant="flat" closable close-label="Close Alert"
                :color="type == 'error' ? 'red-darken-4' : 'teal-darken-3'"
                :icon="type == 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'" prominent>
                <v-alert-title>Системное сообщение</v-alert-title>
                {{ message }}
            </v-alert>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "NoticeDialog",
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        }
    },
    emits: ["noticeDlgClose"],
    data() {
        return {
            showDialog: false,
        }
    },
    watch: {
        show: "updateShow", 
        showDialog: "showLocalControl",
    }, 
    methods: {
        updateShow(newVal) {
            this.showDialog = newVal; 
        }, 
        showLocalControl(newVal) {
            if (newVal == false) {
                this.$emit('noticeDlgClose'); 
            }
        }
    },
}
</script>
