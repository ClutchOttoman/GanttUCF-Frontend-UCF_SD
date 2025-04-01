import React, { useEffect, useLayoutEffect, useState } from 'react';
import './DashboardCharts.css';
import GanttChartIcon from "./GanttChartIcon.js";
import DeleteIcon from "../Images/assets/action_buttons/Delete_Task_or_Chart.png";
import RestoreIcon from "../Images/assets/action_buttons/Restore_Chart.png";

const friendText = "Friend";
const meText = "Me";
const publicText = "(public)"
const privateText = "(private)";

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function toRecoverDate(timestamp) {
    var addDate = new Date(timestamp);
    addDate = addDate.addDays(30);
    var date = addDate.toISOString();
    var i = 0;
    var recoverDate = "";
    recoverDate += date.slice(5, 7) + "/" + date.slice(8, 10) + "/" + date.slice(0, 4);
    return recoverDate;
}
// MM/DD/YYYY

function DashboardProjectCard({project,userId,setSelectedProject,setNewName,setIsModalOpen,setProjectToDelete,mode,setProjectToRestoreChart}){
    
    if(project && mode == "chart"){
    return (
        <div class = "col cardCol">
                {/*   ~~~~BIG CARD~~~~
                        <div class="d-none d-xxl-grid card-xxl">
                            <GanttChartIcon class="projectIcon" />
                            <div class="card-body">
                                {userId.toString() === project.founderId.toString() ? 
                                <div class="row align-items-center mb-1">
                                    <div class = "col col-1 px-0 ms-3 me-3"><button name="DeleteButton1" class="projectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" onClick={()=>setProjectToDelete(project)}><img alt="DeleteButtonIcon" src={DeleteIcon} class="btnIcon" /></button></div>
                                    <div class = "col col-2 px-0 me-5"><h5 class="btnLabel">Delete</h5></div>
                                    <div class = "col col-3 pe-0 ps-5 ms-5 mb-1"><a class = "btn viewChartBtn" href = {`/viewchart/${project?._id}`}>View Chart</a></div>
                                    
                                </div>
                                    : 
                                <div class = "row align-items-start justify-content-end mb-1">
                                    <div class = "col col-3 px-0 ms-0 me-1"><a class = "btn viewChartBtn mx-0" href = {`/viewchart/${project?._id}`}>View Chart</a></div>
                                </div>}
                                <h5 class="card-title ms-3">
                                    {project.nameProject}
                                    <button
                                        className="btn-outline-primary"
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setNewName('');
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        ✏️
                                    </button> 
                                </h5>
                                <p class="card-text ms-3 mb-1">Owner: {project.founderId.toString().localeCompare(userId.toString()) === 0 ? meText : friendText} {project.isVisible === 1 ? publicText : privateText}</p>
                            </div>
                        </div>*/}
                        <div class="card">
                            <GanttChartIcon class="projectIcon" />
                            <div class="card-body">
                                {userId.toString() === project.founderId.toString() ? 
                                <div class="row align-items-center mb-1">
                                    <div class = "col col-1 px-0 me-3"><button name="DeleteButton1" class="projectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" onClick={()=>setProjectToDelete(project)}><img alt="DeleteButtonIcon" src={DeleteIcon} class="btnIcon" /></button></div>
                                    <div class = "col col-2 px-0"><h5 class="card-text btnLabel">Delete</h5></div>
                                    <div class = "col col-3 pe-0 ps-5 ms-4 mb-2 me-0"><a class = "btn viewChartBtn" href = {`/viewchart/${project?._id}`}>View Chart</a></div>
                                    
                                </div>
                                    : 
                                <div class = "row align-items-center justify-content-end mb-1">
                                    <div class = "col-3 px-0 ms-0 me-4"><a class = "btn viewChartBtn mx-0" href = {`/viewchart/${project?._id}`}>View Chart</a></div>
                                </div>}
                                <h5 class="card-subtitle">
                                    {project.nameProject}{ userId.toString() === project.founderId.toString() ? 
                                    <button
                                        style={{fontSize: "0.6em"}}
                                        className="btn-outline-primary"
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setNewName('');
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        ✏️ Edit Project Name
                                    </button>:null }
                                </h5>
                                <p class="card-text">Owner: {project.founderId.toString().localeCompare(userId.toString()) === 0 ? meText : friendText}</p>
                            </div>
                        </div>
        </div>
    );}
    else if(project && mode == "rd"){
        return(
            <div class="col cardCol">
                        <div class="card" >
                            <GanttChartIcon class="projectIcon" />
                            <div class="card-body">
                                <div class="row align-items-center mb-1">
                                    <div class = "col col-1 px-0 me-3"><button name="DeleteButton1" class="projectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" onClick={()=>setProjectToDelete(project)}><img alt="DeleteButtonIcon" src={DeleteIcon} class="btnIcon" /></button></div>
                                    <div class = "col col-2 px-0 me-4"><h5 class="btnLabel">Delete</h5></div>
                                    <div class="col col-1 ps-0 ms-5 me-3"><button class="projectBtn"><img alt="RestoreButtonIcon" src={RestoreIcon} class="btnIcon"  onClick={()=>setProjectToRestoreChart(project)}/></button></div>
                                    <div class = "col col-3 px-0"><h5 class = "btnLabel">Restore</h5></div>
                                </div>
                                <h5 class="card-subtitle mt-1">{project.nameProject}</h5>
                                <p class="card-text">Recover Until: {toRecoverDate(project.dateMoved)}</p>
                            </div>
                        </div>
            </div>
        );

        
    }
}

export default DashboardProjectCard;
