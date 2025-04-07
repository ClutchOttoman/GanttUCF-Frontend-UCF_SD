import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buildPath } from './buildPath';
import './ConfirmDelete.css';

function ConfirmDelete() {
  const { userId, token } = useParams();
  const [message, setMessage] = useState('Processing your request...');

  useEffect(() => {
    const confirmDeletion = async () => {
      if (!userId || !token) {
        setMessage('Invalid request. Missing user ID or token.');
        return;
      }

      try {
        const response = await fetch(buildPath(`api/user/confirm-delete/${userId}/${token}`), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setMessage('Your account has been successfully deleted.');
        } else {
          const result = await response.json();
          setMessage(result.error || 'Failed to delete account. Please try again later.');
        }
      } catch (err) {
        console.error('Error confirming account deletion:', err);
        setMessage('An error occurred while confirming account deletion. Please try again later.');
      }
    };

    confirmDeletion();
  }, [userId, token]);

  return (
    <div className="confirmDeleteContainer">
      <div className="confirmDeleteForm text-center">
        <div className="card-header registerFormHeader">
          <h1 className="confirmDeleteTitle">Account Deletion</h1>
        </div>
        <div className="card-body p-0">
          <p id="floatingMessage">{message}</p>
          <div className="button-container">
            <a href="/login" className="btn-link">Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
