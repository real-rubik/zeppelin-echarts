export const InvColumnParameter = {
    'left': { valueType: 'string', defaultValue: '10', description: 'left', },
    'right': { valueType: 'string', defaultValue: '10', description: '', },
    'top': { valueType: 'string', defaultValue: '10', description: '', },
    'bottom': { valueType: 'string', defaultValue: '10', description: '', },
    'xAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of xAxis', },
    'yAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of yAxis', },
    'xAxisName': { valueType: 'string', defaultValue: '', description: 'name of xAxis', },
    'yAxisName': { valueType: 'string', defaultValue: '', description: 'name of yAxis', },
};

export function createInvDataStructure (rows) {
    return rows.map(r => {
        return { name: r.selector.replace('(sum)',''), type: "bar", data: r.value,}
    })
}

export function createInvChartOption(series, parameter, keyNames, selectors) {
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
        grid : {left: '10%', right: '10%', top: '15%', bottom: '10%',},
        xAxis: {
            type: 'values',
        },
        yAxis: [{
            type: 'category',
            data: keyNames
        }
        ],
        series: series
    };

    return option
}

