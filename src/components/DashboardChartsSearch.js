import React, { useLayoutEffect, useState } from 'react';
import DashboardCharts from '../components/DashboardCharts'
import './DashboardCharts.css';
import {buildPath} from './buildPath';


//empty array for displaying nothing
var empty = []

function DashboardChartsSearch(){
    var search = "";
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud._id;
   
    const doProjectSearch = async event =>{
        var obj;
        if(search.value){
            obj = {founderId:userId,title:search.value};
        }
        else{
            obj = {founderId:userId,title:""};
        }
        var js = JSON.stringify(obj);
        ///console.log(js)
        try
        {   
            const response = await fetch(buildPath('api/search/projects'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            //get list of project names and pass as prop to child
            var toDelete = [];
            if(res.length>0){
                var modifiedRes = res.filter((project) => {
                    if(project.founderId.localeCompare(userId) === 0 || project.isVisible === 1){
                        return true;
                    }
                    return false;
                });
                if(modifiedRes !== chartsAreDisplayed){
                    setChartsToDisplay(<DashboardCharts projects={modifiedRes} triggerReSearch={triggerReSearch}/>);
                    setChartsAreDisplayed(modifiedRes);
                }
                
            }
            else{
                setChartsToDisplay(<DashboardCharts projects={empty} triggerReSearch={triggerReSearch}/>);
                setChartsAreDisplayed(empty);
            }
        }
        catch(e)
        {
            alert(e.toString());
        }
    }
    const triggerReSearch = () =>{
        search="";
        doProjectSearch()
    }
    const [chartsToDisplay, setChartsToDisplay] = useState(<DashboardCharts projects={empty} triggerReSearch={triggerReSearch}/>);
    const [chartsAreDisplayed,setChartsAreDisplayed] = useState([]);


    //do an empty search before page renders
    useLayoutEffect(()=>{doProjectSearch()},[]);
    

    return(
            <div>
                <div class="px-0 mx-0 mt-5 mb-4">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <h1 class="title">Charts</h1>
                        <input type="search" class="form-control searchForm" placeholder='Search charts by name...' id="search projects" onChange={doProjectSearch} ref={(c) => search = c}/>
                    </form>
                </div>
                {chartsToDisplay}
            </div>
        
    );
};

export default DashboardChartsSearch;