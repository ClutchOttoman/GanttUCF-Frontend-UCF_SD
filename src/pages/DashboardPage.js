import React from 'react';

import NavBar from '../components/NavBar';
import DashboardToDo from '../components/DashboardToDo';
import DashboardNavBar from '../components/DashboardNavBar';
import {ToastContainer} from 'react-toastify';

const DashboardPage = () =>
{
    return(
      <div>
        {/* For toast confirmations and alerts. */}
        <ToastContainer limit={1}/> 
        <NavBar layout={2}/>
        <DashboardNavBar page={<DashboardToDo/>}/>
      </div>
    );
};

export default DashboardPage;
