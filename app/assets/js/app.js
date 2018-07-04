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
                this.topCompaniesIssues();
                this.projectInfo()
            });

            appContent.innerHTML = null;
            appContent.appendChild(projectsList);

            this.topIssuesChart();
            this.topCompaniesIssues()
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

            let projectName = document.createElement('div');
            projectName.id = appUI.projectName;
            projectName.innerHTML = project.name;
            header.appendChild(projectName);
        });
    }

    newChart(dataValues, name, container, action){
        let contentChart = new ChartManager(name, container);

        let data = [];
        let labels = [];
        let backgroundColors = [];
        for(let key in dataValues){
            if(dataValues.hasOwnProperty(key)){
                let issues = Object.values(dataValues[key]);

                labels.push(key);
                data.push(issues.length);
                backgroundColors.push(contentChart.randomColor());
            }
        }

        contentChart.data = {
            datasets: [{
                data: data,
                backgroundColor: backgroundColors
            }],
            labels: labels
        };

        contentChart.options = {
            onClick: (e)=>{
                let req;
                let activeElement = contentChart.chartNode.getElementAtEvent(e);

                try{
                    req = activeElement["0"]._model.label;
                }catch(err){
                    req = false;
                }

                if(req){
                    action(req)
                }
            }
        };

        return contentChart
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
                let topIssuesChart = this.newChart(requestTypes, 'topChart', appUI.topContentChart, (type)=>{
                    alert(type)
                });

                topIssuesChart.pie();
            }
        });
    }

    topCompaniesIssues(){
        let topChartContent = document.getElementById(appUI.topContentChart);

        if(topChartContent == null){
            let appContent = document.getElementById(appUI.contentID);
            topChartContent = document.createElement('div');
            topChartContent.id = appUI.topContentChart;
            appContent.appendChild(topChartContent);
        }

        appUI.elementLoad = appUI.topContentChart;
        ConnectorService.getCompaniesIssuesTop(this.currentProject.key).then((companies)=>{
            if(companies){
                let topCompaniesIssuesChart = this.newChart(companies, 'topCompaniesChart', appUI.topContentChart, (option)=>{
                    let branchs = companies[option];
                    let topBranchIssuesChart = this.newChart(branchs, 'topBranchChart', appUI.topContentChart, (key)=>{
                        let issues = branchs[key];
                        let topIssuesChart = this.newChart(issues, 'topIssuesChart', appUI.topContentChart, (issue)=>{
                            alert(issue)
                        });

                        topIssuesChart.pie()
                    });

                    topBranchIssuesChart.pie()
                });

                topCompaniesIssuesChart.pie();
            }
        });
    }
}new app();
