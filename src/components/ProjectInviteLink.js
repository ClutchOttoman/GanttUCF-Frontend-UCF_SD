import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { buildPath } from './buildPath.js';
import './ProjectInviteLink.css';
import ToastSuccess from './ToastSuccess';

const ProjectInviteLink = ({ projectId }) => {
  // Variables to display the current state of the invite link
  const discordBotLink = "https://discord.com/oauth2/authorize?client_id=1354542154017542285&permissions=8&integration_type=0&scope=bot";
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Whenever the projectId changes (when every project is made)
  // fetch the new invite link
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

  // Variables for the copy to clipboard button
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success(ToastSuccess, {data: {title: "Invite link copied to the clipboard!"},
      draggable: false, autoClose: 2000
    });
  };

  // Variables for the copy to clipboard button
  const copyDiscordBotLinkToClipboard = () => {
    navigator.clipboard.writeText(discordBotLink);
    toast.success(ToastSuccess, {data: {title: "Invite link copied to the clipboard!"},
      draggable: false, autoClose: 2000
    });
  };

  const copyButton = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
    </svg>
  );

  // Returning other states for the invite link
  if (loading) return <p>Loading invite link...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div class = "invite-discord-bot-links">
      <div class = "discord-bot-link-container">
        <h3>Discord Bot Link</h3>
        <p>Paste this link into your discord server, click the link and follow the on-screen directions.</p>
        <div class = "bot-link-box">
          <button onClick={copyDiscordBotLinkToClipboard}>
              {copyButton}
          </button>
          <p className="bot-link" href={discordBotLink} target="_blank" rel="noopener noreferrer">
              {discordBotLink}
          </p>
        </div>

      </div>
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
    </div>
  );
};

export default ProjectInviteLink;