<template>
    <v-dialog v-model="showDialog" activator="parent" scrollable persistent>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Добавление графика
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-text-field v-model="plot.title" :label="'Название графика'"></v-text-field>
                <v-radio-group v-model="plot.method" inline>
                    <v-radio v-for="method in plotMethods" :key="method.id" :label="method.label" :value="method.tag"></v-radio>
                </v-radio-group>
                <div v-if="plot.method == 'points'">
                    <v-select label="Ось X" v-model="plot['x']" :items="getAxis" :item-title="'tag'"></v-select>
                    <v-select label="Ось Y" v-model="plot['y']" :items="getAxis" :item-title="'tag'"></v-select>
                </div>
                <div v-if="plot.method == 'polinom'">
                    <v-select label="Координата" v-model="plot['coord']" :items="template" :item-title="'tag'"></v-select>
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="close">
                    Отмена
                </v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save()">
                    Сохранить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "AddTrajPlot",
    props: {
        template: {
            type: Array,
            required: true,
        }
    },
    emits: ["addPlot"],
    data() {
        return {
            showDialog: false,

            plotMethods: [
                {
                    id: 0,
                    label: 'По интерполяционным полиномам', 
                    tag: 'polinom', 
                }, 
                {
                    id: 1,
                    label: 'По точкам', 
                    tag: 'points', 
                }, 
            ],
            plot: {
                title: '',
                // x: null, // если строим по точкам 
                // y: null,
                // coord: tag // если строим по сплайнам -> по оси x всегда время 
                method: 'polinom',
            },
        };
    },
    computed: {
        getAxis() {
            let axis = [
                { id: -1, tag: "time", dimension: "сек" },
                ...this.template
            ];
            return axis;
        },
        // getPlotData(plot) {

        //     return 
        // }
    },
    methods: {
        close() {
            this.showDialog = false;
        },
        save() {
            this.$emit("addPlot", JSON.parse(JSON.stringify(this.plot))); 
            this.plot = {
                title: '',
                x: null,
                y: null,
                method: 'polinom',
            }; 
            this.showDialog = false;
        }
    }
}
</script>