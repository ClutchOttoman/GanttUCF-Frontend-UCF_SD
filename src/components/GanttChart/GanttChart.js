import { useEffect, useState } from 'react';
import { buildPath } from '../buildPath';
import './GanttChart.css';
import Grid from './Grid';
import TaskDetails from './TaskDetails';
import Tasks from './Tasks';
import TimeTable from './TimeTable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {ToastContainer} from 'react-toastify';

export default function GanttChart({ projectId, setUserRole, userRole }) {
  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  var userId = ud._id;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [tasks, setTasks] = useState([]);
  const [searchTasks, setSearchTasks] = useState('')

  const [taskDurations, setTaskDurations] = useState([]);
  const [timeRange, setTimeRange] = useState({
    fromSelectMonth: currentMonth,
    fromSelectYear: currentYear.toString(),
    toSelectMonth: currentMonth + 1, 
    toSelectYear: currentYear.toString(),
    selectedRange: "",
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [isExporting, setIsExporting] = useState(false); //added


  const [sortBy, setSortBy] = useState('created'); // Default sort by creation date
  const [teamId, setTeamId] = useState('')

  const sortTasks = (tasks) => {
    const groupedTasks = tasks.reduce((acc, task) => {
      const category = task?.taskCategory || 'No Category Assigned';
      if (!acc[category]) acc[category] = [];
      acc[category].push(task);
      return acc;
    }, {});

    const sortedCategories = Object.keys(groupedTasks)
      .filter(category => category !== 'No Category Assigned')
      .sort();

    const noCategoryTasks = groupedTasks['No Category Assigned'] || [];

    const sortedTasks = [];

    sortedCategories.forEach(category => {
      const tasksInCategory = groupedTasks[category]
        .sort((a, b) => {
          if (sortBy === 'alphabetical') {
            return (a?.taskTitle || '').localeCompare(b?.taskTitle || '');
          } else if (sortBy === 'created') {
            return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
          }
          return 0;
        });
      sortedTasks.push(...tasksInCategory);
    });

    const sortedNoCategoryTasks = noCategoryTasks.sort((a, b) =>
      sortBy === 'alphabetical' 
        ? (a?.taskTitle || '').localeCompare(b?.taskTitle || '')
        : new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
    );

    sortedTasks.push(...sortedNoCategoryTasks);

    return sortedTasks;
  };



  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(buildPath(`api/getProjectDetails/${projectId}`));
        const project = await response.json();
        if (!project || !project.team) {
          return;
        }

        const isFounder = project.founderId === userId;
        const isEditor = project.team.editors.includes(userId);

        if (isFounder) {
          setUserRole('founder');
        } else if (isEditor) {
          setUserRole('editor');
        } else {
          setUserRole('member');
        }

        setTeamId(project.team._id)
        console.log(teamId)

      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();

  }, [projectId, userId, setUserRole]);

  //Fetch Tasks 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
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
          throw new Error('No tasks found in the response.');
        }

        const sortedTasks = sortTasks(fetchedTasks);

        const durations = sortedTasks.map(task => { //changed
          const duration = {
            task: task._id,
            start: task.startDateTime,
            end: task.dueDateTime
          };
          if (!duration._id) {
            duration._id = `${task._id}-${Date.now()}`;
          }
          return duration;
        });

        setTasks(sortedTasks);
        setTaskDurations(durations);
        sessionStorage.setItem("tasks", JSON.stringify(sortedTasks));
      } catch (error) {
        console.error('Error fetching tasks: ', error);
      }
    };

    fetchTasks();
  }, [projectId, userId, setUserRole, sortBy]);

  useEffect(() => {
    const savedSortOption = sessionStorage.getItem("sortBy");
    if (savedSortOption) {
      setSortBy(savedSortOption); // Set the sort option to the saved value
    }
  }, []);

  useEffect(() => {}, [taskDurations]);

  useEffect(() => {
    const sortedTasks = sortTasks(tasks); // Sort the current tasks based on the selected sorting method
    setTasks(sortedTasks); // Update the state with sorted tasks
  }, [sortBy]); // Trigger re-sorting whenever sortBy changes


  useEffect(() => {
    document.documentElement.style.setProperty('--task-count', tasks.length);
  }, [tasks]);

  const handleTimeRangeChange = (event) => {
    let curMonth = new Date().getMonth();
    let curYear = new Date().getFullYear();
    let selectedRange = event.target.value;

    let updatedTimeRange = {
      fromSelectMonth: curMonth,
      fromSelectYear: curYear.toString(),
      toSelectMonth: (curMonth + 1) % 12,
      toSelectYear:
      curMonth === 11
          ? (curYear + 1).toString()
          : curYear.toString(),
      selectedRange: selectedRange,
    };

    setTimeRange(updatedTimeRange); // Update the timeRange state to trigger TimeTable re-render
  };

  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy); // Update the sorting preference
    sessionStorage.setItem("sortBy", newSortBy); // Save the sort option in sessionStorage
  };



  const exportToPDF = async () => {
    const ganttContainer = document.getElementById('gantt-container');
    const exportButtons = document.querySelectorAll('.export-pdf-button, .export-csv-button');
    const rangeMenu = document.querySelector('.gantt-chart-time-range-selector');
    const sortMenu = document.querySelector('.gantt-chart-sort-selector');

    if (!ganttContainer) return;

    // Temporarily hide the elements we don't want in the export
    const hideElements = () => {
      exportButtons.forEach(button => button.style.display = 'none');
      if (rangeMenu) rangeMenu.style.display = 'none';
      if (sortMenu) sortMenu.style.display = 'none';
    };

    // Restore the hidden elements
    const restoreElements = () => {
      exportButtons.forEach(button => button.style.display = '');
      if (rangeMenu) rangeMenu.style.display = '';
      if (sortMenu) sortMenu.style.display = '';
    };

    try {
      // Hide the elements temporarily
      hideElements();

      // Use html2canvas to capture the gantt container
      const canvas = await html2canvas(ganttContainer, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      // Save the PDF
      pdf.save('gantt-chart.pdf');
    } catch (error) {
      console.error('Error exporting Gantt chart to PDF:', error);
    } finally {
      // Restore the elements after the export
      restoreElements();
    }
  };


  const exportToCSV = () => {
    // Set exporting state to true
    setIsExporting(true);

    const tasksData = tasks.map((task) => ({
        Task: task.taskTitle,
        Description: task.description || "",  // Description
        Start: task.startDateTime ? new Date(task.startDateTime).toISOString() : '',
        End: task.dueDateTime ? new Date(task.dueDateTime).toISOString() : '',
        Category: task.taskCategory || "",
        Color: task.color,  // Color (Optional)
        Pattern: task.pattern || 'No Pattern', // Pattern (Optional)
        Status: task.status || 'Not Started',
    }));

     // Convert tasksData to CSV format
     const header = ['Task', 'Description', 'Start', 'End', 'Category', 'Color', 'Pattern', 'Status'];
     const rows = tasksData.map((task) => [
         task.Task,
         task.Description,
         task.Start,
         task.End,
         task.Category,
         task.Color,
         task.Pattern,
         task.Status,
     ]);

    // Combine header and rows into CSV content
    const csvContent = [header, ...rows]
        .map((row) => row.join(','))
        .join('\n');

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gantt-chart-data.csv'; // Name of the CSV file
    link.click();

    // Reset exporting state after download
    setIsExporting(false);
};

const filteredTasks = tasks.filter(task =>
  (task.taskTitle?.toLowerCase() || '').includes(searchTasks.toLowerCase()) ||
  (task.taskCategory?.toLowerCase() || '').includes(searchTasks.toLowerCase())
);

const handleSearch = (event) =>{
  setSearchTasks(event.target.value)
  console.log(searchTasks)
}


  return (
    <div className="container-fluid main-container" >
      {/* For toast deletion confirmations and alerts. */}
      <ToastContainer limit={1}/> 
      <form onSubmit={(e) => e.preventDefault()}  >
          <input type="search" class="form-control searchForm" placeholder='Search tasks by name or category...' id="search-tasks" value ={searchTasks} onChange={handleSearch}/>
      </form >
      <div id="gantt-container">
        <Grid>
          <Tasks
            tasks={filteredTasks}
            setTasks={setTasks}
            setTaskDurations={setTaskDurations}
            userRole={userRole}
            setSelectedTask={setSelectedTask}
            setShowDetails={setShowDetails}
          />
          <TimeTable
            timeRange={timeRange}
            tasks={filteredTasks}
            setTasks={setTasks}
            taskDurations={taskDurations}
            setTaskDurations={setTaskDurations}
            userId={userId}
            projectId={projectId}
            userRole={userRole}
            projectTasks={filteredTasks}
          />
        </Grid>
      </div>
      
      <TaskDetails
        show={showDetails}
        onHide={() => setShowDetails(false)}
        task={selectedTask}
        handleDelete={(taskId) => setTasks(filteredTasks.filter(task => task._id !== taskId))}
        userId={userId}
        userRole={userRole}
        teamId={teamId}
        projectTasks={filteredTasks}
      />

      <div className="export-buttons-container">
        {/* <div className="gantt-chart-sort-selector"> */}
          <select className="gantt-chart-sort-selection" onChange={handleSortChange} value={sortBy}>
            <option value="created">By Creation Date</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        {/* </div> */}

        {!isExporting && (
          <>
            <button onClick={exportToPDF} className="export-pdf-button">
              Export PDF
            </button>
            <button onClick={exportToCSV} className="export-csv-button">
              Export CSV
            </button>
          </>
        )}

        {/* <div class="gantt-chart-time-range-selector"> */}
          <select id = "timeRangeDropdown" class="gantt-chart-time-range-selection" onChange={(e) => handleTimeRangeChange(e)}>
            <option value="">Days</option>
            <option value="weeks"><p>Weeks</p></option>
            <option value="months"><p>Months</p></option>
          </select>
        {/* </div> */}

      </div>
    </div>
  );
}
