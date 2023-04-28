<template>
    <v-container>
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title>Электронно-компонентная база</v-toolbar-title>
                <v-spacer></v-spacer>
                <template v-slot:extension>
                    <v-tabs v-model="tabActive" centered>
                        <v-tab :value="'motors'">
                            Приводы
                        </v-tab>
                        <v-tab :value="'encoders'">
                            Датчики
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>

            <v-window v-model="tabActive">
                <v-window-item :value="'motors'">
                    <MotorsBase :motors="motors" />
                </v-window-item>
                <v-window-item :value="'encoders'">
                    <EncodersBase :encoders="encoders" />
                </v-window-item>
            </v-window>
        </v-card>
    </v-container>
</template>

<script>
import EncodersBase from "@/components/account/Components/EncodersBase.vue";
import MotorsBase from "@/components/account/Components/MotorsBase.vue";

export default {
    name: "ComponentBaseView",
    data() {
        return {
            motors: [],
            encoders: [],
            error: '',
            tabActive: 'motors',
        };
    },
    components: {
        MotorsBase,
        EncodersBase
    },
    mounted() {
        this.$store.dispatch("ComponentsModule/onGetMotors").then(
            () => {
                this.motors = this.$store.getters["ComponentsModule/GET_MOTORS"];
            },
            (error) => {
                this.error = error;
                alert(error);
            }
        );

        this.$store.dispatch("ComponentsModule/onGetEncoders").then(
            () => {
                this.encoders = this.$store.getters["ComponentsModule/GET_ENCODERS"];
            },
            (error) => {
                this.error = error;
                alert(error);
            }
        );
    },
}
</script>