import React from 'react';
import NavBar from '../components/NavBar';
import DashboardNavBar from '../components/DashboardNavBar';
import '../components/DashboardCharts.css';
import DashboardChartsSearch from '../components/DashboardChartsSearch'


const DashboardChartsPage = () =>
{
    return(
      <div>
        <NavBar layout={2}/>
        <DashboardNavBar page={<DashboardChartsSearch/>}/>
      </div>
    );
};

export default DashboardChartsPage;
