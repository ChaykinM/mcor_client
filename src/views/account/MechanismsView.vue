<template>
    <v-overlay v-if="!mechanismsLoaded" :model-value="true" class="align-center justify-center">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>

    <div v-else>
        <v-container>
            <MechanismsObserve :mechanisms="mechanisms" />
        </v-container>
        <v-container>
            <MechanismsControl :mechanisms="mechanisms" />
        </v-container>
        <v-container>
            <MechanismsSeansControl :mechanisms="mechanisms" />
        </v-container>
    </div>
</template>

<script>
import MechanismsControl from '@/components/account/Mechanisms/MechanismsControl.vue';
import MechanismsObserve from '@/components/account/Mechanisms/MechanismsObserve.vue';
import MechanismsSeansControl from "@/components/account/MechanismParamsControl/MechanismsSeansControl.vue"; 

export default {
    name: "MechanismsView",
    data() {
        return {
            mechanismsLoaded: false,
        };
    },
    components: {
    MechanismsObserve,
    MechanismsControl,
    MechanismsSeansControl,
},
    mounted() {
        this.$store.dispatch("MechanismsModule/onGetMechanisms").then(
            () => {
                this.mechanismsLoaded = true;
            },
            (error) => {
                console.log(error);
            }
        );
    },
    computed: {
        mechanisms() {
            return this.$store.getters["MechanismsModule/GET_MECHANISMS"];
        }
     
    },
    methods: {
        
    }
}
</script>