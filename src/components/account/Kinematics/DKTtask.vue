<template>
    <v-text-field v-model="T" label="Время движения по траектории T, [сек]" type="number" step="1" :min="10" :max="1000" :rules="rules"
        required></v-text-field>
    <v-text-field v-model="N" label="Количество точек траектории N" type="number" step="1" :min="2" :max="1000" :rules="rules"
        required></v-text-field>

    <v-tabs v-model="tabPoints" bg-color="primary">
        <v-tab v-if="dktSuccessSolve" value="dkt">Декартовы координаты</v-tab>
        <v-tab value="ikt">Обобщённые координаты</v-tab>
    </v-tabs>

    <v-window v-model="tabPoints">
        <v-window-item v-if="dktSuccessSolve" value="dkt">
            <DKTpointsTable :template="template.dkt" :points="dktSolution" />
        </v-window-item>

        <v-window-item value="ikt">
            <IKTpointsSet :max-time="T" :points-number="N"  :template="template.ikt" @clear-direct-point="onClearDKTsolution" @solve-direct-task="onSolveDirectTask" />
        </v-window-item>
    </v-window>
</template>

<script>
import DKTpointsTable from "@/components/account/Kinematics/DKTpointsTable.vue";
import IKTpointsSet from "@/components/account/Kinematics/IKTpointsSet.vue";
import { MechanismsAPI } from "@/api/MechanismsAPI";

export default {
    name: "DKTtask",
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
            dktSolution: [],
            dktSuccessSolve: null,
            rules: [
                v => !!v || 'Поле является обязательным для заполнения',
            ],
        }
    },
    components: {
        DKTpointsTable,
        IKTpointsSet,
    },
    methods: {
        onClearDKTsolution() {
            this.iktSolution = []; 
        }, 
        onSolveDirectTask(points) {
            MechanismsAPI.Kinematics.DKTsolver(this.mech_id, points).then(
                (res) => {
                    this.dktSolution = res.data.solution;
                    this.dktSuccessSolve = true;
                    this.$emit('sendDirectPoints', this.dktSolution); 
                    this.$emit('sendInversePoints', points); 
                },
                (error) => {
                    console.log(error)
                }
            )
        },
    }
}
</script>