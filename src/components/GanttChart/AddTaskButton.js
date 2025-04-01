
import React, { useState, useEffect } from 'react';
import './AddTaskButton.css';
import {buildPath} from '../buildPath';
import RichTextEditor from './RichTextEditor.js';
import Hollow_Single_Circle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Circle_Density_1.jsx';
import Hollow_Single_Dot_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Dot_Density_1.jsx';
import Hollow_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Rhombus_Density_1.jsx';
import Hollow_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Square_Density_1.jsx';
import Hollow_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Star_Density_1.jsx';
import Hollow_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Triangle_Density_1.jsx';
import Diagonal_Left_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Left_Single_Line_Density_1.jsx';
import Diagonal_Right_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Right_Single_Line_Density_1.jsx';
import Diagonal_Woven_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Woven_Line_Density_1.jsx';
import Single_Horizontal_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Horizontal_Line_Density_1.jsx';
import Single_Vertical_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Vertical_Line_Density_1.jsx';
import Solid_Single_Circle_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Circle_Density_1.jsx';
import Solid_Single_Dot_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Dot_Density_1.jsx';
import Solid_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Rhombus_Density_1.jsx';
import Solid_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Square_Density_1.jsx';
import Solid_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Star_Density_1.jsx';
import Solid_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Triangle_Density_1.jsx';

import getPattern from './getPattern.js'
import forcePatternColorChange from './forcePatternColorChange.js'

//Default color
const GanttifyOrange = "#DC6B2C";




const patternDisplayNames = {
	'Hollow_Single_Circle_Density_1.jsx':'Hollow Circles',
	'Hollow_Single_Dot_Density_1.jsx':'Hollow Dots',
	'Hollow_Single_Rhombus_Density_1.jsx':'Hollow Rhombuses',
	'Hollow_Single_Square_Density_1.jsx':'Hollow Squares',
	'Hollow_Single_Star_Density_1.jsx':'Hollow Stars',
	'Hollow_Single_Triangle_Density_1.jsx':'Hollow Triangles',
	'Diagonal_Left_Single_Line_Density_1.jsx':'Left Diagonal Lines',
	'Diagonal_Right_Single_Line_Density_1.jsx':'Right Diagonal Lines',
	'Diagonal_Woven_Line_Density_1.jsx':'Woven Diagonal Lines',
	'Single_Horizontal_Line_Density_1.jsx':'Horizontal Line',
	'Single_Vertical_Line_Density_1.jsx':'Vertical Line',
	'Solid_Single_Circle_Density_1.jsx':'Solid Circles',
	'Solid_Single_Dot_Density_1.jsx':'Solid Dots',
	'Solid_Single_Rhombus_Density_1.jsx':'Solid Rhombuses',
	'Solid_Single_Square_Density_1.jsx':'Solid Squares',
	'Solid_Single_Star_Density_1.jsx':'Solid Stars',
	'Solid_Single_Triangle_Density_1.jsx':'Solid Triangles',
    'No Pattern':'No Pattern'
}
const patterns = {
    'Diagonal_Right_Single_Line_Density_1.jsx':Diagonal_Right_Single_Line_Density_1,
    'Diagonal_Left_Single_Line_Density_1.jsx':Diagonal_Left_Single_Line_Density_1, 'Diagonal_Left_Single_Line_Density_1.jsx':Diagonal_Left_Single_Line_Density_1,
    'Diagonal_Woven_Line_Density_1.jsx':Diagonal_Woven_Line_Density_1, 'Single_Horizontal_Line_Density_1.jsx':Single_Horizontal_Line_Density_1,
    'Single_Vertical_Line_Density_1.jsx':Single_Vertical_Line_Density_1,'Solid_Single_Circle_Density_1.jsx':Solid_Single_Circle_Density_1,
    'Solid_Single_Dot_Density_1.jsx':Solid_Single_Dot_Density_1,'Solid_Single_Rhombus_Density_1.jsx':Solid_Single_Rhombus_Density_1,
    'Solid_Single_Square_Density_1.jsx':Solid_Single_Square_Density_1,'Solid_Single_Star_Density_1.jsx':Solid_Single_Star_Density_1,
    'Solid_Single_Triangle_Density_1.jsx':Solid_Single_Triangle_Density_1,'Hollow_Single_Circle_Density_1.jsx':Hollow_Single_Circle_Density_1,
    'Hollow_Single_Dot_Density_1.jsx':Hollow_Single_Dot_Density_1,'Hollow_Single_Rhombus_Density_1.jsx':Hollow_Single_Rhombus_Density_1,
    'Hollow_Single_Square_Density_1.jsx':Hollow_Single_Square_Density_1,'Hollow_Single_Star_Density_1.jsx':Hollow_Single_Star_Density_1,
    'Hollow_Single_Triangle_Density_1.jsx':Hollow_Single_Triangle_Density_1
  }
