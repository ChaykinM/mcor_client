<template>
    <v-dialog v-model="showDialog" activator="parent" fullscreen :scrim="false" transition="dialog-bottom-transition"
        scrollable>
        <v-card>
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Конфигурация механизма
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close()"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form>
                    <v-text-field v-model.trim="mechNameLocal" :label="'Название механизма'" readonly></v-text-field>
                    <v-textarea v-model.trim="mechDescriptionLocal" :label="'Описание механизма'"></v-textarea>
                    <div class="d-flex justify-end">
                    <v-btn variant="flat" color="indigo-darken-2" @click="editMechInfo">Сохранить</v-btn>
                    </div>
                </v-form>
                <v-divider class="ma-2"></v-divider>

                <v-text-field v-model="searchConfigInput" hide-details="true" label="Поиск по истории наблюдений"
                    append-inner-icon="mdi-magnify"></v-text-field>

                <v-table>
                    <thead>
                        <tr>
                            <th v-on:click="sortConfigs('id')" width="5%">ID <v-icon v-if="sortedColumnName == 'id'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortConfigs('name')" width="25%">Название <v-icon
                                    v-if="sortedColumnName == 'name'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortConfigs('description')" width="40%">Описание <v-icon
                                    v-if="sortedColumnName == 'description'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortConfigs('type')" width="10%">Тип <v-icon
                                    v-if="sortedColumnName == 'type'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th v-on:click="sortConfigs('current')" width="10%">Статус <v-icon
                                    v-if="sortedColumnName == 'current'"
                                    :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                            </th>
                            <th width="15%">
                                <div class="d-flex justify-center">
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="deep-purple-darken-1" class="mx-2" v-bind="props">
                                                <v-icon size="32">mdi-plus</v-icon>
                                                <MechanismConfigAdd :struct-img-url="structImgUrl" :standard-mech-config="getStandardConfig" @add-config="onAddConfig"/>
                                            </v-btn>
                                        </template>
                                        <span>Добавить новую</span>
                                    </v-tooltip>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="config in sortedConfigs" :key="config.id">
                            <td>{{ config.id }}</td>
                            <td>{{ config.name }}</td>
                            <td>{{ config.description }}</td>
                            <td>{{ config.type == 'standard' ? 'Стандартная' : 'Пользовательская' }}</td>
                            <td>{{ config.current ? 'Текущая' : 'Архивная' }}</td>
                            <td>
                                <div class="d-flex justify-center">
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="green-darken-3" class="mx-2" v-bind="props" @click="setActiveMechConfig(config.id)">
                                                <v-icon size="32">mdi-check</v-icon>
                                            </v-btn>
                                        </template>
                                        <span> Сделать текущей </span>
                                    </v-tooltip>

                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="indigo-darken-4" class="mx-2" v-bind="props">
                                                <v-icon size="32">mdi-pencil</v-icon>
                                                <MechanismConfigEdit  :struct-img-url="structImgUrl" :mech-config="config"
                                                    @edit-config="onEditConfig" />
                                            </v-btn>
                                        </template>
                                        <span> Редакировать </span>
                                    </v-tooltip>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <div v-if="configsPageLength > 1" class="text-center">
                    <v-pagination v-model="configsTablePage" :length="configsPageLength"></v-pagination>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

<NoticeDialog :show="noticeDialog.show" :type="noticeDialog.type" :message="noticeDialog.msg" @notice-dlg-close="onNoticeDlgClose"/>
</template>

<script>
import MechanismConfigAdd from '@/components/account/Mechanisms/MechanismConfigAdd.vue';
import MechanismConfigEdit from '@/components/account/Mechanisms/MechanismConfigEdit.vue';
import NoticeDialog from '@/components/account/NoticeDialog.vue';

