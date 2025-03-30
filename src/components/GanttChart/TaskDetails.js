import React, { useEffect, useState } from 'react';
import './TaskDetails.css';
import './RichTextEditor.js';
import DeleteTaskButton from '../../Images/assets/action_buttons/Delete_Task_or_Chart.svg';
import EditTaskButton from '../../Images/assets/action_buttons/Edit_Task.svg';
import {buildPath} from '../buildPath';
import RichTextEditor from './RichTextEditor.js';
import Hollow_Single_Circle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Circle_Density_1.svg';
import Hollow_Single_Dot_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Dot_Density_1.svg';
import Hollow_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Rhombus_Density_1.svg';
import Hollow_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Square_Density_1.svg';
import Hollow_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Star_Density_1.svg';
import Hollow_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Triangle_Density_1.svg';
import Diagonal_Left_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Left_Single_Line_Density_1.svg';
import Diagonal_Right_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Right_Single_Line_Density_1.svg';
import Diagonal_Woven_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Woven_Line_Density_1.svg';
import Single_Horizontal_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Horizontal_Line_Density_1.svg';
import Single_Vertical_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Vertical_Line_Density_1.svg';
import Solid_Single_Circle_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Circle_Density_1.svg';
import Solid_Single_Dot_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Dot_Density_1.svg';
import Solid_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Rhombus_Density_1.svg';
import Solid_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Square_Density_1.svg';
import Solid_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Star_Density_1.svg';
import Solid_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Triangle_Density_1.svg';
import './TimeTable.css';
import './Patterns.css';
import {toast} from 'react-toastify';
import ToastConfirm from '../ToastConfirm';
import ToastError from '../ToastError';

// Colors to choose from
const colorOptions = [
  '#e81416', '#ffa500', '#faeb36', '#79c314', '#487de7', '#4b369d', '#70369d',
  '#f47474', '#ffd580', '#fff77e','#b2e687', '#8fb9f9', '#9a86cc', '#b27fc6'
];
const patternDisplayNames = {
	'Hollow_Single_Circle_Density_1.svg':'Hollow Circles',
	'Hollow_Single_Dot_Density_1.svg':'Hollow Dots',
	'Hollow_Single_Rhombus_Density_1.svg':'Hollow Rhombuses',
	'Hollow_Single_Square_Density_1.svg':'Hollow Squares',
	'Hollow_Single_Star_Density_1.svg':'Hollow Stars',
	'Hollow_Single_Triangle_Density_1.svg':'Hollow Triangles',
	'Diagonal_Left_Single_Line_Density_1.svg':'Left Diagonal Lines',
	'Diagonal_Right_Single_Line_Density_1.svg':'Right Diagonal Lines',
	'Diagonal_Woven_Line_Density_1.svg':'Woven Diagonal Lines',
	'Single_Horizontal_Line_Density_1.svg':'Horizontal Line',
	'Single_Vertical_Line_Density_1.svg':'Vertical Line',
	'Solid_Single_Circle_Density_1.svg':'Solid Circles',
	'Solid_Single_Dot_Density_1.svg':'Solid Dots',
	'Solid_Single_Rhombus_Density_1.svg':'Solid Rhombuses',
	'Solid_Single_Square_Density_1.svg':'Solid Squares',
	'Solid_Single_Star_Density_1.svg':'Solid Stars',
	'Solid_Single_Triangle_Density_1.svg':'Solid Triangles',
    'No Pattern':'No Pattern'
}
const patterns = {
    'Diagonal_Right_Single_Line_Density_1.svg':Diagonal_Right_Single_Line_Density_1,
    'Diagonal_Left_Single_Line_Density_1.svg':Diagonal_Left_Single_Line_Density_1, 'Diagonal_Left_Single_Line_Density_1.svg':Diagonal_Left_Single_Line_Density_1,
    'Diagonal_Woven_Line_Density_1.svg':Diagonal_Woven_Line_Density_1, 'Single_Horizontal_Line_Density_1.svg':Single_Horizontal_Line_Density_1,
    'Single_Vertical_Line_Density_1.svg':Single_Vertical_Line_Density_1,'Solid_Single_Circle_Density_1.svg':Solid_Single_Circle_Density_1,
    'Solid_Single_Dot_Density_1.svg':Solid_Single_Dot_Density_1,'Solid_Single_Rhombus_Density_1.svg':Solid_Single_Rhombus_Density_1,
    'Solid_Single_Square_Density_1.svg':Solid_Single_Square_Density_1,'Solid_Single_Star_Density_1.svg':Solid_Single_Star_Density_1,
    'Solid_Single_Triangle_Density_1.svg':Solid_Single_Triangle_Density_1,'Hollow_Single_Circle_Density_1.svg':Hollow_Single_Circle_Density_1,
    'Hollow_Single_Dot_Density_1.svg':Hollow_Single_Dot_Density_1,'Hollow_Single_Rhombus_Density_1.svg':Hollow_Single_Rhombus_Density_1,
    'Hollow_Single_Square_Density_1.svg':Hollow_Single_Square_Density_1,'Hollow_Single_Star_Density_1.svg':Hollow_Single_Star_Density_1,
    'Hollow_Single_Triangle_Density_1.svg':Hollow_Single_Triangle_Density_1
  }

