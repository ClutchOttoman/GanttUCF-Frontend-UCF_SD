import React, { useState } from 'react';
import './AboutUs.css';
import member_an from '../Images/assets/team_member_icons/AN.jpg';
import member_nb from '../Images/assets/team_member_icons/NB.png';
import member_tk from '../Images/assets/team_member_icons/TK.jpg';
import member_lr from '../Images/assets/team_member_icons/LR.jpg';
import member_kr from '../Images/assets/team_member_icons/KR.jpg';
import member_sw from '../Images/assets/team_member_icons/SW.jpg';
import member_oc from '../Images/assets/team_member_icons/OC.jpg';
import member_ak from '../Images/assets/team_member_icons/AK.PNG';
import member_jn from '../Images/assets/team_member_icons/JN.jpg';
import member_cb from '../Images/assets/team_member_icons/CB.jpeg';
import member_am from '../Images/assets/team_member_icons/AM.webp'

import member_placeholder from '../Images/assets/team_member_icons/Placeholder.jpg';
import {buildPath} from './buildPath';


function AboutUs() {   

    return (
        <div className="about-section">
            
            <h1>GanttUCF Teams</h1>
            <p>Thank you for your contributions to this project.</p>
            
            {/* SD1 and SD2 Credits. */}
            <div className='dropdown-section'>
                <div className='section-header'>Senior Design Fall and Spring 2025 Team &#9661;</div>
                {/* Team members. */}
                <div className='dropdown-content'>
                    <div className="team-member-alt">
                        <img src={member_cb} alt="Connor Bennett" className="team-image"/>

                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Connor Bennett</h2>
                                <p>Frontend developer</p>
                            </div>
                        </div>

                    </div>

                    <div className="team-member">
                        <img src={member_ak} alt="Ash Koltz" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Ash Koltz</h2>
                                <p>Database and API developer</p>
                                <p>Project Manager and Artist (COP 4331 Summer 2024)</p>
                            </div>
                        </div>

                    </div>

                    <div className="team-member-alt">
                        <img src={member_tk} alt="Tetiana Kotvitska" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Tetiana Kotvitska</h2>
                                <p>Frontend developer</p>
                                <p>Database and API developer (COP 4331 Summer 2024)</p>
                            </div>
                        </div>

                    </div>

                    <div className="team-member">
                        <img src={member_am} alt="Allen Menorca" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Allen Menorca</h2>
                                <p>Project Manager and Frontend developer</p>
                            </div>
                        </div>

                    </div>

                    <div className="team-member-alt">
                        <img src={member_jn} alt="Jose Neto" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Jose Neto</h2>
                                <p>Frontend developer</p>
                            </div>
                        </div>

                    </div>
                    
                    <div className="team-member">
                        <img src={member_sw} alt="Shane Welz" className="team-image"/>

                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Shane Welz</h2>
                                <p>Frontend developer</p>
                                <p>Frontend and API developer (COP 4331 Summer 2024)</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* From COP 4331 Semester */}
            <div className='dropdown-section'>
                <div className='section-header'>COP 4331 Summer 2024 Team &#9661;</div>
                {/* Team members. */}
                <div className='dropdown-content'>
                    <div className="team-member-alt">
                        <img src={member_nb} alt="Nickolas Brandenburg" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Nickolas Brandenburg</h2>
                                <p>Database and API developer</p>
                            </div> 
                        </div>

                    </div>

                    <div className="team-member">
                        <img src={member_oc} alt="Omar Castro" className="team-image"/>

                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Omar Castro</h2>
                                <p>Frontend developer</p>
                            </div>                       
                        </div>

                    </div> 

                    <div className="team-member-alt">
                        <img src={member_an} alt="Aaron Nogues" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Aaron Nogues</h2>
                                <p>Mobile app developer</p>
                            </div>
                        </div>
                        
                    </div>

                    <div className="team-member">
                        <img src={member_kr} alt="Keyliz Rodriguez" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Keyliz Rodriguez</h2>
                                <p>Frontend developer</p>
                            </div>
                        </div>

                    </div>

                    <div className="team-member-alt">
                        <img src={member_lr} alt="Luis Rodriguez-Rivera" className="team-image"/>
                        
                        <div className='member-info-box'>
                            <div className="member-info">
                                <h2>Luis Rodriguez-Rivera</h2>
                                <p>Database and API developer</p>
                            </div>
                        </div>

                    </div>

                </div>
                
            </div>
        </div>

    );
};

export default AboutUs;
