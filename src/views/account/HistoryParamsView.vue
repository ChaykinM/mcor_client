<template>
    <v-container>
        <v-card>
            <v-card-title class="pa-0 mb-2">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        История
                    </v-toolbar-title>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-select :items="historyTypes" item-title="name" item-value="id" v-model="selectedHistoryType"
                    label="Тип истории"></v-select>
                <HistorySeansTable v-if="selectedHistoryType === 1" :history-seans="historySeans"
                    @send-selected-history="getHistorySeans" @edit-history="editHistorySeans"
                    @delete-history="deleteHistorySeans" />

                <HistoryCustomParamsTable v-else-if="selectedHistoryType === 2" :history-custom-params="historyCustomParams"
                    @send-selected-history="getHistoryCustomParams" @edit-history="editHistoryCustomParams"
                    @delete-history="deleteHistoryCustomParams" />
            </v-card-text>
        </v-card>
    </v-container>

    <div v-if="(Object.keys(selectedHistory).length != 0)">
        <div v-if="(selectedHistory.type.id == 1)">
            <v-container>
                <v-card>

                    <SelectMechParamsForControl :selected-mech-motors="JSON.parse(selectedHistory.history.params)"
                        @send-selected-params="mechSeansControlParams" />
                </v-card>
            </v-container>

            <v-container v-if="mechSeansControlMode">
                <MechMotorParamsPlots
                    :mech-motor-params-with-data="{ motorParams: JSON.parse(selectedHistory.history.params) }"
                    :selected-params="selectedMechMotorParams" />
            </v-container>
        </div>
        <div v-if="(selectedHistory.type.id == 2)">
            <v-container>
                <SelectCustomParams :custom-params="JSON.parse(selectedHistory.history.params)"
                    @send-selected-custom-params="changeSelectedCustomParams" />
            </v-container>
            <v-container>
                <CustomParamsTabsPlot :custom-params="JSON.parse(selectedHistory.history.params)"
                    :selected-custom-params-with-values="selectedCustomParamsWithValues" />
            </v-container>
        </div>
    </div>

    <NoticeDialog :show="noticeDialog.show" :message="noticeDialog.message" :type="noticeDialog.type"
        @notice-dlg-close="onNoticeDlgClose" />
</template>

<script>
import HistorySeansTable from '@/components/account/History/HistorySeansTable.vue';
import HistoryCustomParamsTable from '@/components/account/History/HistoryCustomParamsTable.vue';

import SelectCustomParams from '@/components/account/CustomParamsControl/SelectCustomParams.vue';
import CustomParamsTabsPlot from '@/components/account/CustomParamsControl/CustomParamsTabsPlot.vue';

import SelectMechParamsForControl from '@/components/account/MechanismParamsControl/SelectMechParamsForControl.vue';
import MechMotorParamsPlots from '@/components/account/MechanismParamsControl/MechMotorParamsPlots.vue';

import NoticeDialog from '@/components/account/NoticeDialog.vue';

export default {
    name: "HistoryParamsView",
    data() {
        return {
            historyTypes: [
                {
                    id: 1,
                    name: "История сеансов испытаний механизма",
                },
                {
                    id: 2,
                    name: "История дополнительных наблюдений",
                }
            ],
            selectedHistoryType: 1,
            selectedHistory: {},
            mechSeansControlMode: null,
            selectedMechMotorParams: [],
            selectedCustomParamsWithValues: [],
            noticeDialog: {
                show: false,
                type: 'notice',
                message: '',
            }
        };
    },
    components: {
        HistorySeansTable,
        HistoryCustomParamsTable,
        SelectCustomParams,
        CustomParamsTabsPlot,
        SelectMechParamsForControl,
        MechMotorParamsPlots,
        NoticeDialog
    },
    mounted() {
        this.$store.dispatch("HistoryModule/onGetHistorySeans").then(
            () => {},
            (error) => {
                this.noticeDialog.show = true;
                this.noticeDialog.type = 'error';
                this.noticeDialog.message = `При получении списка с историями сеансов испытаний механизма возникла ошибка: ${error}`;
            });
        this.$store.dispatch("HistoryModule/onGetHistoryCustomParams").then(
            () => {}, 
            (error) => {
                this.noticeDialog.show = true;
                this.noticeDialog.type = 'error';
                this.noticeDialog.message = `При получении списка с историями дополнительными наблюдениями возникла ошибка: ${error}`;
            });
    },
    computed: {
        historySeans() {
            return this.$store.getters["HistoryModule/GET_HISTORY_SEANS"];
        },
        historyCustomParams() {
            return this.$store.getters["HistoryModule/GET_HISTORY_CUSTOM_PARAMS"];
        }
    },
    methods: {
        getHistorySeans(id) {
            let history = this.historySeans.find(h => h.id == id);
            this.selectedHistory = {
                type: {
                    id: 1,
                    name: "История сеансов испытаний механизма",
                },
                history: history
            };
            console.log(history)
        },
        getHistoryCustomParams(id) {
            let history = this.historyCustomParams.find(h => h.id == id);
            this.selectedHistory = {
                type: {
                    id: 2,
                    name: "История дополнительных наблюдений",
                },
                history: history
            };
            console.log(history);
        },
        editHistorySeans(history) {
            this.$store.dispatch("HistoryModule/onEditHistorySeans", history).then(
                () => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.message = `История была успешно отредактирована`;
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.message = `При редактировании истории возникла ошибка: ${error}`;
                }
            )
        },
        editHistoryCustomParams(history) {
            this.$store.dispatch("HistoryModule/onEditHistoryCustomParams", history).then(
                () => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.message = `История была успешно отредактирована`;
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.message = `При редактировании истории возникла ошибка: ${error}`;
                }
            )
        },
        deleteHistorySeans(id) {
            this.$store.dispatch("HistoryModule/onDeleteHistorySeans", id).then(
                () => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.message = `История была успешно удалена`;
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.message = `При удалении истории возникла ошибка: ${error}`;
                }
            )
        },
        deleteHistoryCustomParams(id) {
            this.$store.dispatch("HistoryModule/onDeleteHistoryCustomParams", id).then(
                () => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.message = `История была успешно удалена`;
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.message = `При удалении истории возникла ошибка: ${error}`;
                }
            )
        },

        mechSeansControlParams(selectedMechMotorParams) {
            this.selectedMechMotorParams = selectedMechMotorParams;
            this.mechSeansControlMode = true;
        },

        changeSelectedCustomParams(selectedCustomParams) {
            this.selectedCustomParamsWithValues = []; // очистим перед новой загрузкой
            for (let selectedParam of selectedCustomParams) {
                for (let paramWithValues of JSON.parse(this.selectedHistory.history.params)) {
                    if (paramWithValues.tag == selectedParam) {
                        this.selectedCustomParamsWithValues.push(paramWithValues);
                    }
                }
            }
        },

        onNoticeDlgClose() {
            this.noticeDialog.show = false;
            this.noticeDialog.type = 'notice';
            this.noticeDialog.message = '';
        }
    },

}
</script>