import React from 'react';
import NavBar from '../components/NavBar';
import DashboardNavBar from '../components/DashboardNavBar';
import RecentlyDeletedSearch from '../components/RecentlyDeletedSearch'
import {ToastContainer} from 'react-toastify';

const  RecentlyDeletedPage = () =>
{
    return(
      <div>
        {/* For toast confirmations and alerts. */}
        <ToastContainer limit={1}/> 
        <NavBar layout={2}/>
        <DashboardNavBar page={<RecentlyDeletedSearch/>}/>
      </div>
    );
};

export default RecentlyDeletedPage;
