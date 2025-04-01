import React from 'react';

import NavBar from '../components/NavBar';
import DashboardAccount from '../components/DashboardAccount';
import DashboardNavBar from '../components/DashboardNavBar';
import {ToastContainer} from 'react-toastify';

const DashboardAccountPage = () =>
{
    return(
      <div>
        {/* For toast confirmations and alerts. */}
        <ToastContainer limit={1}/> 
        <NavBar layout={2}/>
        <DashboardNavBar page={<DashboardAccount/>}/>
      </div>
    );
};

export default DashboardAccountPage;
