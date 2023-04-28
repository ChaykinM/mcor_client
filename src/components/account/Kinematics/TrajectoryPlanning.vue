<template>
    <v-card>
        <v-card-title class="pa-0 mb-2">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    Формирование новой траектории
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-radio-group v-model="selectedMechanism" inline>
                <v-radio v-for="mechanism in mechanismsInfo" :key="mechanism.id" :label="mechanism.name"
                    :value="mechanism"></v-radio>
            </v-radio-group>

            <div v-if="selectedMechanism != null">
                <v-card-title class="text-h6 font-weight-regular justify-space-between">
                    <v-avatar class="mr-2" color="primary" size="32" v-text="step"></v-avatar>
                    <span>{{ currentTitle }}</span>
                </v-card-title>

                <v-window v-model="step">
                    <v-window-item :value="1">
                        <v-card-text>
                            <v-radio-group v-model="selectedPlanningMethod">
                                <v-radio v-for="method in planningMethods" :key="method.tag" :value="method.tag"
                                    :label="method.text"></v-radio>
                            </v-radio-group>
                        </v-card-text>
                    </v-window-item>
                    <v-window-item :value="2">
                        <v-card-text>
                            <div v-if="selectedPlanningMethod == 'parametric'">
                                <ParametricTrajectoryTask :mech_id="selectedMechanism.id"
                                    :template="templates[selectedMechanism.type]" @send-direct-points="onSetDKTpoints"
                                    @send-inverse-points="onSetIKTpoints" />
                            </div>
                            <div v-if="selectedPlanningMethod == 'dkt_points'">
                                <IKTtask :mech_id="selectedMechanism.id" :template="templates[selectedMechanism.type]" @send-direct-points="onSetDKTpoints" @send-inverse-points="onSetIKTpoints" />
                            </div>
                            <div v-if="selectedPlanningMethod == 'ikt_points'">
                                <DKTtask :mech_id="selectedMechanism.id" :template="templates[selectedMechanism.type]" @send-direct-points="onSetDKTpoints" @send-inverse-points="onSetIKTpoints"/>
                            </div>
                        </v-card-text>
                    </v-window-item>
                    <v-window-item :value="3">
                        <v-card>
                            <TrajectoryInterpolate :mech_id="selectedMechanism.id"
                                :template="templates[selectedMechanism.type]" :dkt_points="dkt_points"
                                :ikt_points="ikt_points" @send-direct-polinoms="onSetDKTpolinom"
                                @send-inverse-polinoms="onSetIKTpolinom" />
                        </v-card>
                    </v-window-item>
                    <v-window-item :value="4">
                        <v-card>
                            <TrajectoryVisualize :template="templates[selectedMechanism.type]" :dkt_points="dkt_points"
                                :dkt_polinom="dkt_polinom" :ikt_points="ikt_points" :ikt_polinom="ikt_polinom" />
                        </v-card>
                    </v-window-item>
                </v-window>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-btn v-if="step > 1" variant="text" @click="step--">
                        Назад
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-if="step == 1" color="green-darken-3" variant="flat" @click="step++">
                        Задать траекторию
                    </v-btn>
                    <v-btn v-if="step == 2" :disabled="canInterpolate" color="green-darken-3" variant="flat" @click="step++">
                        Интерполировать
                    </v-btn>
                    <v-btn v-if="step == 3" :disabled="canVisualize" color="green-darken-3" variant="flat" @click="step++">
                        Визуализировать траекторию
                    </v-btn>
                    <v-btn v-if="step == 4" color="green-darken-3" variant="flat">
                        Сохранить траекторию
                        <TrajectorySave @save-trajectory="onSaveTrajectory" />
                    </v-btn>
                </v-card-actions>
            </div>
        </v-card-text>
    </v-card>

    <NoticeDialog :show="noticeDialog.show" :message="noticeDialog.message" :type="noticeDialog.type" @notice-dlg-close="onNoticeDlgClose"/>

    <!-- 
    Алгоритм задания траектории: 
    1. Выбор механизма
    2. Выбор типа задания траектории: 
        в параметрической форме;
        по точкам ПЗК;
        по точкам ОЗК; -> можно выбрать из старых решений или нет? -> думаю нет
    3. Интерполирование ?
    4. Визуализация траектории
    5. Задание траектории на механизм
 -->
