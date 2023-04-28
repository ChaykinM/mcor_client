<template>
    <v-container>
        <v-sheet color="rgba(0,0,0,0)" class="d-flex align-center" height="80vh">
            <RegisterForm />
        </v-sheet>
    </v-container>
</template>

<script>
import RegisterForm from "@/components/auth/RegisterForm.vue";

export default {
    name: "RegisterPage",
    data() {
        return {};
    },
    components: { RegisterForm },
}

</script>