// Initializes variables
const TaskDetails = ({ show, onHide, task, handleDelete, userId, projectTasks}) => {
  const [status, setStatus] = useState('');
  const [newCategory, setNewCategory] = useState(''); // Added  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('white'); // Default color
  const [patternColor, setPatternColor] = useState('black'); // Default color
  const [patternPreview, setPatternPreview] = useState('');
  const [pattern,setPattern] = useState('No Pattern');
  const [patternToDisplay,setPatternToDisplay] = useState('No Pattern');
  const [taskCreatorName, setTaskCreatorName] = useState('');
  const [assignedUserNames, setAssignedUserNames] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [teamUsers, setTeamUsers] = useState([]);
  const [createdDate, setCreatedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [progressEditPermission, setProgressEditPermission] = useState(false);
  const [taskCategory, setTaskCategory] = useState('');  // Added 
  const [prerequisiteTasks,setPrerequisiteTasks] = useState([]);
  const [dependentTasks, setDependentTasks] = useState([]);
  const [allPrerequisitesDone, setAllPrerequisitesDone] = useState(false);
  const [prerequisiteDropdown,setPrerequisiteDropdown] = useState(null);

  
  const [taskCategories, setTaskCategories] = useState([]); // Added
  const [removeCategory, setRemoveCategory] = useState(false); // Added (New state for the checkbox)
   
  const [originalTask, setOriginalTask] = useState(null);
  const [fetchedTask, setFetchedTask] = useState(null);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  
  useEffect(() => {
    if (task && show) {
      setProgressEditPermission(false);
      setStatus(task.progress);
      setColor(task.color);
      setPatternColor(task.patternColor ? task.patternColor : 'black')
      setTaskCategory(task.taskCategory || 'No category'); //added
      fetchTaskCreator(task.taskCreatorId);
      fetchAssignedUsers(task.assignedTasksUsers);
      getProjectData(task.tiedProjectId);
      setTaskTitle(task.taskTitle);
      setTaskDescription(task.description);
      setCreatedDate(task.taskCreated);
      setStartDate(task.startDateTime);
      setDueDate(task.dueDateTime);
      setPattern(task.pattern);
      setPatternToDisplay(patternDisplayNames[task.pattern]);
      setPatternPreview("url(" + `${patterns[task.pattern]})`)
      setDependentTasks(task.dependentTasks);
      setPrerequisiteTasks(task.prerequisiteTasks);
      setAllPrerequisitesDone(task.allPrerequisitesDone);

      setOriginalTask({
        progress: task.progress,
        color: task.color,
        taskTitle: task.taskTitle,
        description: task.description,
        taskCreated: task.taskCreated,
        startDateTime: task.startDateTime,
        dueDateTime: task.dueDateTime,
        pattern: task.pattern,
        taskCategory: task.taskCategory || 'No category', //added
        prerequisiteTasks: task.prerequisiteTasks,
        dependentTasks: task.dependentTasks,
        allPrerequisitesDone : task.allPrerequisitesDone,
      });

      fetchTaskFromAPI(task._id);
    }
  }, [task, show]);

  // Makes sure that task gets updated live
  const fetchTaskFromAPI = debounce(async (taskId) => {
    if (taskId) {
      try {
        const response = await fetch(buildPath(`api/fetchTask/${taskId}`));

        console.log("Response: ", response);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Response not JSON");
        }

        const fetchedTask = await response.json();

        console.log("fetched task? ", fetchedTask);

        if (fetchedTask) {
          setTaskDetails(fetchedTask);
          setFetchedTask(fetchedTask);
        }
      } catch (error) {
        console.error('Error fetching task from API:', error);
      }
    }
  }, 200);

  // Re-sets the variables with the updated tasks
  const setTaskDetails = (fetchedTask) => {
    setProgressEditPermission(false);
    setStatus(fetchedTask.progress);
    setColor(fetchedTask.color);
    setPatternColor(fetchedTask.patternColor ? fetchedTask.patternColor : 'black')
    setPattern(fetchedTask.pattern);
    setPatternPreview("url(" + `${patterns[fetchedTask.pattern]})`);
    setTaskCategory(fetchedTask.taskCategory || 'No category'); //added
    fetchTaskCreator(fetchedTask.taskCreatorId);
    fetchAssignedUsers(fetchedTask.assignedTasksUsers);
    getProjectData(fetchedTask.tiedProjectId);
    setTaskTitle(fetchedTask.taskTitle);
    setTaskDescription(fetchedTask.description);
    setCreatedDate(fetchedTask.taskCreated);
    setStartDate(fetchedTask.startDateTime);
    setDueDate(fetchedTask.dueDateTime);
    setPatternToDisplay(patternDisplayNames[fetchedTask.pattern])
    setDependentTasks(fetchedTask.dependentTasks);
    setPrerequisiteTasks(fetchedTask.prerequisiteTasks);
    setAllPrerequisitesDone(fetchedTask.allPrerequisitesDone);

    setOriginalTask({
      progress: fetchedTask.progress,
      color: fetchedTask.color,
      taskTitle: fetchedTask.taskTitle,
      description: fetchedTask.description,
      taskCreated: fetchedTask.taskCreated,
      startDateTime: fetchedTask.startDateTime,
      dueDateTime: fetchedTask.dueDateTime,
      pattern : fetchedTask.pattern,
      taskCategory: fetchedTask.taskCategory || 'No category', //added
      prerequisiteTasks: fetchedTask.prerequisiteTasks,
      dependentTasks: fetchedTask.dependentTasks,
      allPrerequisitesDone : fetchedTask.allPrerequisitesDone,
    });
  };

  const handleClickOutside = (event) => {
    if (show && document.getElementById('task-details-sidebar') &&!document.getElementById('task-details-sidebar').contains(event.target)) {
      if (editMode) {
        resetTaskDetails();
        setEditMode(false);
      }
      onHide();
    }
  };

  // If the user clicks off of the sidebar, all of the values get reset
  const resetTaskDetails = () => {
    if (originalTask) {
      setStatus(originalTask.progress);
      setColor(originalTask.color);
      setPatternColor(originalTask.patternColor ? originalTask.patternColor : 'black')
      setTaskTitle(originalTask.taskTitle);
      setTaskDescription(originalTask.description);
      setCreatedDate(originalTask.taskCreated);
      setStartDate(originalTask.startDateTime);
      setDueDate(originalTask.dueDateTime);
      setTaskCategory(originalTask.taskCategory); //added
      setDependentTasks(originalTask.dependentTasks);
      setPrerequisiteTasks(originalTask.prerequisiteTasks);
      setAllPrerequisitesDone(originalTask.allPrerequisitesDone);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onHide, editMode]);

  // Resets the color picker
  useEffect(() => {
    const handleColorPickerClickOutside = (event) => {
      const colorPickerElement = document.getElementById('color-picker-sidebar');
      const colorCircleElement = document.getElementById('color-circle');

      if (showColorPicker && colorPickerElement && colorCircleElement && !colorPickerElement.contains(event.target) && !colorCircleElement.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleColorPickerClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleColorPickerClickOutside);
    };
  }, [showColorPicker]);


    // Fetch categories when the component mounts
    useEffect(() => { //added
      const fetchCategories = async () => {
        try {
          const response = await fetch(buildPath('api/taskcategories'));
          if (response.ok) {
            const categories = await response.json();
            setTaskCategories(categories);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
  
      fetchCategories();
    }, []);


  const getProjectData = async (projectId) => {
    try {
      const response = await fetch(buildPath(`api/getProjectDetails/${projectId}`));
      const project = await response.json();

      if (!project || !project.team) {
        return;
      }

      const isFounder = project.founderId === userId;
      const isEditor = project.team.editors.includes(userId);

      console.log(project)

      // If a user is the founder or editor they can change the progress of a task
      if (isFounder || isEditor) {
        setProgressEditPermission(true);
      }
      setIsEditable(isFounder || isEditor);
      fetchTeamUsers(project.team._id);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const fetchTeamUsers = async (teamId) => {
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
      const validUsers = Array.isArray(usersInfo) ? filterValidUsers(usersInfo) : [];

      setTeamUsers(validUsers);
    } catch (error) {
      console.error('Error fetching team users:', error);
    }
  };

  const fetchTaskCreator = async (taskCreatorId) => {
    try {
      const response = await fetch(buildPath('api/read/users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: [taskCreatorId] }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch task creator details');
      }

      const { usersInfo } = await response.json();
      if (Array.isArray(usersInfo) && usersInfo.length > 0) {
        const creatorName = usersInfo[0]?.name || 'Unknown';
        setTaskCreatorName(creatorName);
      } else {
        throw new Error('Invalid response structure for task creator details');
      }
    } catch (error) {
      console.error('Error fetching task creator details:', error);
    }
  };

  const fetchAssignedUsers = async (userIds) => {
    try {
      const response = await fetch(buildPath('api/read/users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: userIds }),
      });

      if (!response.ok) {
        throw new Error('Error fetching assigned users');
      }

      const { usersInfo } = await response.json();

      if (Array.isArray(usersInfo)) {
        const validUsers = usersInfo.filter(user => user !== null);
        const userNames = validUsers.map(user => user.name || 'User not found');

        setAssignedUserNames(userNames);
        // If user is assigned to the task they can edit task progress
        if (userIds.includes(userId)) {
          setProgressEditPermission(true);
        }

      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Error fetching assigned users:', error);
    }


  };

  const filterValidUsers = (users) => {
    return users.filter(user => user !== null);
  };

  const formatDateForInput = (dateString) => {
    //console.log("Inputted Date: " + dateString);
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return date.toISOString().split('T')[0];  // Convert to YYYY-MM-DD format
  };
  
  const formatDate = (dateString) => {
    //console.log('Date string:', dateString);  // Add this line
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    //console.log('Parsed date:', date);  // Add this line
    return date.toLocaleDateString('en-US', options);
  };
  const isPrerequisiteDropdownDisabled = () =>{
    var prequisiteTaskSelection = projectTasks.filter(preReqTask =>( (preReqTask._id != task._id && !preReqTask.prerequisiteTasks.includes(task._id))));
    if(prequisiteTaskSelection[0] == null){return true}
    else{return false}
  }
  const generatePrereqAlert = () =>{
    var prereqAlert = "You cannot finish this task while its prerequisite tasks are incomplete:"
    var unfinishedTasks = projectTasks.filter(projectTask => (task.prerequisiteTasks.includes(projectTask._id) && projectTask.progress != "Completed"))
    unfinishedTasks.forEach(unfinishedTask => {
        prereqAlert += `\n${unfinishedTask.taskTitle}`
    });
    return prereqAlert;
  }

  const handleStatusChange = async (newStatus) => {
    console.log("fetched task: " + fetchedTask.allPrerequisitesDone + "| task: " + task.allPrerequisitesDone);
    if(newStatus == "Completed" && (fetchedTask.prerequisiteTasks.length != 0 && !fetchedTask.allPrerequisitesDone)){
        toast.error(ToastError, {
          data: {
            title: "",
            body: "You cannot finish this task while its prerequisite tasks are incomplete.", 
          },  
          draggable: false, autoClose: 3000, ariaLabel: "Error: Cannot mark task as complete. "
        });
        return;
    }
    setStatus(newStatus);

    try {
      const response = await fetch(buildPath(`api/tasks/${task._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      const updatedTask = await response.json();
      console.log('Task updated successfully:', updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };


  const handleColorChange = (newColor) => {
    setColor(newColor);
    var element = document.getElementById('color-circle');
    element.style.backgroundColor = newColor;
  };

  const handlePatternColorChange = (newColor) => {
    setPatternColor(newColor);
    //change color of task bar
  }

  
  const handlePatternChange = async (newPattern,newPatternToDisplay) => {
    console.log(newPattern);
    setPatternToDisplay(newPatternToDisplay)
    setPatternPreview("url(" + `${patterns[newPattern]})`);
    setPattern(newPattern);
  }
  
  
  const handleCategoryChange = (event) => {
    // Ensure event.target is valid
    if (event && event.target) {
      setNewCategory(event.target.value);
      setRemoveCategory(false); //added // Ensure checkbox is unchecked when a category is entered
    } else {
      console.error('Event or event.target is undefined');
    }
  };

  //Updates Task
  const handleSaveChanges = async () => {
    if (!task || !task._id) {
      console.error("Task is undefined or missing ID.");
      return;
    }
  
    const currentDate = new Date();
  
    // Check if start date is before due date
    if (new Date(startDate) > new Date(dueDate)) {
      setDateError("Due date cannot be before start date.");
      return;
    }
  
    setDateError('');
  
    // Step 1: Check if the new category exists in the taskCategories
    let categoryToSave = null; // Default to null for removal case

    if (!removeCategory) {
      if (newCategory && !taskCategories.includes(newCategory)) {
    try {
      const response = await fetch(buildPath('api/taskcategories'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryTitle: newCategory }),

      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Failed to create new category:', errorDetails);
        return;
      }

       // Step 3: If creation is successful, update the local state with the new category
       const newCategoryData = await response.json();
       setTaskCategories([...taskCategories, newCategoryData]);  // Add the newly created category
      //  categoryToSave = newCategoryData._id;  // Save the new category's ID
        categoryToSave = newCategoryData.categoryTitle;  // Use the newly created category
      } catch (error) {
        console.error('Error creating new category:', error);
        return; // Don't proceed with saving changes if category creation fails
      }
    } else {
      // If removeCategory is false, set the current category ID
      categoryToSave = taskCategory ? taskCategory._id : null;
    }
  }

  if (categoryToSave === null) {
  // If category is being removed, ensure task category is updated to null
    categoryToSave = null;
  }

    // Step 4: Update task with the category (whether existing or newly created)
    try {

        //adjust dates to be in client's timezone
    

      const response = await fetch(buildPath(`api/tasks/${task._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle,
          description: taskDescription,
          taskCategory: categoryToSave,  // Save the category, either new or existing
          color, // Include color in the update
          assignedTasksUsers: assignedUserNames.map(name => teamUsers.find(user => user.name === name)?._id).filter(id => id),
          taskCreated: createdDate,
          startDateTime: startDate,
          dueDateTime: dueDate,
          pattern: pattern,
          prerequisiteTasks: prerequisiteTasks,
          dependentTasks: dependentTasks,
          allPrerequisitesDone : allPrerequisitesDone,

        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
  
      const updatedTask = await response.json();
      console.log('Task updated successfully:', updatedTask);


      setTaskCategory(updatedTask.category || null ); // Handle removed category
      setOriginalTask(updatedTask); // Sync the original task with the latest data
      // forceTaskVisualUpdate(task._id,pattern,color)
  
      // Update users' to-do list
  
      setEditMode(false); // Exit edit mode
      window.location.reload(); // Reload the page to reflect changes (optional)
  
      onHide(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCheckboxChange = async (userName) => {
    setAssignedUserNames((prevAssignedUserNames) => {
      const updatedAssignedUsers = prevAssignedUserNames.includes(userName) ? prevAssignedUserNames.filter((name) => name !== userName) : [...prevAssignedUserNames, userName];

      const isChecked = prevAssignedUserNames.includes(userName);
    
      const userId = teamUsers.find(user => user.name === userName)._id;
    
      updateSingleUserToDoList(task._id, userId, isChecked);

      return updatedAssignedUsers;
    });
  };

  const handleCheckboxChange2 = () => {
    setRemoveCategory(!removeCategory);
    if (!removeCategory) setNewCategory(''); // Clear the category text field when checkbox is checked
  };

  const handlePrerequisiteChange = async (taskId) =>{
    if(prerequisiteTasks && prerequisiteTasks.includes(taskId)){
        setPrerequisiteTasks(prerequisiteTasks.filter(prereq => prereq !== taskId));
        //console.log("removing prereq: " + taskId + " from: " + prerequisiteTasks);
    }
    else{
        setPrerequisiteTasks([...prerequisiteTasks,taskId]);
        //console.log("adding prereq: " + taskId + " into: " + prerequisiteTasks);
    }
  }

  const updateSingleUserToDoList = async (taskId, userId, isChecked) => {
    try {
      const response = await fetch(buildPath('api/updateSingleUserToDoList'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, userId, isChecked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user\'s toDoList');
      }

      console.log('User\'s toDoList updated successfully');
    } catch (error) {
      console.error('Error updating user\'s toDoList:', error);
    }
  };

  const handleCloseClick = () => {
    handleClickOutside(true);
    onHide();
    resetTaskDetails();
  };
  const handleCloseColorPicker = () => { 
    setShowColorPicker(false);
  }

  const handleDeleteClick = () => {
    toast.warn(ToastConfirm, {
      data: {
        title: "Are you sure you want to delete this task?", 
      },  
      draggable: false, closeButton: false, position: "top-center", ariaLabel: "Are you sure you want to delete this task?", autoClose: false,
      onClose(reason){
        switch (reason){
            case "confirm":
              handleDelete(task._id, task.tiedProjectId);
        }
      }
    });
  };

  if (!show || !task || !fetchedTask) return null;
 
  return (

    <div id="task-details-sidebar" className="task-details-sidebar">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"></link>
      <div className="task-details-header">
        <div className="icon-button-container">
          {isEditable && <button type="button" className="edit-button" onClick={() => setEditMode(!editMode)}><img alt="EditTaskIcon" src={EditTaskButton}/> Edit Task</button>}
          {isEditable && <button type="button" className="delete-button" onClick={handleDeleteClick}><img alt="DeleteTaskIcon" src={DeleteTaskButton}/> Delete Task</button>}
          <button type="button" className="close" onClick={handleCloseClick}>&times;</button>
        </div>
        <div className="task-title-container">
        <div className={`color-circle ${editMode ? 'clickable hover-highlight' : ''}`} id="color-circle" style={{ backgroundColor: color }} onClick={() => editMode && setShowColorPicker(!showColorPicker)} />
          {editMode ? (
            <input id="title-text" type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          ) : (
            <h5 id="task-title" className="task-title">{task.taskTitle}</h5>
          )}
        </div>
      </div>
      {showColorPicker && (
        <div id="color-picker-sidebar" className="container color-picker-sidebar">
            <form>
                <div class ="row justify-content-end">
                    <div class ="col-3 d-flex">
                        <button type="button" className="close" onClick={handleCloseColorPicker}>&times;</button>
                    </div>
                </div>
                <div class ="row justify-content-center">
                    <div class ="col-12 d-flex justify-content-center">
                        <p class="fs-6 fw-bold">Edit Task Appearance</p>
                    </div>
                </div>
                <div class ="row mt-3">
                    <div class ="col-7 d-flex align-items-center">
                        <label>Task Color</label>
                    </div>
                    <div class ="col-5">
                        <input type="color" className="form-control form-control-color color-sidebar-color-picker" id="myColor" value={color} title="Choose a color" onChange={(e) => handleColorChange(e.target.value)} />
                    </div>
                </div>
                <div class = 'row mt-3'>
                    <div class= "col-12 d-flex align-items-center">
                                <button class="nav-link dropdown-toggle taskPatternDropdown" type="button" id="pattern" data-bs-toggle="dropdown" aria-expanded="false">
                                    {patternToDisplay}
                                </button>
                                <ul class="dropdown-menu">
                                <a onClick={()=>handlePatternChange('Hollow_Single_Circle_Density_1.svg','Hollow Circles')} class = "dropdown-item patternDropdownItem patternDropdownItem">Hollow Circles</a>
                                    <a onClick={()=>handlePatternChange('Hollow_Single_Dot_Density_1.svg','Hollow Dots')} class = "dropdown-item patternDropdownItem patternDropdownItem">Hollow Dots</a>
                                    <a onClick={()=>handlePatternChange('Hollow_Single_Rhombus_Density_1.svg','Hollow Rhombuses')} class = "dropdown-item patternDropdownItem patternDropdownItem">Hollow Rhombuses</a>
                                    <a onClick={()=>handlePatternChange('Hollow_Single_Square_Density_1.svg','Hollow Squares')} class = "dropdown-item patternDropdownItem">Hollow Squares</a>
                                    <a onClick={()=>handlePatternChange('Hollow_Single_Star_Density_1.svg','Hollow Stars')} class = "dropdown-item patternDropdownItem">Hollow Stars</a>
                                    <a onClick={()=>handlePatternChange('Hollow_Single_Triangle_Density_1.svg','Hollow Triangles')} class = "dropdown-item patternDropdownItem">Hollow Triangles</a>
                                    <a onClick={()=>handlePatternChange('Diagonal_Left_Single_Line_Density_1.svg','Left Diagonal Lines')} class = "dropdown-item patternDropdownItem">Left Diagonal Lines</a>
                                    <a onClick={()=>handlePatternChange('Diagonal_Right_Single_Line_Density_1.svg','Right Diagonal Lines')} class = "dropdown-item patternDropdownItem">Right Diagonal Lines</a>
                                    <a onClick={()=>handlePatternChange('Diagonal_Woven_Line_Density_1.svg','Woven Diagonal Lines')} class = "dropdown-item patternDropdownItem">Woven Diagonal Lines</a>
                                    <a onClick={()=>handlePatternChange('Single_Horizontal_Line_Density_1.svg','Horizontal Line')} class = "dropdown-item patternDropdownItem">Horizontal Line</a>
                                    <a onClick={()=>handlePatternChange('Single_Vertical_Line_Density_1.svg','Vertical Line')} class = "dropdown-item patternDropdownItem">Vertical Lines</a>
                                    <a onClick={()=>handlePatternChange('Solid_Single_Circle_Density_1.svg','Solid Circles')} class = "dropdown-item patternDropdownItem">Solid Circles</a>
                                    <a onClick={()=>handlePatternChange('Solid_Single_Dot_Density_1.svg','Solid Dots')} class = "dropdown-item patternDropdownItem">Solid Dots</a>
                                    <a onClick={()=>handlePatternChange('Solid_Single_Rhombus_Density_1.svg','Solid Rhombuses')} class = "dropdown-item patternDropdownItem">Solid Rhombuses</a>
                                    <a onClick={()=>handlePatternChange('Solid_Single_Square_Density_1.svg','Solid Squares')} class = "dropdown-item patternDropdownItem">Solid Squares</a>
                                    <a onClick={()=>handlePatternChange('Solid_Single_Star_Density_1.svg','Solid Stars')} class = "dropdown-item patternDropdownItem">Solid Stars</a>
                                    <a onClick={()=>handlePatternChange('Solid_Single_Triangle_Density_1.svg','Solid Triangles')} class = "dropdown-item patternDropdownItem">Solid Triangles</a>
                                    <a onClick={()=>handlePatternChange('No Pattern','No Pattern')} class = "dropdown-item patternDropdownItem">No Pattern</a>
                                    </ul>
                        </div>
                </div>
                <div class ="row mt-5">
                    {/* PATTERN COLOR -- DOES NOT WORK YET
                    <div class ="col-7 d-flex align-items-center">
                        <label>Pattern Color</label>
                    </div>
                    <div class ="col-5">
                        <input type="color" className="form-control form-control-color color-sidebar-color-picker" id="myColor" value={patternColor} title="Choose a color" onChange={(e) => handlePatternColorChange(e.target.value)} />
                    </div>*/}
                </div>
                <div class="row mt-4 justify-content-center">
                    <div class="col-12 d-flex align-items-center">
                        <div class="task-appearance-preview" draggable="false" style={{backgroundColor:`${color}`,backgroundImage:patternPreview,backgroundSize: 'contain'}}></div>
                    </div>
                </div>
            </form>
            
       </div>
      )}
      <div class = "row align-items-start">
        {progressEditPermission ?
        <div className="col-4  dropdownDetails">
            <a className="nav-link dropdown-toggle" id="todoDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >{status}</a>
            <div className="dropdown-menu" aria-labelledby="todoDropdown">
              <a className="dropdown-item" onClick={() => handleStatusChange('Not Started')}>Not Started</a>
              <a className="dropdown-item" onClick={() => handleStatusChange('In-Progress')}>In-Progress</a>
              <a className="dropdown-item" onClick={() => handleStatusChange('Completed')}>Completed</a>
            </div>
        </div> :
        <div className="col-4 dropdownDetails">
            <a className="nav-link" id="todoDropdown" disabled aria-expanded="false" >{status}</a>
        </div>}
        {(editMode && !showColorPicker) ?
            <div class= "col-8 dropdownDetails">
                <a class =  "btn editTaskAppearanceButton m-0" onClick={() => setShowColorPicker(!showColorPicker)} >Edit Task Appearance</a>
            </div>
         : null}
        </div>
      
      {/*Rich Text Editor */}
        <div id="description-title">Description</div>
      {editMode ?
            <RichTextEditor
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            />
      :
      <div 
      id="textbox" 
      dangerouslySetInnerHTML={{
        __html: taskDescription?.trim() ? taskDescription : 'Add a description here...',
      }} 
      />
      }

      <div className="task-details-footer">
        <div className="details">

          <div className="details-header">Details</div>
          <div className="details-body">


            <p><strong>Task Creator:</strong> {taskCreatorName}</p>

            {editMode ? (
              
                <div className="mb-4 dropup dropup-center d-grid gap-2">
                    <label htmlFor="assignedTasksUsers" className="text-align-start"><p><strong>Assigned Users:</strong></p></label>
                    <button class="dropdownBtnAdd dropdown-toggle" type="button" id="assignedUsers" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Select Users</button>
                    <ul class ="dropdown-menu" id="assignedUsersDropdownMenu" >
                  {teamUsers.map(user => (
                   
                    <a href={"#"+`${user.id}`}key={user._id} class="dropdown-item">
                    <div class="form-check">
                      <input
                          type="checkbox"
                          class ="form-check-input"
                          id={`user-${user._id}`}
                          checked={assignedUserNames.includes(user.name)}
                          onChange={() => handleCheckboxChange(user.name)}
                      />
                      <label htmlFor={`user-${user._id}`} class="form-check-label assignedUserDropdownItem">{user.name}</label>
                    </div>
                  </a>
                  ))}
                  </ul>
                
    
                {/* New Task Category Field */}
                <div className="task-detail-field">
                  <label><strong>Task Category:</strong></label>
                  {/* Input field to allow category entry */}
                    <input
                      type="text"
                      value={newCategory}  // Always bind to newCategory state
                      onChange={handleCategoryChange}
                      placeholder="Enter new task category"
                      disabled={removeCategory} // Disable the text field when checkbox is checked
                     
                    
                    />
                </div>
                <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', position: 'relative', top: '-4px' }}>
                  <input
                    type="checkbox"
                    id="noCategoryCheckbox"
                    checked={removeCategory}
                    onChange={handleCheckboxChange2}
                  />
                  <label htmlFor="noCategoryCheckbox">No category</label>
                </div>
              </div>
              {/* For selecting/deselecting prequsites */}
                    <div className="mb-4 dropup dropup-center d-grid gap-2">
                        <label htmlFor='prerequisiteTaskSelection' className="form-label text-align-start">Prerequisite Tasks</label>
                        <button class="dropdownBtnAdd dropdown-toggle" type="button" id="prerequisiteTasks" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" disabled = {isPrerequisiteDropdownDisabled()}>Select Prerequisite Tasks</button>
                        <ul class="dropdown-menu" id = "prerequisiteTaskDropdownMenu">
                            {projectTasks.map(preReqTask =>( (preReqTask._id == task._id || preReqTask.prerequisiteTasks.includes(task._id)) ? null : 
                                <a href={"#" + `${task._id}`} key={preReqTask._id} class ="dropdown-item">
                                    <div class="form-check">
                                        <input type ="checkbox" id={preReqTask._id} class ="form-check-input" value={preReqTask._id} onChange={(e) => handlePrerequisiteChange(e.target.value)} checked={prerequisiteTasks.includes(preReqTask._id) ? true : false}/>
                                        <label htmlFor = {preReqTask._id} class = "form-check-label prerequisiteTaskDropdownItem">{preReqTask.taskTitle}</label>
                                    </div>
                                </a>
                            ))}
                           <>
                           </>
                        </ul>
                    </div>
            </div>
            ) : (
              <>
              <div className="mb-4 dropup dropup-center d-grid gap-2">
                    <label htmlFor="assignedTasksUsers" className="text-align-start"><p><strong>Assigned Users:</strong></p></label>
                    <button class="dropdownBtnAdd dropdown-toggle" type="button" id="assignedUsers" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" disabled = {assignedUserNames[0] ? false: true} >Show Users</button>
                    <ul class ="dropdown-menu" id="assignedUsersDropdownMenu" >
                  {teamUsers.map(user => ( assignedUserNames.includes(user.name) ?
                    
                        <div key={user._id} class="dropdown-item">
                        <label htmlFor={`user-${user._id}`} class="form-check-label assignedUserDropdownItem">{user.name}</label>
                        </div>
                   : null
                  ))}
                  </ul>
                  </div>
              <p><strong>Task Category:</strong> {taskCategory || 'No category assigned'}</p>
              <div className="mb-4 dropup dropup-center d-grid gap-2">
                        <label htmlFor='prerequisiteTaskSelection' className="form-label text-align-start">Prerequisite Tasks</label>
                        <button class="dropdownBtnAdd dropdown-toggle" type="button" id="prerequisiteTasks" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" disabled = {task.prerequisiteTasks[0] ? false : true}>Show Prerequisite Tasks</button>
                        <ul class="dropdown-menu" id = "prerequisiteTaskDropdownMenu">
                            {projectTasks.map(preReqTask =>( prerequisiteTasks.includes(preReqTask._id) ?
                                <div key={preReqTask._id} class ="dropdown-item">
                                    {/*Indicates if the task was done or not. */}
                                    <i className={`${preReqTask.progress === "Completed" ? 'fa-solid fa-check' : 'fa-regular fa-circle-xmark'}`} aria-describedby={`${preReqTask.progress === "Completed" ? 'Completed' : 'Incomplete'}`}></i>
                                    <label htmlFor = {preReqTask._id} class = "prerequisiteTaskDropdownItem">{preReqTask.taskTitle} - <span style={{fontSize: "0.75em", fontStyle: "italic"}}>{preReqTask.progress === "Completed" ? 'Complete' : 'Incomplete'}</span></label>
                                </div> : null
                            ))}
                        </ul>
                    </div>
              </>
                
            )}
            
            

            <p><strong>Created Date:</strong> {formatDate(fetchedTask.taskCreated)}</p>
<p><strong>Start Date:</strong> {editMode ? (
  <input type="date" value={formatDateForInput(startDate)} onChange={(e) => setStartDate(e.target.value)} />
) : (
  formatDate(fetchedTask.startDateTime)
)}</p>

<p><strong>Due Date:</strong> {editMode ? (
  <input type="date" value={formatDateForInput(dueDate)} onChange={(e) => setDueDate(e.target.value)} />
) : (
  formatDate(fetchedTask.dueDateTime)
)}</p>
        {editMode && <button type="button" className="done-button" onClick={handleSaveChanges}>Done</button>}


          </div>

          {dateError && <p className="error">{dateError}</p>}

        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
