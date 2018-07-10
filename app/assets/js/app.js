import appUI from './appUI'
import {Project} from './Project'
import {ChartManager} from './ChartManager'
import {ConnectorService} from './ConnectorService'

class app {
    constructor(){
        Project.list().then((projects)=>{
            let appContent = document.getElementById(appUI.contentID);

            this.projects = projects;
            let selectContainer = document.createElement('div');
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

            selectContainer.id = appUI.selectContainer;
            projectsList.addEventListener('change', (e)=>{
                this.currentProject = this.projects[e.currentTarget.value];
                this.topIssuesChart();
                this.topCompaniesIssues();
                this.projectInfo()
            });

            appContent.innerHTML = null;
            selectContainer.appendChild(projectsList);
            appContent.appendChild(selectContainer);

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
        let appContent = document.getElementById(appUI.contentID);
        let chartContainer = document.getElementById(appUI.chartContainerIssues);
        let topChartContent = document.getElementById(appUI.topIssuesContentChart);
        let titleChart = document.getElementById(appUI.topIssuesContentChart + '-title');

        if(chartContainer == null){
            chartContainer = document.createElement('div');
            chartContainer.id = appUI.chartContainerIssues;
            appContent.appendChild(chartContainer);
        }

        if(titleChart == null){
            titleChart = document.createElement('div');
            titleChart.id = appUI.topIssuesContentChart + '-title';
            chartContainer.appendChild(titleChart);
        }

        if(topChartContent == null){
            topChartContent = document.createElement('div');
            topChartContent.id = appUI.topIssuesContentChart;
            chartContainer.appendChild(topChartContent);
        }

        appUI.elementLoad = appUI.topIssuesContentChart;
        ConnectorService.getIssuesTop(this.currentProject.key).then((requestTypes)=>{
            if(requestTypes){
                titleChart.innerText = 'Request Types';
                let topIssuesChart = this.newChart(requestTypes, 'topChart', appUI.topIssuesContentChart, (type)=>{
                    alert(type)
                });

                topIssuesChart.pie();
            }
        });
    }

    topRequestTypes(data){
        return this.newChart(data, 'topCompaniesChart', appUI.topCompaniesContentChart, (option)=>{
            titleChart.innerText = option;
            let backOp = document.createElement('span');
            backOp.id = appUI.chartBackOption;
            backOp.innerText = 'Back';
            backOp.addEventListener('click', ()=>{
                currentChart.pie()
            });

            titleChart.appendChild(backOp);

            this.topCompanyIssues();
        });
    }

    topCompanyIssues(){
        return this.newChart(branchs, 'topBranchChart', appUI.topCompaniesContentChart, (key)=>{
            let issues = branchs[key];
            titleChart.innerText = key;

            this.topBranchIssues();
        });
    }

    topBranchIssues(){
        return this.newChart(issues, 'topIssuesChart', appUI.topCompaniesContentChart, (issue)=>{
            alert(issue);
            titleChart.innerText = issue;
        });
    }

    topCompaniesIssues(){
        let appContent = document.getElementById(appUI.contentID);
        let backOption = document.getElementById(appUI.chartBackOption);
        let chartContainer = document.getElementById(appUI.chartContainerCompanies);
        let topChartContent = document.getElementById(appUI.topCompaniesContentChart);
        let titleChart = document.getElementById(appUI.topCompaniesContentChart + '-title');

        if(chartContainer == null){
            chartContainer = document.createElement('div');
            chartContainer.id = appUI.chartContainerCompanies;
            appContent.appendChild(chartContainer);
        }

        if(titleChart == null){
            titleChart = document.createElement('div');
            titleChart.id = appUI.topCompaniesContentChart + '-title';
            chartContainer.appendChild(titleChart);
        }

        if(topChartContent == null){
            topChartContent = document.createElement('div');
            topChartContent.id = appUI.topCompaniesContentChart;
            chartContainer.appendChild(topChartContent);
        }

        appUI.elementLoad = appUI.topCompaniesContentChart;
        ConnectorService.getCompaniesIssuesTop(this.currentProject.key).then((companies)=>{
            if(companies){
                titleChart.innerHTML = null;
                titleChart.innerText = 'Companies issues';

                let topRequestChart = this.topRequestTypes(companies);
                topRequestChart.pie();
            }
        });
    }
}new app();