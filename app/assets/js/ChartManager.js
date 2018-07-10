import Chart from 'chart.js'

export class ChartManager{
    constructor(name, container){
        this.data = {};
        this.name = name;
        this.options = {};
        this.container = container;
    }

    newChart(type, data, options){
        let chartContent = document.getElementById(this.container);

        chartContent.innerHTML = null;
        chartContent.innerHTML = `<canvas id="${this.name}" width="100%" height="100%"></canvas>`;

        let chart = document.getElementById(this.name);
        new Chart(chart,{
            type: type,
            data: data,
            options: options
        });
    }

    randomColor(){
        let randomColorFactor = function(){
            return Math.round(Math.random() * 255);
        };

        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ', 0.5)';
    }

    pie(){
        this.newChart('pie', this.data, this.options)
    }
}