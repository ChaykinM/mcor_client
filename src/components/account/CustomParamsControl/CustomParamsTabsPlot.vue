<template>
    <v-card v-if="selectedCustomParamsWithValues.length != 0">
            <v-tabs v-model="plotTab" background-color="primary">
                <v-tab v-for="param in selectedCustomParamsWithValues" :key="param" :value="param.tag"> {{ param.name }} </v-tab>
                <v-spacer></v-spacer>
            </v-tabs>

            <v-card-text>
                <v-window v-model="plotTab">
                    <v-window-item v-for="param in selectedCustomParamsWithValues" :key="param" :value="param.tag">
                        <div class="d-flex flex-row mb-6 bg-surface-variant">
                            <v-sheet width="100%" height="600px">
                                <RealtimeParamPlot :params="[param]" />
                            </v-sheet>
                        </div>
                    </v-window-item>
                </v-window>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="accent" prepend-icon="mdi-cloud-upload"> Сохранить историю 
                    <HistorySave history_type="custom_params" :params_with_data="customParams" />
                </v-btn>
            </v-card-actions>
        </v-card>
</template>

<script>
import RealtimeParamPlot from '@/components/account/RealtimeParamPlot.vue';
import HistorySave from '@/components/account/History/HistorySave.vue'

export default {
    name: "CustomParamsTabsPlot", 
    props: {
        customParams: Array,
        selectedCustomParamsWithValues: Array, 
    }, 
    emits: [], 
    data() {
        return {
            plotTab: null,
        }
    }, 
    components: {
        RealtimeParamPlot,
        HistorySave,
    }
}
</script>