// Initialization of the modal
const AddTaskButton = ({ projectId }) => {

  const [showModal, setShowModal] = useState(false);
  const [taskData, setTaskData] = useState({
    taskTitle: "",
    description: "",
    dueDateTime: "",
    startDateTime: "",
    assignedTasksUsers: [],
    color: GanttifyOrange,
    pattern: "No Pattern",
    patternColor:"#000000",
    taskCategory: "",
    prerequisiteTasks: [],
    allowEmailNotifications: false,
    dependentTasks: [],
  });


  // Initialization of the variables
  const [teamUsers, setTeamUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [color, setColor] = useState('#DC6B2C'); 
  const [pattern,setPattern] = useState('No Pattern');
  const [patternFilename,setPatternFilename] = useState("")
  const [patternColor,setPatternColor] = useState('#000000');
  const [patternPreview, setPatternPreview] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [prerequisiteTasks, setPrerequisiteTasks] = useState([]);
  const [allowEmailNotifications, setAllowEmailNotifcations] = useState(false);

  //All of the pre-choosen colors
  const colorOptions = [
    '#e81416', '#ffa500', '#faeb36', '#79c314', '#487de7', '#4b369d', '#70369d', 
    '#f47474', '#ffd580', '#fff77e','#b2e687', '#8fb9f9', '#9a86cc', '#b27fc6'
  ];


  // Gets the information about the project for use in task creation
  useEffect(() => {
    getProjectInfo(projectId);
  }, [projectId, showModal]);

  

  //Gets information about project -> team info, project tasks
  const getProjectInfo = async (projectId) => {

    try {
      const response = await fetch(buildPath(`api/getProjectDetails/${projectId}`));
      const project = await response.json();

      if (!project || !project.team) {
        return;
      }

      //get information about tasks
      try{
        const obj = { projectId };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath('api/search/tasks/project'), {
          method: 'POST',
          body: js,
          headers: { 'Content-Type': 'application/json' }
        });


        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }

        const fetchedTasks = await response.json();

        if (!fetchedTasks) {
          setProjectTasks([]);
        }

        //console.log(fetchedTasks);
        const tasks = Array.isArray(fetchedTasks) ? fetchedTasks : [];
        console.log(tasks);
        setProjectTasks(tasks);
      }
      catch(error){
        console.error('Error fetching task information:', error);
      }

      const teamId = project.team._id;
      //get information about project's team
      try {
        const response = await fetch(buildPath(`api/teams/${teamId}`));
        const team = await response.json();

        const founderId = team.founderId;
        const editors = Array.isArray(team.editors) ? team.editors : [];
        const members = Array.isArray(team.members) ? team.members : [];

        const allUserIds = [founderId, ...editors, ...members];
        const uniqueUserIds = [...new Set(allUserIds)];

        const responseUsers = await fetch(buildPath('api/read/users'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ users: uniqueUserIds }),
        });

        if (!responseUsers.ok) {
          throw new Error('Failed to fetch user details');
        }

        const { usersInfo } = await responseUsers.json();
        const filteredUsers = usersInfo.filter(user => user !== null);
        const validUsers = Array.isArray(usersInfo) ? filteredUsers : [];

        setTeamUsers(validUsers);
      } catch (error) {
        console.error('Error fetching team users:', error);
      }

    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };



  //Updates the colors 
  const handleColorChange = async (newColor) => {
    setColor(newColor); 
    setTaskData(oldData => ({...oldData, color: newColor}));
  };

  const handlePatternColorChange = async (newColor) =>{
    setPatternColor(newColor); 
    const patternId = "addTaskPreview";
    forcePatternColorChange(newColor,patternFilename,patternId);
    setTaskData(oldData => ({...oldData, patternColor: newColor}));
  }


  //Updates the task data whenever a text field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };


  //Updates the array of users that are check marked
  const handleCheckboxChange = (userId) => {
    setTaskData((prevData) => {
      const assignedUsers = prevData.assignedTasksUsers.includes(userId) ? prevData.assignedTasksUsers.filter((id) => id !== userId) : [...prevData.assignedTasksUsers, userId];
      return { ...prevData, assignedTasksUsers: assignedUsers };
    });
  };

  const handlePatternChange = async (newPattern,newPatternToDisplay) => {
    console.log(newPattern);
    setPattern(newPatternToDisplay);
    setPatternFilename(newPattern)
    setTaskData(oldData => ({...oldData, pattern: newPattern}));
    setPatternPreview(getPattern(newPattern,patternColor,511,"addTaskPreview"));

  }
  const isPrerequisiteDropdownDisabled = () =>{
    if(projectTasks[0] == null){return true}
    else{return false}
  }
  
  const handlePrerequisiteChange = async (taskId) =>{
    console.log("prereqs changed: " + taskId);
    if(prerequisiteTasks && prerequisiteTasks.includes(taskId)){
        setPrerequisiteTasks(prerequisiteTasks.filter(prereq => prereq !== taskId));
        //console.log("removing prereq: " + taskId + " from: " + prerequisiteTasks);
    }
    else{
        setPrerequisiteTasks([...prerequisiteTasks,taskId]);
        //console.log("adding prereq: " + taskId + " into: " + prerequisiteTasks);
    }
    setTaskData((prevData) => {
        const prerequisiteTasks = prevData.prerequisiteTasks.includes(taskId) ? prevData.prerequisiteTasks.filter((id) => id !== taskId) : [...prevData.prerequisiteTasks, taskId];
        return { ...prevData, prerequisiteTasks: prerequisiteTasks };
      });
  }
  //toggle allowing email notifications
  const handleAllowEmailNotificationsCheckboxChange = async (allowEmailNotifs) =>{
    //console.log(allowEmailNotifs);
    setAllowEmailNotifcations(!allowEmailNotifs);
    setTaskData((prevData)=>{
        return{...prevData, allowEmailNotifications: !allowEmailNotifs}
    });
    
    
  }

  //Validates the date 
  const handleAddTask = async (e) => {

    e.preventDefault();
    const { startDateTime, dueDateTime } = taskData;

    if (new Date(dueDateTime) < new Date(startDateTime)) {
      setErrorMessage("Due date cannot be before start date.");
      return;
    }

    try {
      const newTask = {
        ...taskData, 
        tiedProjectId: projectId, 
        taskCreatorId: localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data'))._id : null,};
      
      
      console.log("New task being created:", newTask);
      await createTask(newTask);
      closeModal();
      setProjectTasks(...projectTasks,newTask);
    } 
    
    catch (error) {
      console.error('Error creating task:', error);
    }
  };


  //Creates the task
  const createTask = async (newTask) => {
    
    
    try {
      var timeZone =  " " + new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
      newTask.dueDateTime += timeZone; 
      newTask.startDateTime += timeZone;
      const response = await fetch(buildPath('api/createtask'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Response data:', responseData);
        throw new Error('Failed to create task');
      }

      window.location.reload();
      //console.log(prerequisiteTasks);
      return responseData;
    } 
    
    catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const closeModal = () => {
    
    setPrerequisiteTasks([]);
    setShowModal(false);
    setTaskData({
      taskTitle: "",
      description: "",
      dueDateTime: "",
      startDateTime: "",
      assignedTasksUsers: [],
      color: GanttifyOrange,
      pattern: "default-pattern",
      patternColor: "#000000",
      taskCategory: "", // Reset the task category
      prerequisiteTasks: [],
      dependentTasks:[],
      allowEmailNotifications: false,
    });
    setPattern('No Pattern')
    setPatternPreview('No Pattern')
    setColor(GanttifyOrange);
    setPatternColor('#000000')
    setAllowEmailNotifcations(false);
    setErrorMessage(""); 
  };


  return (
    <>
    
      <div className="floating-button" onClick={() => setShowModal(true)}>
        <div className="button-content">
          <span className="button-icon">+</span>
          <span className="button-text">Add Task</span>
        </div>
      </div>



      {showModal && (


        <div className="modal show w-100">
          <div className="modal-dialog add-task-modal ">
            <div className="modal-content">


              <div className="modal-header">
                <h5 className="modal-title">Add a Task</h5>
        
                <button type="button" className="btn-close align-content-center" onClick={closeModal} style={{ color: 'black', fontSize: '1.7rem', background: `${GanttifyOrange}`, border: 'none' }}>
                    ✖  
                </button>
                      
              </div>


              <div className="modal-body">
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                
                <form onSubmit={handleAddTask}>
                  <div className="mb-3">
                    <label htmlFor="taskTitle" className="form-label">Task Title</label>
                    <input type="text" className="form-control" id="taskTitle" name="taskTitle" value={taskData.taskTitle} onChange={handleInputChange} required />
                  </div>

                  {/*Rich Text Editor */}
                    <label htmlFor="description" className="form-label">Description</label>
                    <RichTextEditor
                    taskDescription={taskData.description}
                    setTaskDescription={(newDescription) => 
                      setTaskData((prev) => ({ ...prev, description: newDescription }))}
                    /> 

                  <div className="mb-3">
                    <label htmlFor="startDateTime" className="form-label">Start Date</label>
                    <input type="date" className="form-control" id="startDateTime" name="startDateTime" value={taskData.startDateTime} onChange={handleInputChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="dueDateTime" className="form-label">Due Date</label>
                    <input type="date" className="form-control" id="dueDateTime" name="dueDateTime" value={taskData.dueDateTime} onChange={handleInputChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="taskCategory" className="form-label">Task Category (Optional)</label>
                    <input type="text" className="form-control" id="taskCategory" name="taskCategory" value={taskData.taskCategory} onChange={handleInputChange} />
                  </div>
                    <div className="mb-4 dropup dropup-center d-grid gap-2">
                        <label htmlFor='prerequisiteTaskSelection' className="form-label text-align-start">Prerequisite Tasks</label>
                        <button class="dropdownBtnAdd dropdown-toggle" type="button" id="prerequisiteTasks" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" disabled={isPrerequisiteDropdownDisabled()}>Select Prerequisite Tasks</button>
                        <ul class="dropdown-menu" id = "prerequisiteTaskDropdownMenu">
                            {projectTasks.map(task =>(
                                    <a href={"#" + `${task._id}`} key={task._id} class ="dropdown-item">
                                        <div class="form-check  d-flex align-items-center">
                                           <input type ="checkbox" id={task._id} className ="form-check-input checkBoxAddBtn me-2"  checked={taskData.prerequisiteTasks.includes(task._id)} onChange={() => handlePrerequisiteChange(task._id)}/>
                                            <label htmlFor = {task._id} class = "form-check-label prerequisiteTaskDropdownItem">{task.taskTitle}</label>
                                        </div>
                                    </a>
                               
                            ))}
                           <>
                           </>
                        </ul> 
                        </div>                 
                  <div className="mb-4 dropup dropup-center d-grid gap-2">
                  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"></link>
                    <label htmlFor="assignedTasksUsers" className="form-label text-align-start">Assigned Users</label>
                    <button class="dropdownBtnAdd dropdown-toggle" type="button" id="assignedUsers" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Select Users</button>
                    <ul class ="dropdown-menu" id="assignedUsersDropdownMenu" >

                      {teamUsers.map(user => (
                        <a href={"#"+`${user.id}`}key={user._id} class="dropdown-item ">
                          <div class="form-check d-flex align-items-center">
                            <input
                                type="checkbox"
                                class ="form-check-input checkBoxAddBtn me-2"
                                id={`user-${user._id}`}
                                checked={taskData.assignedTasksUsers.includes(user._id)}
                                onChange={() => handleCheckboxChange(user._id)}
                            />
                            <label htmlFor={`user-${user._id}`} class="form-check-label assignedUserDropdownItem">{user.name}</label>
                          </div>
                        </a>
                      ))}
                      </ul>
                    
                  </div>
                  
                 {/*<div class="mb-3 form-check">
                      <label class="form-label allowEmailNotifcationsLabel">Allow Email Notifications</label>
                      <input type="checkbox" class = "form-check-input allowEmailNotifcationsCheckBox" checked = {allowEmailNotifications} onChange={(e) => handleAllowEmailNotificationsCheckboxChange(allowEmailNotifications)}/>
                 </div>*/}
                  <div className="mb-3">
                  <label className="form-label">Task Color</label>


                  <div className="color-picker-container">
                    <input type="color" className="form-control form-control-color taskAppearanceColorPicker" id="myColor" value={color} title="Choose a task color" onChange={(e) => handleColorChange(e.target.value)} />
                  </div>

                </div>

                  <div className="mb-4 dropup dropup-center d-grid gap-2">
                    <label htmlFor="pattern" className="form-label text-align-start">Pattern</label>
                    <button class="dropdownBtnAdd dropdown-toggle" type="button" id="pattern" data-bs-toggle="dropdown" aria-expanded="false">
                        {pattern}
                    </button>
                    <ul class="dropdown-menu">
                        <a onClick={()=>handlePatternChange('No Pattern','No Pattern')} class = "dropdown-item patternDropdownItem">No Pattern</a>
                        <a onClick={()=>handlePatternChange('Hollow_Single_Dot_Density_1.jsx','Hollow Dots')} class = "dropdown-item patternDropdownItem">Hollow Dots</a>
                        <a onClick={()=>handlePatternChange('Hollow_Single_Rhombus_Density_1.jsx','Hollow Rhombuses')} class = "dropdown-item patternDropdownItem">Hollow Rhombuses</a>
                        <a onClick={()=>handlePatternChange('Hollow_Single_Square_Density_1.jsx','Hollow Squares')} class = "dropdown-item patternDropdownItem">Hollow Squares</a>
                        <a onClick={()=>handlePatternChange('Hollow_Single_Star_Density_1.jsx','Hollow Stars')} class = "dropdown-item patternDropdownItem">Hollow Stars</a>
                        <a onClick={()=>handlePatternChange('Hollow_Single_Triangle_Density_1.jsx','Hollow Triangles')} class = "dropdown-item patternDropdownItem">Hollow Triangles</a>
                        <a onClick={()=>handlePatternChange('Diagonal_Left_Single_Line_Density_1.jsx','Left Diagonal Lines')} class = "dropdown-item patternDropdownItem">Left Diagonal Lines</a>
                        <a onClick={()=>handlePatternChange('Diagonal_Right_Single_Line_Density_1.jsx','Right Diagonal Lines')} class = "dropdown-item patternDropdownItem">Right Diagonal Lines</a>
                        <a onClick={()=>handlePatternChange('Diagonal_Woven_Line_Density_1.jsx','Woven Diagonal Lines')} class = "dropdown-item patternDropdownItem">Woven Diagonal Lines</a>
                        <a onClick={()=>handlePatternChange('Single_Horizontal_Line_Density_1.jsx','Horizontal Line')} class = "dropdown-item patternDropdownItem">Horizontal Line</a>
                        <a onClick={()=>handlePatternChange('Single_Vertical_Line_Density_1.jsx','Vertical Line')} class = "dropdown-item patternDropdownItem">Vertical Lines</a>
                        <a onClick={()=>handlePatternChange('Solid_Single_Circle_Density_1.jsx','Solid Circles')} class = "dropdown-item patternDropdownItem">Solid Circles</a>
                        <a onClick={()=>handlePatternChange('Solid_Single_Dot_Density_1.jsx','Solid Dots')} class = "dropdown-item patternDropdownItem">Solid Dots</a>
                        <a onClick={()=>handlePatternChange('Solid_Single_Rhombus_Density_1.jsx','Solid Rhombuses')} class = "dropdown-item patternDropdownItem">Solid Rhombuses</a>
                        <a onClick={()=>handlePatternChange('Solid_Single_Square_Density_1.jsx','Solid Squares')} class = "dropdown-item patternDropdownItem">Solid Squares</a>
                        <a onClick={()=>handlePatternChange('Solid_Single_Star_Density_1.jsx','Solid Stars')} class = "dropdown-item patternDropdownItem">Solid Stars</a>
                        <a onClick={()=>handlePatternChange('Solid_Single_Triangle_Density_1.jsx','Solid Triangles')} class = "dropdown-item patternDropdownItem">Solid Triangles</a>
                        </ul>
                  </div>

                  <div className="mb-3">
                  <label className="form-label">Pattern Color</label>


                  <div className="color-picker-container">
                    <input type="color" className="form-control form-control-color taskAppearanceColorPicker" id="myColor" value={patternColor} title="Choose a pattern color" onChange={(e) => handlePatternColorChange(e.target.value)} />
                  </div>

                </div>
                  <label class="form-label">Task Appearance Preview</label>
                  <div class="row mt-3 justify-content-center">
                    <div class="col-12 d-flex align-items-center">
                        <div class="task-appearance-preview" draggable="false" style={{backgroundColor:`${color}`}}>
                            {patternPreview}
                        </div>
                    </div>
                  </div>
                  <div class="row mt-3 justify-content-center">
                    <div class="col-8">
                        <button type="submit" className="btn btn-primary px-0 mx-0 mt-3 w-100">Add Task</button>
                    </div>
                  </div>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default AddTaskButton;
