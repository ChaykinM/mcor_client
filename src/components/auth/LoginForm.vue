<template>
  <v-card class="mx-auto pa-8" elevation="8" width="448" rounded="lg">
    <v-form ref="form" v-model="valid" lazy-validation>
      <div class="text-subtitle-1 text-medium-emphasis">Логин</div>
      <v-text-field @keydown.enter.prevent="onLogin()" v-model.trim="login" density="compact" placeholder="Имя пользователя"
        prepend-inner-icon="mdi-account-outline" variant="outlined"
        :rules="[v => !!v || 'Поле является обязательным для заполнения']"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Пароль</div>
      <v-text-field @keydown.enter.prevent="onLogin()" v-model.trim="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'" density="compact" placeholder="Введите ваш пароль"
        prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
        :rules="[v => !!v || 'Поле является обязательным для заполнения']"></v-text-field>
    </v-form>

    <v-card v-if="authError != ''" class="mb-6" color="red-darken-4" variant="flat">
      <v-card-text class="text-medium-emphasis text-caption">
        {{ authError }}
      </v-card-text>
    </v-card>

    <v-btn block  color="indigo-darken-2" size="large" variant="flat" @click="onLogin">
      Авторизироваться
    </v-btn>
     
  </v-card>
</template>

<script>

export default {
  name: "LoginForm",
  data() {
    return {
      login: '',
      password: '',
      authError: '',
      valid: true,
      visible: false,
    };
  },
  methods: {
    async onLogin() {
      const { valid } = await this.$refs.form.validate()
      if (valid) {
        this.$store.dispatch('AuthModule/onLogin', { login: this.login, password: this.password }).then(
          () => {
            this.$router.go({ path: '/account/mechanisms' })
          },
          (error) => {
            this.authError = error.response.data.error;
          }
        )
      }
    },

  },
}
</script>