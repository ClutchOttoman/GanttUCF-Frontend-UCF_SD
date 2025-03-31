import React, { useEffect, useState } from 'react';
import AnnouncementModal from './AnnouncementModal';
import { buildPath } from './buildPath';
import DashboardCalendar from './DashboardCalendar.js';
import './DashboardToDo.css';
import {toast} from 'react-toastify';
import ToastSuccess from './ToastSuccess';
import ToastError from './ToastError';
var i, j, task,tasks = [];

function toDate(timestanp) {
    var i = 0;
    var date = "";
    date += timestanp.slice(5, 7) + "/" + timestanp.slice(8, 10) + "/" + timestanp.slice(0, 4);
    return date;
}

// Function used to show task date as MM/DD/YYYY
function toDisplayDate(date) {
    const today = new Date();
    const year = parseInt(date.slice(6, 10));
    const month = parseInt(date.slice(0, 2));
    const day = parseInt(date.slice(3, 5));
    const thisDay = parseInt(today.getDate());
    const thisMonth = parseInt(today.getMonth()) + 1;
    const thisYear = parseInt(today.getFullYear());
    if (year < thisYear) { return "PAST DUE"; }
    if (year > thisYear || (month > thisMonth)) { return date }
    if (month < thisMonth) { return "PAST DUE"; }
    if (day - thisDay > 1) { return date; }
    if (day - thisDay < 0) { return "PAST DUE"; }
    if (day - thisDay == 1) { return "Tomorrow";}
    if(day-thisDay == 0){return "Today";}
    return date;
}

