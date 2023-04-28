<template>
    <ConfirmationDlg :msg="msg" @confirm="onConfirm"/>
</template>

<script>
import ConfirmationDlg from '../ConfirmationDlg.vue';

export default {
    name: "DeleteParamControl",
    props: {
        paramId: {
            type: Number,
            required: true,
        },
        paramTypeId: {
            type: Number,
            required: true,
        }
    },
    emits: ["deleteParam"],
    data() {
        return {
            msg: "Вы точно хотите безвозвратно удалить параметр?",
        };
    },
    components: { ConfirmationDlg },
    methods: {
        onCancel() {
        },
        onConfirm() {
            this.$emit('deleteParam', {
                paramId: this.paramId,
                paramTypeId: this.paramTypeId
            }); 
        }
    },
}
</script>