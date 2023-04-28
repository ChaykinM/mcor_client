<template>
    <v-chart :option="getSeriesData" autoresize />
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
    name: "TrajectoryplotPoints",
    props: {
        title: {
            type: String,
        },
        xLabel: {
            type: String, 
        }, 
        yLabel: {
            type: String, 
        }, 
        data: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {

        };
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
                title: {
                    text: this.title,
                },
                tooltip: {
                    trigger: "axis",
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {},
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
                    scale: true,
                    name: this.xLabel, 
                },
                yAxis: {
                    type: "value",
                    splitLine: {
                        show: true,
                    },
                    scale: true,
                    name: this.yLabel, 
                },
                series: [],
            };
            let series = [];
            series = [
                {
                    type: 'line',
                    symbol: 'none',
                    lineStyle: {
                        color: '#5470C6',
                        width: 5
                    },
                   
                    data: this.data
                }
            ]

            option.series = series;
            console.log(option)
            return option;
        },
    }
}
</script>

 