<template>
    <v-tabs v-model="tab" bg-color="primary">
        <v-tab v-for="temp_coord in template" :key="temp_coord.id" :value="temp_coord.id"> {{ temp_coord.tag }}</v-tab>
    </v-tabs>
    <v-window v-model="tab">
        <v-window-item v-for="temp_coord in template" :key="temp_coord.id" :value="temp_coord.id">
            <v-table>
                <thead>
                    <th>x</th>
                    <th>a</th>
                    <th>b</th>
                    <th>c</th>
                    <th>d</th>
                </thead>
                <tbody>
                    <tr v-for="spline in getSplines" :key="spline">
                        <td>{{ spline.x }}</td>
                        <td>{{ spline.a }}</td>
                        <td>{{ spline.b }}</td>
                        <td>{{ spline.c }}</td>
                        <td>{{ spline.d }}</td>
                    </tr>
                </tbody>
            </v-table>
            <div v-if="pagination[temp_coord.id].pageLength > 1" class="text-center">
                <v-pagination v-model="pagination[temp_coord.id].currentPage" :length="pagination[temp_coord.id].pageLength"></v-pagination>
            </div>
        </v-window-item>
    </v-window>
</template>

<script>
export default {
    name: "InterpolationPolinomsTable",
    props: {
        template: {
            type: Object,
            required: true,
        },
        polinoms: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            polinomsLocal: this.polinoms,
            tab: null,
            rowToPage: 10,
            pagination: {}, 
        }
    },
    watch: {
        polinomsLocal: 'updatePolinoms'
    },
    mounted() {
        this.polinomsLocal = this.polinoms; 
        for (let tag_id of this.template.map(t => t.id)) {
            this.pagination[tag_id] = {
                pageLength: 1,
                currentPage: 1,
            };
        }
    }, 
    computed: {
        getSplines() {
            let splines = [];
            if (this.polinomsLocal.length != 0 ){
                splines = this.polinomsLocal.find(p => p.id == this.tab).splines.filter((row, index, array) => {
                    let pageLength = Math.ceil(
                        array.length / this.rowToPage
                    );
                    this.setPageLength(pageLength);
                    
                    let start = (this.pagination[this.tab].currentPage - 1) * this.rowToPage;
                    let end = this.pagination[this.tab].currentPage * this.rowToPage;
                    if (index >= start && index < end) return true;
                });
            }
            return splines; 
        }
    },
    methods: {
        updatePolinoms(newPolinoms) {
            console.log(newPolinoms)
            this.polinomsLocal = newPolinoms;
        }, 
        setPageLength(pageLength) {
            this.pagination[this.tab].pageLength = pageLength;
        },
    },
}
</script>