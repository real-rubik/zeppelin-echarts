import Visualization from "zeppelin-vis";
import AdvancedTransformation from "zeppelin-tabledata/advanced-transformation";

import * as echarts from 'echarts/lib/echarts'

require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');

import {ColumnParameter, createChartOption, createDataStructure} from './chart/column'
import {CLParameter, createCLChartOption, createCLDataStructure} from "./chart/columnline";
import {createInvChartOption, createInvDataStructure, InvColumnParameter} from "./chart/invcolumn";

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
                        'yAxisLine': { dimension: 'multiple', axisType: 'group', }
                    },
                    parameter: ColumnParameter
                },
                'column-line': {
                    transform: { method: 'array', },
                    sharedAxis: true,
                    axis: {
                        'xAxis': { dimension: 'single', axisType: 'key', },
                        'yAxisBar': { dimension: 'multiple', axisType: 'aggregator', minAxisCount: 1, },
                        'yAxisLine': { dimension: 'single', axisType: 'aggregator',}
                    },
                    parameter: CLParameter
                },
                'inv-column': {
                    transform: { method: 'array', },
                    sharedAxis: true,
                    axis: {
                        'xAxis': { dimension: 'multiple', axisType: 'aggregator', minAxisCount: 1,},
                        'yAxis': { dimension: 'single', axisType: 'key', }
                    },
                    parameter: InvColumnParameter
                }
            }
        };

        this.transformation = new AdvancedTransformation(config, spec)
    }

    getChartElement() {
        return document.getElementById(this.targetEl[0].id)
    }

    clearChart() {
        if (this.chartInstance) {this.chartInstance.clear()}
    }

    hideChart() {
        this.clearChart();
        this.getChartElement().innerHTML = `
        <div style="margin-top: 60px; text-align: center; font-weight: 100">
            <span style="font-size:30px;">
                Please set axes in
            </span>
            <span style="font-size: 30px; font-style:italic;">
                Settings
            </span>
        </div>`
    }

    showError(error) {
        this.clearChart()
        this.getChartElement().innerHTML = `
        <div style="margin-top: 60px; text-align: center; font-weight: 300">
            <span style="font-size:30px; color: #e4573c;">
                ${error.message} 
            </span>
        </div>`
    }

    drawColumnChart(parameter, column, transformer) {
        if (column.aggregator.length === 0) {
            this.hideChart();
            return;
        }
        const { keyNames, rows } = transformer();
        const series = createDataStructure(rows);

        const selector = [];
        for (let i = 0; i < series.length; i++) {
            let catName = series[i].name;
            selector.push(catName)
        }

        let container = this.getChartElement();
        let option = createChartOption(series, parameter, keyNames, selector);

        this.chartInstance = echarts.init(container).setOption(option)
    }

    drawColumnLineChart(parameter, column, transformer, axis) {
        if (column.aggregator.length === 0) {
            this.hideChart();
            return;
        }
        const { keyNames, rows } = transformer();

        const lineName = [];
        if (typeof axis.yAxisLine[0].name !== 'undefined') {
            let name = axis.yAxisLine[0].name + "(sum)";
            lineName.push(name)
        }

        const series = createCLDataStructure(rows, lineName);

        const selector = [];
        for (let i = 0; i < series.length; i++) {
            let catName = series[i].name;
            selector.push(catName)
        }

        let container = this.getChartElement();
        let option = createCLChartOption(series, parameter, keyNames, selector);

        this.chartInstance = echarts.init(container).setOption(option)
    }

    drawInvColumnChart(parameter, column, transformer) {
        if (column.aggregator.length === 0) {
            this.hideChart();
            return;
        }
        const { keyNames, rows } = transformer();
        const series = createInvDataStructure(rows);

        const selector = [];
        for (let i = 0; i < series.length; i++) {
            let catName = series[i].name;
            selector.push(catName)
        }

        let container = this.getChartElement();
        let option = createInvChartOption(series, parameter, keyNames, selector);

        this.chartInstance = echarts.init(container).setOption(option)
    }

    refresh() {
        try {
            this.chartInstance && this.chartInstance.resize()
        } catch(e) {
            console.warn(e)
        }
    }

    render(data) {
        const {
            chartChanged, parameterChanged, axis,
            chart, parameter, column, transformer
        } = data;

        if (!chartChanged && !parameterChanged) { return }

        try {
            if (chart === 'column') {this.drawColumnChart(parameter, column, transformer) }
            else if (chart === 'column-line') {this.drawColumnLineChart(parameter, column, transformer, axis) }
            else if (chart === 'column-line') {this.drawInvColumnChart(parameter, column, transformer, axis) }
        } catch (e) {
            console.error(e);
            this.showError(e);
        }

    }

    getTransformation() {
        return this.transformation
    }
}

