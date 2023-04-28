<template>
    <v-dialog v-model="showDialog" activator="parent" scrollable>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Параметр структуры
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field v-model.trim="configLocal.tag" label="Идентификатор" validate-on="input"
                        readonly required></v-text-field>
                    <v-textarea v-model.trim="configLocal.description" label="Описание" required></v-textarea>
                    <v-text-field v-model.string="configLocal.value" label="Значение" type="number" step="0.1" min="0"
                        :rules="rules" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="showDialog = false;">
                    Отмена
                </v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save()">
                    Сохранить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "MechanismConfigParamEdit",
    props: {
        config: {
            type: Object,
            required: true,
        },
    },
    emits: [
        "editConfigParam",
    ],
    data() {
        return {
            showDialog: null,
            configLocal: {},
            rules: [
                v => !!v || 'Поле является обязательным для заполнения',
            ],
        };
    },
    mounted() {
        this.configLocal = JSON.parse(JSON.stringify(this.config));
    },
    methods: {
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit("editConfigParam", this.configLocal);
                this.showDialog = false;
            }
        }
    }

}
</script>