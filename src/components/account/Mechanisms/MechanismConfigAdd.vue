<template>
    <v-dialog v-model="showDialog" activator="parent" persistent scrollable>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Добавить конфигурацию механизма
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field :rules="[v => !!v || 'Обязательное поле']" v-model.trim="standardMechConfigLocal.name"
                        :label="'Название конфигурации'"></v-text-field>
                    <v-textarea :rules="[v => !!v || 'Обязательное поле']" v-model.trim="standardMechConfigLocal.description"
                        :label="'Описание конфигурации'"></v-textarea>
                </v-form>
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            Структурная схема
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-img :src="structImgUrl"></v-img>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-table>
                    <thead>
                        <tr>
                            <th>Идентификатор</th>
                            <th>Описание</th>
                            <th>Значение</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="configParam in standardMechConfigLocal.config_params" :key="configParam.id">
                            <td>{{ configParam.tag }}</td>
                            <td>{{ configParam.description }}</td>
                            <td>{{ configParam.value }}</td>
                            <td>
                                <div class="d-flex justify-end">

                                    <v-btn color="indigo-darken-4" class="mx-2">
                                        <v-icon size="32">mdi-pencil</v-icon>
                                        <MechanismConfigParamEdit :config="configParam"
                                            @edit-config-param="onEditConfigParam" />
                                    </v-btn>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="close">
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
import MechanismConfigParamEdit from '@/components/account/Mechanisms/MechanismConfigParamEdit.vue';

export default {
    name: "MechanismConfigAdd",
    props: {
        structImgUrl: {
            type: String,
            required: true,
        },
        standardMechConfig: {
            type: Object,
            required: true
        },
    },
    emits: [
        "addConfig",
    ],
    data() {
        return {
            showDialog: null,
            showSuccessDialog: null,
            standardMechConfigLocal: {},
        };
    },
    components: { MechanismConfigParamEdit },
    mounted() {
        this.standardMechConfigLocal = JSON.parse(JSON.stringify(this.standardMechConfig));
        this.standardMechConfigLocal.type = "custom"; 
    },
    methods: {
        onEditConfigParam(configParam) {
            let index = this.standardMechConfigLocal.config_params.findIndex(p => p.id == configParam.id);
            this.standardMechConfigLocal.config_params[index] = configParam;
        },

        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit('addConfig', this.standardMechConfigLocal)
                this.showDialog = false;
            }
        },

        close() {
            this.showDialog = false;
        },
    },
}
</script> 