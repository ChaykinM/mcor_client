<template>
    <v-card>
        <v-card-title class="pa-0">
            <v-toolbar color="primary">
                <v-toolbar-title>Дополнительные параметры</v-toolbar-title>                 
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-text-field hide-details="true" v-model="searchParamsInput" label="Поиск по параметрам"
                append-inner-icon="mdi-magnify" class="mt-2"></v-text-field>
            <v-table>
                <thead>
                    <tr>
                        <th width="10%">
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
                        <th v-on:click="sortParams('name')" width="25%">Название <v-icon v-if="sortedColumnName == 'name'"
                                :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                        <th v-on:click="sortParams('tag')" width="25%">Идентификатор <v-icon
                                v-if="sortedColumnName == 'tag'"
                                :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>

                        <th v-on:click="sortParams('description')" width="40%">Описание <v-icon
                                v-if="sortedColumnName == 'description'"
                                :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="param in params" :key="param">
                        <td>
                            <v-checkbox-btn v-model="selectedParams" :value="param.tag" class="center">
                            </v-checkbox-btn>
                        </td>
                        <td>{{ param.name }}</td>
                        <td>{{ param.tag }}</td>
                        <td>{{ param.description }}</td>
                    </tr>
                </tbody>
            </v-table>
            <div v-if="paramsPageLength > 1" class="text-center">
                <v-pagination v-model="paramsTablePage" :length="paramsPageLength"></v-pagination>
            </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="indigo-darken-2" prepend-icon="mdi-eye-check"
                @click="$emit('sendSelectedCustomParams', selectedParams)"
                :disabled="selectedParams.length != 0 ? false : true">Следить</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "SelectCustomParams",
    props: {
        customParams: Array,
    },
    emits: ["sendSelectedCustomParams"],
    data() {
        return {
            selectedParams: [],
            paramsTablePage: 1,
            paramsPageLength: 0,
            paramsToPageSize: 10,
            searchParamsInput: '',
            currentSortDir: "asc",
            sortedColumnName: "name",
        };
    },
    computed: {
        params() {
            let params = this.customParams.filter((param) => {
                return param.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchParamsInput.toLowerCase()) ||
                    param.tag
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
                if (this.selectedParams.indexOf(p.tag) == -1) {
                    this.selectedParams.push(p.tag)
                }
            })
        },

        selectAllParams() {
            this.customParams.map(p => {
                if (this.selectedParams.indexOf(p.tag) == -1) {
                    this.selectedParams.push(p.tag)
                }
            })
        },

        clearSelectParams() {
            this.selectedParams = [];
        },



    }
}
</script>