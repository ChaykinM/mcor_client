<template>
    <v-dialog v-model="showDialog" activator="parent">
        <v-card width="600px">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                <v-toolbar-title>
                    Редактировать пароль пользователя
                </v-toolbar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>
                </template>
            </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-text-field v-model.trim="newPassword"
                        :rules="[v => !!v || 'Обязательное поле']" label="Новый пароль" type="password">
                    </v-text-field>
                    <v-text-field v-model.trim="repeatPassword"
                        :rules="[v => !!v || 'Обязательное поле',
                                 v => (v && v == newPassword) || 'Пароли должны совпадать']" label="Повторите пароль" type="password">
                    </v-text-field>
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
    name: "ChangeUserPassword",
    props: {
        userId: {
            type: Number, 
            required: true, 
        }
    },
    emits: ["changePassword"], 
    data() {
        return {
            showDialog: false, 
            newPassword: '',
            repeatPassword: '', 
        };
    },
    methods: {
        async save() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit('changePassword', {
                    id: this.userId, 
                    password: this.newPassword, 
                });
                this.showDialog = false; 
                this.newPassword = '';
                this.repeatPassword = '';  
            }
        }
    }
}
</script>