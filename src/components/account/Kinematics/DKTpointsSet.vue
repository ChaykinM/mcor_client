<template>
    <v-table>
        <thead>
            <tr>
                <th width="5%">ID</th>
                <th>t</th>
                <th v-for="coord in template" :key="coord.id">
                    {{ coord.tag + ' , ' + coord.dimension }}
                </th>
                <th width="10%">
                    <div class="d-flex justify-center">
                        <v-tooltip location="bottom">
                            <template v-slot:activator="{ props }">
                                <v-btn color="deep-purple-darken-1" class="mx-2" v-bind="props" :disabled="cadAddPoint">
                                    <v-icon size="32">mdi-plus</v-icon>
                                    <AddDKTpoint :template="template" @add-point="onAddPoint" />
                                </v-btn>
                            </template>
                            <span>Добавить новую</span>
                        </v-tooltip>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody v-if="points.length != 0">
            <tr v-for="point in points" :key="point">
                <td>
                    {{ point.id }}
                </td>
                <td>{{ point.time }}</td>
                <td v-for="coord in template" :key="coord.id">
                    {{ point[coord.tag] }}
                </td>
                <td>
                    <div class="d-flex justify-center">
                        <v-tooltip location="bottom">
                            <template v-slot:activator="{ props }">
                                <v-btn color="indigo-darken-4" class="mx-2" v-bind="props">
                                    <v-icon size="32">mdi-pencil</v-icon>
                                    <EditDKTpoint :template="template" :point="point" @edit-point="onEditPoint"/>
                                </v-btn>
                            </template>
                            <span> Редакировать </span>
                        </v-tooltip>
                    </div>
                </td>
            </tr>
        </tbody>

    </v-table>
    <v-alert v-if="points.length == 0" type="error" color="red-darken-4" variant="flat" class="ma-2" width="100%">
        Нет добавленных декартовых точек
    </v-alert>

    <v-divider></v-divider>
    <div class="d-flex justify-end" style="width: 100%;">
        <v-btn @click="solveIKT" :disabled="canSolveIKT" color="indigo-darken-2" variant="flat" class="ma-2"> Получить обобщённые координаты </v-btn>
    </div>
</template>

<script>
import AddDKTpoint from '@/components/account/Kinematics/AddDKTpoint.vue';
import EditDKTpoint from '@/components/account/Kinematics/EditDKTpoint.vue';

export default {
    name: "DKT",
    props: {
        maxTime: {
            type: Number,
            required: true,
        }, 
        pointsNumber: {
            type: Number,
            required: true, 
        }, 
        template: {
            type: Array,
            required: true,
        }, 
    },
    emits: ['clearInversePoint', 'solveInverseTask'],
    data() {
        return {
            T: this.maxTime,
            N: this.pointsNumber, 
            t_h: this.maxTime / ( this.pointsNumber - 1),
            points: [],
        };
    },
    watch: {
        maxTime: 'onChangeTime', 
        pointsNumber: 'onChangePointsNumber', 
    },
    components: { AddDKTpoint, EditDKTpoint },
    computed: {
        cadAddPoint() {
            return this.points.length == this.N ? true : false; 
        },
        canSolveIKT() {
            return  this.points.length == this.N ? false : true;  // если указали все точки, то можем получить обобщённые координаты
        }
    },
    methods: {
        onChangeTime(newTime) {
            this.T = newTime; 
            this.t_h = this.maxTime / ( this.pointsNumber - 1); 
            this.points = []; 
            this.$emit("clearInversePoint");
        }, 
        onChangePointsNumber(newPointsNumber) {
            this.N = newPointsNumber; 
            this.t_h = this.maxTime / ( this.pointsNumber - 1); 
            this.points = []; 
            this.$emit("clearInversePoint");
        },
        onAddPoint(point) {
            let id = 0;
            if (this.points.length != 0) {
                id = Math.max(...this.points.map((p) => p.id)) + 1; 
            }
            point['id'] = id; 
            point['time'] = this.t_h * id; 
            this.points.push(point);
            this.$emit("clearInversePoint");
        }, 
        onEditPoint(point) {
            let pointIndex = this.points.findIndex((p) => p.id == point.id); 
            this.points[pointIndex] = point; 
            this.$emit("clearInversePoint");
        }, 
        solveIKT() {
            this.$emit('solveInverseTask', this.points); 
        }
    }
}
</script>