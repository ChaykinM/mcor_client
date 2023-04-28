<template>
    <v-container>
        <SelectCustomParams :custom-params="customParams" @send-selected-custom-params="changeSelectedCustomParams" />
    </v-container>
    <v-container>
        <CustomParamsTabsPlot :custom-params="customParams" :selected-custom-params-with-values="selectedCustomParamsWithValues"/>
    </v-container>
</template>

<script>
import SelectCustomParams from '@/components/account/CustomParamsControl/SelectCustomParams.vue';
// import PlotViewSettings from '@/components/account/PlotViewSettings.vue';
import CustomParamsTabsPlot from '@/components/account/CustomParamsControl/CustomParamsTabsPlot.vue';

export default {
    name: "CustomParams",
    data() {
        return {
            customParams: [],
            selectedCustomParamsWithValues: [],
        };
    },
    components: {
        SelectCustomParams,
        CustomParamsTabsPlot
    },
    mounted() {
        this.$store.dispatch("ParamsModule/onGetCustomParamsForControl").then(() => {
            this.customParams = this.$store.getters["ParamsModule/GET_CUSTOM_PARAMS_WITH_VALUES"];
            console.log(this.customParams);
        }, (error) => {
            console.log(error);
        });
    },
    methods: {
        changeSelectedCustomParams(selectedCustomParams) {
            this.selectedCustomParamsWithValues = []; // очистим перед новой загрузкой
            for (let selectedParam of selectedCustomParams) {
                for (let paramWithValues of this.customParams) {
                    if (paramWithValues.tag == selectedParam) {
                        this.selectedCustomParamsWithValues.push(paramWithValues);
                    }
                }
            }
        },
    }
}
</script>