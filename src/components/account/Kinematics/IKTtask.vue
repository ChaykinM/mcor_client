<template>
    <v-text-field v-model="T" label="Время движения по траектории T, [сек]" type="number" step="1" :min="10" :max="1000" :rules="rules"
        required></v-text-field>
    <v-text-field v-model="N" label="Количество точек траектории N" type="number" step="1" :min="2" :max="1000" :rules="rules"
        required></v-text-field>
        
    <v-tabs v-model="tabPoints" bg-color="primary">
        <v-tab value="dkt">Декартовы координаты</v-tab>
        <v-tab v-if="iktSuccessSolve" value="ikt">Обобщённые координаты</v-tab>
    </v-tabs>
    <v-window v-model="tabPoints">
        <v-window-item value="dkt">
            <DKTpointsSet :max-time="T" :points-number="N" :template="template.dkt" @clear-inverse-point="onClearIKTsolution" @solve-inverse-task="onSolveInverseTask"  />
        </v-window-item>

        <v-window-item v-if="iktSuccessSolve" value="ikt">
            <IKTpointsTable :template="template.ikt" :points="iktSolution" />
        </v-window-item>
    </v-window>
</template>

<script>
import DKTpointsSet from "@/components/account/Kinematics/DKTpointsSet.vue";
import IKTpointsTable from "@/components/account/Kinematics/IKTpointsTable.vue";
import { MechanismsAPI } from "@/api/MechanismsAPI";

export default {
    name: "IKTtask",
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
            T: 100,
            N: 50, 
            tabPoints: null,
            iktSuccessSolve: null,
            iktSolution: [],
            rules: [
                v => !!v || 'Поле является обязательным для заполнения',
            ],
        };
    },
    components: {
        DKTpointsSet,
        IKTpointsTable
    },
    methods: {
        onClearIKTsolution() {
            this.iktSolution = []; 
        }, 
        onSolveInverseTask(points) {
            MechanismsAPI.Kinematics.IKTsolver(this.mech_id, points).then(
                (res) => {
                    this.iktSolution = res.data.solution;
                    this.$emit('sendDirectPoints', points); 
                    this.$emit('sendInversePoints', this.iktSolution); 
                    this.iktSuccessSolve = true;
                },
                (error) => {
                    console.log(error)
                }
            )
        },
    }
}
</script>