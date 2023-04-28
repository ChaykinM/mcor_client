<template>
    <v-dialog v-model="showDialog" activator="parent" fullscreen scrollable :scrim="false"
        transition="dialog-bottom-transition">
        <v-card class="overflow-y-auto" height="90vh">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Параметры для контроля
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-row no-gutters>
                    <v-col cols="3" class="pa-2">
                        <div class="text-center text-subtitle-1">
                            Доступные параметры
                        </div>
                        <v-sheet class="overflow-y-auto" height="100%">
                            <v-text-field hide-details="true" v-model="searchParamsInput" label="Поиск по параметрам"
                                append-inner-icon="mdi-magnify"></v-text-field>
                            <v-card v-for="param in getAllParams" :key="param.param_id" draggable="true"
                                @dragstart="onDragStart($event, param)" class="pa-1 border-sm border-s-xl"
                                style="cursor: pointer;">
                                <v-row no-gutters>
                                    <v-col cols="2" align-self="center">
                                        <v-tooltip location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-chip v-bind="props" color="accent">
                                                    <v-icon>mdi-comment-bookmark</v-icon>
                                                </v-chip>
                                            </template>
                                            <span>
                                                {{ param.description }}
                                            </span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="10" align-self="center">
                                        <div class="text-center">
                                            {{ param.name }}
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-alert v-if="allParams.length == 0" type="error" color="red-darken-4" variant="flat" class="ma-2">
                                Нет доступных параметров для контроля за работой механизма.
                            </v-alert>
                            <v-alert v-if="getAllParams.length == 0" type="info" variant="flat" class="ma-2">
                                Параметры, удовлетворяющие заданному запросу не найдены.
                            </v-alert>
                            <div v-if="paramsPageLength > 1" class="text-center">
                                <v-pagination v-model="paramsPage" :length="paramsPageLength"></v-pagination>
                            </div>
                        </v-sheet>
                    </v-col>

                    <v-col cols="9" class="pa-2">
                        <div class="text-center text-subtitle-1">
                            Параметры приводов
                        </div>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="motor in mechMotorsLocal" :key="motor.mech_motor_id">
                                <v-expansion-panel-title>
                                    {{ motor.name }}
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <div v-if="motor.params.length == 0" class="dropzone"
                                        @drop="onDrop($event, motor.mech_motor_id)" @dragenter="onDragEnter"
                                        @dragleave="onDragLeave" @dragover.prevent @dragenter.prevent>
                                        <v-alert type="error" color="red-darken-4" variant="flat">
                                            Привод не имеет добавленных параметров для контроля. Выберите нужные параметры
                                            из списка доступных.
                                        </v-alert>
                                    </div>
                                    <v-row v-else no-gutters>
                                        <v-col cols="11"  align-self="center">
                                            <div class="dropzone" @drop="onDrop($event, motor.mech_motor_id)"
                                                @dragenter="onDragEnter" @dragleave="onDragLeave" @dragover.prevent
                                                @dragenter.prevent>
                                                <div v-for="motorParam in motor.params"
                                                    :key="motorParam.mech_motor_param_id"
                                                    class="pa-1 d-flex align-center  border-sm border-s-xl"
                                                    style="height: 40px;">
                                                    <div class="text-center" style="width: 70%">
                                                        {{ motorParam.param_data.name }}
                                                    </div>
                                                    <div class="text-center" style="width: 30%">
                                                        <v-chip class="text-overline">
                                                            {{ motorParam.param_data.tag }}
                                                        </v-chip>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>
                                        <v-col cols="1" align-self="center">
                                            <div v-for="motorParam in motor.params" :key="motorParam.mech_motor_param_id"
                                                class="d-flex justify-center border-sm" style="height: 40px;">
                                                <v-tooltip location="bottom">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn
                                                            @click="deleteMotorParam(motor.mech_motor_id, motorParam.mech_motor_param_id)"
                                                            color="red-darken-3" class="mx-2 float-right" v-bind="props">
                                                            <v-icon size="32">mdi-delete-sweep</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Удалить параметр</span>
                                                </v-tooltip>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>

    <NoticeDialog :show="noticeDialog.show" :type="noticeDialog.type" :message="noticeDialog.msg"
        @notice-dlg-close="onNoticeDlgClose" />
</template>

<script>
import NoticeDialog from '@/components/account/NoticeDialog.vue';
import { ParamsAPI } from '@/api/ParamsAPI';

