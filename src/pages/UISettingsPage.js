import React from 'react';
import UISettings from '../components/UIsettings'
import DashboardNavBar from '../components/DashboardNavBar';
import NavBar from '../components/NavBar'

const UISettingsPage = () => {
    return(
        <div>
            <NavBar layout ={2}/>
            <DashboardNavBar page={<UISettings/>}/>
        </div>
    )
}

export default UISettingsPage;