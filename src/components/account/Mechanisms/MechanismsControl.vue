<template>
    <v-card>
        <v-card-title class="pa-0 mb-2">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    Управление механизмом
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-radio-group v-model="selectedMechanism" inline>
                <v-radio v-for="mechanism in mechanisms" :key="mechanism.id" :label="mechanism.name"
                    :value="mechanism"></v-radio>
            </v-radio-group>
            <div v-if="selectedMechanism != null">
                выбрать траекторию
                начать обход
                остановить движение
                получить текущие данные 
                // таблица с параметрами, которая обновляется часто?? ну позиция вала ДПТ
                
                {{  selectedTrajectory }}

                <v-autocomplete label="Выберите траекторию" :items="selectedMechanism.trajectories" v-model="selectedTrajectory" :item-title="'name'" :item-value="'id'"></v-autocomplete>
                <v-table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="motor in selectedMechanism.motors" :key="motor.mech_motor_id">
                            <td>
                                {{  motor.mech_motor_id }}
                            </td>   
                            <td> {{  motor.name }}</td>  
                            <td></td>                       
                        </tr>

                    </tbody>
                </v-table>
                Ручной режим 
                <v-btn>
                    Запустить стенд
                </v-btn>
                <v-btn>
                    Остановить стенд 
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "MechanismsControl",
    props: {
        mechanisms: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selectedMechanism: null,
            selectedTrajectory: null, 
        };
    },
    computed: {
   
    },
    methods: {
        start() {
            // запустить стенд
        },
        stop() {
            // остановить стенд 
        }
    }



}
</script>