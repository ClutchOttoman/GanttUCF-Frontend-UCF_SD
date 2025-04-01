import React, { useState, } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import GanttChart from '../components/GanttChart/GanttChart';
import AddTaskButton from '../components/GanttChart/AddTaskButton';

const ViewChartPage = () => {
  const { id } = useParams();
  const [userRole, setUserRole] = useState('');

  return (
    <div>
      <NavBar layout={3} />
        <GanttChart projectId={id} setUserRole={setUserRole} userRole={userRole} />
        {['founder', 'editor'].includes(userRole) && <AddTaskButton projectId={id} />} 
    </div>
  );
};

export default ViewChartPage;