export default {
    name: "MechanismConfig",
    props: {
        mech_id: {
            type: [String, Number],
            required: true
        },
        mech_name: {
            type: String,
            required: true
        },
        mech_description: {
            type: String,
            required: true
        },
        structImgUrl: {
            type: String,
            required: true
        },
        configs: {
            type: Array,
            required: true,
        }
    },

    data() {
        return {
            showDialog: null,
            searchConfigInput: '',
            sortedColumnName: 'current',
            currentSortDir: 'desc',
            configsTablePage: 1,
            configsPageLength: 0,
            configsToPageSize: 8,
            mechNameLocal: '',
            mechDescriptionLocal: '',
            configsLocal: [],
            noticeDialog: {
                show: false, 
                type: 'notice',
                msg: '', 
            }
        };
    },
    components: { MechanismConfigAdd, MechanismConfigEdit, NoticeDialog },

    mounted() {
        this.mechNameLocal = this.mech_name.slice();
        this.mechDescriptionLocal = this.mech_description.slice();
        this.configsLocal = this.configs;
    },

    computed: {
        sortedConfigs() {
            let sortedConfigs = this.configsLocal.filter((config) => {
                return config.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchConfigInput.toLowerCase());
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
                    let configsPageLength = Math.ceil(
                        array.length / this.configsToPageSize
                    );
                    this.setConfigsPageLength(configsPageLength); // задали количество страниц исходя из текущего количества элементов

                    let start = (this.configsTablePage - 1) * this.configsToPageSize;
                    let end = this.configsTablePage * this.configsToPageSize;
                    if (index >= start && index < end) return true;
                });

            return sortedConfigs;
        },
        getStandardConfig() {
            return this.configsLocal.find((config) => config.type == 'standard');
        }
    },
    methods: {
        editMechInfo() {
            let mechanismInfo = {
                id: this.mech_id,
                name: this.mechNameLocal,
                description: this.mechDescriptionLocal
            };

            this.$store.dispatch("MechanismsModule/onEditMechanismInfo", { mechanismInfo: mechanismInfo }).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.msg = 'Информация о манипуляционном механизме была успешно отредактирована';
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.msg = `При редактировании информации о манипуляционном механизме возникла ошибка: ${error}`; 
                }
            )
        },

        onAddConfig(config) {
            this.$store.dispatch("MechanismsModule/onAddMechanismConfig", { mech_id: this.mech_id, config: config }).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'notice';
                    this.noticeDialog.msg = 'Конфигурация манипуляционного механизма была успешно добавлена';
                },
                (error) => {
                    alert(error);
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'error';
                    this.noticeDialog.msg = `При добавлении конфигурации манипуляционного механизма возникла ошибка: ${error}`;
                }
            )
        }, 

        setActiveMechConfig(config_id) {
            this.$store.dispatch("MechanismsModule/onSetActiveMechanismConfig", {mech_id: this.mech_id, config_id: config_id}).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'notice'; 
                    this.noticeDialog.msg = 'Конфигурация манипуляционного механизма была успешно установлена активной';  
                },
                (error) => {
                    this.noticeDialog.show = true;
                    this.noticeDialog.type = 'error'; 
                    this.noticeDialog.msg = `При установки конфигурации манипуляционного механизма активной возникла ошибка: ${error}` 
                }
            )
        }, 

        onEditConfig(config) {
            this.$store.dispatch("MechanismsModule/onEditMechanismConfig", { mech_id: this.mech_id, config: config }).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'notice'; 
                    this.noticeDialog.msg = 'Конфигурация манипуляционного механизма была успешно отредактирована'; 
                },
                (error) => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'error';                     
                    this.noticeDialog.msg = `При редактировании конфигурации манипуляционного механизма возникла ошибка: ${error}`
                }
            )
        },

        sortConfigs(columnName) {
            if (columnName === this.sortedColumnName) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.sortedColumnName = columnName;
        },

        setConfigsPageLength(configsPageLength) {
            this.configsPageLength = configsPageLength;
        },

        close() {
            this.showDialog = false;
        }, 

        onNoticeDlgClose() {
            this.noticeDialog.show = false; 
            this.noticeDialog.type = 'notice'; 
            this.noticeDialog.msg = ''; 
        }
    },
}
</script>