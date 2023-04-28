<template>
    <v-tabs v-model="tabPoints" bg-color="primary">
        <v-tab value="dkt">Декартовы координаты</v-tab>
        <v-tab value="ikt">Обобщённые координаты</v-tab>
    </v-tabs>
    <v-window v-model="tabPoints">
        <v-window-item value="dkt">
            <div class="d-flex justify-center ma-2" style="width: 100%;">
                <v-progress-circular v-if="dktInterpolateProccess.loading" :size="70" :width="7" color="purple"
                    indeterminate></v-progress-circular>
            </div>

            <InterpolationPolinomsTable v-if="dktInterpolateProccess.successSolved" :template="template.dkt"
                :polinoms="dkt_polinom" />
            <v-alert v-if="!dktInterpolateProccess.successSolved && dktInterpolateProccess.error != ''"> {{
                dktInterpolateProccess.error }}</v-alert>
        </v-window-item>

        <v-window-item value="ikt">
            <div class="d-flex justify-center ma-2" style="width: 100%;">
                <v-progress-circular v-if="iktInterpolateProccess.loading" :size="70" :width="7" color="purple"
                    indeterminate></v-progress-circular>
            </div>

            <InterpolationPolinomsTable v-if="iktInterpolateProccess.successSolved" :template="template.ikt"
                :polinoms="ikt_polinom" />
            <v-alert v-if="!iktInterpolateProccess.successSolved && iktInterpolateProccess.error != ''"> {{
                iktInterpolateProccess.error }}</v-alert>
        </v-window-item>
    </v-window>
</template>

<script>
import InterpolationPolinomsTable from "@/components/account/Kinematics/IntrepolationPolinomsTable.vue";
import { MechanismsAPI } from "@/api/MechanismsAPI";

export default {
    name: "TrajectoryInterpolate",
    props: {
        mech_id: {
            type: Number,
            required: true,
        },
        template: {
            type: Object,
            required: true,
        },
        dkt_points: {
            type: Array,
            required: true,
        },
        ikt_points: {
            type: Array,
            required: true,
        },
    },
    watch: {
        dkt_points: "dktInterpolate",
        ikt_points: "iktInterpolate",
    },
    emits: ["sendDirectPolinoms", "sendInversePolinoms"],
    data() {
        return {
            tabPoints: null,
            dkt_polinom: [],
            dktInterpolateProccess: {
                loading: true,
                successSolved: false,
                error: '',
            },
            iktInterpolateProccess: {
                loading: false,
                successSolved: true,
                error: '',
            },
            ikt_polinom: [],
        }
    },
    components: { InterpolationPolinomsTable },
    mounted() {
        this.dktInterpolate(this.dkt_points);
        this.iktInterpolate(this.ikt_points);
    },
    methods: {
        dktInterpolate(dktSolution) {
            let dktInterpolationTask = [];
            this.dktInterpolateProccess.loading = true;
            this.dktInterpolateProccess.successSolved = false;
            this.dktInterpolateProccess.error = '';

            for (let tag of this.template.dkt) {
                let dkt_coords = {
                    id: tag.id,
                    time: dktSolution.map((p) => p['time']),
                    val: dktSolution.map((p) => p[tag.tag])
                };
                dktInterpolationTask.push(dkt_coords)
            }
            console.log(dktInterpolationTask)

            MechanismsAPI.Kinematics.Interpolation(this.mech_id, dktInterpolationTask).then(
                (res) => {
                    this.dkt_polinom = res.data.solution;
                    this.dktInterpolateProccess.loading = false;
                    this.dktInterpolateProccess.successSolved = true;
                    this.$emit("sendDirectPolinoms", this.dkt_polinom);
                },
                (err) => {
                    this.dktInterpolateProccess.loading = false;
                    this.dktInterpolateProccess.successSolved = false;
                    this.dktInterpolateProccess.error = err;
                }
            )
        },
        iktInterpolate(iktSolution) {
            let iktInterpolationTask = [];
            this.iktInterpolateProccess.loading = true;
            this.iktInterpolateProccess.successSolved = false;
            this.iktInterpolateProccess.error = '';

            for (let tag of this.template.ikt) {
                let ikt_coords = {
                    id: tag.id,
                    time: iktSolution.map((p) => p['time']),
                    val: iktSolution.map((p) => p[tag.tag])
                };
                iktInterpolationTask.push(ikt_coords)
            }

            MechanismsAPI.Kinematics.Interpolation(this.mech_id, iktInterpolationTask).then(
                (res) => {
                    this.ikt_polinom = res.data.solution;
                    this.iktInterpolateProccess.loading = false;
                    this.iktInterpolateProccess.successSolved = true;
                    this.$emit("sendInversePolinoms", this.ikt_polinom);
                },
                (err) => {
                    this.iktInterpolateProccess.loading = false;
                    this.iktInterpolateProccess.successSolved = false;
                    this.iktInterpolateProccess.error = err;
                }
            )
        },
    }
}  
</script>