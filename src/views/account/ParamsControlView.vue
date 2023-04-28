<template>
    <v-container>
        <ParamsTable :params-types="paramsTypes"/>
    </v-container>
</template>

<script>
import ParamsTable from '@/components/account/Params/ParamsTable.vue'
export default {
    name: "ParamsControlView",
    data() {
        return {
            paramsTypes: [
                {
                    id: 1,
                    title: 'Параметры механизма',
                    params: [],
                    loadingError: '',
                },
                {
                    id: 2,
                    title: 'Дополнительные параметры',
                    params: [],
                    loadingError: '',
                }
            ],
        }
    },
    components: { ParamsTable },
    mounted() {
        this.$store.dispatch("ParamsModule/onGetParams").then(
            () => {
                this.paramsTypes.find(p => p.id == 1).params = this.$store.getters["ParamsModule/GET_PARAMS"];
            },
            (error) => {
                this.paramsTypes.find(p => p.id == 1).loadingError = error;
            }
        )
        this.$store.dispatch("ParamsModule/onGetCustomParams").then(
            () => {
                this.paramsTypes.find(p => p.id == 2).params = this.$store.getters["ParamsModule/GET_CUSTOM_PARAMS"];
            },
            (error) => {
                this.paramsTypes.find(p => p.id == 2).loadingError = error;
            }
        );
    },
    

}
</script>