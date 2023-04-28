<template>
    <v-dialog v-model="showDialog" activator="parent">
        <v-card width="600px">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    Сохранение истории
                </v-toolbar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                </template>
            </v-toolbar>

            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model.trim="history.name" :rules="[v => !!v || 'Обязательное поле']"
                        label="Название сеанса">
                    </v-text-field>
                    <v-textarea v-model.trim="history.description" :rules="[v => !!v || 'Обязательное поле']"
                        label="Описание сеанса">
                    </v-textarea>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="showDialog = false">Отмена</v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save()">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <NoticeDialog :show="noticeDialog.show" :message="noticeDialog.message" :type="noticeDialog.type" @notice-dlg-close="onNoticeDlgClose"/>
</template>
<script>
import { HistoryAPI } from '@/api/HistoryAPI';
import NoticeDialog from "@/components/account/NoticeDialog.vue";

export default {
    name: "HistorySave",
    props: {
        mech_id: Number,
        history_type: String,
        params_with_data: Array,
    },
    data() {
        return {
            showDialog: null,
            valid: true,
            history: {
                time: new Date(),
                name: "",
                description: "",
                params: [],
            },
            noticeDialog: {
                show: false,
                type: 'notice',
                message: '',
            }
        };
    },
    components: {NoticeDialog}, 
    methods: {
        async save() {
            const { valid } = await this.$refs.form.validate()

            if (valid) {
                if (this.history_type == 'custom_params') {
                    console.log("save history_custom_params")
                    this.history.params = JSON.stringify(this.params_with_data);
                    HistoryAPI.CustomSession.addHistory(this.history).then(
                        () => {
                            this.noticeDialog.show = true;
                            this.noticeDialog.type = 'notice';
                            this.noticeDialog.message = 'История наблюдений за произвольными параметрами была успешно сохранена';
                            this.showDialog = false; 
                        },
                        (error) => {
                            this.noticeDialog.show = true;
                            this.noticeDialog.type = 'error';
                            this.noticeDialog.message =  `Ошибка ${error.response.status}. Название истории должно быть уникальным.`;
                        }
                    )
                } else if (this.history_type == 'seans') {
                    this.history["mech_id"] = this.mech_id;
                    this.history.params = JSON.stringify(this.params_with_data);
                    console.log(this.history); 
                    HistoryAPI.MechanismsSession.addHistory(this.history).then(
                        () => {
                            this.noticeDialog.show = true;
                            this.noticeDialog.type = 'notice';
                            this.noticeDialog.message = 'История наблюдений за параметрами механизма была успешно сохранена';
                            this.showDialog = false; 
                        },
                        (error) => {
                            this.noticeDialog.show = true;
                            this.noticeDialog.type = 'error';
                            this.noticeDialog.message =  `Ошибка ${error.response.status}. Название истории должно быть уникальным.`;
                        }
                    )
                }
            }
        }, 
        onNoticeDlgClose() {
            this.noticeDialog.show = false; 
            this.noticeDialog.type = 'notice';
            this.noticeDialog.message = ''; 
        }
    }
}
</script>