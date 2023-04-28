<template>
    <v-dialog v-model="showDialog" activator="parent" :scrim="false" fullscreen transition="dialog-bottom-transition"
        scrollable>
        <v-card>
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Электронно-компонентная база механизма
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
                            <v-text-field hide-details="true" v-model="searchEncodersInput" label="Поиск по энкодерам"
                                append-inner-icon="mdi-magnify"></v-text-field>
                            <v-card v-for="encoder in getAllEncoders" :key="encoder.id" draggable="true"
                                @dragstart="onDragStart($event, encoder)" class="pa-1 border-sm border-s-xl"
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
                                                {{ encoder.description }}
                                            </span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="10" align-self="center">
                                        <div class="text-center">
                                            {{ encoder.name }}
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-alert v-if="allEncoders.length == 0" type="error" color="red-darken-4" variant="flat"
                                class="ma-2">
                                Нет доступных датчиков обратной связи.
                            </v-alert>
                            <v-alert v-if="getAllEncoders.length == 0" type="info" variant="flat" class="ma-2">
                                Датчики обратной связи, удовлетворяющие заданному запросу не найдены.
                            </v-alert>
                            <div v-if="encodersPageLength > 1" class="text-center">
                                <v-pagination v-model="encodersPage" :length="encodersPageLength"></v-pagination>
                            </div>
                        </v-sheet>
                    </v-col>

                    <v-col cols="9" class="pa-2">
                        <div class="text-center text-subtitle-1">
                            Электронные компоненты приводов
                        </div>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="motor in mechMotorsLocal" :key="motor.mech_motor_id" :eager="true">
                                <v-expansion-panel-title>
                                    {{ motor.name }}
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-card class="mb-2">
                                        <v-card-title>
                                            {{ motor.motor_data.name }}
                                            <v-tooltip location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="indigo-darken-4" class="mx-2" v-bind="props">
                                                        <v-icon size="32">mdi-pencil</v-icon>
                                                        <MechanismMotorSelect :mech-motor-id="motor.mech_motor_id"
                                                            :motor-name="motor.name" :standard-motors="allMotors"
                                                            :selected-motor-id="motor.motor_data.id"
                                                            @change-selected-motor="onEditMechMotor" />
                                                    </v-btn>
                                                </template>
                                                <span> Редакировать </span>
                                            </v-tooltip>
                                        </v-card-title>
                                        <v-card-text>
                                            {{ motor.motor_data.description }}
                                        </v-card-text>
                                    </v-card>

                                    <div v-if="motor.encoders.length == 0" class="dropzone"
                                        @drop="onDrop($event, motor.mech_motor_id)" @dragenter="onDragEnter"
                                        @dragleave="onDragLeave" @dragover.prevent @dragenter.prevent>
                                        <v-alert type="error" color="red-darken-4" variant="flat">
                                            Привод не имеет добавленных датчиков обратной связи. Выберите нужные датчики
                                            обратной связи из списка доступных.
                                        </v-alert>
                                    </div>

                                    <v-row v-else no-gutters>
                                        <v-col cols="11" align-self="center">
                                            <div class="dropzone" @drop="onDrop($event, motor.mech_motor_id)"
                                                @dragenter="onDragEnter" @dragleave="onDragLeave" @dragover.prevent
                                                @dragenter.prevent>
                                                <div v-for="encoder in motor.encoders" :key="encoder.mech_motor_enc_id"
                                                    class="pa-1 d-flex justify-center border-sm border-s-xl"
                                                    style="height: 40px;">
                                                    {{ encoder.encoder_data.name }}
                                                </div>
                                            </div>
                                        </v-col>
                                        <v-col cols="1" align-self="center">
                                            <div v-for="encoder in motor.encoders" :key="encoder.mech_motor_enc_id"
                                                class="d-flex justify-center border-sm" style="height: 40px;">
                                                <v-tooltip location="bottom">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn
                                                            @click="deleteMotorEncoder(motor.mech_motor_id, encoder.mech_motor_enc_id)"
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
import MechanismMotorSelect from "./MechanismMotorSelect.vue";
import NoticeDialog from '@/components/account/NoticeDialog.vue';
import { ComponentsAPI } from "@/api/ComponentsAPI";

