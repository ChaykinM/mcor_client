<template>
    <v-card>
        <v-tabs v-model="motorTab" background-color="primary">
            <v-tab v-for="motor in selectedParamsWithValues.motorParams" :key="motor.mech_motor_id" :value="motor.name">
                {{ motor.name }}</v-tab>
        </v-tabs>

        <v-card-text>
            <v-window v-model="motorTab">
                <v-window-item v-for="motor in selectedParamsWithValues.motorParams" :key="motor.mech_motor_id"
                    :value="motor.name">
                    <v-sheet class="d-flex  justify-center flex-wrap">
                        <v-sheet width="50%" height="400px" class="flex-grow-1 flex-shrink-0" v-for="param in motor.params"
                            :key="param.id">
                            <v-sheet height="10%" class="text-subtitle-1 text-center" style="cursor:pointer;">
                                {{ param.name }}</v-sheet>
                            <v-divider></v-divider>
                            <v-sheet width="100%" height="90%">
                                <RealtimeParamPlot :params="[param]" />
                            </v-sheet>
                        </v-sheet>
                    </v-sheet>
                </v-window-item>
            </v-window>
        </v-card-text> 
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="accent" prepend-icon="mdi-cloud-upload"> Сохранить историю
                <HistorySave history_type="seans" :mech_id="mechMotorParamsWithData.mech_id"
                    :params_with_data="mechMotorParamsWithData.motorParams" />
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import RealtimeParamPlot from '@/components/account/RealtimeParamPlot.vue';
import HistorySave from '@/components/account/History/HistorySave.vue'

export default {
    name: "MechMotorParamsPlots",
    props: {
        mechMotorParamsWithData: {
            type: Object,
            required: true, 
        }, 
        selectedParams: {
            type: Array,
            required: true, 
        }
    },
    data() {
        return {
            motorTab: null,
        };
    },
    components: {
        RealtimeParamPlot, 
        HistorySave
    }, 
    computed: {
        selectedParamsWithValues() {
            let selectedParamsObject = {};
            for (let selectedParam of this.selectedParams) {
                selectedParamsObject[selectedParam.mech_motor_id] = [];
            }
            for (let selectedParam of this.selectedParams) {
                selectedParamsObject[selectedParam.mech_motor_id].push(selectedParam.param_id);
            }
            console.log(selectedParamsObject)
            
            let selectedParamsWithValues = {
                mech_id: this.mechMotorParamsWithData.mech_id,
                motorParams: [],
            };

            for (let motor of this.mechMotorParamsWithData.motorParams) {
                console.log(motor)
                if (Object.keys(selectedParamsObject).includes(motor.mech_motor_id.toString())) {
                    console.log("здесь")
                    let motorWithParamsData = {
                        mech_motor_id: motor.mech_motor_id,
                        name: motor.name,
                        params: [],
                    };

                    for (let param of motor.params) {
                        if (selectedParamsObject[motor.mech_motor_id].includes(param.param_data.param_id)) {
                            motorWithParamsData.params.push(param.param_data);
                        }
                    }
                    console.log(motorWithParamsData)
                    selectedParamsWithValues.motorParams.push(motorWithParamsData);
                }
            }
            return selectedParamsWithValues; 
        }
    },
}
</script>