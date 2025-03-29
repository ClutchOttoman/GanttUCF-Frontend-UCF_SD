import React, { useState, useEffect } from 'react';
import { buildPath } from './buildPath.js';
import RichTextEditor from './GanttChart/RichTextEditor.js'

function AnnouncementModal({showAnnouncementModal, setShowAnnouncementModal, editable}) {
    const [show, setShow] = useState(showAnnouncementModal ?? false);
    const [editMode, setEditMode] = useState(false); //Edit actions
    const[text, setText] = useState('')
    const[title, setTitle] = useState('')
    const [check, setCheck] = useState(false)


    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(buildPath(`api/dashboard/account`), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                  });
                const data = await response.json();
                setText(data.text || 'Add a description here...');
                setTitle(data.title || 'Announcements')
            } catch (error) {
                console.error("Error fetching announcement:", error);
            }
        };

        fetchAnnouncement();

        const userData = localStorage.getItem('user_data');
        const parsedData = JSON.parse(userData)
        const modalShown = localStorage.getItem('modalShown');


        if ((!modalShown && parsedData.showAnnouncement) || editable) {
          setShow(true);
          localStorage.setItem('modalShown', 'true');
        }
      }, []);
    

    const handleCloseModal = async() => {
        setShow(false) //Closses Modal
        if (check) {
            try {
                const userData = localStorage.getItem('user_data');
                const user = JSON.parse(userData)
    
                if (user && user._id) {
                    await fetch(buildPath(`api/announcement/hide/${user._id}`), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                    });
    
                } else {
                    console.error("User data is missing or invalid");
                }
            } catch (error) {
                console.error("Error hiding announcement:", error);
            }
        }

        if(showAnnouncementModal) //Closes modal in admin account page
            setShowAnnouncementModal(false)
    };

    const handleEditModal = () => {
        setEditMode(true)
    }

    const handleSave = async () => {
        setEditMode(false)
        
        try{
            const response = await fetch(buildPath(`api/dashboard/account`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text, title: title }),
              });
              if (response.ok) {

                const data = await response.json();
                setText(data.text); 
                console.log(editMode)
            } else {
                console.error('Failed to save announcement');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpload = async () => {
        setEditMode(false)
        
        try{
            const response = await fetch(buildPath("api/dashboard/account/announce"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div>
            {show && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" id="announcementModal" aria-labelledby="announcementModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{maxHeight: '1000px'}}>
                            <div className="modal-header">
                            <h1 className="modal-title" id="announcementModalLabel">
                                {editMode ? <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> : title}
                            </h1>
                            </div>
                            <div className="modal-body">
                            {editMode ?
                            <RichTextEditor
                            taskDescription={text}
                            setTaskDescription={setText}
                            />
                            :
                            <div 
                            id="textbox" 
                            dangerouslySetInnerHTML={{
                                __html: text?.trim() ? text : 'Add a description here...',
                            }} 
                            />
                            }
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                {editable && editMode && (
                                    <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    data-bs-dismiss="modal" 
                                    onClick={handleUpload}
                                    style={{ minWidth: "100px" }}
                                    >
                                    Upload
                                    </button>
                                )}
                                
                                {editable && (
                                    <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    data-bs-dismiss="modal" 
                                    onClick={editMode ? handleSave : handleEditModal}
                                    style={{ minWidth: "100px" }}
                                    >
                                    {editMode ? 'Save' : 'Edit'}
                                    </button>
                                )}

                                {!editable && (
                                    <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                    <input 
                                        style={{ width: "20px", height: "25px" }} 
                                        type="checkbox" 
                                        onChange={() => setCheck(prev => !prev)}
                                    />
                                    <label style={{ margin: "0px 10px" }}>Don't display again until the next announcement.</label>
                                    </div>
                                )}

                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    data-bs-dismiss="modal" 
                                    onClick={handleCloseModal}
                                    style={{ minWidth: "100px" }}
                                >
                                    Close
                                </button>
                                </div>

                         </div>
                        </div>
                        </div>
                    )}
        </div>
    )

}

export default AnnouncementModal;
