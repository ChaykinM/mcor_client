<template>
    <div>
        <v-autocomplete v-model="selectedMotor" :items="selectedMechMotors" item-title="name" item-value="mech_motor_id"
            label="Выбор привода"></v-autocomplete>
        <div v-if="selectedMotor != ''">
            <v-text-field hide-details="true" v-model="searchParamsInput" label="Поиск по параметрам"
                append-inner-icon="mdi-magnify"></v-text-field>
            <v-table v-if="motorParams.length != 0">
                <thead>
                    <tr>
                        <th>
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-vertical" variant="flat" v-bind="props"></v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="selectAllParamsOnPage()">
                                        <template v-slot:prepend>
                                            <v-icon icon="mdi-checkbox-marked"></v-icon>
                                        </template>
                                        <v-list-item-title> Выбрать все на странице</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="selectAllParams()">
                                        <template v-slot:prepend>
                                            <v-icon icon="mdi-checkbox-multiple-marked"></v-icon>
                                        </template>
                                        <v-list-item-title> Выбрать все параметры</v-list-item-title>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                    <v-list-item @click="clearSelectParams()">
                                        <template v-slot:prepend>
                                            <v-icon icon="mdi-delete-outline"></v-icon>
                                        </template>
                                        <v-list-item-title> Отменить выбор </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </th>
                        <th v-on:click="sortParams('name')">Имя <v-icon v-if="sortedColumnName == 'name'"
                            :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                        <th v-on:click="sortParams('tag')">Идентификатор <v-icon v-if="sortedColumnName == 'tag'"
                            :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                        <th v-on:click="sortParams('description')">Описание <v-icon v-if="sortedColumnName == 'description'"
                            :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="param in params" :key="param.mech_motor_param_id">
                        <td>
                            <v-checkbox-btn v-model="selectedParams"
                                :value="{ mech_motor_id: selectedMotor, param_id: param.param_data.param_id }" class="center">
                            </v-checkbox-btn>
                        </td>
                        <td>{{ param.param_data.name }}</td>
                        <td>{{ param.param_data.tag }}</td>
                        <td>{{ param.param_data.description }}</td>
                    </tr>
                </tbody>
            </v-table>
            <v-alert v-else type="error" color="red-darken-4" variant="flat" class="ma-2">
                Нет доступных параметров для контроля. Выберите другой привод или добавьте параметры для
                контроля в обозревателе механизмов.
            </v-alert>
        </div>
        <v-alert v-else type="error" color="red-darken-4" variant="flat" class="ma-2">
            Выберите привод для контроля параметров
        </v-alert>

        <div v-if="paramsPageLength > 1" class="text-center">
            <v-pagination v-model="paramsTablePage" :length="paramsPageLength"></v-pagination>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="onSendSelectedParams" variant="flat" color="indigo-darken-2" prepend-icon="mdi-eye-check"> Следить
            </v-btn>
        </v-card-actions>
    </div>
</template>
<script>
export default {
    name: "SelectMechParamsForControl",
    props: {
        selectedMechMotors: {
            type: Array, 
            required: true,             
        }
    },
    emits: ['sendSelectedParams'],
    data() {
        return {
            selectedMotor: "",
            selectedParams: [],
            paramsTablePage: 1,
            paramsPageLength: 0,
            paramsToPageSize: 10,
            searchParamsInput: '',
            currentSortDir: "asc",
            sortedColumnName: "name",
        };
    },
    watch: {
        selectedMechMotors() {
            this.selectedMotor = ''; 
        }, 
    }, 
    computed: {
        motorParams() {
            let params = [];
            if (this.selectedMotor != "") {
                let motor = this.selectedMechMotors.find((m) => { return m.mech_motor_id === this.selectedMotor });
                console.log(motor)
                if (motor != undefined && motor.params != null) {
                    params = motor.params;
                }
            }

            return params;
        },

        params() {
            let params = this.motorParams.filter((param) => {
                return param.param_data.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchParamsInput.toLowerCase()) ||
                    param.param_data.tag
                        .toString()
                        .toLowerCase()
                        .includes(this.searchParamsInput.toLowerCase());
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
                    let paramsPageLength = Math.ceil(
                        array.length / this.paramsToPageSize
                    );
                    this.setparamsPageLength(paramsPageLength); // задали количество страниц исходя из текущего количества элементов

                    let start = (this.paramsTablePage - 1) * this.paramsToPageSize;
                    let end = this.paramsTablePage * this.paramsToPageSize;
                    if (index >= start && index < end) return true;
                });

            return params;
        }
    },

    methods: {
        sortParams(columnName) {
            if (columnName === this.sortedColumnName) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.sortedColumnName = columnName;
        },

        setparamsPageLength(paramsPageLength) {
            this.paramsPageLength = paramsPageLength;
        },

        selectAllParamsOnPage() {
            this.params.map(p => {
                if (this.selectedParams.findIndex(sp => sp.mech_motor_id == this.selectedMotor && sp.param_id == p.param_data.param_id) == -1) {
                    this.selectedParams.push({mech_motor_id: this.selectedMotor, param_id: p.param_data.param_id})
                }
            })
        },

        selectAllParams() {

            this.motorParams.map(p => {
                // { mech_motor_id: selectedMotor, param_id: param.param_id }
                if (this.selectedParams.findIndex(sp => sp.mech_motor_id == this.selectedMotor && sp.param_id == p.param_data.param_id) == -1) {
                    this.selectedParams.push({mech_motor_id: this.selectedMotor, param_id: p.param_data.param_id})
                }
            })
        },

        clearSelectParams() {
            // отменить выбор параметров конкретного мотора или всех параметров для всех моторов? 
            this.selectedParams = [];
        },

        onSendSelectedParams() {
            this.$emit('sendSelectedParams', this.selectedParams);
        }
    }
}
</script>