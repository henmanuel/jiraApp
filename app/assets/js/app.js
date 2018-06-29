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
        ConnectorService.getIssuesTop().then((requestTypes)=>{
           if(requestTypes){
               let topContentChart = document.createElement('div');
               topContentChart.id = appUI.topContentChart;

               let contentApp = document.getElementById(appUI.contentID);
               contentApp.innerHTML = null;
               contentApp.appendChild(topContentChart);

               let topIssuesChart = new ChartManager('topChart', appUI.topContentChart);

               let data = [];
               let labels = [];
               for(let key in requestTypes){
                   if(requestTypes.hasOwnProperty(key)){
                       let issues = Object.values(requestTypes[key]);

                       labels.push(key);
                       data.push(issues.length)
                   }
               }

               data = {
                   datasets: [{
                       data: data
                   }],
                   labels: labels
               };

               topIssuesChart.pie(data)
           }
        });
    }

    loadTopQueues(){
        if(this.currentProject.projectTypeKey == 'service_desk'){
            appUI.elementLoad = appUI.queuesContent;
            Project.getQueues(this.currentProject.key).then((queues)=>{
                if(queues.hasOwnProperty('values')){
                    for(let key in queues.values){
                        if(queues.values.hasOwnProperty(key)){
                            if(queues.values[key].name == 'Unassigned'){
                                Project.getIssuesQueue(this.currentProject.key, queues.values[key].id).then((issues)=>{
                                    console.log(issues);
                                    ConnectorService.getQueuesController('doc=queues').then((queues)=>{
                                        if(!queues){
                                            ConnectorService.addQueuesController({'summary' : 5}).then((result)=>{
                                                if(result){
                                                    this.printIssue(issues, queues.summary);
                                                }
                                            });
                                        }else{
                                            this.printIssue(issues, queues.summary);
                                        }
                                    });
                                });
                            }
                        }
                    }
                }
            })
        }
    }

    printIssue(issues, summary){
        let count = issues.values.length;
        let table = document.createElement('div');
        table.id = appUI.tableQueuesTop;
        table.classList.add('app-table-top-issues');

        for(let i = 0; i < count; i++){
            let row = document.createElement('div');
            row.id = issues.values[i].id;
            row.classList.add('app-row-issue');

            let key = issues.values[i].key;
            let description = issues.values[i].fields.summary;
            let score = issues.values[i].fields.customfield_10069;
            row.innerHTML = `<span>${key}</span><span>${description}</span><span>${score}</span>`;

            table.appendChild(row);
            if(i == summary){break}
        }

        let content = document.getElementById(appUI.queuesContent);
        content.appendChild(table);
    }
}new app();