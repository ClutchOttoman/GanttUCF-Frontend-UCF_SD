import React from 'react';
import Start from '../Images/assets/backgrounds/Homepage_Start_Image.JPG';
import Plan from '../Images/assets/backgrounds/Homepage_Plan_Image.JPG';
import Complete from '../Images/assets/backgrounds/Homepage_Mobile_Image.JPG';
import Logo from '../Images/assets/logo/Logo.png';
import { Link } from "react-router-dom";
import GanttChartIcon from "./GanttChartIcon.js";
import './ContentBox.css';
import {buildPath} from './buildPath';


function ContentBox() {
  return (
    <div>
      <div className="landing-page-container">
        <div className="left-column">
          <h1 className="animated-header-1">Never pay for Gantt charts again.</h1>
          <p>At GanttUCF, there's only one plan: free, simple and accessible to everyone.</p>
          <Link to="/register" className="cta-button">Get free GanttUCF access</Link>
        </div>
        <div className="right-column">
          <div className="gantt-chart-icon-container">
            <GanttChartIcon />
          </div>
        </div>
      </div>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="midTitle">
        <h1>Streamline Your Project Management</h1>
      </div>
      <br></br>
      <br></br>
      <br></br>

      <div className="cards-container">
        <div className="cardContent">
          <img src={Start} alt="User dashaboard preview." />
          <div className="card-contentbox">
            <h2 className="card-title">Start Your Project</h2>
            <p className="card-subtext">Take advantage of GanttUCF's simple onboarding process to plan your day! Everyone gets GanttUCF and all of its features for free. Simply sign up with a valid email address.</p>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="cardContent">
          <img src={Plan} alt="View a chart and plan on it." />
          <div className="card-contentbox">
            <h2 className="card-title">Plan Efficiently</h2>
            <p className="card-subtext">GanttUCF offers a single plan that's free, easy to use, and open to everyone! Divide and conquer by assigning team members to tasks within a chart. Use a color picker and pattern overlays for maximum visual contrast for task colors.</p>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="cardContent">
          <img src={Complete} alt="Mobile task list." />
          <div className="card-contentbox">
            <h2 className="card-title">Complete Tasks</h2>
            <p className="card-subtext">Simply toggle a task's completion status to indicate if it's done in projects or to-do lists.</p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>

      <footer className="footer">
        <ul className="footer-links">
          <li><a href="/about-us" className="footer-link">About Us</a></li>
        </ul>
      </footer>
    </div>
  );
}

export default ContentBox;
