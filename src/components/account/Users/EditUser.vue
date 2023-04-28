<template>
    <v-dialog v-model="showDialog" activator="parent">
        <v-card width="600px">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    Редактировать пользователя
                </v-toolbar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                </template>
            </v-toolbar>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field v-model.trim="userLocal.login" :rules="[v => !!v || 'Обязательное поле']"
                        label="Логин">
                    </v-text-field>
                    <v-text-field v-model.trim="userLocal.email" :rules="[v => !!v || 'Обязательное поле']"
                        label="Почта">
                    </v-text-field>
                    <v-select :items="statuses" v-model="userLocal.status" label="Статус">
                    </v-select>
                </v-form>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" @click="showDialog = false">Отмена</v-btn>
                    <v-btn variant="flat" color="indigo-darken-2" @click="save()"> Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "EditUser",
    props: {
        user: {
            type: Object, 
            required: true
        }
    },
    emits: ["editUser"], 
    data() {
        return {
            showDialog: false, 
            userLocal: {},
            statuses: ['observer', 'developer', 'admin'],
        }
    },
    mounted() {
        this.userLocal = JSON.parse(JSON.stringify(this.user)); 
    },
    methods: {
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit("editUser", this.userLocal); 
                this.showDialog = false; 
            }
        }
    }
}
</script>