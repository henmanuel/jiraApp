import Chart from 'chart.js'

export class ChartManager{
    constructor(name, container){
        let chartContent = document.getElementById(container);

        chartContent.innerHTML = null;
        chartContent.innerHTML = `<canvas id="${name}" width="100%" height="100%"></canvas>`;

        this.chart = document.getElementById(name);
    }

    randomColor(){
        let randomColorFactor = function(){
            return Math.round(Math.random() * 255);
        };

        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + ('0.5' || '.3') + ')';
    }

    pie(data, options = {}){
        this.chartNode = new Chart(this.chart,{
            type: 'pie',
            data: data,
            options: options
        });
    }
}