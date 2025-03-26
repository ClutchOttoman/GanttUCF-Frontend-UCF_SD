import React, { useEffect, useState } from "react";
import { buildPath } from './buildPath.js';
import './ProjectInviteLink.css';
import {toast} from 'react-toastify';
import ToastSuccess from './ToastSuccess';

const ProjectInviteLink = ({ projectId }) => {
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("ProjectID: ", projectId);

  useEffect(() => {
    const fetchInviteLink = async () => {
      setLoading(true);
      try {
        const response = await fetch(buildPath(`api/get-invite-link/${projectId}`), { method: 'GET' })
        
        if (!response.ok) {
          throw new Error("Failed to fetch invite link");
        }
        const data = await response.json();
        setInviteLink(data.inviteLink);
      } catch (err) {
        setError("Failed to fetch invite link.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInviteLink();
  }, [projectId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success(ToastSuccess, {data: {title: "Invite link copied to the clipboard!"},
      draggable: false, autoClose: 2000
    });
  };

  const copyButton = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
    </svg>
  );

  if (loading) return <p>Loading invite link...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="invite-link-container">
      <h3>Project Invite Link</h3>
      {inviteLink ? (
        <>
          <p>
            Share this link with team members to join the project:
            <br />
            <div className="link-box">
            <button onClick={copyToClipboard}>
                {copyButton}
            </button>
              <p className="link" href={inviteLink} target="_blank" rel="noopener noreferrer">
                {inviteLink}
              </p>
            </div>
          </p>
        </>
      ) : (
        <p>No invite link available for this project.</p>
      )}
    </div>
  );
};

export default ProjectInviteLink;