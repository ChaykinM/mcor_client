<template>
    <v-alert type="info" color="blue-darken-4" class="mb-2" text="Координаты траектории зависят от переменной времени t."
        variant="flat"></v-alert>
    <v-form ref="form" lazy-validation>
        <v-text-field v-model="paramTraj['T']" label="Время движения по траектории T, [сек]" type="number" step="1"
            :rules="rules" required></v-text-field>
        <v-text-field v-model="paramTraj['N']" label="Количество точек траектории N" type="number" step="1" :rules="rules"
            required></v-text-field>
        <v-text-field v-for="coord in template" :key="coord.id" v-model="paramTraj[coord.tag]"
            :label="`${coord.tag}, [${coord.dimension}]`" :rules="rules" required></v-text-field>
    </v-form>
    <v-divider></v-divider>
    <div class="d-flex justify-end" style="width: 100%;">
        <v-btn @click="solveParamTraj" color="indigo-darken-2" variant="flat" class="ma-2"> Получить декартовые
            координаты</v-btn>
    </div>
</template>

<script>
export default {
    name: "ParametricTrajectorySet",
    props: {
        template: {
            type: Array,
            required: true,
        }
    },
    emits: ['solveParamTraj'],
    data() {
        return {
            rules: [
                value => {
                    if (value) return true
                    return 'Обязательное поле'
                },
            ],
            paramTraj: {},
        }
    },
    methods: {
        async solveParamTraj() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.$emit('solveParamTraj', this.paramTraj);
            }
        }
    }
}
</script>