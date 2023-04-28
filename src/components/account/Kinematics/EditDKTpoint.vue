<template>
    <v-dialog v-model="showDialog" activator="parent" scrollable>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Редактировать декартовую точку
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field v-for="coord in template" :key="coord.id" v-model="pointLocal[coord.tag]" 
                    :label="`${coord.tag}, ${coord.dimension}`" type="number" step="0.1"
                        :rules="rules" required></v-text-field>
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
    name: "EditDKTPoint",
    props: {
        template: {
            type: Object, 
            required: true, 
        }, 
        point: {
            type: Object, 
            required: true, 
        }
    },
    emits: ['editPoint'], 
    data() {
        return {
            showDialog: false, 
            rules: [
                v => !!v || 'Поле является обязательным для заполнения',
            ],
            pointLocal: {}
        }
    }, 
    mounted() {
        this.pointLocal = JSON.parse(JSON.stringify(this.point)); 
    },
    methods: {
        close() {
            this.showDialog = false; 
        }, 
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit("editPoint", this.pointLocal); 
                this.showDialog = false; 
            }
        }
    }
}
</script>