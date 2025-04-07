import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buildPath } from './buildPath';
import './ConfirmRestore.css';

function ConfirmRestore() {
  const { userId, token } = useParams();
  const [message, setMessage] = useState('Processing your request...');

  useEffect(() => {
    const confirmRestore = async () => {
      if (!userId || !token) {
        setMessage('Invalid request. Missing user ID or token.');
        return;
      }

      try {
        const response = await fetch(buildPath(`api/user/restore-account/${userId}/${token}`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setMessage('Your account has been successfully restored.');
        } else {
          const result = await response.json();
          setMessage(result.error || 'Failed to restore account. Please try again later.');
        }
      } catch (err) {
        console.error('Error confirming account restoration:', err);
        setMessage('An error occurred while restoring your account. Please try again later.');
      }
    };

    confirmRestore();
  }, [userId, token]);

  return (
    <div className="confirmRestoreContainer">
      <div className="confirmRestoreForm text-center">
        <div className="card-header registerFormHeader">
          <h1 className="confirmRestoreTitle">Account Restoration</h1>
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

export default ConfirmRestore;
