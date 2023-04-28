<template>
    <v-overlay v-if="!mechanismsLoaded" :model-value="true" class="align-center justify-center">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>

    <div v-else>
        <v-container>
            <TrajectoryPlanning
                :mechanisms-info="mechInfo" />
        </v-container>
    </div>
</template>

<script>
import TrajectoryPlanning from '@/components/account/Kinematics/TrajectoryPlanning.vue';
import { MechanismsAPI } from '@/api/MechanismsAPI';

export default {
    name: "NewTrajectoryView",
    data() {
        return {
            mechanismsLoaded: false, 
            mechInfo: [],
        };
    },
    mounted() {
        MechanismsAPI.getMechanismsInfo().then(
            (res) => {
                this.mechInfo = res.data.mechanisms.map((m) => { let info = { id: m.id, type: m.type, name: m.name }; return info });
                this.mechanismsLoaded = true;
            },
            (error) => {
                console.log(error); 
            }
        )
    },
    components: { TrajectoryPlanning }
}
</script>