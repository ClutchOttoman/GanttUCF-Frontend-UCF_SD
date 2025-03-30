import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import React, { useEffect, useRef, useState } from 'react';
import './DashboardCalendar.css';

function DashboardCalendar({ taskList }) {
    const [viewMode, setViewMode] = useState('dayGridMonth');
    const [currentEvents, setCurrentEvents] = useState([]);
    const [isTabVisible, setIsTabVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [taskSet, setTaskSet] = useState({});
    const calendarRef = useRef(null);

    // Function to take the task list from the to-do-list
    // and put the tasks into a set with the keys as their due dates
    function splitTasksByDay(){
        let taskSet = {};

        for(let i = 0; i < taskList.length; i++){
            let curDate = new Date(taskList[i].dueDateActual);
            if(!taskSet[curDate]){
                taskSet[curDate] = [];
            }

            taskSet[curDate].push(taskList[i]);
        }

        return taskSet;
    }

    // Close the Tasks Tab after hitting the X-Button
    const closeTab = () => {
        const tabDiv = document.getElementById('task-tab');
        if (tabDiv) {
            tabDiv.remove();
        }
        setIsTabVisible(false);
    };

    // If the task list changes, then the calendar needs to be re-rendered
    useEffect(() => {
        const calendarEl = calendarRef.current;

        const taskSet = splitTasksByDay();

        //Final events to be added to calendar
        let finalEvents = [];

        // Go through each date to find out which ones have more than 3 
        // events that need to be displayed on the calendar
        Object.keys(taskSet).forEach(date => {
            // If there is more than 3 tasks for a single date
            if(taskSet[date].length > 3){
                // Push placeholder for better calendar UI
                finalEvents.push({
                    title: "...",
                    start: new Date(date),
                    color: "rgb(220, 107, 44)",
                    extendedProps: { isPlaceHolder: true },
                });

                // Get the first 2 tasks from the set and add them to the events list
                let tempEvents = (taskSet[date].slice(0, 2).map(task => ({
                    title: task.taskTitle,
                    start: new Date(date),
                    color: "rgb(220, 107, 44)",
                    extendedProps: { progress: task.progress },
                })));

                finalEvents.push(tempEvents[0]);
                finalEvents.push(tempEvents[1]);

                // console.log("Slicing...\n", (taskSet[date].slice(0, 2).map(task => ({
                //     title: task.taskTitle,
                //     start: new Date(date),
                //     color: "rgb(220, 107, 44)",
                // }))));
            }
            // If there is 3 or less tasks for a single date
            else{
                finalEvents.push(...taskSet[date].map(task => ({
                    title: task.taskTitle,
                    start: new Date(task.dueDateActual),
                    color: "rgb(220, 107, 44)",
                    extendedProps: { progress: task.progress },
                })));
            }
        });

        if (calendarEl) {
            calendarEl.innerHTML = '';
            
            // Initialize the Calendar
            const calendar = new Calendar(calendarEl, {
                plugins: [dayGridPlugin, listPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                editable: true,
                height: 'auto',
                selectable: true,
                contentHeight: 'auto',
                displayEventTime: false,
                // Add the final events
                events: finalEvents,
                // Function to strike through the completed tasks
                eventDidMount: function(info) {
                    // const eventDate = new Date(info.event.start);

                    info.el.style.color = "rgb(220, 107, 44)";

                    if (info.event.extendedProps.progress === 'Completed') {
                        info.el.style.textDecoration = 'line-through';
                        info.el.style.color = 'gray';
                    }
                },
                datesSet: function(){
                    calendar.refetchEvents()
                },
                // Ensure that placeholders go last
                eventOrder: function(a, b) {
                    // A is a placeholder
                    if (a.extendedProps.isPlaceHolder && !b.extendedProps.isPlaceHolder) {
                        return 1;
                    }
                    // B is a placeholder
                    if (!a.extendedProps.isPlaceHolder && b.extendedProps.isPlaceHolder) {
                        return -1;
                    }
                
                    return 0;
                },
                // Function calls after a specific date on the calendar is clicked
                dateClick: function(info) {
                    const selectedDate = info.dateStr;
                    setSelectedDate(selectedDate);
                    // Load the events for date that was clicked
                    const eventsForDay = taskList.filter(task => {
                        const taskDate = new Date(task.dueDateActual).toISOString().split('T')[0];  // Format taskDate
                        return taskDate === selectedDate;
                    });

                    setCurrentEvents(eventsForDay);
                    setIsTabVisible(true);

                    const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString();

                    const viewHarness = document.querySelector('.fc-view-harness');
                    if (viewHarness) {
                        const taskTab = document.getElementById('task-tab');

                        // Task Tab already visible
                        // So just change the date and tasks listed
                        if(taskTab){
                            taskTab.innerHTML = `
                                <button class="close-btn" id="close-btn" onclick="closeTab()">X</button>
                                <h3>Tasks for ${formattedDate}</h3>
                                <ul class="task">
                                    ${eventsForDay.map(event => `
                                        <li class="task">
                                            ${event.progress === 'Completed' 
                                                ? `<strong style="text-decoration: line-through;">&#8226; ${event.taskTitle}</strong><p>(${event.progress})</p>` 
                                                : `<strong>&#8226; ${event.taskTitle}</strong><p>(${event.progress})</p>`}
                                            <br />
                                            <ul class="task-description">
                                                <li class="task-description">
                                                    ${event.description === '' ? "No Task Description" : event.description}
                                                </li>
                                            </ul>
                                        </li>
                                    `).join('</br>')}
                                </ul>
                            `;

                            const closeBtn = document.getElementById('close-btn');
                                if (closeBtn) {
                                    closeBtn.addEventListener('click', closeTab);
                                }
                        }
                        // Task tab not yet visible
                        // So add the date and tasks to a new tab
                        else{
                            const tabDiv = document.createElement('div');
                            tabDiv.classList.add('task-tab');
                            tabDiv.id = 'task-tab';
                            tabDiv.innerHTML = `
                                <button class="close-btn" id="close-btn" onclick="closeTab()">X</button>
                                <h3>Tasks for ${formattedDate}</h3>
                                <ul class="task">
                                    ${eventsForDay.map(event => `
                                        <li class="task">
                                            ${event.progress === 'Completed' 
                                                ? `<strong style="text-decoration: line-through;">&#8226; ${event.taskTitle}</strong><p>(${event.progress})</p>` 
                                                : `<strong>&#8226; ${event.taskTitle}</strong><p>(${event.progress})</p>`}
                                            <br />
                                            <ul class="task-description">
                                                <li class="task-description">
                                                    ${event.description === '' ? "No Task Description" : event.description}
                                                </li>
                                            </ul>
                                        </li>
                                    `).join('</br>')}
                                </ul>
                            `;

                            viewHarness.appendChild(tabDiv);

                            const closeBtn = document.getElementById('close-btn');
                            if (closeBtn) {
                                closeBtn.addEventListener('click', closeTab);
                            }
                        }
                    }
                }
            });

            calendar.render();

        } else {
            console.error("Calendar element not found.");
        }
    }, [taskList]);

    return (
        <div>
            <div ref={calendarRef} className="calendar"></div>
        </div>
    );
}

export default DashboardCalendar;
