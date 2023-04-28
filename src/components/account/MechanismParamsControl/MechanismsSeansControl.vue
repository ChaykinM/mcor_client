<template>
    <v-card class="mb-8">
        <v-card-title class="pa-0 mb-2">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    Сеанс наблюдения
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>

        <v-radio-group v-model="selectedMechanism" @click="clearSelected()" inline>
            <v-radio v-for="mech in mechanisms" :key="mech" :label="mech.name" :value="mech.id"></v-radio>
        </v-radio-group>
        <v-divider></v-divider>

        <v-expand-transition v-if="selectedMechanism != ''">
             <div>
                <SelectMechParamsForControl :selected-mech-motors="getSelectedMechMotors"
                    @send-selected-params="controlParams" />
            </div>
        </v-expand-transition>
    </v-card>
    <MechMotorParamsPlots v-if="controlMode" :mech-motor-params-with-data="getMechMotorsParamsWithValues"
        :selected-params="selectedParams" />
</template>

<script>
import SelectMechParamsForControl from '@/components/account/MechanismParamsControl/SelectMechParamsForControl.vue';
import MechMotorParamsPlots from '@/components/account/MechanismParamsControl/MechMotorParamsPlots.vue';

export default {
    name: "MechanismsSeansControl",
    props: {
        mechanisms: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            selectedMechanism: '',
            selectedMotor: "",
            selectedParams: [],
            controlMode: null,
        };
    },
    components: {
        SelectMechParamsForControl,
        MechMotorParamsPlots
    },
    computed: {
        getSelectedMechMotors() {
            return this.mechanisms.find(m => m.id == this.selectedMechanism).motors;
        },
        getMechMotorsParamsWithValues() {
            return this.$store.getters["ParamsModule/GET_MECH_MOTORS_PARAMS"];
        },
    },
    methods: {
        clearSelected() {
            this.selectedMotor = "";
            this.selectedParams = [];
        },

        controlParams(selectedParams) {
            console.log(selectedParams)

            this.selectedParams = selectedParams;
            this.$store.dispatch("ParamsModule/onGetMechMotorsParamsForControl", { mech_id: this.selectedMechanism }).then(
                () => {
                    console.log("загрузил")
                    this.controlMode = true;
                },
                (error) => {
                    alert(error)
                }
            )
        },
    }
}
</script>