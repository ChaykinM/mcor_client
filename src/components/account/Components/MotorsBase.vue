<template>
    <v-card>
        <v-card-text>
            <v-text-field hide-details="true" v-model="searchInput" label="Поиск по приводам"
                append-inner-icon="mdi-magnify" class="mb-2"></v-text-field>
            <v-row>
                <v-alert v-if="sortedMotors.length == 0">
                    Приводов не найдено
                </v-alert>
                <v-col v-else v-for="motor in sortedMotors" :key="motor.id" :cols="4" :md="4" :lg="3">
                    <v-card class="mx-auto" >
                        <v-img cover height="250" class="align-end text-white"
                            :src="motor.img_url == '' ? '/assets/motors/default-image.jpg' : motor.img_url">
                            <v-card-title class="bg-cyan-darken-2">{{ motor.name }}
                            </v-card-title>
                        </v-img>
                        <v-card-actions>
                            <v-btn color="blue-darken-2" variant="flat">
                                Редактировать
                                <EditMotor :motor="JSON.parse(JSON.stringify(motor))" @edit-motor="onEditMotor"/> 
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-tooltip location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn :icon="showMotorsDescrions.indexOf(motor.id) > -1 ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="changeShowMotorsDescrions(motor.id)" v-bind="props"></v-btn>
                                </template>
                                <span> {{ showMotorsDescrions.indexOf(motor.id) > -1 ? 'Свернуть описание' : 'Развернуть описание' }} </span>
                            </v-tooltip>
                        </v-card-actions>

                        <v-expand-transition>
                            <div v-show="showMotorsDescrions.indexOf(motor.id) > -1">
                                <v-divider></v-divider>
                                <v-card-text>
                                    {{ motor.description }}
                                </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
            <div v-if="motorsPageLength > 1" class="text-center">
                <v-pagination v-model="motorsPage" :length="motorsPageLength"></v-pagination>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="indigo-darken-2" prepend-icon="mdi-plus">
                Добавить новый
                <AddMotor @add-motor="onAddMotor"/>
            </v-btn>
        </v-card-actions>
    </v-card>

    <NoticeDialog :show="noticeDialog.show" :message="noticeDialog.message" :type="noticeDialog.type" @notice-dlg-close="onNoticeDlgClose"/>
</template>

<script>
import AddMotor from "@/components/account/Components/AddMotor.vue"
import EditMotor from "@/components/account/Components/EditMotor.vue";
import NoticeDialog from "@/components/account/NoticeDialog.vue";

export default {
    name: "MotorsBase",
    props: {
        motors: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            motorsPage: 1,
            motorsPageLength: 0,
            motorsToPageSize: 8,
            searchInput: '',
            show: false,
            showMotorsDescrions: [], 
            noticeDialog: {
                show: false, 
                type: 'notice', 
                message: '', 
            }
        };
    },
    components: { AddMotor, EditMotor, NoticeDialog },
    computed: {
        sortedMotors() {
            return this.motors.filter((motor) => {
                return motor.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchInput.toLowerCase()) ||
                    motor.description
                        .toString()
                        .toLowerCase()
                        .includes(this.searchInput.toLowerCase());
            })
                .filter((row, index, array) => {
                    let motorsPageLength = Math.ceil(
                        array.length / this.motorsToPageSize
                    );
                    this.setMotorsPageLength(motorsPageLength); // задали количество страниц исходя из текущего количества элементов

                    let start = (this.motorsPage - 1) * this.motorsToPageSize;
                    let end = this.motorsPage * this.motorsToPageSize;
                    if (index >= start && index < end) return true;
                });
        }
    },
    methods: {
        changeShowMotorsDescrions(motor_id){
            let index = this.showMotorsDescrions.indexOf(motor_id);
            if (index > -1) {
                this.showMotorsDescrions.splice(index, 1)
            } else {
                this.showMotorsDescrions.push(motor_id); 
            }
        }, 
        setMotorsPageLength(motorsPageLength) {
            this.motorsPageLength = motorsPageLength;
        },
        onAddMotor(motorAddRequest) {
            this.$store.dispatch("ComponentsModule/onAddMotor", { motorAddRequest: motorAddRequest }).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'success'; 
                    this.noticeDialog.message = 'Новый привод был успешно добавлен'; 
                },
                (error) => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'error'; 
                    this.noticeDialog.message = `При добавлении привода возникла ошибка: ${error}`;  
                }
            )
        },
        onEditMotor(motorEditRequest) {
            this.$store.dispatch("ComponentsModule/onEditMotor", { motorEditRequest: motorEditRequest }).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'success'; 
                    this.noticeDialog.message = 'Данные привода были успешно отредактированы'; 
                }, 
                (error) => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'error'; 
                    this.noticeDialog.message = `При редактировании информации привода возникла ошибка: ${error}`; 
                }
            )
        },
        onNoticeDlgClose() {
            this.noticeDialog.show = false; 
            this.noticeDialog.type = 'notice'; 
            this.noticeDialog.message = ''; 
        }
    }
}
</script>