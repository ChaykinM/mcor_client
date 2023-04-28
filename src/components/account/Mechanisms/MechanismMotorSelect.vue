<template>
    <v-dialog v-model="showDialog" activator="parent" persistent scrollable>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Редактирование привода
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="cancel"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field :rules="[v => !!v || 'Обязательное поле']" v-model.trim="newMotorName"
                        :label="'Название привода'"></v-text-field>                    
                </v-form>

                <v-text-field hide-details="true" v-model="searchMotorsInput" label="Поиск по приводам"
                    append-inner-icon="mdi-magnify"></v-text-field>
                <v-table v-if="motors.length != 0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Название</th>
                            <th>Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="motor in motors" :key="motor.id">
                            <td>
                                <v-checkbox-btn v-model="newSelectedMotorId" :value="motor.id" class="center">
                                </v-checkbox-btn>
                            </td>
                            <td> {{ motor.name }}</td>
                            <td> {{ motor.description }}</td>
                        </tr>
                    </tbody>
                </v-table>
                <v-alert v-else type="error" color="red-darken-4" variant="flat">
                    Выберите привод для контроля параметров
                </v-alert>
                <div v-if="motorsPageLength > 1" class="text-center">
                    <v-pagination v-model="motorsTablePage" :length="motorsPageLength"></v-pagination>
                </div>
            </v-card-text><v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="cancel">
                    Отмена
                </v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save">
                    Сохранить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "MechanismMotorSelect",
    props: {
        standardMotors: {
            type: Object,
            required: true,
        },
        mechMotorId: {
            type: Number,
            required: true,
        },
        selectedMotorId: {
            type: Number,
            required: true,
        },
        motorName: {
            type: String,
            required: true,
        }
    },
    emits: ['changeSelectedMotor'],
    data() {
        return {
            showDialog: false,
            searchMotorsInput: '',
            motorsTablePage: 1,
            motorsPageLength: 0,
            motorsToPageSize: 8,
            currentSortDir: "asc",
            sortedColumnName: "name",
            newSelectedMotorId: Number,
            newMotorName: '',
        };
    },
    mounted() {
        this.newSelectedMotorId = this.selectedMotorId;
        this.newMotorName = this.motorName;
    },
    computed: {
        motors() {
            return this.standardMotors.filter((motor) => {
                return motor.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchMotorsInput.toLowerCase()) ||
                    motor.description
                        .toString()
                        .toLowerCase()
                        .includes(this.searchMotorsInput.toLowerCase());
            })
                .sort((a, b) => {
                    let modifier = 1;
                    if (this.currentSortDir === "desc") modifier = -1;
                    if (a[this.sortedColumnName] < b[this.sortedColumnName])
                        return -1 * modifier;
                    if (a[this.sortedColumnName] > b[this.sortedColumnName])
                        return 1 * modifier;
                    return 0;
                })
                .filter((row, index, array) => {
                    let motorsPageLength = Math.ceil(
                        array.length / this.motorsToPageSize
                    );
                    this.setMotorsPageLength(motorsPageLength);

                    let start = (this.motorsTablePage - 1) * this.motorsToPageSize;
                    let end = this.motorsTablePage * this.motorsToPageSize;
                    if (index >= start && index < end) return true;
                });
        },
    },
    methods: {
        sortMotors(columnName) {
            if (columnName === this.sortedColumnName) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.sortedColumnName = columnName;
        },
        setMotorsPageLength(motorsPageLength) {
            this.motorsPageLength = motorsPageLength;
        },
        cancel() {
            this.showDialog = false;
        },
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                let motorData = this.standardMotors.find((m) => m.id == this.newSelectedMotorId)
                this.$emit('changeSelectedMotor', { mech_motor_id: this.mechMotorId, motorName: this.newMotorName, motorData: motorData });
                this.showDialog = false;
            }
        }
    }
}
</script>