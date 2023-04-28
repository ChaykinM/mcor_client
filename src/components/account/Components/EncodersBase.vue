<template>
    <v-card>
        <v-card-text>
            <v-text-field hide-details="true" v-model="searchInput" label="Поиск по приводам"
                append-inner-icon="mdi-magnify" class="mb-2"></v-text-field>
            <v-row>
                <v-alert v-if="sortedEncoders.length == 0" type="error" color="red-darken-4" variant="flat">
                    Приводов не найдено
                </v-alert>
                <v-col v-else v-for="encoder in sortedEncoders" :key="encoder.id" :cols="4" :md="4" :lg="3">
                    <v-card class="mx-auto" >
                        <v-img cover height="250" class="align-end text-white"
                            :src="encoder.img_url == '' ? '/assets/motors/default-image.jpg' : encoder.img_url">
                            <v-card-title class="bg-cyan-darken-2">{{ encoder.name }}
                            </v-card-title>
                        </v-img>
                        <v-card-actions>
                            <v-btn color="blue-darken-2" variant="flat">
                                Редактировать
                                <EditEncoder :encoder="JSON.parse(JSON.stringify(encoder))" @edit-encoder="onEditEncoder"/> 
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-tooltip location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-btn :icon="showEncodersDescrions.indexOf(encoder.id) > -1 ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="changeShowEncodersDescrions(encoder.id)" v-bind="props"></v-btn>
                                </template>
                                <span> {{ showEncodersDescrions.indexOf(encoder.id) > -1 ? 'Свернуть описание' : 'Развернуть описание' }} </span>
                            </v-tooltip>
                        </v-card-actions>

                        <v-expand-transition>
                            <div v-show="showEncodersDescrions.indexOf(encoder.id) > -1">
                                <v-divider></v-divider>
                                <v-card-text>
                                    {{ encoder.description }}
                                </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
            <div v-if="encodersPageLength > 1" class="text-center">
                <v-pagination v-model="encodersPage" :length="encodersPageLength"></v-pagination>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="indigo-darken-2" prepend-icon="mdi-plus">
                Добавить новый
                <AddEncoder @add-encoder="onAddEncoder"/>
            </v-btn>
        </v-card-actions>
    </v-card>

    <NoticeDialog :show="noticeDialog.show" :message="noticeDialog.message" :type="noticeDialog.type" @notice-dlg-close="onNoticeDlgClose"/>
</template>

<script>
import AddEncoder from "@/components/account/Components/AddEncoder.vue"
import EditEncoder from "@/components/account/Components/EditEncoder.vue";
import NoticeDialog from "@/components/account/NoticeDialog.vue";

export default {
    name: "EncodersBase",
    props: {
        encoders: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            encodersPage: 1,
            encodersPageLength: 0,
            encodersToPageSize: 8,
            searchInput: '',
            show: false,
            showEncodersDescrions: [], 
            noticeDialog: {
                show: false, 
                type: 'notice', 
                message: '', 
            }
        };
    },
    components: { AddEncoder, EditEncoder, NoticeDialog },
    computed: {
        sortedEncoders() {
            return this.encoders.filter((encoder) => {
                return encoder.name
                    .toString()
                    .toLowerCase()
                    .includes(this.searchInput.toLowerCase()) ||
                    encoder.description
                        .toString()
                        .toLowerCase()
                        .includes(this.searchInput.toLowerCase());
            })
                .filter((row, index, array) => {
                    let encodersPageLength = Math.ceil(
                        array.length / this.encodersToPageSize
                    );
                    this.setEncodersPageLength(encodersPageLength); // задали количество страниц исходя из текущего количества элементов

                    let start = (this.encodersPage - 1) * this.encodersToPageSize;
                    let end = this.encodersPage * this.encodersToPageSize;
                    if (index >= start && index < end) return true;
                });
        }
    },
    methods: {
        changeShowEncodersDescrions(enc_id){
            let index = this.showEncodersDescrions.indexOf(enc_id);
            if (index > -1) {
                this.showEncodersDescrions.splice(index, 1)
            } else {
                this.showEncodersDescrions.push(enc_id); 
            }
        }, 
        setEncodersPageLength(encodersPageLength) {
            this.encodersPageLength = encodersPageLength;
        },
        onAddEncoder(encoderAddRequest) {
            this.$store.dispatch("ComponentsModule/onAddEncoder", { encoderAddRequest: encoderAddRequest }).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'success'; 
                    this.noticeDialog.message = 'Новый энкодер был успешно добавлен'; 
                },
                (error) => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'error'; 
                    this.noticeDialog.message = `При добавлении энкодера возникла ошибка: ${error}`;  
                }
            )
        },
        onEditEncoder(encoderEditRequest) {
            this.$store.dispatch("ComponentsModule/onEditEncoder", { encoderEditRequest: encoderEditRequest }).then(
                () => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'success'; 
                    this.noticeDialog.message = 'Данные датчика обратной связи были успешно отредактированы'; 
                }, 
                (error) => {
                    this.noticeDialog.show = true; 
                    this.noticeDialog.type = 'error'; 
                    this.noticeDialog.message = `При редактировании информации датчика возникла ошибка: ${error}`; 
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