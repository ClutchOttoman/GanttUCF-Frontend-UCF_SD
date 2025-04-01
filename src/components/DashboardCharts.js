import React, { useEffect, useLayoutEffect, useState } from 'react';
import './DashboardCharts.css';
import GanttChartIcon from "./GanttChartIcon.js";
import ProjectCard from "./DashboardProjectCard.js"
import DeleteIcon from "../Images/assets/action_buttons/Delete_Task_or_Chart.png";
import InvisibleProjectIcon from "../Images/assets/action_buttons/Private_Gantt_Chart.png";
import VisibleProjectIcon from "../Images/assets/action_buttons/Public_Gantt_Chart.png";
import {buildPath} from './buildPath';
import DashboardProjectCard from './DashboardProjectCard.js';
function DashboardCharts({ projects, triggerReSearch  }) {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud?._id;
    const [projectToDelete, setProjectToDelete] = useState({});
    const [projectIsDeleted,setProjectIsDeleted] = useState(false);
    
    // FOR CHANGING PROJECT NAME
    const [selectedProject, setSelectedProject] = useState(null);
    const [newName, setNewName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState('');

    //change number of displayed projects based on screen size
    const [pageStartIndex,setPageStartIndex] = useState(0);
    const [oldPageWidth,setOldPageWidth] = useState(document.documentElement.clientWidth)
    const initPageSize = () =>{
        const pageWidth = document.documentElement.clientWidth;
        if(pageWidth > 1400)
            return (8);
        else if(pageWidth > 1200)
            return (6);
        else if(pageWidth > 1000)
            return (4);
        else if(pageWidth > 800)
            return 2
        setOldPageWidth(pageWidth);
    }
    const [pageSize,setPageSize] = useState(8);

    const getPageSize = () =>{
        const pageWidth = document.documentElement.clientWidth;
        const diff = oldPageWidth - pageWidth;
        if(!(diff < 300 && diff > -300)){
            if(pageWidth > 1400)
                setPageSize(8);
            else if(pageWidth > 1200)
                setPageSize(6);
            else if(pageWidth > 1000)
                setPageSize(4);
            else if(pageWidth > 800)
                setPageSize(2);
            setOldPageWidth(pageWidth);
        }
    }

    
    //window.addEventListener("resize",getPageSize);
    useEffect(() => {
        userCharts();
    }, [projects,pageStartIndex]);
    
 // Handle form submission to CHANGE PROJECT NAME
 const handleSubmit = async event  => {
    event.preventDefault();

    var obj = { founderId: userId, nameProject: newName };
    console.log(obj.userId + " : " + obj.nameProject);
    
    try {
        
        
        // Check for project name length
        if (newName.length > 35) {
            setMessage("Project names cannot be longer than 35 characters");
            return;
        }
        
        const response = await fetch(buildPath(`api/projects/updateProjectName/${selectedProject._id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nameProject: newName }),
        });
  
        // Check if the response status is OK
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update project name');
        }
  
        const updatedProject = await response.json();
        
        setNewName('');
        setIsModalOpen(false); // Close modal after successful update
        setMessage('');
        
        window.location.reload();
    } catch (error) {
        setMessage(error.toString());
    }
};
  
      
    
    const buttonOn = "btn chartNavButton", buttonOff = "btn chartNavButton hiddenButton";
    var buttonVisibility = [buttonOff, buttonOn]; //0->prev 1->next
    //when component is rendered, display the first page
    const [prevButton, setPrevButton] = useState(buttonVisibility[0]);
    const [nextButton, setNextButton] = useState(buttonVisibility[1]);
    const [cardsToDisplay,setCardsToDisplay] = useState([]);
    const [chartsToDisplay,setChartsToDisplay] = useState([]);

    
    const userCharts = () => {
        if(projects && chartsToDisplay && !chartsToDisplay.includes(projects.slice(pageStartIndex,pageStartIndex + pageSize))){
           console.log(projects.slice(pageStartIndex,pageStartIndex + pageSize))
           setCardsToDisplay(new Array (projects.slice(pageStartIndex,pageStartIndex + pageSize).map(chart =>
             <DashboardProjectCard 
                project={chart} 
                userId={userId}
                setProjectToDelete={setProjectToDelete}
                setNewName={setNewName}
                setSelectedProject={setSelectedProject}
                setIsModalOpen={setIsModalOpen}
                mode = {"chart"}
                key={chart._id.toString()}
            />
            )));
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
        if(newPageStartIndex > -1){
            setPageStartIndex(newPageStartIndex);
        }
    }
    const doProjectDelete = async event =>{
        try
        {   
            const response = await fetch(buildPath('api/projects/'+projectToDelete._id.toString()),
            {method:'DELETE',headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            console.log(res);
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
    
    //whenever projects is updated by the parent component, rerender charts
    return (
        <div class= "container p-0 chartsContainer" >
            <div id="chart-row" class="row row-cols-xs-1 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 gx-0 gy-3">
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
            <div class="modal modal fade" id="deleteProjectModal" tabIndex="-1" aria-labelledby="DeleteProjectModalLabel" aria-hidden="true"  data-bs-backdrop="false" data-bs-keyboard="false" >
                <div class="modal-dialog">
                    <div class="modal-content delete-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="DeleteProjectModalLabel">{projectIsDeleted ? "Project was deleted succesfully" :"Are you sure you want to delete " + projectToDelete.nameProject+"?"}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>handleProjectDeleted()}
                                style={{ color: 'black', fontSize: '1.7rem', background: 'none', border: 'none' }}> 
                                     ✖  
                            </button>
                        </div>
                        <div class="modal-body">
                            {projectIsDeleted  ? "You can also delete your project from the recently deleted page manually":"Your project will be moved to your recently deleted page for 30 days, then it is deleted permanantly"}
                        </div>
                        <div class="modal-footer">
                        {projectIsDeleted?  <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal" onClick={()=>handleProjectDeleted()}>Got It!</button> : <button type="button" class="btn btn-primary w-100" onClick={doProjectDelete}>Yes, delete my project </button>}
                        </div>
                    </div>
                </div>
            </div>
            {/* Bootstrap Modal */}
            <div className={`modal fade ${isModalOpen ? 'show' : ''}`} id="changeProjectModal" tabIndex="-1" aria-labelledby="changeProjectModalLabel" aria-hidden="true" style={{ display: isModalOpen ? 'block' : 'none' }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="changeProjectModalLabel">Change Project Name</h5>
                                        <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} aria-label="Close"
                                            style={{ color: 'black', fontSize: '1.7rem', background: 'none', border: 'none' }}> 
                                                ✖  
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                    <form onSubmit={(e) => {handleSubmit}}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter new project name"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                        {message && <div className="text-danger">{message}</div>} {/* Display error messages */}
                                    </form>
                                    </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-primary px-0 mx-0 mt-3 w-100" 
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

            
        </div>
    );
}


export default DashboardCharts;


