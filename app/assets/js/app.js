import appUI from './appUI'
import {Project} from './Project'
import {ChartManager} from './ChartManager'
import {ConnectorService} from './ConnectorService'

class app{
    constructor(){
        Project.list().then((projects)=>{
            this.projects = projects;
            let projectsList = document.createElement('select');

            for(let key in projects){
                let option = document.createElement('option');

                if(projects.hasOwnProperty(key)){
                    if(key == 0){
                        this.currentProject = projects[key];
                    }

                    option.value = key;
                    option.text = projects[key].name;
                    projectsList.add(option);
                }
            }

            let appContent = document.getElementById(appUI.contentID);
            projectsList.addEventListener('change', (e)=>{
                this.currentProject = this.projects[e.currentTarget.value];
                this.topIssuesChart()
            });

            appContent.innerHTML = null;
            appContent.appendChild(projectsList);

            this.topIssuesChart()
        });
    }

    topIssuesChart(){
        let topChartContent = document.getElementById(appUI.topContentChart);

        if(topChartContent == null){
            let appContent = document.getElementById(appUI.contentID);
            topChartContent = document.createElement('div');
            topChartContent.id = appUI.topContentChart;
            appContent.appendChild(topChartContent);
        }

        appUI.elementLoad = appUI.topContentChart;
        ConnectorService.getIssuesTop(this.currentProject.key).then((requestTypes)=>{
           if(requestTypes){
               let topIssuesChart = new ChartManager('topChart', appUI.topContentChart);

               let data = [];
               let labels = [];
               let backgroundColor = [];
               for(let key in requestTypes){
                   if(requestTypes.hasOwnProperty(key)){
                       let issues = Object.values(requestTypes[key]);

                       labels.push(key);
                       data.push(issues.length);
                       backgroundColor.push(topIssuesChart.randomColor());
                   }
               }

               data = {
                   datasets: [{
                       data: data,
                       backgroundColor : backgroundColor
                   }],
                   labels: labels
               };

               options = {
                   onClick : this.merchantIssuesChart()
               };

               topIssuesChart.pie(data);
           }
        });
    }

    merchantIssuesChart(){
        alert('chart')
    }
}new app();