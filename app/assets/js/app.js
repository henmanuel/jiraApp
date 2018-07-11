import appUI from './appUI'
import {Project} from './Project'
import {ChartManager} from './ChartManager'
import {ConnectorService} from './ConnectorService'

class app {
    constructor(){
        this.currentChart = null;
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
                this.topIssuesCompanies();
                this.projectInfo()
            });

            appContent.innerHTML = null;
            selectContainer.appendChild(projectsList);
            appContent.appendChild(selectContainer);

            this.topIssuesChart();
            this.topIssuesCompanies()
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

    topIssuesCompanies(){
        this.backChart = [];
        let appContent = document.getElementById(appUI.contentID);
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
                let back = document.createElement('span');

                back.innerText = null;
                back.id = appUI.chartBackOption;
                back.addEventListener('click', ()=>{
                    let index = this.backChart.length;
                    if(!index){
                        this.topIssuesCompanies();
                    }else{
                        this.backChart[index].pie();
                        --this.backChart.length
                    }
                });

                titleChart.appendChild(back);
                this.currentChart = this.topCompaniesChart(companies);
                this.currentChart.pie();
            }
        });
    }

    topCompaniesChart(companies){
        let dataCompany = [];
        for(let company in companies){
            if(companies.hasOwnProperty(company)){
                let companyIssues = [];
                for(let branch in companies[company]){
                    if(companies[company].hasOwnProperty(branch)){
                        for(let type in companies[company][branch]){
                            if(companies[company][branch].hasOwnProperty(type)){
                                for(let issue in companies[company][branch][type]){
                                    if(companies[company][branch][type].hasOwnProperty(issue)){
                                        companyIssues[issue] = companies[company][branch][type][issue];
                                        dataCompany[company] = companyIssues;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return this.newChart(dataCompany, 'topIssuesCompanies', appUI.topCompaniesContentChart, (option)=>{
            let titleChart = document.getElementById(appUI.topCompaniesContentChart + '-title');
            let back = document.getElementById(appUI.chartBackOption);
            titleChart.innerHTML = null;
            titleChart.innerText = `Issues in ${option} company`;
            back.innerText = 'Back';
            titleChart.appendChild(back);

            let dataBranch = [];
            for(let branch in companies[option]){
                if(companies[option].hasOwnProperty(branch)){
                    let companyIssues = [];
                    for(let type in companies[option][branch]){
                        if(companies[option][branch].hasOwnProperty(type)){
                            for(let issue in companies[option][branch][type]){
                                if(companies[option][branch][type].hasOwnProperty(issue)){
                                    companyIssues[issue] = companies[option][branch][type][issue];
                                    dataBranch[branch] = companyIssues;
                                }
                            }
                        }
                    }
                }
            }

            this.backChart.push(this.currentChart);
            this.currentChart = this.topBranchChart(dataBranch, companies[option]);
            this.currentChart.pie();
        });
    }

    topBranchChart(branches, branchIssues){
        return this.newChart(branches, 'topBranchChart', appUI.topCompaniesContentChart, (option)=>{
            let titleChart = document.getElementById(appUI.topCompaniesContentChart + '-title');
            let back = document.getElementById(appUI.chartBackOption);
            titleChart.innerHTML = null;
            titleChart.innerText = `Issues in ${option} branch`;
            back.innerText = 'Back';
            titleChart.appendChild(back);

            let dataTypes = [];
            for(let type in branchIssues[option]){
                if(branchIssues[option].hasOwnProperty(type)){
                    let dataIssueType = [];
                    for(let issue in branchIssues[option][type]){
                        if(branchIssues[option][type].hasOwnProperty(issue)){
                            dataIssueType[issue] = branchIssues[option][type][issue];
                            dataTypes[type] = dataIssueType;
                        }
                    }
                }
            }

            this.backChart.push(this.currentChart);
            this.topTypeIssuesChart(dataTypes).pie();
        });
    }

    topTypeIssuesChart(dataIssueType){
        return this.newChart(dataIssueType, 'topIssuesChart', appUI.topCompaniesContentChart, (issue)=>{
            alert(issue);
        });
    }
}new app();