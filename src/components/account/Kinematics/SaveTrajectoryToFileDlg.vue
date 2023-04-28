<template>
    <v-dialog v-model="showDialog" activator="parent" scrollable persistent>
        <v-card width="800">
            <v-card-title class="pa-0">
                <v-toolbar color="primary">
                    <v-toolbar-title>
                        Импорт данных в файл
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn icon="mdi-close" @click="close"></v-btn>
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-select v-model="downloadRequest.dataType" :items="dataTypes" label="Тип данных для сохранения"
                    :item-title="'title'" :item-value="'tag'">
                </v-select>
                Тип файла
                <v-radio-group v-model="downloadRequest.fileType" inline>
                    <v-radio v-for="fileType in fileTypes" :key="fileType.id" :label="fileType.title"
                        :value="fileType.tag"></v-radio>
                </v-radio-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" @click="close">
                    Отмена
                </v-btn>
                <v-btn variant="flat" color="indigo-darken-2" @click="save()">
                    Сохранить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "SaveTrajectoryToFileDlg",
    props: {
        trajectory: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            showDialog: null,
            dataTypes: [
                {
                    id: 0,
                    tag: 'dkt_point',
                    title: 'Декартовые координаты',
                },
                {
                    id: 1,
                    tag: 'dkt_polinoms',
                    title: 'Интерполяционные полиномы для декартовых координат'
                },
                {
                    id: 2,
                    tag: 'ikt_point',
                    title: 'Обобщённые координаты',
                },
                {
                    id: 3,
                    tag: 'ikt_polinoms',
                    title: 'Интерполяционные полиномы для обобщённых координат'
                }
            ],
            fileTypes: [
                {
                    id: 0,
                    tag: 'csv',
                    title: '.csv',
                },
                {
                    id: 1,
                    tag: 'txt',
                    title: '.txt',
                }
            ],
            downloadRequest: {
                dataType: 'ikt_point',
                fileType: 'csv',
            }
        };
    },
    methods: {
        close() {
            this.showDialog = false;
        },
        save() {
            let jsonToImport = JSON.parse(this.trajectory[this.downloadRequest.dataType]);

            var fields = Object.keys(jsonToImport.at(0))
            var replacer = function (key, value) { return value === null ? '' : value }
            var data = jsonToImport.map(function (row) {
                console.log(row)
                return fields.map(function (fieldName) {
                    return JSON.stringify(row[fieldName], replacer)
                }).join(',')
            })
            data = data.join('\r\n');
            
            var file;
            var temp_link = document.createElement('a');

            if (this.downloadRequest.fileType == 'csv') {
                file = new Blob([data], { type: "text/csv" });
                temp_link.download = `${this.trajectory.name} [${this.downloadRequest.dataType}].csv`;
            } else if (this.downloadRequest.fileType == 'txt') {
                file = new Blob([data], { type: "text/plain" });
                temp_link.download = `${this.trajectory.name} [${this.downloadRequest.dataType}].txt`;
            }

            var url = window.URL.createObjectURL(file);
            temp_link.href = url;
            temp_link.style.display = "none";
            document.body.appendChild(temp_link);
            temp_link.click();
            document.body.removeChild(temp_link);
            this.showDialog = false;
        }
    }
}
</script>