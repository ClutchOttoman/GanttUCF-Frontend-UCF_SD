import React, { useLayoutEffect, useState } from 'react';
import RecentlyDeletedCharts from '../components/RecentlyDeletedCharts'
import './DashboardCharts.css';
import {buildPath} from './buildPath';


//empty array for displaying nothing
var empty = []

function RecentlyDeletedSearch(){
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
        try
        {   
            const response = await fetch(buildPath('api/search/recently-deleted'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            //get list of project names and pass as prop to child
            if(res.length>0){
                setChartsToDisplay(<RecentlyDeletedCharts projects={res} triggerReSearch={triggerReSearch}/>);
            }
            else{
                setChartsToDisplay(<RecentlyDeletedCharts projects={empty} triggerReSearch={triggerReSearch}/>);
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
    const [chartsToDisplay, setChartsToDisplay] = useState(<RecentlyDeletedCharts projects={empty} triggerReSearch={triggerReSearch}/>);
    


    //do an empty search before page renders
    useLayoutEffect(()=>{doProjectSearch()},[]);
    

    return(
        <div>
            <div class="px-0 mx-0 mt-5 mb-4">
                    <form>
                        <h1 class="title">Recently Deleted</h1>
                        <input type="search" class="form-control searchForm" placeholder='Search charts by name...' id="search projects" onChange={doProjectSearch} ref={(c) => search = c}/>
                    </form>
            </div>
            {chartsToDisplay}
        </div>
    );
};

export default RecentlyDeletedSearch