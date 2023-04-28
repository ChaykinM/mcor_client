<template>
    <v-dialog v-model="showDialog" activator="parent" fullscreen :scrim="false" transition="dialog-bottom-transition"
        scrollable>
        <v-card>
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Обозреватель траекторий механизма
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close()"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="searchTrajInput" hide-details="true" label="Поиск по траектория"
                    append-inner-icon="mdi-magnify"></v-text-field>
                <v-table v-if="trajectories.length != 0">
                    <thead>
                        <tr>
                            <th width="5%"></th>
                            <th v-on:click="sortTrajectories('id')" width="5%">ID
                                <v-icon v-if="sortedColumnName == 'id'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortTrajectories('mech_config_id')" width="5%">Id конфигурации
                                <v-icon v-if="sortedColumnName == 'mech_config_id'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortTrajectories('time')" width="15%">Время
                                <v-icon v-if="sortedColumnName == 'time'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortTrajectories('name')" width="20%">Название
                                <v-icon v-if="sortedColumnName == 'name'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortTrajectories('description')">Описание
                                <v-icon v-if="sortedColumnName == 'description'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th width="10%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="trajectory in getTrajectories" :key="trajectory.id" style="cursor: pointer">
                            <td>
                                <v-checkbox-btn v-model="selectedTrajId" :value="trajectory.id"
                                    @update:model-value="changeSelectedTrajId" class="center">
                                </v-checkbox-btn>
                            </td>
                            <td>{{ trajectory.id }}</td>
                            <td>{{ trajectory.mech_config_id }}</td>
                            <td>{{ trajectory.time }}</td>
                            <td>{{ trajectory.name }}</td>
                            <td>{{ trajectory.description }}</td>
                            <td>
                                <div class="d-flex justify-end">
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-btn @click="selectedTrajId == trajectory.id ?  changeSelectedTrajId(-1) : changeSelectedTrajId(trajectory.id)" color="deep-purple-darken-3" class="mx-2" v-bind="props">
                                                <v-icon size="32">{{ selectedTrajId == trajectory.id ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}}</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Визуализировать</span>
                                    </v-tooltip>
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="green-darken-3" class="mx-2" v-bind="props">
                                                <v-icon size="32">mdi-download</v-icon>
                                                <SaveTrajectoryToFileDlg :trajectory="trajectory" />
                                            </v-btn>
                                        </template>
                                        <span>Импортировать в файл</span>
                                    </v-tooltip>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <v-alert v-else>
                    Нет добавленных траекторий
                </v-alert>
                <div v-if="trajPageLength > 1" class="text-center">
                    <v-pagination v-model="trajTablePage" :length="trajPageLength"></v-pagination>
                </div>
                <TrajectoryVisualize v-if="selectedTrajId != -1" :template="templates[mechType]"
                    :dkt_points="getVisualizeTrajectory.dkt_points" :dkt_polinom="getVisualizeTrajectory.dkt_polinom"
                    :ikt_points="getVisualizeTrajectory.ikt_points" :ikt_polinom="getVisualizeTrajectory.ikt_polinom" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import SaveTrajectoryToFileDlg from '@/components/account/Kinematics/SaveTrajectoryToFileDlg.vue';
import TrajectoryVisualize from '@/components/account/Kinematics/TrajectoryVisualize.vue';

export default {
    name: "MechanismTrajectories",
    props: {
        mechType: {
            type: String,
            required: true,
        },
        trajectories: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            showDialog: false,
            searchTrajInput: '',
            selectedTrajId: -1,
            sortedColumnName: 'current',
            currentSortDir: 'desc',
            trajTablePage: 1,
            trajPageLength: 0,
            trajToPageSize: 8,
        };
    },
    components: { TrajectoryVisualize, SaveTrajectoryToFileDlg },
    computed: {
        templates() {
            return this.$store.getters["MechanismsModule/GET_MECH_COORD_TEMPLATES"];
        },
        getTrajectories() {
            let sortedTrajectories = this.trajectories.filter((trajectory) => {
                return trajectory.name.toString().toLowerCase().includes(this.searchTrajInput.toLowerCase()) ||
                    trajectory.description.toString().toLowerCase().includes(this.searchTrajInput.toLowerCase())
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
                    let trajPageLength = Math.ceil(
                        array.length / this.trajToPageSize
                    );
                    this.setTrajectoriesPageLength(trajPageLength); // задали количество страниц исходя из текущего количества элементов

                    let start = (this.trajTablePage - 1) * this.trajToPageSize;
                    let end = this.trajTablePage * this.trajToPageSize;
                    if (index >= start && index < end) return true;
                });

            return sortedTrajectories;
        },
        getVisualizeTrajectory() {
            return {
                dkt_points: JSON.parse(this.trajectories.find((t) => t.id == this.selectedTrajId).dkt_point),
                dkt_polinom: JSON.parse(this.trajectories.find((t) => t.id == this.selectedTrajId).dkt_polinoms),
                ikt_points: JSON.parse(this.trajectories.find((t) => t.id == this.selectedTrajId).ikt_point),
                ikt_polinom: JSON.parse(this.trajectories.find((t) => t.id == this.selectedTrajId).ikt_polinoms),
            }
        }
    },
    methods: {
        close() {
            this.showDialog = false;
        },
        changeSelectedTrajId(selectedTrajId) {
            if (selectedTrajId) {
                this.selectedTrajId = selectedTrajId;
            } else {
                this.selectedTrajId = -1;
            }
        },
        sortTrajectories(columnName) {
            if (columnName === this.sortedColumnName) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.sortedColumnName = columnName;
        },
        setTrajectoriesPageLength(trajPageLength) {
            this.trajPageLength = trajPageLength;
        },
    },
}
</script>

 