export default {
    name: "MechanismParams",
    props: {
        mech_id: {
            type: [Number, String],
            required: true,
        },
        mechMotors: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            showDialog: false,
            searchParamsInput: '',
            paramsPage: 1,
            paramsPageLength: 0,
            paramsToPageSize: 15,
            motorsOpenedPanel: [],
            mechMotorsLocal: [],
            allParams: [],

            noticeDialog: {
                show: false,
                type: 'notice',
                msg: '',
            }
        };
    },
    components: { NoticeDialog },
    mounted() {
        this.mechMotorsLocal = this.mechMotors.slice();
        this.mechMotorsLocal.map( (m) => {
            if (m.params == null) {
                m.params = []; 
            }
        });

        ParamsAPI.MechanismsSession.getParams().then(
            (res) => {
                this.allParams = res.data.params;
            },
            (error) => {
                this.noticeDialog.show = true;
                this.noticeDialog.type = 'error'; 
                this.noticeDialog.msg = `При загрузке параметров для контроля за работой механизма возникла ошибка: ${error}`;
            }
        );
    },
    computed: {
        getAllParams() {
            return this.allParams.filter((param) => {
                return param.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchParamsInput.toLowerCase()) ||
                    param.tag
                        .toString()
                        .toLowerCase()
                        .includes(this.searchParamsInput.toLowerCase());
            })
                .filter((row, index, array) => {
                    let paramsPageLength = Math.ceil(
                        array.length / this.paramsToPageSize
                    );
                    this.setParamsPageLength(paramsPageLength); // задали количество страниц исходя из текущего количества элементов

                    let start = (this.paramsPage - 1) * this.paramsToPageSize;
                    let end = this.paramsPage * this.paramsToPageSize;
                    if (index >= start && index < end) return true;
                });
        }
    },
    methods: {
        onDragStart(evt, param) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('param_data', JSON.stringify(param));
        },
        onDragEnter(evt) {
            if (evt.dataTransfer.getData('param_data') !== undefined) {
                evt.target.classList.add('dropzone_active');
            }
        },
        onDragLeave(evt) {
            if (evt.dataTransfer.getData('param_data') !== undefined) {
                evt.target.classList.remove('dropzone_active');
            }
        },
        onDrop(evt, mech_motor_id) {
            let param_data_str =
                evt.dataTransfer.getData('param_data');
            if (param_data_str !== undefined) {
                evt.target.classList.remove('dropzone_active');
                let param_data = JSON.parse(param_data_str)
                let params = this.mechMotorsLocal.find(m => m.mech_motor_id == mech_motor_id).params;
                if (params != null) {
                    let paramIndex = params.findIndex(p => p.param_data.param_id == param_data.param_id);
                    if (paramIndex > -1) {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = 'Данный параметр уже добавлен для контроля';
                    } else {
                        this.$store.dispatch("MechanismsModule/onAddMechMotorParam", { mech_id: this.mech_id, mech_motor_id: mech_motor_id, param: param_data }).then(
                            () => {
                                this.noticeDialog.show = true;
                                this.noticeDialog.type = 'notice';
                                this.noticeDialog.msg = 'Параметр привода был успешно добавлен';
                            },
                            (error) => {
                                this.noticeDialog.show = true;
                                this.noticeDialog.type = 'error';
                                this.noticeDialog.msg = `При добавлении параметра привода возникла ошибка: ${error}`;
                            }
                        );
                    }
                }
            }
        },
        deleteMotorParam(mech_motor_id, mech_motor_param_id) {
            this.$store.dispatch("MechanismsModule/onDeleteMechMotorParam", { mech_id: this.mech_id, mech_motor_id: mech_motor_id, mech_motor_param_id: mech_motor_param_id }).then(
                () => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.msg = 'Параметр привода был успешно удалён';
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.msg = `При удалении параметра привода возникла ошибка: ${error}`;
                }
            )
        },
        setParamsPageLength(paramsPageLength) {
            this.paramsPageLength = paramsPageLength;
        },
        close() {
            this.showDialog = false;
        },
        onNoticeDlgClose() {
            this.noticeDialog.show = false;
            this.noticeDialog.type = 'notice';
            this.noticeDialog.msg = '';
        }
    }
}
</script>

<style>
.dropzone * {
    pointer-events: none;
    user-select: none;
    min-height: 30px;
}

.dropzone_active {
    border: dashed #5e35b1;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="rgb(139,131,247)" d="M20 14h-6v6h-4v-6H4v-4h6V4h4v6h6v4Z"%2F%3E%3C%2Fsvg%3E');
    background-size: 40% 40%;
    background-repeat: no-repeat;
    background-position: center center;
}
</style>