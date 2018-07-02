import appUI from './appUI'
import {Project} from './Project'
import {ChartManager} from './ChartManager'
import {ConnectorService} from './ConnectorService'

class app {
    constructor(){
        Project.list().then((projects)=>{
            let appContent = document.getElementById(appUI.contentID);

            this.projects = projects;
            let projectsList = document.createElement('select');

            for(let key in projects){
                let option = document.createElement('option');

                if(projects.hasOwnProperty(key)){
                    if(key === '0'){
                        this.currentProject = projects[key];
                    }

                    option.value = key;
                    option.text = projects[key].name;
                    projectsList.add(option);
                }
            }

            this.projectInfo();

            projectsList.addEventListener('change', (e)=>{
                this.currentProject = this.projects[e.currentTarget.value];
                this.topIssuesChart();
                this.projectInfo()
            });

            appContent.innerHTML = null;
            appContent.appendChild(projectsList);

            this.topIssuesChart()
        });
    }

    projectInfo(){
        appUI.elementLoad = appUI.headerID;
        Project.info(this.currentProject.key).then((project)=>{
            let header = document.getElementById(appUI.headerID);

            header.innerHTML = null;
            let projectIcon = document.createElement('div');
            projectIcon.id = appUI.projectIcon;
            projectIcon.innerHTML = `<img src="${project.avatarUrls['16x16']}"/>`;
            header.appendChild(projectIcon);

            let projectName = document.createElement('a');
            projectName.src = project.self;
            projectName.id = appUI.projectName;
            projectName.innerHTML = project.name;
            header.appendChild(projectName);
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
                let backgroundColors = [];
                for(let key in requestTypes){
                    if(requestTypes.hasOwnProperty(key)){
                        let issues = Object.values(requestTypes[key]);

                        labels.push(key);
                        data.push(issues.length);
                        backgroundColors.push(topIssuesChart.randomColor());
                    }
                }

                data = {
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors
                    }],
                    labels: labels
                };

                let options = {
                    onClick: (e)=>{
                        let req;
                        let activeElement = topIssuesChart.chartNode.getElementAtEvent(e);

                        try{
                            req = activeElement["0"]._model.label;
                        }catch(err){
                            req = false;
                        }

                        if(req){
                            alert(req)
                        }
                    }
                };

                topIssuesChart.pie(data, options);
            }
        });
    }
}new app();
