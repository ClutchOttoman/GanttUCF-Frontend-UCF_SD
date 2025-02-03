import Papa from 'papaparse'; // CSV parsing
import React, { useState } from 'react';
import "./DashboardNavBar.css";
import { buildPath } from './buildPath';

function DasboardNavBar() {   
    const [message, setMessage] = useState('');
    const [projectCreated, setProjectCreated] = useState(false);
    const [fetchedProject, setFetchedProject] = useState(null);
    const [csvData, setCsvData] = useState(null);  // State to store CSV data

    const newProjectName = React.createRef();
    const _ud = localStorage.getItem('user_data');
    const ud = JSON.parse(_ud);
    const userId = ud._id;
    const userRole = ud.role;  // Assuming 'role' field indicates user role 

    console.log('User Role:', userRole);  // Debug log to check the user role

    const doCreateProject = async event => {
        event.preventDefault();

        if (!newProjectName.current.value.trim()) {
            setMessage("Project name is required");
                return;
        }


        const obj = { founderId: userId, nameProject: newProjectName.current.value };
        console.log(obj);
        const js = JSON.stringify(obj);
        console.log("Step 1: Starting Create Project API Call");
        try {
            const response = await fetch(buildPath('api/createproject'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const txt = await response.text();
            const res = JSON.parse(txt);
            console.log("Step 2: Create Project Response: ", res);

            console.log("Step 3: Starting Generate Invite Link API Call");
            const linkResponse = await fetch(buildPath('api/generate-invite-link'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: res.project._id })
            });

            console.log("Step 4: Finished Generate Invite Link API Call");

            if (response.error != null) {
                setMessage("API Error:" + response.error);
            } else {
                setMessage('Project has been created');
                setProjectCreated(true);
                // Fetch project and its tasks after creation
                fetchProject(response.project._id);                
                
                window.location.reload(); // Reload the page
               
            }
        }  catch (e) {
            setMessage(e.toString());
        }
    };

    // Handle project creation page refresh
    const handleProjectCreated = async() => {
        if (projectCreated) {
            setProjectCreated(false);
            window.location.assign(window.location.pathname);
        }
    };

    const handleCSVImport = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            Papa.parse(file, {
                complete: (result) => {
                    console.log('Parsed CSV Data:', result.data); // Debugging
                    //if (!result.meta.fields.includes('Task')) {
                        if (!result.meta.fields.includes('Task') || !result.meta.fields.includes('Start') || !result.meta.fields.includes('End')) {
                            setMessage('CSV file is missing required columns');
                            return;
                         }

                        // Modify category before sending to the backend
                const cleanedData = result.data.map((task) => {
                    if (task.Category === 'No category') {
                        task.Category = '';  // Set to empty if 'No category'
                    }
                    return task;
                }); 
                setCsvData(cleanedData); // Save CSV data in state

                },
                header: true // Ensures the first row is treated as column headers
            });
        } else {
            setMessage("Please upload a valid CSV file.");
        }
    };


    const createProjectWithCSV = async (csvData) => {
        console.log("Received CSV Data:", csvData);
    
        try {
            // Create the project using the CSV data
            const projectData = {
                founderId: userId,
                nameProject: newProjectName.current.value,
                csvData: csvData,  // Send the parsed CSV data to the backend
            };
    
            const js = JSON.stringify(projectData);
            const response = await fetch(buildPath('api/createproject'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
    
            const res = await response.json();
    
            if (res.error) {
                setMessage("API Error: " + res.error);
                return;
            }
    
            setMessage('Project created with CSV tasks');
            
            // After creating the project, iterate over the CSV data and create tasks
            for (let i = 0; i < csvData.length; i++) {
                const task = csvData[i];
    
                const startDate = new Date(task.Start);
                const endDate = new Date(task.End);
    
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.error('Invalid date format in task:', task);
                    continue; // Skip this task if the date is invalid
                }
                
                // Task data based on the CSV
                const taskData = {
                taskTitle: task.Task,
                description: task.Description || "",
                startDateTime: startDate.toISOString(), 
                dueDateTime: endDate.toISOString(), 
                taskCreated: new Date().toISOString(),
                taskCategory: task.Category || "No Category",
                taskCategoryId: null,
                color: task.Color,
                pattern: task.Pattern || "No Pattern",
                progress: "Not Started",
                assignedTasksUsers: [],
                prerequisiteTasks: [],
                dependentTasks: [],
                allPrequisitesDone: false,
                tiedProjectId: null,
                taskCreatorId: userId,
                };
    
                // Send request to create the task
                const taskJs = JSON.stringify(taskData);
    
                const taskResponse = await fetch(buildPath('api/createtask'), {
                    method: 'POST',
                    body: taskJs,
                    headers: { 'Content-Type': 'application/json' },
                });
    
                const taskRes = await taskResponse.json();
    
                if (taskRes.error) {
                    console.log("Error creating task:", taskRes.error);
                } else {
                    console.log("Created task:", taskRes);
                }
            }
    
            // Refresh project tasks after creation
            fetchProject(res.project._id);
    
        } catch (e) {
            setMessage("Error creating project or tasks: " + e.toString());
        }
    };

    const fetchProject = async (projectId) => {
        try {
            const projectResponse = await fetch(buildPath(`api/projects/${projectId}`));
            const project = await projectResponse.json();
            setFetchedProject(project);

            if (project.tasks && project.tasks.length > 0) {
                console.log('Tasks:', project.tasks);
                // Map over project.tasks and render in the UI
              }
            } catch (e) {
              setMessage("Failed to fetch project data: " + e.toString());
            }
          };
    

    return (
        <div>
            <div className="d-none d-md-block container-lg navBarBody mb-5">
                <a id="ToDo List" className="btn navBtn topNavBtn" href="/dashboard"><span className="navBtnText">To Do List</span></a>
                <a id="Charts" className="btn navBtn" href="/dashboard/charts"><span className="navBtnText">Charts</span></a>
                <a id="Recently Deleted" className="btn navBtn" href="/dashboard/recently-deleted"><span className="navBtnText">Recently Deleted</span></a>
                <button id="Create Project" className="btn navBtn" data-bs-toggle="modal" data-bs-target="#createProjectModal"><span className="navBtnText">Create Project</span></button> 
                <a id="Account" className="btn navBtn" href="/dashboard/account"><span className="navBtnText">Account</span></a>
            </div>

            <div className="modal fade px-0" id="createProjectModal" tabindex="-1" aria-labelledby="createProjectModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createProjectModalLabel">{projectCreated ? "Project has been Created" : "Create a Project"}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleProjectCreated}></button>
                        </div>
                        <div className="modal-body">
                            {projectCreated ? (
                                <button className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close" onClick={handleProjectCreated}>Got It</button>
                            ) : (
                                <form onSubmit={doCreateProject}>
                                    <label htmlFor="newProjectNameInput">Enter a name for your new project:</label>
                                    <input id="newProjectNameInput" className="form-control mt-2" placeholder="35 characters maximum" ref={newProjectName} />
                                    <div className="mt-3">
                                    <label htmlFor="csvImport" className="form-label" style={{ fontWeight: 'normal' }}>
                                        Import CSV
                                    </label>

                                        <input 
                                            type="file" 
                                            id="csvImport" 
                                            className="form-control" 
                                            accept=".csv" 
                                            onChange={handleCSVImport} 
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create Project</button>
                                </form>
                            )}
                        </div>

                        {!projectCreated && (
                            <div className="modal-footer">
                                <h5 className="message">{message}</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DasboardNavBar;
