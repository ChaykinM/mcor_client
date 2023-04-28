<template>
    <v-tabs v-model="tabPoints" bg-color="primary">
        <v-tab value="dkt">Декартовы координаты</v-tab>
        <v-tab value="ikt">Обобщённые координаты</v-tab>
    </v-tabs>

    <v-window v-model="tabPoints">
        <v-window-item value="dkt">
            <DKTsolutionVisualize :template="template.dkt" :dkt_polinom="dkt_polinom" :dkt_points="dkt_points"/>
        </v-window-item>
        <v-window-item value="ikt">
            <IKTsolutionVisualize :template="template.ikt" :ikt_polinom="ikt_polinom" :ikt_points="ikt_points"/>
        </v-window-item>
    </v-window>
</template>

<script>
import DKTsolutionVisualize from "@/components/account/Kinematics/DKTsolutionVisualize.vue";
import IKTsolutionVisualize from "@/components/account/Kinematics/IKTsolutionVisualize.vue";

export default {
    name: "TrajectoryVisualize",
    props: {
        template: {
            type: Object,
            required: true, 
        }, 
        dkt_points: {
            type: Array, 
            required: true, 
        },
        dkt_polinom: {
            type: Array, 
            required: true, 
        }, 
        ikt_points: {
            type: Array, 
            required: true, 
        },
        ikt_polinom: {
            type: Array,
            required: true, 
        }
    }, 
    data() {
        return {
            tabPoints: 'dkt',
        };
    },
    components: { 
        DKTsolutionVisualize, 
        IKTsolutionVisualize
     }
}
</script>