export default {
    name: "MechanismComponents",
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
            showDialog: null,
            searchEncodersInput: '',
            encodersPage: 1,
            encodersPageLength: 0,
            encodersToPageSize: 15,
            mechMotorsLocal: [],
            allEncoders: [],
            allMotors: [],

            noticeDialog: {
                show: false,
                type: 'notice',
                msg: '',
            }
        };
    },
    components: { MechanismMotorSelect, NoticeDialog },
    mounted() {
        this.mechMotorsLocal = this.mechMotors.slice();
        this.mechMotorsLocal.map((m) => {
            if (m.encoders == null) {
                m.encoders = [];
            }
        });

        ComponentsAPI.Encoders.getEncoders().then(
            (res) => {
                this.allEncoders = res.data.encoders;
            },
            (error) => {
                this.noticeDialog.show = true;
                this.noticeDialog.type = 'error';
                this.noticeDialog.msg = `При загрузке датчиков обратной связи из электронно-компонентной базы возникла ошибка: ${error}`;
            }
        );

        ComponentsAPI.Motors.getMotors().then(
            (res) => {
                this.allMotors = res.data.motors;
            },
            (error) => {
                this.noticeDialog.show = true;
                this.noticeDialog.type = 'error';
                this.noticeDialog.msg = `При загрузке приводов из электронно-компонентной базы возникла ошибка: ${error}`;
            }
        );
    },
    computed: {
        getAllEncoders() {
            return this.allEncoders.filter((encoder) => {
                return encoder.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchEncodersInput.toLowerCase())
            })
                .filter((row, index, array) => {
                    let encodersPageLength = Math.ceil(
                        array.length / this.encodersToPageSize
                    );
                    this.setEncodersPageLength(encodersPageLength);

                    let start = (this.encodersPage - 1) * this.encodersToPageSize;
                    let end = this.encodersPage * this.encodersToPageSize;
                    if (index >= start && index < end) return true;
                });
        }
    },
    methods: {
        onDragStart(evt, encoder) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('encoder_data', JSON.stringify(encoder));
        },
        onDragEnter(evt) {
            if (evt.dataTransfer.getData('encoder_data') !== undefined) {
                evt.target.classList.add('dropzone_active');
            }
        },
        onDragLeave(evt) {
            if (evt.dataTransfer.getData('encoder_data') !== undefined) {
                evt.target.classList.remove('dropzone_active');
            }
        },
        onDrop(evt, mech_motor_id) {
            let encoder_data_str = evt.dataTransfer.getData('encoder_data');
            if (encoder_data_str !== undefined) {
                evt.target.classList.remove('dropzone_active');
                let encoder_data = JSON.parse(encoder_data_str)
                let motorEncoders = this.mechMotorsLocal.find(m => m.mech_motor_id == mech_motor_id).encoders;
                if (motorEncoders != null) {
                    let encoderIndex = motorEncoders.findIndex(p => p.encoder_data.id == encoder_data.id);
                    if (encoderIndex > -1) {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = 'Данный датчик обратной связи уже добавлен для привода';
                    } else {
                        this.$store.dispatch("MechanismsModule/onAddMechMotorEncoder", { mech_id: this.mech_id, mech_motor_id: mech_motor_id, encoder: encoder_data }).then(
                            () => {
                                this.noticeDialog.show = true;
                                this.noticeDialog.type = 'notice';
                                this.noticeDialog.msg = 'Датчик обратной связи для привода был успешно добавлен';
                            },
                            (error) => {
                                this.noticeDialog.show = true;
                                this.noticeDialog.type = 'error';
                                this.noticeDialog.msg = `При добавлении датчика обратной связи для привода возникла ошибка: ${error}`;
                            }
                        );
                    }
                }
            }
        },
        deleteMotorEncoder(mech_motor_id, mech_motor_enc_id) {
            this.$store.dispatch("MechanismsModule/onDeleteMechMotorEncoder", { mech_id: this.mech_id, mech_motor_id: mech_motor_id, mech_motor_enc_id: mech_motor_enc_id }).then(
                () => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.msg = 'Датчик обратной связи для привода был успешно удалён';
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.msg = `При удалении датчика обратной связи для привода возникла ошибка: ${error}`;
                }
            )
        },
        setEncodersPageLength(encodersPageLength) {
            this.encodersPageLength = encodersPageLength;
        },
        onEditMechMotor(editRequest) {
            this.$store.dispatch("MechanismsModule/onEditMechMotor", { mech_id: this.mech_id, editRequest: editRequest }).then(
                () => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.msg = 'Привод манипуляционного механизма был успешно отредактирован';
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.msg = `При редактировании привода манипуляционного механизма возникла ошибка: ${error}`;

                }
            )
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