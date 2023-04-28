<template>
    <div class="d-flex justify-end" style="width: 100%;">
        <v-btn color="indigo-darken-2" variant="flat" class="ma-2" :prepend-icon="'mdi-plus'"> Добавить график
            <AddTrajPlot :template="template" @add-plot="onAddPlot" />
        </v-btn>
    </div>

    <v-row no-gutters>
        <v-col cols="6" v-for="plot in plots" :key="plot.id">
            <v-sheet v-if="plot.method == 'points'" :height="'400px'" :width="'100%'">
                <TrajectoryPlotPoints :title="plot.title" :x-label="plot.x" :y-label="plot.y"  :data="getPlotPointsData(plot)" />
            </v-sheet>
            <v-sheet v-if="plot.method == 'polinom'" :height="'400px'" :width="'100%'">
                <TrajectoryPlotPoints :title="plot.title" x-label="time" :y-label="plot.coord" :data="getPlotPolinomData(plot.coord)" />
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
import AddTrajPlot from '@/components/account/Kinematics/AddTrajPlot.vue';
import TrajectoryPlotPoints from '@/components/account/Kinematics/TrajectoryPlotPoints.vue';

export default {
    name: "DKTsolutionVisualize",
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
        }
    },
    data() {
        return {
            plots: [],
        };
    },
    methods: {
        onAddPlot(plot) {
            let id = 0;
            if (this.plots.length != 0) {
                id = Math.max(...this.plots.map((p) => p.id)) + 1;
            }
            plot['id'] = id;
            this.plots.push(plot);
        },

        getPlotPointsData(plot) {
            let data = this.dkt_points.map(p => [p[plot.x], p[plot.y]]);
            return data;
        },

        getPlotPolinomData(coord) {
            let id = this.template.find((t) => t.tag == coord).id;
            let coord_polinom = this.dkt_polinom.find((p) => p.id == id);
            let splines = coord_polinom.splines;
            console.log(splines);

            let data = [];
            let N = 9; // сколько точек для каждого сплайна будем считать 

            let T = coord_polinom.T;
            let time = [...splines.map((s) => s.x), T];
            console.log(time)
            console.log(splines.length)
            for (let i = 0; i < splines.length; i++) {
                let a = splines[i].a;
                let b = splines[i].b;
                let c = splines[i].c;
                let d = splines[i].d;

                let time_step = (time[i + 1] - time[i]) / N;
                let prev_time = time[i];
                while (prev_time < time[i + 1]) {
                    let dt = prev_time - time[i];
                    let val = a + b * dt + c * Math.pow(dt, 2) + d * Math.pow(dt, 3);
                    data.push([prev_time, val]);
                    prev_time = prev_time + time_step;
                }
                console.log(splines[i])
            }
            console.log(data);
            return data;
        }
    },
    components: { AddTrajPlot, TrajectoryPlotPoints }
}
</script>