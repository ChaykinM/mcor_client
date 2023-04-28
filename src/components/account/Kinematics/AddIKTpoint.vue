<template>
    <v-dialog v-model="showDialog" activator="parent" scrollable persistent>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Добавить обобщённую координату
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field v-for="coord in template" :key="coord.id" v-model="point[coord.tag]"
                        :label="`${coord.tag}, ${coord.dimension}`" type="number" step="0.1" :rules="rules"
                        required></v-text-field>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="close">
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
    name: "AddIKTpoint",
    props: {
        template: {
            type: Array,
            required: true,
        }
    },
    emits: ['addPoint'],
    data() {
        return {
            showDialog: false,
            rules: [
                value => {
                    if (/^[+-]?\d+(\.\d+)?$/.test(value)) return true

                    return 'В поле должно быть число'
                }
            ],
            point: {}
        }
    },
    mounted() {
        let tags = this.template.map((c) => c.tag);
        for (let tag of tags) {
            this.point[tag] = null;
        }
    },
    methods: {
        close() {
            this.showDialog = false;
        },
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit("addPoint", JSON.parse(JSON.stringify(this.point)));
                this.showDialog = false;
                for (let tag of Object.keys(this.point)) {
                    this.point[tag] = null;
                }
            }
        }
    }

}
</script>