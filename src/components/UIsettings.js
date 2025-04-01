import React, { useState, useEffect, useRef, useContext } from 'react';
import {buildPath} from './buildPath';
import { ThemeContext } from './ThemeProvider'; 
import './UIsettings.css'
import DashboardPreview  from '../Images/assets/setting_previews/dashboard_preview.svg?react';
import TimetablePreview  from '../Images/assets/setting_previews/timetable_preview.svg?react';

import * as wcagContrast from 'wcag-contrast';


const debounce = (func, delay) => {
  const timeoutRef = useRef(null);  // This will persist across renders

  const debouncedFunction = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);  // Clear any existing timeout
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };

  return debouncedFunction;
};
const UISettings = () => {
  const { theme, setTheme, customColors, setCustomColors, fontStyle, setFontStyle, activeCVD, setActiveCVD } = useContext(ThemeContext);
  const [pendingColors, setPendingColors] = useState(customColors);

  const [contrastWarnings, setContrastWarnings] = useState({}); //added

  const [message, setMessage] = useState('');

  const customLabels = {
    background: "Background Color",
    text: "Text",
    contentarea: "Content Area",
    cardcolor: "Chart",
    timetable: "Time Table",
    texteditor: "Text Editor",
    navbar: "Navigation Bar",
    sidebar: "Dashboard Bar",
    buttons: "Buttons",
    dropdowns: "Dropdown Menu",
    todolist: "To-Do List",
    scrollbar: "Scrollbar",
    sidebarbtn: "Sidebar Buttons",
  };

// Function to calculate contrast ratio
const getContrastRatio = (color1, color2) => {
  return wcagContrast.hex(color1, color2);
};

// Function to validate contrast and show warnings
const validateContrast = (id, newColor) => {
  let newWarnings = { ...contrastWarnings };

  // Define key UI elements to check contrast against
  const elementsToCheck = {
    cardcolor: ["text", "buttons", "background"],
    text: ["background", "sidebarbtn", "contentarea", "cardcolor", "timetable", "texteditor", "navbar", "buttons", "dropdown", "todolist"],
    background: ["text", "buttons", "timetable", "contentarea", "navbar", "sidebar", "todolist", "card"],
    contentarea: ["text", "buttons", "background", "texteditor"],
    timetable: ["text", "buttons", "background"],
    texteditor: ["text", "contentarea"],
    navbar: ["text", "background"],
    buttons: ["background", "text", "contentarea", "cardcolor", "timetable", "todolist"],
    dropdowns: ["text"],
    todolist: ["text", "buttons", "background"],
    sidebarbtn: ["text", "sidebar"],
    sidebar: ["text", "sidebarbtn", "background"],
  };


  const contrastRequirements = {
    default: 4.5,
    highContrast: 7.0,
  };
  

  if (elementsToCheck[id]) {
    elementsToCheck[id].forEach((element) => {
      const color1 = newColor;
      const color2 = customColors[element];

      if (!color2) return;

      const ratio = getContrastRatio(color1, color2);

      if (ratio < contrastRequirements.default) {
        newWarnings[id] = ``;
        newWarnings[element] = `⚠️ Minimum contrast of 4.5:1 is recommended for ${customLabels[id]}. You have ${ratio.toFixed(1)}:1.`;
      } else if (ratio < contrastRequirements.highContrast) {
        newWarnings[id] = ``;
        newWarnings[element] = `✅ ${customLabels[id]}${customLabels[id].endsWith('s') ? ' meet' : ' meets'} the default contrast (4.5:1). If you want high contrast, you have ${ratio.toFixed(1)}:1, and you need 7:1.`;
      } else {
        newWarnings[id] = ``;
        newWarnings[element] = `✅ ${customLabels[id]}${customLabels[id].endsWith('s') ? ' meet' : ' meets'}  the high contrast requirement (7:1).`;
      }

      console.log(newWarnings)
    });
  }

  setContrastWarnings(newWarnings);
};


    // Assuming theme values are 'dark', 'custom', or 'high-contrast'
    let backgroundColor = theme === 'dark' ? "#121212" : theme === 'high-contrast' ? "white" : theme === 'custom' ? pendingColors.background : "white";
    let borderColor = theme === 'dark' ? "#FFF" : theme === 'high-contrast' ? "#000000" : "#000000";
    let navbarColor = theme === 'dark' ? "#333" : theme === 'high-contrast' ? "#6B2B00" : theme === 'custom' ? pendingColors.navbar : "#FDDC87";

    // Dashboard related svgs
    let sideBarColor = theme === 'dark' ? "#2f2f2f" : theme === 'high-contrast' ? "#f3b35b" : theme === 'custom' ? pendingColors.sidebar : "#DC6B2C";
    let sideBarButtonColor = theme === 'dark' ? "#424242" : theme === 'high-contrast' ? "#402C12" : theme === 'custom' ? pendingColors?.sidebarbtn || "#FFFFFF" : "#FFFFFF";
    let viewButtonColor = theme === 'dark' ? "#2f2f2f" : theme === 'high-contrast' ? "#002238" : theme === 'custom' ? pendingColors?.buttons || "#DC6B2C" : "#DC6B2C"; //changed color
    let projectCardColor = theme === 'dark' ? "#424242" : theme === 'high-contrast' ? "#f3b35b" : theme === 'custom' ? pendingColors.cardcolor : "#fddc87";
    let projectCardBorderColor = theme === 'dark' ? "#2f2f2f" : theme === 'high-contrast' ? "#402C12" : theme === 'custom' ? pendingColors.cardbordercolor : "#DC6B2C";

    // Timetable related svgs
    let timetableColor = theme === 'dark' ? "#222" : theme === 'high-contrast' ? "white" : theme === 'custom' ? pendingColors.timetable : "white";
    let timetableInnerColor = theme === 'dark' ? "#333" : theme === 'high-contrast' ? "#FFF" : theme === 'custom' ? pendingColors.timetableinner : "#FFF";
    let timetableBorderColor = theme === 'dark' ? "#FFF" : theme === 'high-contrast' ? "#000000" : theme === 'custom' ? pendingColors.timetableborder : "#000000";
    let gridColor = theme === 'dark' ? "white" : theme === 'high-contrast' ? "black" : "black";
    let addTaskButtonColor = theme === 'dark' ? "#333" : theme === 'high-contrast' ? "#002238" : theme === 'custom' ? pendingColors?.buttons || "#DC6B2C" : "#DC6B2C";

    const toggleTheme = async (newTheme) => {
      const savedUserInfo = localStorage.getItem('user_data');
      const savedUserId = JSON.parse(savedUserInfo)._id;

      const updatedTheme = (theme === newTheme ? 'default' : newTheme); //Need to have const variable to use newTheme result immediately.
      setTheme(updatedTheme)

      try {
        const response = await fetch(buildPath(`api/toggle-theme/${savedUserId}/${updatedTheme}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (!response.ok) {
          setMessage("Unable to toggle to dark mode");
        } else {
          const message = await response.json();
          setMessage(message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("An error occurred while toggling");
      }
    };

    // Handles Font Changes
    const handleFontChange = async (event) => {

      // Handle localStorage.
      const selectedFont = event.target.value;
      document.body.style.fontFamily = selectedFont;
      setFontStyle(selectedFont)

      let savedUserInfo = localStorage.getItem('user_data');
      const savedUserId = JSON.parse(savedUserInfo)._id; // use user id to query database.
      console.log("Changing font style, savedUserId = " + savedUserId);

      const response = await fetch(buildPath(`api/change-font-style/${savedUserId}/${selectedFont}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok){
        // Set error message here.
        setMessage("Unable to save font style changes");
      } else {
        const message = await response.json();
        setMessage(message);
      }

      savedUserInfo = JSON.parse(localStorage.getItem('user_data'));
      savedUserInfo.uiOptions.fontStyle = selectedFont
      localStorage.setItem("user_data", JSON.stringify(savedUserInfo))

    };

    //Filters
    const applyProtanCVDFilter = () => {
      if (activeCVD === 'protanopia') {
        removeCVDFilter();
      } 
      else {
        setActiveCVD('protanopia'); // Apply Protanopia filter
          const allInstances = document.getElementsByClassName("cvd_filter_applicable");
          for (let i = 0; i < allInstances.length; i++) {
            allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
            allInstances[i].classList.add("protanopia");
          }
          CVDFilterHandler('protanopia');
        }
    };
    
    const applyDeuteranCVDFilter = () => {
      if (activeCVD === 'deuteranopia') {
        removeCVDFilter();
      } 
      else {
      setActiveCVD('deuteranopia');
      const allInstances = document.getElementsByClassName("cvd_filter_applicable");
      for (let i = 0; i < allInstances.length; i++) {
        allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
        allInstances[i].classList.add("deuteranopia");
      }
      CVDFilterHandler('deuteranopia');
      }
    };
    
    const applyTritanCVDFilter = () => {
      if (activeCVD === 'tritanopia') {
        removeCVDFilter();
      } else {
      setActiveCVD('tritanopia');
      const allInstances = document.getElementsByClassName("cvd_filter_applicable");
      for (let i = 0; i < allInstances.length; i++) {
        allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
        allInstances[i].classList.add("tritanopia");
      }
      CVDFilterHandler('tritanopia');
    }
    };

    const removeCVDFilter = () => {
      // Get all tags and objects that are of class "cvd_filter_applicable"
      setActiveCVD('normal'); // Remove the active CVD filter
      const allInstances = document.getElementsByClassName("cvd_filter_applicable");

      // Apply no filter.
      for (let i = 0; i < allInstances.length; i++){
        allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
        allInstances[i].classList.add("normal");
      }
      CVDFilterHandler('normal');
    }

    const CVDFilterHandler = debounce(async(filter) => {
      let savedUserInfo = localStorage.getItem('user_data');
      const savedUserId = JSON.parse(savedUserInfo)._id; // use user id to query database.
      console.log("Changing CVD filter, savedUserId = " + savedUserId);

      const response = await fetch(buildPath(`api/change-CVD-filter/${savedUserId}/${filter}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok){
        // Set error message here.
        setMessage("Unable to change CVD Filter");
      } else {
        const message = await response.json();
        setMessage(message);
    }

    savedUserInfo = JSON.parse(localStorage.getItem('user_data'));
    savedUserInfo.uiOptions.CVDFilter = filter;
    localStorage.setItem("user_data", JSON.stringify(savedUserInfo))
  }, 500);

  //Handler for custom colors
  const handleCustomColorChange = (event) =>{
    const {id, value} = event.target;
    console.log(value)
    setPendingColors((prevColors) => ({
      ...prevColors,
      [id]: value, 
      ...(id === "buttons" && { buttonshover: brightenColor(value, 15) }),
      ...(id === "sidebarbtn" && { sidebarbtnhover: brightenColor(value, 15) }),
      ...(id === "text" && { texthover: brightenColor(value, 15) }),
      ...(id === "dropdowns" && { dropdownhover: brightenColor(value, 15) }),
      ...(id === "cardcolor" && { cardbordercolor: darkenColor(value, 15) }), // Generate a darker border for cards
      ...(id === "timetable" && { timetableborder: darkenColor(value, 15), timetableinner: brightenColor(value, 15) }), // Generate a darker border for timetable
      ...(id === "texteditor" && { texteditorinner: brightenColor(value, 15) }),
      ...(id === "todolist" && { todolistinner: brightenColor(value, 15) }),
      
    }));

    validateContrast(id, value);
  };

  const brightenColor = (hex, percent) => {
    if(hex === undefined) 
      return;
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
  
    // Increase brightness by the given percentage
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const darkenColor = (hex, percent) => {
    if(hex === undefined) 
      return;
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
  
    // Reduce brightness by the given percentage
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));
  
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  

  //Will apply custom colors to the entire website
  const applyCustomColorChange = () =>{
    let userData = JSON.parse(localStorage.getItem("user_data"))
    userData.uiOptions.custom = { ...pendingColors };
    localStorage.setItem("user_data", JSON.stringify(userData))
    setCustomColors(pendingColors)
    
    const savedUserInfo = localStorage.getItem('user_data');
    const savedUserId = JSON.parse(savedUserInfo)._id; 

    const response = fetch(buildPath(`api/update-custom/${savedUserId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom: pendingColors, 
      }),
    });

    response.then(async (res) => {
      if (!res.ok) {
        setMessage("Unable to toggle to custom mode");
      } else {
        const message = await res.json();
        setMessage(message);
        Object.entries(pendingColors).map(([key, value]) => validateContrast(key, value))
      }
    });

  }

  const applyReset = () => {
    let userData = JSON.parse(localStorage.getItem("user_data"));

    // Default color values
    const defaultColors = {
      background: "#ffffff",
      text: "#000000",
      contentarea: "#ffffff",
      cardcolor: "#FDDC87",
      cardbordercolor: "#DC6B2C",
      timetable: "#ffffff",
      timetableinner: "#FFF",
      timetableborder: "#000000",
      navbar: "#FDDC87",
      sidebar: "#DC6B2C",
      buttons: "#dc6b2c",
      buttonshover:"#f08b4f",
      texteditor:"#f0f0f0",
      texteditorinner:"#fff",
      dropdowns:"#ffffff",
      dropdownshover:"#ffffff",
      todolist:"#dc6b2c",
      todolistinner:"#ffffff",
      sidebarbtn:"#ffffff",
      texthover:"#dc6b2c",
      sidebarbtnhover: "#F0F0F0"
    };

    setPendingColors(defaultColors);
    setCustomColors(defaultColors);
    setContrastWarnings({}); // Clear all contrast warnings

    userData.uiOptions.custom = { ...defaultColors };
    localStorage.setItem("user_data", JSON.stringify(userData));

    const savedUserInfo = localStorage.getItem('user_data');
    const savedUserId = JSON.parse(savedUserInfo)._id; 

    const response = fetch(buildPath(`api/update-custom/${savedUserId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom: defaultColors, 
      }),
    });

    response.then(async (res) => {
      if (!res.ok) {
        setMessage("Unable to toggle to custom mode");
      } else {
        const message = await res.json();
        setMessage(message);
      }
    });
};

      
    return(
      <div>
        <h1 class="title"></h1>
        <div class="settings-container ">
          {/* Color Settings Container */}
            {/* Color UI/CVD Filter Preview Container */}
            <div class="ui-preview-container ">
            <h2>
            Color UI Preview: 
              <span className="normal-text">
                  Prototype colorblind UI is not calculated in realtime. This uses the Brettel 1997 method from  
                  <a href="https://daltonlens.org/colorblindness-simulator" target="_blank" rel="noopener noreferrer">daltonlens.org</a> 
                  for a mock-up CVD preview of tritanopia.
              </span>
            </h2>

              {/* This is the container for the preview images */}
              <div className="img-container normal cvd_filter_applicable">
                <DashboardPreview className="dashboard-preview" style={{
                      '--background-color': backgroundColor,
                      '--navbar-color': navbarColor,
                      '--border-color': borderColor,
                      '--sidebar-color': sideBarColor,
                      '--sidebar-btn-color': sideBarButtonColor,
                      '--card-color': projectCardColor,
                      '--view-btn-color': viewButtonColor,
                      '--project-color': projectCardColor,
                      '--project-border-color': projectCardBorderColor,
                      
                  }} />
                  <TimetablePreview className="timetable-preview" style={{
                      '--background-color': backgroundColor,
                      '--navbar-color': navbarColor,
                      '--border-color': borderColor,
                      '--timetable-color': timetableColor,
                      '--timetable-inner-color': timetableInnerColor,
                      '--timetable-border-color': timetableBorderColor,
                      '--grid-color': gridColor,
                      '--add-task-btn-color': addTaskButtonColor,
                  }} />
              </div>
              <h3>Themes</h3>
                <div class="default-colorbar">
                  <div>
                        <button
                            onClick={() => toggleTheme("dark")}
                            className={`dark-mode-toggle ${theme === 'dark' ? "dark" : ""}`}
                            aria-label="Toggle dark mode"
                        >
                            <div className="thumb"></div>
                        </button>
                        <span>Dark Mode</span>
                  </div>
                  <div>
                        <button
                            onClick={() => toggleTheme("high-contrast")}
                            className={`high-contrast-mode-toggle ${theme === 'high-contrast' ? "high-contrast" : ""}`}
                            aria-label="Toggle high-contrast mode"
                        >
                            <div className="thumb"></div> 
                        </button>
                        <span>High Contrast</span>
                  </div>
                  <div>
                        <button
                            onClick={() => toggleTheme("custom")}
                            className={`custom-mode-toggle ${theme === 'custom' ? "custom" : ""}`}
                            aria-label="Toggle high-contrast mode"
                        >
                            <div className="thumb"></div> 
                        </button>
                        <span>Custom</span>
                  </div>
                </div>

                {/* Custom Mode */}
                <div className ={`custom-settings-container ${theme === 'custom' ? "visible": ""}`}>
                {Object.entries(customColors)
                  .filter(([key]) => !['timetableinner', 'timetableborder', 'cardbordercolor',  'todolistinner', 'texteditorinner','dropdownshover', 'buttonshover', 'scrollbarinner',
                                       'texthover', 'sidebarbtnhover',
                  ].includes(key))
                  .map(([key]) => (
                  <div className ="custom-settings-btn">
                    <input 
                        type="color" 
                        id={key} 
                        value={pendingColors[key]} 
                        onChange={handleCustomColorChange} 
                        className="custom-color-selector" 
                      />
                      <span>{customLabels[key]}</span>
                      {contrastWarnings[key] && <p style={{ color: "red" }}>{contrastWarnings[key]}</p>}
                  </div>
                ))}
      
                <div class="d-flex gap-2 ">
                  <button type="button" className="btn btn-secondary" onClick={applyCustomColorChange}>Apply</button>
                  <button type="button" className="btn btn-primary" onClick={applyReset}>Reset</button>        
                </div>

                </div>

              <h3>CVD Filters</h3>
              <div className="cvd-toolbar">
              <div>
                <button 
                  className={`protan-toggle ${activeCVD === 'protanopia' ? 'active' : 'normal'}`} 
                  onClick={applyProtanCVDFilter}
                >
                  <div className="thumb"></div> 
                </button>
                <span>Protanopia Filter</span>
              </div>
              <div>
                <button 
                  className={`deuteran-toggle ${activeCVD === 'deuteranopia' ? 'active' : 'normal'}`} 
                  onClick={applyDeuteranCVDFilter}
                >
                  <div className="thumb"></div> 
                </button>
                <span>Deuteranopia Filter</span>
              </div>
              <div>
                <button 
                  className={`tritan-toggle ${activeCVD === 'tritanopia' ? 'active' : 'normal'}`} 
                  onClick={applyTritanCVDFilter}
                >
                  <div className="thumb"></div> 
                </button>
                <span>Tritanopia Filter</span>
              </div>
            </div>
            {/* Font Editing Container */}
            <div className="font-container">
              <h3>Font Styles: </h3>
              <select 
                  className="font-selector" 
                  onChange={handleFontChange}
                  value={fontStyle}
              >
                <option value="Inter"> Default </option>
                <option value="Merriweather">Merriweather </option>
                <option value="Arial">Arial </option>
                <option value="Verdana">Verdana </option>
                <option value="Open Sans">Open Sans </option>
                <option value="Courier New">Courier New </option>
                <option value="Opendyslexic">Opendyslexic</option>

              </select>
            </div>
            </div>

        </div>
      </div>
    )
}

export default UISettings;
