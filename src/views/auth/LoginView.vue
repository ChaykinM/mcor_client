<template>
  <v-container >
    <v-sheet color="rgba(0,0,0,0)" class="d-flex align-center" height="80vh">
      <LoginForm/>
    </v-sheet>
  </v-container>
</template>

<script>
import LoginForm from "../../components/auth/LoginForm.vue";
export default {
  name: 'LoginPage',
  components: { LoginForm }
}
</script>