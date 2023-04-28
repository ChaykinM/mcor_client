<template>
    <v-card>
        <v-card-title class="pa-0">
            <v-toolbar color="primary">
                <v-toolbar-title>
                    Обозреватель манипуляционных механизмов
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-table>
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Название </th>
                        <th> Описание </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="mech in mechanisms" :key="mech">
                        <td>{{ mech.id }}</td>
                        <td>{{ mech.name }}</td>
                        <td>{{ mech.description }}</td>
                        <td>
                            <div class="d-flex justify-end">
                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="deep-purple-darken-1" v-bind="props" class="mx-2">
                                            <v-icon size="32">mdi-sign-text </v-icon>
                                            <MechanismConfig :mech_id="mech.id" :mech_name="mech.name"
                                                :mech_description="mech.description" :struct-img-url="mech.struct_img_url" :configs="mech.configs" />
                                        </v-btn>
                                    </template>
                                    <span>Конфигурация</span>
                                </v-tooltip>

                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="indigo-darken-1" class="mx-2" v-bind="props">
                                            <v-icon size="32">mdi-widgets-outline</v-icon>
                                            <MechanismComponents :mech_id="mech.id" :mech-motors="mech.motors" />
                                        </v-btn>
                                    </template>
                                    <span>Компоненты</span>
                                </v-tooltip>

                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="light-blue-darken-3" class="mx-2" v-bind="props">
                                            <v-icon size="32">mdi-file-document-edit-outline</v-icon>
                                            <MechanismParams :mech_id="mech.id" :mech-motors="mech.motors" />
                                        </v-btn>
                                    </template>
                                    <span>Параметры</span>
                                </v-tooltip>

                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="green-darken-3" class="mx-2" v-bind="props">
                                            <v-icon size="32">mdi-vector-curve</v-icon>
                                            <MechanismTrajectories :mech-type="mech.type" :trajectories="mech.trajectories"  />
                                        </v-btn>
                                    </template>
                                    <span>Моделирование траектория</span>
                                </v-tooltip>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
</template>

<script>
import MechanismConfig from '@/components/account/Mechanisms/MechanismConfig.vue';
import MechanismComponents from '@/components/account/Mechanisms/MechanismComponents.vue';
import MechanismParams from '@/components/account/Mechanisms/MechanismParams.vue';
import MechanismTrajectories from '@/components/account/Mechanisms/MechanismTrajectories.vue';

export default {
    name: "MechanismsObserve",
    props: {
        mechanisms: Array,
    },
    emits: [],
    data() {
        return {
        };
    },
    components: { MechanismConfig, MechanismComponents, MechanismParams, MechanismTrajectories },
}
</script>