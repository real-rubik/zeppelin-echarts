export const CLParameter = {
    'left': { valueType: 'string', defaultValue: '10', description: 'left', },
    'right': { valueType: 'string', defaultValue: '10', description: '', },
    'top': { valueType: 'string', defaultValue: '10', description: '', },
    'bottom': { valueType: 'string', defaultValue: '10', description: '', },
    'xAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of xAxis', },
    'yAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of yAxis', },
    'xAxisName': { valueType: 'string', defaultValue: '', description: 'name of xAxis', },
    'yAxisName': { valueType: 'string', defaultValue: '', description: 'name of yAxis', },
};

export function createCLDataStructure (rows, lineName) {
    let series = [];
    console.log(rows);
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.selector === lineName) {
            series.push({name: row.selector.replace('(sum)',''), type: "line", data: row.value, yAxisIndex: 1})
        }
        else series.push({name: row.selector.replace('(sum)',''), type: "bar", data: row.value,});
        console.log(series);
    }
    return series;
}

export function createCLChartOption(series, parameter, keyNames, selectors) {
    const {
        left, right, top, bottom,
        xAxisName, yAxisName,xAxisUnit, yAxisUnit,
    } = parameter;
    const colors = ['#19d4ae', '#0067a6', '#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4'];
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                crossStyle: {color: '#999'}
            }
        },
        color: colors,
        legend: {
            data: selectors,
            show: true,
            right: 0,
            itemWidth: 15,
            itemHeight: 10,
            textStyle: {fontSize: 11}
        },
        grid : {left: '10%', right: '10%', top: '15%', bottom: '10%'},
        xAxis: {
            type: 'category',
            data: keyNames,
            axisLine: {show: true, lineStyle: {color: '#ced0d3'}},
            axisLabel: {color: '#333'}
        },
        yAxis: [{
            type: 'value',
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {show: false}
        },
            {
                type: 'value',
                axisTick: {show: false},
                splitLine: {show: false},
                axisLine: {show: false}
            }
        ],
        series: series
    };

    return option
}