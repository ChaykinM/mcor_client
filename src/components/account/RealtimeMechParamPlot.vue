<template>
    <v-chart class="chart" :option="getSeriesData" autoresize />
</template>
  
<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
    GridComponent,
    CanvasRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
]);

export default {
    name: "RealtimeParamPlot",
    props: {
        params: Array,
    },
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: "purple-passion",
    },
    computed: {
        getSeriesData() {
            let option = {
                // title: {
                //   text: "Traffic Sources",
                // },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data: [],
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                dataZoom: [
                    {
                        type: "inside",
                    },
                    {
                        type: "slider",
                    },
                ],
                xAxis: {
                    type: "value",
                    axisLabel: {
                        //   formatter: function (value) {
                        //     let timeArrive = new Date(value);
                        //     let label = `${timeArrive.getHours()}:${timeArrive.getMinutes()}:${timeArrive.getSeconds()}`;
                        //     return label;
                        //   },
                    },
                },
                yAxis: {
                    type: "value",
                    // boundaryGap: [0, "100%"],
                    splitLine: {
                        show: true,
                    },
                },
                series: [],
            };
            let series = [];
            let legendLabels = [];
            let params = this.params;

            if (typeof params !== "undefined") {
                for (let param of params) {

                    let data = {
                        name: param.name,
                        type: "line",
                        symbol: "circle",
                        symbolSize: 10,
                        //   encode: {
                        //     x: "timestamp",
                        //   },
                        data: param.data,
                    };
                    series.push(data);
                }
            }
            option.legend.data = legendLabels;
            option.series = series;
            return option;
        },
    },
};
</script>