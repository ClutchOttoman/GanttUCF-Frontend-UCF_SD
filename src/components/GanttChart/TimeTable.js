import { React, useEffect, useRef, useState } from 'react';
import { months } from '../../constants';
import {
  createFormattedDateFromDate,
  createFormattedDateFromStr,
  dayDiff,
  getDayOfWeek,
  getDaysInMonth,
  getNextDateFromStr,
  monthDiff,
} from '../../helpers/dateFunctions';
// Patterns for tasks
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

import TaskDetails from './TaskDetails';
import './TimeTable.css';

import { buildPath } from '../buildPath';

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Function to determine if a task is happeneing during a certain date
function isTaskHappeningNow(startDate,dueDate,dateToCheck){
    const timestamp = new Date(dateToCheck+"T00:00:00.000Z");
    const start = new Date(startDate);
    const end = new Date(dueDate);
    if(timestamp < start || timestamp > end){
        return false;
    }
    return true;
}

// Adding days to a given date
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export default function TimeTable({
  timeRange,
  tasks,
  setTasks,
  taskDurations,
  setTaskDurations,
  userId,
  projectId,
  userRole,
}) {


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

  const ganttRef = useRef(null);


  // Initializing the Gantt Chart's different states
  const [arrayOfTasks, setArrayOfTasks] = useState([]);
  const [taskDurationElDraggedId, setTaskDurationElDraggedId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [resizingTask, setResizingTask] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentDayMarkerHeight,setCurrentDayMarkerHeight] = useState(0);

  // Used for creating the left and right boundaries of the chart
  const [leftBoundary, setLeftBoundary] = useState(new Date(null));
  const [rightBoundary, setRightBoundary] = useState(new Date(null));

  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const [numWeeks, setNumWeeks] = useState(0);
  
  // For changing the selected view of the chart
  const [selectedRange, setSelectedRange] = useState("Days");

  const rangeSelector = document.getElementById('timeRangeDropdown');

  // If the rangeSelector (the dropdown for the chart views) changes,
  // then the view for the chart is changed
  if (rangeSelector) {
    rangeSelector.addEventListener('change', (event) => {
      const selectedValue = event.target.value;
      setSelectedRange(selectedValue);
    });
  }

  // The number of tasks has changed
  useEffect(() => {
    setNumberOfTasks(arrayOfTasks.length);
  }, [arrayOfTasks]);

  // Gets the project's details
  useEffect(() => { 
      // The currentDay marker height is based on the number of tasks
      setCurrentDayMarkerHeight(tasks.length)
      if(userRole === 'founder' || 'editor'){
        setIsEditable(true);
      }

      setArrayOfTasks(tasks);

      let lB = null;
      let rB = null;
    
      // Determining where to set the left/right boundaries
      for(let i in tasks){        
        // Set the left boundary to the earliest start date of all tasks
        // But only if that task is not already completed
        if(lB == null || ((tasks[i].startDateTime < lB.startDateTime) || ((tasks[i].progress !== "Completed") && (lB.progress === "Completed")))){
          lB = tasks[i];
        }
          
        if(rB == null || rB < tasks[i].dueDateTime){
          rB = tasks[i].dueDateTime;
        }
      }

      if(lB == null){
        lB = tasks[0];
      }

      setLeftBoundary(lB?.startDateTime);
      setRightBoundary(rB);


  }, [projectId, userId, tasks]);

  // Event handlers
  const handleOutsideClick = (e) => {
    if (e.target.closest('.task-duration') === null) {
      setHoveredTask(null);
    }
  };


  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleResizeEnd);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);


  // Handles the "resizing" of a singular task 
  // Only when the start (left side) of a task is dragged
  const handleResizeStart = (e, taskDurationId, direction) => {
    console.log("starting resize");
    e.stopPropagation();
    e.preventDefault();
    setResizingTask(taskDurationId);
    setResizeDirection(direction);
    setIsResizing(true);
    setShowDetails(false);
  };

  // Handles the "resizing" of a singular task 
  // Only when the end (right side) of a task is dragged
  const handleResizeEnd = async () => {
    if (resizingTask && resizeDirection) {
      const taskDuration = taskDurations.find(
        (taskDuration) => taskDuration._id === resizingTask
      );

      if (!taskDuration) {
        return;
      }

      updateTaskAPI(taskDuration);

    }
    if (isDragging) {
      setIsDragging(false);
      handleDragEnd(taskDurationElDraggedId);
    }
  };


  // Updates the task's dates based off of the user's mouse's position 
  const handleMouseMove = (e) => {
    // If the user is resizing a task
    if (resizingTask && resizeDirection) {
      const taskDuration = taskDurations.find(
        (taskDuration) => taskDuration._id === resizingTask
      );

      if (!taskDuration) {
        return;
      }

      const dateCells = Array.from(document.querySelectorAll('[data-date]'));
      const closestDateCell = dateCells.reduce((closest, cell) => {
        const box = cell.getBoundingClientRect();
        const distance = Math.abs(e.clientX - (box.left + box.right) / 2);

        if (distance < closest.distance) {
          return { cell, distance };
        }

        return closest;
      }, { cell: null, distance: Infinity });

      if (closestDateCell.cell) {
        const newDate = closestDateCell.cell.getAttribute('data-date');
        const id = taskDuration._id.slice(0,24);

        // Determining the direction the user is dragging in
        if (resizeDirection === 'left') {
          if (new Date(newDate) <= new Date(taskDuration.end)) {
            taskDuration.start = newDate;
          }
        } else if (resizeDirection === 'right') {
          if (new Date(newDate) >= new Date(taskDuration.start)) {
            taskDuration.end = newDate;
          }
        }
        
        // Set the new task duration
        setTaskDurations((prevDurations) =>
          prevDurations.map((duration) =>
            duration._id === taskDuration._id ? { ...taskDuration } : duration
          )
        );
      }
    }

    // If the user is dragging the entire task instead of dragging one side
    if (isDragging) {
      const taskDuration = taskDurations.find(
        (taskDuration) => taskDuration._id === taskDurationElDraggedId
      );

      if (!taskDuration) {
        return;
      }

      const dateCells = Array.from(document.querySelectorAll('[data-date]'));

      // Gets the cell date that is closest to the user's mouse
      const closestDateCell = dateCells.reduce((closest, cell) => {
        const box = cell.getBoundingClientRect();
        const distance = Math.abs(e.clientX - (box.left + box.right) / 2);

        if (distance < closest.distance) {
          return { cell, distance };
        }

        return closest;
      }, 
      { cell: null, distance: Infinity }
    );

      // Update's the dates that is closest to the user's mouse's position
      if (closestDateCell.cell) {
        const newStartDate = closestDateCell.cell.getAttribute('data-date');
        const daysDuration = dayDiff(new Date(taskDuration.start), new Date(taskDuration.end));
        const newEndDate = new Date(new Date(newStartDate).setDate(new Date(newStartDate).getDate() + daysDuration - 1));

        taskDuration.start = newStartDate;
        taskDuration.end = createFormattedDateFromDate(newEndDate);

        // Set the new task duration
        setTaskDurations((prevDurations) =>
          prevDurations.map((duration) =>
            duration._id === taskDuration._id ? { ...taskDuration } : duration
          )
        );
      }
    }
  };

  // Styling
  const ganttTimePeriod = {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(60px, 1fr)',
    outline: '0.5px solid var(--color-outline)',
    textAlign: 'center',
    height: 'var(--cell-height)',
  };

  const ganttTimePeriodWeeks = {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(90px, 1fr)',
    outline: '0.5px solid var(--color-outline)',
    textAlign: 'center',
    height: 'var(--cell-height)',
  }

  const ganttTimePeriodMonths = {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(180px, 1fr)',
    outline: '0.5px solid var(--color-outline)',
    textAlign: 'center',
    height: 'var(--cell-height)',
  }

  const ganttTimePeriodSpan = {
    margin: 'auto',
    fontSize: '20px',
  };

  const ganttTimePeriodSpanMonths = {
    margin: 'auto',
    fontSize: '10px',
  };

  const ganttTimePeriodCell = {
    position: 'relative',
    outline: '0.5px solid var(--color-outline)',
    marginTop: '0.5px',
  };

  const taskDurationBaseStyle = {
    position: 'absolute',
    height: 'calc(var(--cell-height) * 0.75)',
    top: 'calc(var(--cell-height) / 8)',
    zIndex: '1',
    borderRadius: 'var(--border-radius)',
    boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.05)',
    cursor: isEditable && !isResizing ? 'move' : 'default', // Update cursor style
  };

  const currentDayMarkerStyle = {
    position: 'relative',
    width:'2px',
    left:'29px',
    zIndex: '2',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'black',
    pointerEvents: 'none',
  }

  const currentDayMarkerStyleForMonths = {
    position: 'relative',
    width:'2px',
    left:'89px',
    zIndex: '2',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'black',
    pointerEvents: 'none',
  }

  const currentDayMarkerStyleForWeeks = {
    position: 'relative',
    width:'2px',
    left:'44px',
    zIndex: '2',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'black',
    pointerEvents: 'none',
  }

  const currentDate = new Date();

  // Function to call to make sure the dates are in the correct format
  function ensureDate(value) {
    if (value instanceof Date) {
      return value;
    }
    const date = new Date(value);
    if (!isNaN(date)) {
      return date;
    } else {
      throw new Error("Invalid date value provided");
    }
  }

  // Initializing of important dates
  let startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6);
  let endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 6);
  let earliestTaskStartDate = currentDate;
  let latestTaskDueDate = currentDate;
  let earliestTaskStartWeek = null;
  let earliestTaskStartWeekIndex = 0;
  let earliestTaskStartWeekProgress = "";
  let earliestTaskStartMonth = null;
  let earliestTaskStartMonthIndex = 0;
  let earliestTaskStartMonthProgress = "";

  if(arrayOfTasks.length > 0){
    //Make the chart render with the left boundary at the earliest task start date
    earliestTaskStartDate = leftBoundary;
    latestTaskDueDate = rightBoundary;

    earliestTaskStartDate = ensureDate(earliestTaskStartDate);
    latestTaskDueDate = ensureDate(latestTaskDueDate);

    // Gets the start and end dates
    startMonth = new Date(earliestTaskStartDate.getFullYear(), earliestTaskStartDate.getMonth() - 6);
    endMonth = new Date(earliestTaskStartDate.getFullYear(), earliestTaskStartDate.getMonth() + 6);
  }

  const numMonths = monthDiff(startMonth, endMonth) + 1;
  let month = new Date(startMonth);

  // Arrays to hold things for the months/weeks/days/tasks
  let monthRows = [];
  let dayRows = [];
  let dayRow = [];
  let weekRows = [];
  let weekRow = [];
  let taskRows = [];
  let taskRow = [];
  //Index helpers
  let currentDayIndex = 0;
  let dayCounter = -1;
  let numDaysForBoundaries = 0;

  // Get the st, th, and rd for the respective numbers
  function getOrdinal(n) {
    return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th";
  }

  // Change the view based on the selected view, default being the day view
  switch(selectedRange){
    case "weeks":
      let tempDateHolder = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
      let numWeeks = 0;

      // Decides if the task is occurring in a specified week
      function isTaskHappeningInWeek(taskStart, taskEnd, weekStart, weekEnd) {
        taskStart = new Date(taskStart);
        taskEnd = new Date(taskEnd);
        weekStart = new Date(weekStart);
        weekEnd = new Date(weekEnd);
        weekEnd.setHours(23, 59, 59, 999);

        return (
          (taskStart >= weekStart && taskStart <= weekEnd) ||
          (taskEnd >= weekStart && taskEnd <= weekEnd) ||
          (taskStart < weekStart && taskEnd > weekEnd)
        );
      }

      for (let i = 0; i < numMonths; i++) {
        // For each month, push the Month + Year to the top of the chart
        monthRows.push(
          <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
            <span style={ganttTimePeriodSpan}>
              {months[month.getMonth()] + ' ' + month.getFullYear()}
            </span>
          </div>
        );

        let currentWorkingDate = new Date(tempDateHolder);
        let lastDate = new Date(currentWorkingDate.getFullYear(), currentWorkingDate.getMonth() + 1, 0);

        while(currentWorkingDate <= lastDate){
          let nextWorkingDate = new Date(currentWorkingDate);
          nextWorkingDate.setDate(currentWorkingDate.getDate() + 6);
          
          const startDay = currentWorkingDate.getDate();
          const endDay = nextWorkingDate.getDate();

          const startOrdinal = getOrdinal(startDay);
          const endOrdinal = getOrdinal(endDay);

          const startMonthName = months[currentWorkingDate.getMonth()];
          const endMonthName = months[nextWorkingDate.getMonth()];

          let currentDateInWeek = isTaskHappeningInWeek(currentDate, currentDate, currentWorkingDate, nextWorkingDate);

          // If the current Date is a part of the week, push it with the 
          // CurrentDayMarker, if not, only push the grid without it
          currentDateInWeek ?
            dayRow.push(
              <div>
                <div key={currentWorkingDate.toISOString()} style={{ ...ganttTimePeriod, outline: 'none' }}>
                  <span style={{ ...ganttTimePeriodSpanMonths, color: '#3E455B' }}>
                    {`${startMonthName} ${startDay}${startOrdinal} - ${endMonthName} ${endDay}${endOrdinal}`}
                  </span>
                </div>
                <div id='currentDayMarker' style={{
                  ...currentDayMarkerStyleForWeeks,
                  height:`calc(var(--cell-height)*${currentDayMarkerHeight})`
                }}
              />
              </div>
            )
            :
            // Push the row with the names for the Weeks (e.g -> Feb 27th - Mar 5th)
            //Day Row is used for weeks in the weeks view
            dayRow.push(
              <div key={currentWorkingDate.toISOString()} style={{ ...ganttTimePeriod, outline: 'none' }}>
                <span style={{ ...ganttTimePeriodSpanMonths, color: '#3E455B' }}>
                  {`${startMonthName} ${startDay}${startOrdinal} - ${endMonthName} ${endDay}${endOrdinal}`}
                </span>
              </div>
            );;

          // Incrementing the current week
          currentWorkingDate.setDate(currentWorkingDate.getDate() + 7);

          numWeeks++;

          if(currentWorkingDate == lastDate){
            tempDateHolder = new Date(currentWorkingDate.getFullYear(), currentWorkingDate.getMonth() + 1, 1);
          }
          else if(currentWorkingDate > lastDate){
            tempDateHolder = new Date(currentWorkingDate);
          }
        }

        // Push the weeks for this month to another container
        dayRows.push(
          <div key={i} style={{ ...ganttTimePeriodWeeks, outline: 'none' }}>
            {dayRow}
          </div>
        );

        // Reset containers and increment month
        dayRow = [];
        weekRow = [];

        month.setMonth(month.getMonth() + 1);
      }

      // Finding the task duration for the task bars 
      function findTaskDuration(currentWeekStart, endDate){
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
        let weekDif = 0;

        do{
          weekDif++;
          currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
          currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
        }while(endDate > currentWeekEnd)

        if(endDate > currentWeekStart){
          weekDif++;
        }

        return weekDif;
      }

      if (tasks) {
        // Push the tasks in the same manner as the rows of Dates/Weeks/Months
        tasks.forEach((task, index) => {
          const startDate = new Date(task.startDateTime);
          const dueDate = new Date(task.dueDateTime);
          
          for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
            const currentWeekStart = new Date(startMonth);
            currentWeekStart.setDate(currentWeekStart.getDate() + weekIndex * 7);
      
            const currentWeekEnd = new Date(currentWeekStart);
            currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
            currentWeekEnd.setHours(23, 59, 59, 999);
      
            const isTaskInWeek = isTaskHappeningInWeek(
              startDate,
              dueDate,
              currentWeekStart,
              currentWeekEnd
            );

            // Determine where the left side of the chart will render to
            // Sets to earliest task that is NOT complete
            if(isTaskInWeek && (earliestTaskStartWeek == null || ((currentWeekStart < earliestTaskStartWeek) || ((task.progress !== "Completed") && (earliestTaskStartWeekProgress === "Completed")) ))){
              earliestTaskStartWeek = currentWeekStart;
              earliestTaskStartWeekProgress = task.progress;
              earliestTaskStartWeekIndex = weekIndex;
            }
      
            // Push individual task to the row
            taskRow.push(
              <div
                key={`${task._id}-${currentWeekStart.toISOString()}-${index}`}
                style={{
                  ...ganttTimePeriodCell,
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                  ...(hoveredRow === task._id && { backgroundColor: '#f0f0f0' }),
                }}
                data-task={task._id}
                onMouseEnter={() => setHoveredRow(task._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >

                {taskDurations.map((el, i) => {                  
                  const elStartDate = new Date(el?.start.split('T')[0]);
                  const elEndDate = new Date(el?.end.split('T')[0]);

                  const adjustedWeekEnd = new Date(currentWeekEnd);
                  adjustedWeekEnd.setHours(23, 59, 59, 999);

                  if (el?.task === task._id &&
                    elStartDate >= currentWeekStart &&
                    elStartDate <= adjustedWeekEnd
                  ) {

                    return (
                      <div
                        key={`${i}-${el?.task}`}
                        id={`${task._id}--pattern-target`}
                        className="task-duration"
                        draggable="false"
                        style={{
                          ...taskDurationBaseStyle,
                          width: `calc(${findTaskDuration(currentWeekStart, dueDate)} * 100% - 1px)`,
                          background: task.color || 'var(--color-primary-light)',
                          backgroundImage: patterns[task.pattern] ? `url(${patterns[task.pattern]})` : 'none',
                          backgroundSize: 'contain',
                        }}
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDetails(true);
                        }}
                      ></div>
                    );
                  }
                })}
              </div>
            );
          }
      
          taskRows.push(
            <div key={`${task._id}-month-${index}`} style={ganttTimePeriodWeeks}>
              {taskRow}
            </div>
          );

          // Reset for next task
          taskRow = [];
        });
      }

      break;

      case "months":

        // Decides if the task is occurring in a specified month
        function isTaskHappeningInMonth(taskStart, taskEnd, monthStart, monthEnd, index) {
          taskStart = new Date(taskStart);
          taskEnd = new Date(taskEnd);
          monthStart = new Date(monthStart);
          monthEnd = new Date(monthEnd);
          monthEnd.setHours(23, 59, 59, 999);

          return ((taskStart >= monthStart && taskStart <= monthEnd) ||
          (taskEnd >= monthStart && taskEnd <= monthEnd) ||
          (taskStart < monthStart && taskEnd > monthEnd));
        }
      

        let numYears = endMonth.getFullYear() - startMonth.getFullYear();
        let i = 0;
        let startYear = startMonth.getFullYear();
  
        do{
        dayRow = [];

        //Pushing each YEAR for the top of the chart
          monthRows.push(
            <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
              <span style={ganttTimePeriodSpan}>
                {startYear}
              </span>
            </div>
          );
        
        let currentWorkingMonth = new Date();
        let lastMonthOfCurrentYear = new Date();

        if(i == 0){
          currentWorkingMonth = new Date(startMonth);
          lastMonthOfCurrentYear = new Date(startMonth.getFullYear(), 11, 31);
        }
        else{
          currentWorkingMonth = new Date(startMonth.getFullYear() + 1, 0, 1);
          lastMonthOfCurrentYear = new Date(endMonth);
        }

        while(currentWorkingMonth <= lastMonthOfCurrentYear){

          let lastDayOfMonth = new Date(currentWorkingMonth.getFullYear(), currentWorkingMonth.getMonth() + 1, 0);
          let currentDateInMonth = isTaskHappeningInMonth(currentDate, currentDate, currentWorkingMonth, lastDayOfMonth);
          
          // Pushing each MONTH for the top of the chart
          // Day Row is used for months in the month view
          // Same pushing of the currentDayMarker or not depending
          // On if the current date is within the month
          currentDateInMonth ?
          dayRow.push(
            <div>
              <div key={currentWorkingMonth.toISOString()} style={{ ...ganttTimePeriod, outline: 'none' }}>
                <span style={{ ...ganttTimePeriodSpanMonths, color: '#3E455B' }}>
                  {`${months[currentWorkingMonth.getMonth()]}`}
                </span>
              </div>
                <div id='currentDayMarker' style={{
                  ...currentDayMarkerStyleForMonths,
                  height:`calc(var(--cell-height)*${currentDayMarkerHeight})`
                }}
              />
            </div>
          )
          : dayRow.push(
            <div key={currentWorkingMonth.toISOString()} style={{ ...ganttTimePeriod, outline: 'none' }}>
              <span style={{ ...ganttTimePeriodSpanMonths, color: '#3E455B' }}>
                {`${months[currentWorkingMonth.getMonth()]}`}
              </span>
            </div>
          );;
          

          // Increment Month
          currentWorkingMonth.setMonth(currentWorkingMonth.getMonth() + 1);
        }

        dayRows.push(
          <div key={i} style={{ ...ganttTimePeriodMonths, outline: 'none' }}>
            {dayRow}
          </div>
        );

          // Reset container and increment year
          dayRow = [];
  
          i++;
          startYear++;
        }while(i < numYears + 1);
  
        // Finding task duration for task bars
        function findTaskDurationMonths(currentMonthStart, endDate) {
          let monthDif = 0;
        
          if (!(currentMonthStart instanceof Date)) {
            currentMonthStart = new Date(currentMonthStart);
          }
          if (!(endDate instanceof Date)) {
            endDate = new Date(endDate);
          }
        
          let tempDate = new Date(currentMonthStart);
          while (tempDate <= endDate) {
            monthDif++;
            tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 1);
          }
        
          return monthDif;
        }
  
        if (tasks) {
          // Pushing task bars for their specific task durations
          tasks.forEach((task, index) => {
            // taskRows = [];
            taskRow = [];

            const startDate = new Date(task.startDateTime);
            const dueDate = new Date(task.dueDateTime);
                  
            for (let monthIndex = 0; monthIndex < numMonths; monthIndex++) {
              let currentMonth = new Date(startMonth.getFullYear(), startMonth.getMonth() + monthIndex, 1);
              let currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
              currentMonthEnd.setHours(23, 59, 59, 999);

              const isTaskInMonth = isTaskHappeningInMonth(
                startDate,
                dueDate,
                currentMonth,
                currentMonthEnd,
                index
              );

              // Determine where the left side of the chart will render to
              // Sets to earliest task that is NOT complete
              if(isTaskInMonth && (earliestTaskStartMonth == null || ((currentMonth < earliestTaskStartMonth) || ((task.progress !== "Completed") && (earliestTaskStartMonthProgress === "Completed"))))){
                earliestTaskStartMonth = currentMonth;
                earliestTaskStartMonthProgress = task.progress;
                earliestTaskStartMonthIndex = monthIndex;
              }

              taskRow.push(
                <div
                  key={`${task._id}-${currentMonth.toISOString()}-${index}`}
                  style={{
                    ...ganttTimePeriodCell,
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                    ...(hoveredRow === task._id && { backgroundColor: '#f0f0f0' }),
                  }}
                  data-task={task._id}
                  onMouseEnter={() => setHoveredRow(task._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
        
                  {taskDurations.map((el, i) => {
                    const elStartDate = new Date(el?.start.split('T')[0]);
                    const elEndDate = new Date(el?.end.split('T')[0]);

                    const adjustedMonthEnd = new Date(currentMonthEnd);
                    adjustedMonthEnd.setHours(23, 59, 59, 999);
                          
                    if (el?.task === task._id &&
                      elStartDate >= currentMonth &&
                      elStartDate <= adjustedMonthEnd
                    ) {

                      return (
                        <div
                          key={`${i}-${el?.task}`}
                          id={`${task._id}--pattern-target`}
                          className="task-duration"
                          draggable="false"
                          style={{
                            ...taskDurationBaseStyle,
                            width: `calc(${findTaskDurationMonths(currentMonth, dueDate)} * 100% - 1px)`,
                            background: task.color || 'var(--color-primary-light)',
                            backgroundImage: patterns[task.pattern] ? `url(${patterns[task.pattern]})` : 'none',
                            backgroundSize: 'contain',
                          }}
                          onClick={() => {
                            setSelectedTask(task);
                            setShowDetails(true);
                          }}
                        ></div>
                      );
                    }
                  })}
                </div>
              );
            }
        
            // Push the tasks into their larger containers
            taskRows.push(
              <div key={`${task._id}-month-index-${index}`} style={ganttTimePeriodMonths}>
                {taskRow}
              </div>
            );
    
            // Reset the container for next Task
            taskRow = [];
          });
        }
  
      break;

    default:
      // Determining where the chart will render to based on earliest task
      if(earliestTaskStartDate <= currentDate){
        for (let countMonths = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1); countMonths < earliestTaskStartDate; countMonths.setDate(countMonths.getDate() + 1)) {
          numDaysForBoundaries++;
        }
      }
      else{
        for (let countMonths = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1); countMonths < new Date(endMonth.getFullYear(), endMonth.getMonth(), 1); countMonths.setDate(countMonths.getDate() + 1)) {
          numDaysForBoundaries++;
        }
      }

      for (let i = 0; i < numMonths; i++) {
        // Pushing months for the top part of the chart
        monthRows.push(
          <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
            <span style={ganttTimePeriodSpan}>
              {months[month.getMonth()] + ' ' + month.getFullYear()}
            </span>
          </div>
        );

        const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1);
        const currYear = month.getFullYear();
        const currMonth = month.getMonth() + 1;

        for (let j = 1; j <= numDays; j++) {
          let k = getOrdinal(j);

          const formattedDate = createFormattedDateFromStr(currYear, currMonth, j);
          const nextDate = getNextDateFromStr(currYear,currMonth,j);
          if (new Date(formattedDate).toDateString() === currentDate.toDateString()) {
            currentDayIndex = dayCounter;
            }
            // Pushing the day with the current day marker 
            if(new Date(nextDate).toDateString() === currentDate.toDateString()){
                // Push each day to the day row when on the day view
                dayRow.push(
                    <div>
                    <div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
                      <span style={ganttTimePeriodSpanMonths}>
                        {getDayOfWeek(currYear, currMonth - 1, j - 1)} {j}{k}
                      </span>
                    </div>
                    <div id='currentDayMarker' style={{
                        ...currentDayMarkerStyle,
                        height:`calc(var(--cell-height)*${currentDayMarkerHeight})`
                      }}
                    />
                    </div>
                  );
                  
            // Pushing the day without the current day marker 
            }
            else{
                dayRow.push(
                
                    <div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
                      <span style={ganttTimePeriodSpanMonths}>
                          {getDayOfWeek(currYear, currMonth - 1, j - 1)} {j}{k}
                      </span>
                    </div>
            
                );
            }

          weekRow.push(
            <div key={j} style={{ ...ganttTimePeriod, outline: 'none' }}>
              <span style={{ ...ganttTimePeriodSpanMonths, color: '#3E455B' }}>
                {getDayOfWeek(currYear, currMonth - 1, j - 1)}
              </span>
            </div>

          );

          dayCounter++;
        }

        //Pushing them into their respective containers
        dayRows.push(
          <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
            {dayRow}
          </div>
        );

        weekRows.push(
          <div key={i} style={{ ...ganttTimePeriod, outline: 'none' }}>
            {weekRow}
          </div>
        );

        // Reset for next Day/Week and increment for next month
        dayRow = [];
        weekRow = [];
        month.setMonth(month.getMonth() + 1);
      }

      if (tasks) {
        // Push every task as above
        tasks.forEach((task, index) => {
          const startDate = task.startDateTime;
          const dueDate = task.dueDateTime;
          let mnth = new Date(startMonth);
          for (let i = 0; i < numMonths; i++) {
            const curYear = mnth.getFullYear();
            const curMonth = mnth.getMonth() + 1;
    
            const numDays = getDaysInMonth(curYear, curMonth);
    
            for (let j = 1; j <= numDays; j++) {
    
              
              const dayOfTheWeek = getDayOfWeek(curYear, curMonth - 1, j - 1);
              const formattedDate = createFormattedDateFromStr(curYear, curMonth, j);
              var taskHappening=false;
              if(task['pattern'] && (task['pattern'] in patterns)){
                taskHappening = isTaskHappeningNow(startDate,dueDate,formattedDate);
              }
              taskRow.push(
                <div
                  key={`${task._id}-${j}`}
                  style={{
                    ...ganttTimePeriodCell,
                    backgroundColor:
                      dayOfTheWeek === 'S' ? 'var(--color-tertiary)' : index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                    ...(hoveredRow === task._id && { backgroundColor: '#f0f0f0' }),
                  }}
    
                  data-task={task?._id}
                  data-date={formattedDate}
                  data-task-id={task._id}
                  onDrop={onTaskDurationDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                  onMouseEnter={() => setHoveredRow(task._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  
                  {taskDurations.map((el, i) => {
                    const elStartDate = el?.start.split('T')[0];
    
                    if (el?.task === task?._id && elStartDate === formattedDate) {
                      return (
                        
                        <div
                          key={`${i}-${el?.task}`}
                          id={`${task._id}--pattern-target`}
                    
                          className={`task-duration ${taskDurationElDraggedId === el?._id ? 'dragging' : ''}`}
    
                          draggable={isEditable && !isResizing ? "true" : "false"}
    
                          tabIndex="0"
                          onDragStart={isEditable && !isResizing ? () => handleDragStart(el?._id) : null}
                          onDragEnd={isEditable && !isResizing ? () => handleDragEnd(el?._id) : null}
                          onMouseMove={(e) => handleMouseMove(e)}
    
                          onMouseUp={handleResizeEnd}
    
                          style={{
                            
                            ...taskDurationBaseStyle,
                            width: `calc(${dayDiff(el?.start, el?.end)} * 100% - 1px)`,
                            opacity: taskDurationElDraggedId === el?._id ? '0.5' : '1',
                            background: task.color || 'var(--color-primary-light)',
                            backgroundImage: patterns[task.pattern] ? `url(${patterns[task.pattern]})` : 'none',
                            backgroundSize: 'contain',
                            border: hoveredTask === el?._id && !isResizing ? '2px solid black' : 'none',
                            cursor: isEditable && !isResizing ? 'move' : 'default'
                          }}
    
                          onKeyDown={isEditable ? (e) => deleteTaskDuration(e, el?.task) : null}
                          onClick={() => { setSelectedTask(task); setShowDetails(true); }}
                        >
    
                          {isEditable && (
                            <>
                            
                              <div
                                className="resize-handle left"
                                onMouseDown={(e) => handleResizeStart(e, el?._id, 'left')}
                                style={{ cursor: 'ew-resize', position: 'absolute', left: '0', width: '10px', height: '100%', zIndex: 2 }}
                              />
                              <div
                                className="resize-handle right"
                                onMouseDown={(e) => handleResizeStart(e, el?._id, 'right')}
                                style={{ cursor: 'ew-resize', position: 'absolute', right: '0', width: '10px', height: '100%', zIndex: 2 }}
                              />
    
                                
                            </>
                          )}

                          {(hoveredTask === el?._id || resizingTask === el?._id) && (
                            <div className="task-tooltip">
                              {`${el.start.split('T')[0].replace(/-/g, '/')}  -  ${el.end.split('T')[0].replace(/-/g, '/')}`}
                            </div>
                          )}

                        </div>
                      );
                    }
                  })}
                </div>
              );
            }
    
            // Push tasks into their container
            taskRows.push(
              
              <div key={`${i}-${task?._id}`} style={ganttTimePeriod}>
                {taskRow}
              </div>
    
            );
    
            // Reset for next tasks and increment for next month
            taskRow = [];
            mnth.setMonth(mnth.getMonth() + 1);
          }
        });
      }

      break;
  }

  // Re-rendering of tasks for their new pattern/color
  const forceTaskVisualUpdate = (taskId,newPattern,newColor) => {
    let taskDuration = document.getElementById(`${taskId}--pattern-target`)
    if(!taskDuration){
        console.log("Task cant be found by id: " + `${taskId}--pattern-target` );
        return;
    }
    taskDuration.style.backgroundImage = newPattern ? `url(${patterns[newPattern]})` : 'none';
    taskDuration.style.backgroundColor = newColor;
  }

  // Deleting Task
  const handleDelete = async (taskId, projectId) => {
    try {
      const response = await fetch(buildPath(`api/tasks/${taskId}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Task deleted successfully:', data);

      
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setTaskDurations(prevDurations => prevDurations.filter(duration => duration.task !== taskId));
      console.log(tasks)
  
      setShowDetails(false);
      setSelectedTask(null);
      setCurrentDayMarkerHeight(currentDayMarkerHeight - 1);
      console.log(currentDayMarkerHeight);
      //console.log(projectId.tasks.length)
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  function deleteTaskDuration(e, id) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (window.confirm('Are you sure you want to delete?')) {
        handleDelete(id, projectId);
      }
    }
  }

  // Dragging a tasks start date
  function handleDragStart(taskDurationId) {
    if (!resizingTask) {
      
      setTaskDurationElDraggedId(taskDurationId);
      setHoveredTask(null);
      setIsDragging(true);
      console.log("Drag started for taskDurationId:", taskDurationId);
    }
  }

  // Dragging a tasks end date
  function handleDragEnd(taskDurationId) {

    if (!resizingTask) {

      setTaskDurationElDraggedId(null);
      setHoveredTask(null);
      setIsDragging(false);
      
      console.log("Drag ended for taskDurationId:", taskDurationId);
    }
  }

  // Seperating update task api to add a debounce.
  const updateTaskAPI = debounce(async (taskDuration) => {
    const obj = { startDateTime: taskDuration.start, dueDateTime: taskDuration.end };
    const js = JSON.stringify(obj);
  
    try {
      const response = await fetch(buildPath(`api/tasks/${taskDuration.task}/dates`), {
        method: 'PUT',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }
  
      console.log('Task dates updated successfully on the server.');
      setResizingTask(null);
      setResizeDirection(null);
      setIsResizing(false);

    } catch (error) {
      console.error('Error updating task dates: ', error);
    }
  }, 500);

  //Handler for task drag and drop
  async function onTaskDurationDrop(e) {
    const targetCell = e.target;
    
    const taskDuration = taskDurations.find(
      (taskDuration) => taskDuration._id === taskDurationElDraggedId
    );

    if (!taskDuration) {
      return;
    }

    const dataTask = targetCell.getAttribute('data-task');
    const dataDate = targetCell.getAttribute('data-date');
    const targetTaskId = targetCell.getAttribute('data-task-id');

    console.log(taskDuration)
    console.log(targetTaskId)

    if (taskDuration.task !== targetTaskId) {
      console.log("Task can only be dropped within its respective row.");
      return;
    }

    const adjustedDataDate = new Date(dataDate + 'T00:00:00');
    const originalStartDate = new Date(taskDuration.start.split('T')[0] + 'T00:00:00');
    const daysDuration = dayDiff(new Date(taskDuration.start), new Date(taskDuration.end));

    const newStartDate = new Date(adjustedDataDate);
    let newEndDate = new Date(newStartDate);

    
    newEndDate.setDate(newEndDate.getDate() + daysDuration - 1);

    const allowableRange = 1;

    if (!targetCell.hasAttribute('draggable') || Math.abs(dayDiff(originalStartDate, newStartDate)) <= allowableRange) {
      
      taskDuration.task = dataTask;
      taskDuration.start = createFormattedDateFromDate(newStartDate);
      taskDuration.end = createFormattedDateFromDate(newEndDate);

      const newTaskDurations = taskDurations.filter(
        (taskDuration) => taskDuration._id !== taskDurationElDraggedId
      );
      newTaskDurations.push(taskDuration);

      updateTaskAPI(taskDuration);
    } 
    
    else {
      console.log("It's occupied!");
    }

    setTaskDurationElDraggedId(null);
  }

  // Determining the rendering position of the chart based on the
  // selected view and the tasks
  useEffect(() => {
    monthRows = [];
    dayRows = [];
    dayRow = [];
    weekRows = [];
    weekRow = [];
    taskRow = [];
    tasksHolder = null;
    gridColumns = "";
    gridRows = null;

    if (ganttRef.current) {
      let cellWidth = 60;
      let scrollPosition = numDaysForBoundaries * cellWidth;

      // Week View
      if(selectedRange == "weeks"){
        const timeDifference = endMonth.getTime() - startMonth.getTime();
        let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        daysDifference = Math.round(daysDifference);
        setNumWeeks(Math.floor(daysDifference / 7));

        if(arrayOfTasks.length > 0){
          cellWidth = 90;
          scrollPosition = earliestTaskStartWeekIndex * cellWidth;
    
          ganttRef.current.scrollLeft = scrollPosition;
        }
        else{
          scrollPosition = currentDayIndex * cellWidth;
          
          ganttRef.current.scrollLeft = scrollPosition;
        }
      }
      // Month View
      else if(selectedRange == "months"){
        if(arrayOfTasks.length > 0){
          cellWidth = 180;
          scrollPosition = earliestTaskStartMonthIndex * cellWidth;

          console.log("earliestTaskStartMonthIndex: ", earliestTaskStartMonthIndex);
    
          ganttRef.current.scrollLeft = scrollPosition;
        }
        else{
          scrollPosition = currentDayIndex * cellWidth;

          ganttRef.current.scrollLeft = scrollPosition;
        }
      }
      // Day View
      else{
        if(arrayOfTasks.length > 0){
    
          ganttRef.current.scrollLeft = scrollPosition;
        }
        else{
          scrollPosition = currentDayIndex * cellWidth;
    
          ganttRef.current.scrollLeft = scrollPosition;
        }
      }
    }
  }, [currentDayIndex, numberOfTasks, selectedRange]);

  let gridColumns = "";
  let tasksHolder = null;
  let gridRows = null;

  // Based on the chosen view,
  // Change the number of columns, the task bars, and the number of rows
  switch(selectedRange){
    // Week View
    case "weeks":
      gridColumns = `repeat(${numWeeks}, 1fr)`;

      tasksHolder = (
        <div>
          {taskRows.map((taskRow, index) => (
            <div key={index}>{taskRow}</div>
          ))}
        </div>
      );

      gridRows = (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gridTemplateRows: 'auto auto',
          }}
        >
          {monthRows.map((monthRow, index) => (
            <div key={index}>
              <div style={{ gridColumn: index + 1 }}>{monthRow}</div>
              <div style={{ gridColumn: index + 1 }}>{dayRows[index]}</div>
            </div>
          ))}
        </div>
      );

      break;

    // Month View
    case "months":
      gridColumns = `repeat(${numMonths}, 1fr)`;

      gridRows = (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gridTemplateRows: 'auto auto',
          }}
        >
          {monthRows.map((monthRow, index) => (
            <div key={index}>
              <div style={{ gridColumn: index + 1 }}>{monthRow}</div>
              <div style={{ gridColumn: index + 1 }}>{dayRows[index]}</div>
            </div>
          ))}
        </div>
      );

      tasksHolder = (
        <div>
          {taskRows.map((taskRow, index) => (
            <div key={index}>{taskRow}</div>
          ))}
        </div>
      );    

      break;
    
    // Day View
    default:
      gridColumns = `repeat(${numMonths}, 1fr)`;

      tasksHolder = taskRows;

      gridRows = (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gridTemplateRows: 'auto auto',
          }}
        >
          {monthRows.map((monthRow, index) => (
            <div key={index}>
              <div style={{ gridColumn: index + 1 }}>{monthRow}</div>
              <div style={{ gridColumn: index + 1 }}>{dayRows[index]}</div>
            </div>
          ))}
        </div>
      );
      break;
  }
  
    // Return the full chart
    return (

      <div
        id="gantt-grid-container__time"
        style={{ gridTemplateColumns: gridColumns }}
        ref={ganttRef}
      >
        {gridRows}
  
        <div
          id="gantt-time-period-cell-container"
          style={{
            gridColumn: '1/-1',
            display: 'grid',
            gridTemplateColumns: gridColumns,
            paddingLeft: '0.5px',
            paddingBottom: '-100px',
          }}
  
          
          onMouseMove={handleMouseMove}
          onMouseUp={handleResizeEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          
          {tasksHolder}
        </div>
  
        <TaskDetails
          show={showDetails}
          onHide={() => setShowDetails(false)}
          task={selectedTask}
          projectTasks={arrayOfTasks}
          handleDelete={handleDelete}
          forceTaskVisualUpdate={forceTaskVisualUpdate}
          userId={userId}
        />
      </div>
    );
  }
