import Chart from 'chart.js'

export class ChartManager{
    constructor(name, container){
        let chartContent = document.getElementById(container);

        chartContent.innerHTML = null;
        chartContent.innerHTML = `<canvas id="${name}" width="100%" height="100%"></canvas>`;

        this.chart = document.getElementById(name);
    }

    randomColor(){
        let o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }

    pie(data, options = {}){
        this.chartNode = new Chart(this.chart,{
            type: 'pie',
            data: data,
            options: options
        });
    }
}