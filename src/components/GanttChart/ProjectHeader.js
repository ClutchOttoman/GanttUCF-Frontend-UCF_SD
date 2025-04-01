import React, { useState } from 'react';
import './ProjectHeader.css';
import { buildPath } from '../buildPath';


function ProjectHeader({ projectName, setProjectName, projectId, founderId }) {
  const [newName, setNewName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  var userId = ud?._id; // Ensure userId exists

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      // Check for project name length
      if (newName.length > 35) {
        setMessage("Project names cannot be longer than 35 characters");
        return;
      }
  
      // Send PUT request to update the project name
      const response = await fetch(buildPath(`api/projects/updateProjectName/${projectId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nameProject: newName }),
      });
  
      console.log('Response status:', response.status);
  
      // Check if the response status is OK
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project name');
      }
  
      // Parse the response as JSON
      const updatedProject = await response.json();
      console.log('Backend response after update:', updatedProject);
  
      // If update is successful, update project name and close modal
      
      setProjectName(updatedProject.updatedName || newName);
      setNewName('');
      setIsModalOpen(false);
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating project name:', error);
      alert(`An error occurred while updating the project name: ${error.message || error}`);
    }
  };
  
  

  return (
    <div className="project-header">
      <h1>
      <span style= {{fontSize: "0.6em"}} className="project-name">{projectName}</span>
      {founderId === userId ?
        <button style= {{fontSize: "0.3em"}}
        className="btn-outline-primary2"
        onClick={() => setIsModalOpen(true)} // Open modal on button click
      >
        ✏️ Edit Project Name
      </button> : ''
      }

      </h1>

      {/* Bootstrap Modal */}
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} id="changeProjectModal" tabIndex="-1" aria-labelledby="changeProjectModalLabel" aria-hidden="true" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="changeProjectModalLabel">Change Project Name</h5>
               <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} aria-label="Close"
                style={{ color: 'black', fontSize: '1.7rem', background: 'none', border: 'none' }}>  
                  ✖  
                </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Enter new project name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              {message && <div className="text-danger">{message}</div>} {/* Display error messages */}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary px-0 mx-0 mt-3 w-100" 
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectHeader;