function DashboardToDo() {
    var search = ""
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud._id;
    var displayedTasks = [];

    const [taskList, setTaskList] = useState([])
    const [prerequisites, setPrerequisites] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [displayCalendar, setDisplayCalendar] = useState(false);
    const [calendar, setCalendar] = useState(<div></div>);
    const [buttonText, setButtonText] = useState("Calendar View");

    useEffect(() => { 
        const fetchTasks = async () => {
            getTasks();

        };
        fetchTasks();

    }, []);

    // Function to get all the tasks assigned to the user
    const getTasks = async event => {
        var obj = { userId: userId };
        var js = JSON.stringify(obj);
        try {
            //get list of tasks user is assigned to 
            const response1 = await fetch(buildPath('api/search/tasks/todo'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            //get list of projects to get project info for tasks
            const respone2 = await fetch(buildPath("api/readprojects"),
                { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            var txt1 = await response1.text();
            var usersTasks = JSON.parse(txt1);
            var txt2 = await respone2.text();
            var allProjects = JSON.parse(txt2);

            var usersToSearch = [];
            
            //For loop goes through each task pulled from the fetch and adds it to tasks
            for (i = 0; i < usersTasks.length; i++) {

                if (displayedTasks.includes(usersTasks[i]._id)) {
                    return;
                }
                displayedTasks.push(usersTasks[i]._id); // Flag used to prevent readding the same task(?)

                //get all info relevant info for respecitve task
                let currTaskId = usersTasks[i]._id;
                let currTaskTitle = usersTasks[i].taskTitle;
                let currTaskDescription = usersTasks[i].description;
                let currTaskWorkers = usersTasks[i].assignedTasksUsers;
                if(currTaskWorkers){
                    currTaskWorkers.forEach(teamUser => {
                        if(!usersToSearch.includes(teamUser)){usersToSearch.push(teamUser);}
                    });
                }
                let currDueDate = toDate(usersTasks[i].dueDateTime);
                let currDueDatePretty = toDisplayDate(currDueDate);
                let currProjectId = usersTasks[i].tiedProjectId;
                let currTaskProgress = usersTasks[i].progress
                let currTaskCategory = usersTasks[i].taskCategory;
                let currTaskCategoryId = usersTasks[i].taskCategoryId;
                let prerequisiteTasks = usersTasks[i].prerequisiteTasks;
                let currProject = allProjects.filter(project => project._id === currProjectId);
                var currProjectName;
                var currProjectOwnerId;
                if(currProject[0]){
                    currProjectName = currProject[0].nameProject;
                    currProjectOwnerId = currProject[0].founderId;
                }

                task = {
                    _id: currTaskId,
                    taskTitle: currTaskTitle,
                    description: currTaskDescription,
                    users: currTaskWorkers,
                    dueDatePretty: currDueDatePretty,
                    dueDateActual:currDueDate,
                    projectId: currProjectId,
                    projectName: currProjectName,
                    progress: currTaskProgress,
                    projectOwnerId: currProjectOwnerId,
                    taskCategory: currTaskCategory,
                    taskCategoryId: currTaskCategoryId
                };
                tasks.push(task);
            };

            setTaskList(tasks);
        }
        catch (e) {
            console.log(e);
        }
    }
    
    const getPrerequisites = async (taskId) =>{
        console.log(taskId);
        let obj = { id: taskId };
        let js = JSON.stringify(obj);
        try {
            //get list of tasks user is assigned to 
            const response = await fetch(buildPath('api/readallprerequisites'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
    
            let txt = await response.text();
            let prequisites = JSON.parse(txt);
    
            setPrerequisites(prequisites.allPrerequisitesOfTask || []);
        } catch (e) {
            console.log(e);
        }
    };

    // Removes a row that whose task has been marked as complete.
    function dismissTaskFromList(rowNum){
        if (!rowNum){return;}
        console.log(`Inside of dismissTaskFromList(${rowNum})`);
        document.getElementById(`task-row ${rowNum}`).remove();
        document.getElementById(`task-row ${rowNum} show`).remove();
    }

    // Toggles the visibility of a expanded row's content.
    function toggleExpandVisible(rowNum){
        try{
            let rowToggle = document.getElementById(`task-row ${rowNum} show`);
            if (rowToggle.style.visibility === "collapse"){
                rowToggle.style.visibility = "visible";
            } else if (rowToggle.style.visibility === "visible"){
                rowToggle.style.visibility = "collapse";
            }
        }
        catch (e) {
            console.log(e);
        }
    }
   
    // Function for task searching on to-do list
    function doTaskSearch() {
        let value = search.value.toLowerCase();
        let rows = document.getElementById("taskTableBody").getElementsByTagName("tr");
        setExpandedRow(null)

        for (var i = 0; i < rows.length; i++) {
            let taskCol = rows[i].getElementsByTagName("td")[1].textContent.toLowerCase();
            let projectCol = rows[i].getElementsByTagName("td")[3].textContent.toLowerCase();
            let taskCategoryCol = rows[i].getElementsByTagName("td")[2].textContent.toLowerCase();
            if (taskCol.includes(value) || projectCol.includes(value) || taskCategoryCol.includes(value)) {
                rows[i].style.display = "";
            }
            else {
                rows[i].style.display = "none";
            }
        }

    }

    //Removes tasks from the todo list that are completed AND are past due date (Doesn't show old tasks)
    const filterTasks = () => {
        return taskList.filter(task => !(task.dueDatePretty === "PAST DUE" && task.progress === "Completed"));
    };

    // Function to change the progress of a task within the to-do list
    const doMarkTaskStatus = async (task, index) => { 
        var error = "";
        var obj;

        // Only switch between in-progress and completed
        if(task.progress == "In-Progress"){
            var obj = { progress: "Completed" };
        }
        else{
            var obj = { progress: "In-Progress" };
        }

        var js = JSON.stringify(obj);
    
        // Change the progress of the task in the DB
        try {
            console.log("Editing task in to-do list; " + task._id);
            const response = await fetch(buildPath(`api/to-do-tasks/${task._id}`),
            { 
                method: 'PUT', 
                body: js, 
                headers: { 'Content-Type': 'application/json' } 
            });
    
            var jsonResult = await response.json();
            if (response.ok) {
                toast.success(ToastSuccess, {data: {title: jsonResult.message},
                    draggable: false, autoClose: 2000, ariaLabel: jsonResult.message,
                });

                // Remove the item from the to-do list.
                dismissTaskFromList(index);

            } else {
                toast.error(ToastError, {data: {title: jsonResult.error},
                    draggable: false, autoClose: 2000, ariaLabel: jsonResult.error,
                });
            }

        } catch (e) {
            error = "Failed to update task visibility";
            toast.error(ToastError, {data: {title: error},
                draggable: false, autoClose: 2000, ariaLabel: error,
            });
        }
    }

    // Function to help swithcing to the calendar view
    const switchViews = () => {
        setDisplayCalendar(!displayCalendar);
        
        // Change the button text based on the current view
        if (buttonText === "Calendar View") {
            setButtonText("List View");
        } else {
            setButtonText("Calendar View");
        }
    };

    return (
        // Display the calendar or the to-do list
        displayCalendar ? (
            <div class="container px-0 mt-5 mx-0">
                <h1 class="title">Calendar</h1>
                <form class="search-bar-calendar-btn" onSubmit={(e) => e.preventDefault()}>
                    <input type="search" class="form-control searchForm" placeholder='Search tasks by name, category or project...' id="search projects" onChange={doTaskSearch} ref={(c) => search = c} />
                    <button id="calendar-btn" class="calendar-btn" onClick={switchViews} >{buttonText}</button>
                </form>
                <div>
                    {/* Render the calendar using the already fetched task list */}
                    <DashboardCalendar taskList={taskList} />
                </div>
            </div>
        ) : (
        <div class="container px-0 mt-5 mx-0">
            {/*Announcements for new features */}
            <AnnouncementModal />

                <h1 class="title">To Do List</h1>
                <form class="search-bar-calendar-btn" onSubmit={(e) => e.preventDefault()}>
                    <input type="search" class="form-control searchForm" placeholder='Search tasks by name, category or project...' id="search projects" onChange={doTaskSearch} ref={(c) => search = c} />
                    <button class="calendar-btn" onClick={switchViews} >{buttonText}</button>
                </form>
                    <table className="table" id="taskTableHeader">
                        <thead>
                            <tr>
                                <th scope='col' className="todoTableBody">Due Date</th>
                                <th scope='col' className="todoTableBody">Task Name</th>
                                <th scope='col' className="todoTableBody">Category</th>
                                <th scope='col' className="todoTableBody" >Project</th>
                                <th scope='col' className="todoTableBody" >Progress</th>
                                <th scope='col' className="todoTableBody" >Details</th>
                            </tr>
                        </thead>
                            <tbody className="table-group-divider" id="taskTableBody">
                            {filterTasks().map((task, index) => (
                                    <React.Fragment key={task._id}>
                                        {/* Default visible row. */}
                                        <tr
                                            {...index++}
                                            key={task._id}
                                            id={`task-row ${index}`}
                                        >
                                            <td>{task.dueDatePretty}</td>
                                            <td>{task.taskTitle}</td>
                                            <td>{task.taskCategory}</td>
                                            <td>{task.projectName}</td>
                                            <td>{task.progress}</td>
                                            <td><button className="taskBtn" onClick={() => toggleExpandVisible(index)}>...</button></td>
                                        </tr>
                                        {/* For making a row visible on click */}
                                        <tr id={`task-row ${index} show`} style={{visibility: "collapse"}}>
                                            <td colSpan="6" className="details-row">
                                                <div>
                                                    <h5><strong>Description:</strong></h5>
                                                        <p dangerouslySetInnerHTML={{__html: task.description}}></p>
                                                    <p>
                                                        <span>
                                                            {task.dueDatePretty === 'PAST DUE' ?
                                                            `THIS TASK WAS DUE: ${task.dueDateActual}`
                                                            : ''}
                                                        </span>
                                                    </p>
                                                    <button className="btn btn-primary progress-btn" onClick={() => doMarkTaskStatus(task, index)}>
                                                        Mark As {task.progress === "In-Progress" ? "Completed" : 'In-Progress'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expands row to show task description when clicking action button */}
                                        {expandedRow === task._id && (
                                            <tr>
                                                <td colSpan="6" className="details-row">
                                                    <div>
                                                        <h5><strong>Description:</strong></h5>
                                                        <p dangerouslySetInnerHTML={{ __html: task.description }}></p>
                                                        <h5><strong>Prerequisite Tasks:</strong></h5>
                                                        <ul className="prerequsisite-list">
                                                            {prerequisites.map((prereq, index) => (
                                                                <li key={index}>
                                                                    {prereq.taskTitle} - {prereq.progress}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <p>
                                                            <span>
                                                                {task.dueDatePretty === 'PAST DUE' ?
                                                                `THIS TASK WAS DUE: ${task.dueDateActual}`
                                                                : ''}
                                                            </span>
                                                        </p>
                                                        <button className="btn btn-primary progress-btn" onClick={() => doMarkTaskStatus(task, index)}>
                                                            Mark As {task.progress === "In-Progress" ? "Completed" : 'In-Progress'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                    </table>
        </div>
        ));
};

export default DashboardToDo;
