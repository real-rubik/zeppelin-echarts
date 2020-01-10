import Visualization from "zeppelin-vis";
import AdvancedTransformation from "zeppelin-tabledata/advanced-transformation";

import * as echarts from 'echarts/lib/echarts'

require('echarts/lib/chart/bar');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/visual/dataColor');

import {CommonParameter, createChartOption} from './chart/column'

export default class EchartsBar extends Visualization {
    constructor(targetEl, config) {
        super(targetEl, config);

        const spec = {
            charts: {
                'column': {
                    transform: { method: 'array', },
                    sharedAxis: true,
                    axis: {
                        'xAxis': { dimension: 'single', axisType: 'key', },
                        'yAxisBar': { dimension: 'multiple', axisType: 'aggregator', minAxisCount: 1, },
                        'yAxisLine': { dimension: 'multiple', axisType: 'aggregator'}
                    },
                    parameter: CommonParameter
                }
            }
        };

        this.transformation = new AdvancedTransformation(config, spec)
    }

    getChartElement() {
        return document.getElementById(this.targetEl[0].id)
    }


    drawColumnChart(parameter, column, transformer) {

        const { keyNames, rows , selectors} = transformer();
        console.log(rows);
        const series = createDataStructure(rows);
        console.log(series);
        let container = this.getChartElement();
        let option = createChartOption(series, parameter, keyNames, selectors);

        this.chartInstance = echarts.init(container).setOption(option);
    }

    refresh() {
        try {
            this.chartInstance && this.chartInstance.resize(this.targetEl.width())
        } catch(e) {
            console.warn(e)
        }
    }

    render(data) {
        console.log(data);
        const {
            chartChanged, parameterChanged,
            chart, parameter, column, transformer
        } = data;

        if (!chartChanged && !parameterChanged) { return }

        try {
            this.drawColumnChart(parameter, column, transformer)
        } catch (e) {
            console.error(e);
        }

    }

    getTransformation() {
        return this.transformation
    }
}

export function createDataStructure (rows) {
    return rows.map(r => {
        return { name: r.selector, type: "bar", data: r.value,}
    })
}
