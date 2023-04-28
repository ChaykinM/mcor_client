<template>
    <div v-if="historySeans.length != 0">
        <v-text-field v-model="searchHistoryInput" hide-details="true" label="Поиск по истории наблюдений"
            append-inner-icon="mdi-magnify"></v-text-field>
        <v-table>
            <thead>
                <tr>
                    <th v-on:click="sortHistories('time')" width="25%">Время <v-icon v-if="sortedColumnName == 'time'"
                            :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                    <th v-on:click="sortHistories('mech_name')" width="25%">Механизм <v-icon
                            v-if="sortedColumnName == 'mech_name'"
                            :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                    <th v-on:click="sortHistories('name')" width="25%">Название <v-icon v-if="sortedColumnName == 'name'"
                            :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                    <th v-on:click="sortHistories('description')" width="25%">Описание <v-icon
                            v-if="sortedColumnName == 'description'"
                            :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="history in histories" :key="history.id">
                    <td>{{ history.time }}</td>
                    <td>{{ history.mech_name }}</td>
                    <td>{{ history.name }}</td>
                    <td>{{ history.description }}</td>
                    <td>
                        <div class="d-flex justify-end">
                            <v-tooltip location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="deep-purple-darken-3" v-bind="props" class="mx-2"
                                        @click="$emit('sendSelectedHistory', history.id)">
                                         <v-icon size="32">mdi-eye-outline</v-icon>
                                    </v-btn>
                                </template>
                                <span>Загрузить историю</span>
                            </v-tooltip>
                            <v-tooltip location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="green-darken-3" class="mx-2" v-bind="props">
                                        <v-icon size="32">mdi-download</v-icon>
                                        <HistorySaveToFile :history="history" />
                                    </v-btn>
                                </template>
                                <span>Импортировать в файл</span>
                            </v-tooltip>
                            <v-tooltip location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="indigo-darken-4" v-bind="props" class="mx-2">
                                        <v-icon size="32">mdi-pencil</v-icon>
                                        <EditHistory :history="history" @save-history="onEditHistory" />
                                    </v-btn>
                                </template>
                                <span>Редактировать историю</span>
                            </v-tooltip>

                            <v-tooltip location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="red-darken-3" v-bind="props" class="mx-2"
                                        @click="$emit('deleteHistory', history.id)">
                                        <v-icon size="32">mdi-delete-sweep</v-icon>

                                    </v-btn>
                                </template>
                                <span>Удалить историю</span>
                            </v-tooltip>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <div v-if="historiesPageLength > 1" class="text-center">
            <v-pagination v-model="historiesTablePage" :length="historiesPageLength"></v-pagination>
        </div>
    </div>
    <v-alert v-else type="error" color="red-darken-4" variant="flat">
        Нет сохранённых историй наблюдений
    </v-alert>
</template>

<script>
import EditHistory from '@/components/account/History/EditHistory.vue';
import HistorySaveToFile from '@/components/account/History/HistorySaveToFile.vue';

export default {
    name: "HistorySeansTable",
    props: {
        historySeans: {
            default: () => [],
            type: Array,
            required: true,
        },
    },
    emits: ['sendSelectedHistory', 'editHistory', 'deleteHistory'],
    data() {
        return {
            historiesTablePage: 1,
            historiesPageLength: 0,
            historiesToPageSize: 10,
            searchHistoryInput: '',
            currentSortDir: "asc",
            sortedColumnName: "time",
        };
    },
    components: { EditHistory, HistorySaveToFile },
    computed: {
        histories() {
            let histories = this.historySeans.filter((history) => {
                return history.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchHistoryInput.toLowerCase());
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
                    let historiesPageLength = Math.ceil(
                        array.length / this.historiesToPageSize
                    );
                    this.setHistoriesPageLength(historiesPageLength); // задали количество страниц исходя из текущего количества элементов

                    let start = (this.historiesTablePage - 1) * this.historiesToPageSize;
                    let end = this.historiesTablePage * this.historiesToPageSize;
                    if (index >= start && index < end) return true;
                });

            return histories;
        }
    },
    methods: {
        sortHistories(columnName) {
            if (columnName === this.sortedColumnName) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.sortedColumnName = columnName;
        },

        setHistoriesPageLength(historiesPageLength) {
            this.historiesPageLength = historiesPageLength;
        },

        onEditHistory(history) {
            this.$emit('editHistory', history);
        }
    }

}
</script>