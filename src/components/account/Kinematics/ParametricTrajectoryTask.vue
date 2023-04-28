<template>
    <ParametricTrajectorySet :template="template.dkt" @solve-param-traj="onSolveParamTraj" />

    <v-tabs v-model="tabPoints" bg-color="primary">
        <v-tab v-if="dktSolution.length != 0" value="dkt">Декартовы координаты</v-tab>
        <v-tab v-if="iktSolution.length != 0" value="ikt">Обобщённые координаты</v-tab>
    </v-tabs>

    <v-window v-model="tabPoints">
        <v-window-item v-if="dktSolution.length != 0" value="dkt">
            <DKTpointsTable :template="template.dkt" :points="dktSolution" />
            <v-divider></v-divider>
            <div class="d-flex justify-end" style="width: 100%;">
                <v-btn color="indigo-darken-2" variant="flat" class="ma-2" @click="solveinverseTask">Получить обобщённые
                    координаты</v-btn>
            </div>
        </v-window-item>

        <v-window-item v-if="iktSolution.length != 0" value="ikt">
            <IKTpointsTable :template="template.ikt" :points="iktSolution" />
        </v-window-item>
    </v-window>

</template>

<script>
import ParametricTrajectorySet from "@/components/account/Kinematics/ParametricTrajectorySet.vue";
import DKTpointsTable from "@/components/account/Kinematics/DKTpointsTable.vue"
import IKTpointsTable from "@/components/account/Kinematics/IKTpointsTable.vue"

import { MechanismsAPI } from "@/api/MechanismsAPI";

import { evaluate } from "mathjs";

export default {
    name: "ParametricTrajectoryTask",
    props: {
        mech_id: {
            type: Number,
            required: true,
        },
        template: {
            type: Object,
            required: true,
        }
    },
    emits: ['sendDirectPoints', 'sendInversePoints'],
    data() {
        return {
            tabPoints: 'dkt',

            dktSolution: [],
            dkt_polinom: [],
            iktSolution: [],
            ikt_polinom: [],
        };
    },
    components: {
        ParametricTrajectorySet,
        DKTpointsTable,
        IKTpointsTable
    },
    methods: {
        onSolveParamTraj(paramTraj) {
            this.dktSolution = [];
            this.iktSolution = [];

            let t_vec = [];

            let t_max = paramTraj.T;
            let N = paramTraj.N; // количество точек
            let t_h = t_max / (N - 1);

            for (let t_i = 0; t_i < t_max; t_i = t_i + t_h) {
                // let t_i = 
                t_vec.push(t_i); // получаю время от начала до предпоследней точки
            }
            t_vec.push(t_max);  // добавляю время конечной точки

            // let dktSolution = [];
            for (let i = 0; i < t_vec.length; i++) {
                let point = {};
                point["id"] = i;
                point["time"] = t_vec[i];
                for (let key of Object.keys(paramTraj)) {
                    try {
                        point[key] = evaluate(paramTraj[key], { t: Number(t_vec[i]) });
                    }
                    catch (e) {
                        console.log(e)
                        // и по идеи тут должны отказаться от исполнения функции прервать 
                    }
                }
                this.dktSolution.push(point);
            }
        },

        solveinverseTask() {
            MechanismsAPI.Kinematics.IKTsolver(this.mech_id, this.dktSolution).then(
                (res) => {
                    this.iktSolution = res.data.solution;
                    this.$emit("sendDirectPoints", this.dktSolution); 
                    this.$emit("sendInversePoints", this.iktSolution); 
                    // this.iktSuccessSolve = true;
                },
                (error) => {
                    console.log(error)
                }
            )
        },


    }
}
</script>