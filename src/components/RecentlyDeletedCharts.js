import React, { useEffect, useLayoutEffect, useState } from 'react';
import './DashboardCharts.css';
import DashboardProjectCard from './DashboardProjectCard.js';
import {buildPath} from './buildPath';
import {toast} from 'react-toastify';
import ToastSuccess from './ToastSuccess';

function RecentlyDeletedCharts({ projects,triggerReSearch }) {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud._id;
    const [projectToDelete, setProjectToDelete] = useState({});
    const [projectIsDeleted,setProjectIsDeleted] = useState(false);
    const [pageStartIndex,setPageStartIndex] = useState(0);
    const [pageSize,setPageSize] = useState(8);






    const buttonOn = "btn chartNavButton", buttonOff = "btn chartNavButton hiddenButton";
    var buttonVisibility = [buttonOff, buttonOn]; //0->prev 1->next
    //when component is rendered, display the first page
    const [prevButton, setPrevButton] = useState(buttonVisibility[0]);
    const [nextButton, setNextButton] = useState(buttonVisibility[1]);
    const [cardsToDisplay,setCardsToDisplay] = useState([]);
    const [chartsToDisplay,setChartsToDisplay] = useState([]);

    
    const userCharts = () => {
        if(projects && chartsToDisplay && !chartsToDisplay.includes(projects.slice(pageStartIndex,pageStartIndex + pageSize))){
           setCardsToDisplay(new Array (projects.slice(pageStartIndex,pageStartIndex + pageSize).map(chart =>
             <DashboardProjectCard 
                project={chart} 
                userId={userId}
                setProjectToDelete={setProjectToDelete}
                setProjectToRestoreChart={setProjectToRestoreChart}
                mode = {"rd"}
                key={chart._id.toString()}
            />
            )));
            console.log(projects.slice(pageStartIndex,pageStartIndex + pageSize));
            setChartsToDisplay(new Array(projects.slice(pageStartIndex,pageStartIndex + pageSize)));

            //buttons to show in right situations

            if(projects.length <= (pageStartIndex + pageSize)){
                setNextButton(buttonVisibility[0])
            }
            else{
                setNextButton(buttonVisibility[1]);
            }

            if(pageStartIndex >= pageSize){
                setPrevButton(buttonVisibility[1]);
            }
            else{
                setPrevButton(buttonVisibility[0]);
            }
        }
    }
   
    //next page, need to render only the charts and buttons that need to be rendered
    const nextChartPage = event => {
       let newPageStartIndex = pageStartIndex + pageSize;
       setPageStartIndex(newPageStartIndex);
       
    }
    //previous page, need to render only the charts and buttons that need to be rendered
    const prevChartPage = event => {
        let newPageStartIndex = pageStartIndex - pageSize;
        setPageStartIndex(newPageStartIndex);
    }


    const doProjectDelete = async event =>{
        try
        {   
            const response = await fetch(buildPath('api/wipeproject/'+projectToDelete._id.toString()),
            {method:'DELETE',headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            setProjectIsDeleted(true);
        }
        catch(e)
        {
            alert(e.toString());
        }
    }
    //when project is deleted, page is refreshed
    const handleProjectDeleted = () =>{
        if(projectIsDeleted){
            setProjectIsDeleted(false);
            triggerReSearch();
        }
        
    }
    const setProjectToRestoreChart = async (project) =>{
        try {
            const response = await fetch(buildPath('api/restore-project/'+project._id.toString()),{method:'POST',headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            console.log(res);
            triggerReSearch();
            toast.success(ToastSuccess, {data: {title: "", body: "Your project has been restored succsessfully!"},
                draggable: false, autoClose: 2000, ariaLabel: "Your project has been restored succsessfully!",
            });

        } catch(e){
            toast.error(ToastError, {data: {title: "", body: e},
                draggable: false, autoClose: 2000, ariaLabel: e,
            });
       }
    }

   






    //whenever projects is updated by the parent component, rerender charts
    useEffect(() => { userCharts() }, [projects,pageStartIndex]);
    return (
        <div class= "container p-0 chartsContainer" >
            <div id="chart-row" class="row row-cols-xs-1 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 gx-4 gy-3">
                {cardsToDisplay}
            </div>
            <div class="row px-0 mt-3">
                <div class="col px-0">
                    <button class={prevButton} onClick={prevChartPage}>Previous</button>
                </div>
                <div class="col px-0">
                    <button class={nextButton} onClick={nextChartPage}>Next</button>
                </div>
            </div>
            <div class="modal modal fade" id="deleteProjectModal" tabindex="-1" aria-labelledby="DeleteProjectModalLabel" aria-hidden="true"  data-bs-backdrop="false" data-bs-keyboard="false" >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="DeleteProjectModalLabel">{projectIsDeleted ? "Project was deleted succesfully" :"Are you sure you want to delete " + projectToDelete.nameProject+" permanently?"}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>handleProjectDeleted()}></button>
                        </div>
                        {projectIsDeleted?null:
                        <div class="modal-body">
                            This action cannot be undone!
                        </div>}
                        <div class="modal-footer">
                        {projectIsDeleted?  <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal" onClick={()=>handleProjectDeleted()}>Got It!</button> : <button type="button" class="btn btn-primary w-100" onClick={doProjectDelete}>Yes, delete my project</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default RecentlyDeletedCharts;