</template>

<script>
import ParametricTrajectoryTask from "@/components/account/Kinematics/ParametricTrajectoryTask.vue";
import IKTtask from "@/components/account/Kinematics/IKTtask.vue";
import DKTtask from "@/components/account/Kinematics/DKTtask.vue";
import TrajectoryInterpolate from "@/components/account/Kinematics/TrajectoryInterpolate.vue";
import TrajectoryVisualize from "@/components/account/Kinematics/TrajectoryVisualize.vue";
import TrajectorySave from "@/components/account/Kinematics/TrajectorySave.vue";
import NoticeDialog from "@/components/account/NoticeDialog.vue";

export default {
    name: "TrajectoryPlanning",
    props: {
        mechanismsInfo: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            selectedMechanism: null,
            step: 1,
            selectedPlanningMethod: 'parametric',
            planningMethods: [
                {
                    tag: 'parametric',
                    text: 'В параметрической форме',
                },
                {
                    tag: 'dkt_points',
                    text: 'По декартовым координатам',
                },
                {
                    tag: 'ikt_points',
                    text: 'По обобщённым координатам'
                }
            ],

            tabPoints: null,

            dkt_points: [],
            dkt_polinom: [],
            ikt_points: [],
            ikt_polinom: [],

            trajectory: {},

            noticeDialog: {
                show: false, 
                type: 'notice', 
                message: '', 
            }
        }
    },
    components: {
        ParametricTrajectoryTask,
        IKTtask,
        DKTtask,
        TrajectoryVisualize,
        TrajectorySave,
        TrajectoryInterpolate,
        NoticeDialog
    },
    computed: {
        templates() {
            return this.$store.getters["MechanismsModule/GET_MECH_COORD_TEMPLATES"]; 
        }, 
        currentTitle() {
            switch (this.step) {
                case 1: return 'Выбeрите метод задания траектории'
                case 2: return 'Задайте траекторию'
                case 3: return 'Интерполирование'
                case 4: return 'Визуализация траектории'
                default: return 'Выбeрите метод задания траектории'
            }
        },
        canInterpolate() {
            return this.dkt_points.length == 0 || this.ikt_points.length == 0 ? true : false
        },
        canVisualize() {
            return this.dkt_polinom.length == 0 || this.ikt_polinom.length == 0 ? true : false
        }
    },
    methods: {
        onSetDKTpoints(dkt_points) {
            this.dkt_points = dkt_points;
        },
        onSetIKTpoints(ikt_points) {
            this.ikt_points = ikt_points;
        },
        onSetDKTpolinom(dkt_polinom) {
            this.dkt_polinom = dkt_polinom;
        },
        onSetIKTpolinom(ikt_polinom) {
            this.ikt_polinom = ikt_polinom;
        },
        onSaveTrajectory(trajectoryInfo) {
            let trajectory = {
                mech_id: this.selectedMechanism.id,
                name: trajectoryInfo.name,
                description: trajectoryInfo.description,
                dkt_point: JSON.stringify(this.dkt_points),
                dkt_polinoms: JSON.stringify(this.dkt_polinom),
                ikt_point: JSON.stringify(this.ikt_points),
                ikt_polinoms: JSON.stringify(this.ikt_polinom),
            }
            
            this.$store.dispatch('MechanismsModule/onAddMechTrajectory', {mech_id: this.selectedMechanism.id, trajectory: trajectory}).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'notice'; 
                    this.noticeDialog.message = 'Данные траектории были успешно сохранены';  
                },
                (error) => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'error'; 
                    this.noticeDialog.message = `При сохранении траектории возникла ошибка: ${error}`;  
                }
            )
        },
        onNoticeDlgClose() {
            this.noticeDialog.show = false; 
            this.noticeDialog.type = 'notice';
            this.noticeDialog.message = ''; 
        }
    }
}
</script>