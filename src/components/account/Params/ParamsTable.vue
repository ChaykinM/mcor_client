<template>
    <v-card>
        <v-card-title class="pa-0">
            <v-toolbar color="primary">
                <v-toolbar-title>Параметры для контроля</v-toolbar-title>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-select :items="paramsTypes" item-title="title" item-value="id" v-model="selectedParamsType" class="mt-2"
                label="Тип параметров"></v-select>
            <v-text-field hide-details="true" v-model="searchParamsInput" label="Поиск по параметрам"
                append-inner-icon="mdi-magnify"></v-text-field>

            <v-alert v-if="paramsTypes.find(p => p.id == selectedParamsType).loadingError != ''" type="error" color="red-darken-4" variant="flat">
                Ошибка загрузка списка параметров!
            </v-alert>
            <v-table v-else>
                <thead>
                    <tr>
                        <th v-on:click="sortParams('name')" width="25%">Название <v-icon v-if="sortedColumnName == 'name'"
                                :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                        </th>
                        <th v-on:click="sortParams('tag')" width="25%">Идентификатор <v-icon
                                v-if="sortedColumnName == 'tag'"
                                :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                        </th>
                        <th v-on:click="sortParams('description')" width="25%">Описание <v-icon
                                v-if="sortedColumnName == 'description'"
                                :icon="currentSortDir === 'desc' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="param in params" :key="param">
                        <td width="20%"> {{ param.name }}</td>
                        <td width="20%"> {{ param.tag }}</td>
                        <td width="50%"> {{ param.description }}</td>
                        <td>
                            <div class="d-flex justify-end">
                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="indigo-darken-4" v-bind="props" class="mx-2">
                                            <v-icon size="32">mdi-pencil</v-icon>
                                            <EditParamControl :param-type-id="selectedParamsType" :param="param"
                                                @edit-param="onEditParam" />
                                        </v-btn>
                                    </template>
                                    <span>Редактировать параметр</span>
                                </v-tooltip>

                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="red-darken-4" v-bind="props" class="mx-2">
                                            <v-icon size="32">mdi-delete-sweep</v-icon>
                                            <DeleteParamControl :param-id="param.param_id"
                                                :param-type-id="selectedParamsType" @delete-param="onDeleteParam" />
                                        </v-btn>
                                    </template>
                                    <span>Удалить параметр</span>
                                </v-tooltip>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div v-if="paramsPageLength > 1" class="text-center">
                <v-pagination v-model="paramsTablePage" :length="paramsPageLength"></v-pagination>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="indigo-darken-2" prepend-icon="mdi-plus">
                    Добавить новый
                    <AddParamControl :param-type-id="selectedParamsType" @add-param="onAddParam" />
                </v-btn>
            </v-card-actions>
        </v-card-text>
    </v-card>

    <NoticeDialog :show="noticeDialog.show" :type="noticeDialog.type" :message="noticeDialog.msg"
        @notice-dlg-close="onNoticeDlgClose" />
</template>

<script>
import AddParamControl from '@/components/account/Params/AddParamControl.vue';
import EditParamControl from '@/components/account/Params/EditParamControl.vue';
import DeleteParamControl from './DeleteParamControl.vue';
import NoticeDialog from '@/components/account/NoticeDialog.vue';

export default {
    name: "ParamsTable",
    props: {
        paramsTypes: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            showDelParamDlg: false,
            selectedParamsType: 1,
            paramsTablePage: 1,
            paramsPageLength: 0,
            paramsToPageSize: 10,
            searchParamsInput: '',
            currentSortDir: "asc",
            sortedColumnName: "time",
            noticeDialog: {
                show: false,
                type: 'notice',
                msg: '',
            }
        }
    },
    components: {
        EditParamControl,
        AddParamControl,
        DeleteParamControl,
        NoticeDialog,
    },
    computed: {
        params() {
            let params = this.paramsTypes.find(p => p.id == this.selectedParamsType).params.filter((param) => {
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

        onEditParam(request) {
            if (request.paramTypeId == 1) {
                this.$store.dispatch("ParamsModule/onEditParam", { paramData: request.paramData }).then(
                    () => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'notice';
                        this.noticeDialog.msg = 'Параметр механизма был успешно отредактирован';
                    },
                    (error) => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = `При редактировании параметра механизма возникла ошибка: ${error}`;
                    }
                )
            } else if (request.paramTypeId == 2) {
                this.$store.dispatch("ParamsModule/onEditCustomParam", { paramData: request.paramData }).then(
                    () => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'notice';
                        this.noticeDialog.msg = 'Параметр для дополнительных наблюдений был успешно отредактирован';
                    },
                    (error) => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = `При редактировании параметра для дополнительных наблюдений возникла ошибка: ${error}`;
                    }
                )
            }
        },

        onDeleteParam(request) {
            if (request.paramTypeId == 1) {
                this.$store.dispatch("ParamsModule/onDeleteParam", { param_id: request.paramId }).then(
                    () => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'notice';
                        this.noticeDialog.msg = 'Параметр механизма был успешно удален';
                    },
                    (error) => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = `При удалении параметра механизма возникла ошибка: ${error}`;
                    }
                )
            } else if (request.paramTypeId == 2) {
                this.$store.dispatch("ParamsModule/onDeleteCustomParam", { param_id: request.paramId }).then(
                    () => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'notice';
                        this.noticeDialog.msg = 'Параметр для дополнительных наблюдений был успешно удален';
                    },
                    (error) => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = `При удалении параметра для дополнительных наблюдений возникла ошибка: ${error}`;
                    }
                )
            }
        },

        onAddParam(request) {
            if (request.paramTypeId == 1) {
                this.$store.dispatch("ParamsModule/onAddParam", { paramData: request.paramData }).then(
                    () => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'notice';
                        this.noticeDialog.msg = 'Параметр механизма был успешно добавлен';
                    },
                    (error) => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = `При добавлении параметра механизма возникла ошибка: ${error}`;
                    }
                )
            } else if (request.paramTypeId == 2) {
                this.$store.dispatch("ParamsModule/onAddCustomParam", { paramData: request.paramData }).then(
                    () => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'notice';
                        this.noticeDialog.msg = 'Параметр для дополнительных наблюдений был успешно добавлен';
                    },
                    (error) => {
                        this.noticeDialog.show = true;
                        this.noticeDialog.type = 'error';
                        this.noticeDialog.msg = `При добавлении параметра для дополнительных наблюдений возникла ошибка: ${error}`;
                    }
                )
            }
        },

        onNoticeDlgClose() {
            this.noticeDialog.show = false;
            this.noticeDialog.type = 'notice';
            this.noticeDialog.msg = '';
        }

    }
}
</script>