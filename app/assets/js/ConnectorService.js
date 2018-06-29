import appUI from './appUI'
import {PrettyLoader} from './PrettyLoader'

class connectorService {

    constructor(){
        this.dev = true;
        this.getMethod = 'GET';
        this.putMethod = 'PUT';
        this.postMethod = 'POST';
        this.deleteMethod = 'DELETE';
        this.url = '/atlassian-connect.json';

        this.httpServiceAsync({}, this.getMethod).then((connect)=>{
            this.url = connect.baseUrl + '/system/ServiceData.php';
        })
    }

    getIssuesTop(project){
        project.toLowerCase();

        let request = {
            'document' : 'issuesTop' + project.toUpperCase()
        };

        return this.httpServiceAsync(request, this.getMethod);
    }

    getQueuesController(){
        let request = {
            'document' : 'queues'
        };

        return this.httpServiceAsync(request, this.getMethod);
    }

    addQueuesController(data){
        let request = {
            'document' : 'queues',
            'data' : data
        };

        return this.httpServiceAsync(JSON.stringify(request), this.postMethod);
    }

    /**
     * Load Jira REST FULL API action
     * 
     * @param action
     * @param method
     * @param data
     * @returns {Promise}
     */
    load(action, method = this.getMethod, data = {}){
        PrettyLoader(appUI.elementLoad);

        return new Promise((resolve)=>{
            AP.request(action, {
                type: method,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(response){
                    console.log(response);
                    resolve(JSON.parse(response))
                },
                error: function(e){
                    console.log(e);
                    document.getElementById(appUI.contentID).innerHTML = e
                }
            })
        })
    }

    /**
     * Http post service that returns a Promise
     *
     * @param request
     * @param method
     * @returns {Promise}
     */
    httpServiceAsync(request, method){
        PrettyLoader(appUI.elementLoad);

        return new Promise((resolve) => {
            $.ajax({
                type: method,
                url: this.url,
                data: request,
                dataType: 'jsonp'
            }).done(function(response){
                resolve(response);
            }).fail(function(response){
                let dataResponse = 'A error as occurred';

                if(response.responseText){
                    dataResponse = JSON.parse(response.responseText);
                    resolve(dataResponse)
                }else{
                    document.getElementById(appUI.contentID).innerHTML = dataResponse;
                }
            });
        })
    }
}

export let ConnectorService = new connectorService();