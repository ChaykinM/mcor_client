<template>
     <Line :chart-data="data" :chart-options="options" />
</template>

<script>
import {
     Chart as ChartJS,
     CategoryScale,
     LinearScale,
     PointElement,
     LineElement,
     Title,
     Tooltip,
     Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
     CategoryScale,
     LinearScale,
     PointElement,
     LineElement,
     Title,
     Tooltip,
     Legend
)
export default {
     name: "LinePlot",
     data() {
          return {

               data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                         {
                              label: 'Data One',
                              backgroundColor: '#f87979',
                              data: [40, 39, 10, 40, 39, 80, 40]
                         }
                    ]
               },

               option: {
                    responsive: true,
                    maintainAspectRatio: false
               }
          }
     },
     components: {
          Line
     },
}
</script>

<style>
.line {
     width: 100%;
     height: 100%;
}
</style>