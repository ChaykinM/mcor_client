<template>
    <v-table>
        <thead>
            <tr>
                <th width="5%">ID</th>
                <th>t</th>
                <th v-for="coord in template" :key="coord.id">
                    {{ coord.tag + ' , ' + coord.dimension }}
                </th>
            </tr>
        </thead>
        <tbody v-if="pointsLocal.length != 0">
            <tr v-for="point in getPoints" :key="point">
                <td>
                    {{ point.id }}
                </td>
                <td>{{ point.time }}</td>
                <td v-for="coord in template" :key="coord.id">
                    {{ point[coord.tag] }}
                </td>
            </tr>
        </tbody>
    </v-table>
    <v-alert v-if="pointsLocal.length == 0" type="error" color="red-darken-4" variant="flat" class="ma-2" width="100%">
        Нет добавленных декартовых координат
    </v-alert>
    <div v-if="pageLength > 1" class="text-center">
        <v-pagination v-model="currentPage" :length="pageLength"></v-pagination>
    </div>
</template>

<script>
export default {
    name: 'DKTpointsTable',
    props: {
        template: {
            type: Object,
            required: true,
        },
        points: {
            type: Array,
            required: true,
        }
    },
    watch: {
        points: 'pointsChange',
    },
    data() {
        return {
            pointsLocal: this.points,
            rowToPage: 10,
            pageLength: 1,
            currentPage: 1
        }
    },
    computed: {
        getPoints() {
            return this.pointsLocal.filter((row, index, array) => {
                let pageLength = Math.ceil(
                    array.length / this.rowToPage
                );
                this.setPageLength(pageLength); // задали количество страниц исходя из текущего количества элементов

                let start = (this.currentPage - 1) * this.rowToPage;
                let end = this.currentPage * this.rowToPage;
                if (index >= start && index < end) return true;
            });
        }
    },
    methods: {
        pointsChange(newVal) {
            this.pointsLocal = newVal;
        },
        setPageLength(pageLength) {
            this.pageLength = pageLength;
        },
    }
}   
</script>