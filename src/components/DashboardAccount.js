import React, { useState, useEffect } from 'react';
import './DashboardAccount.css';
import { buildPath } from './buildPath';
import {toast} from 'react-toastify';
import ToastNotify from './ToastNotify';
import ToastConfirm from './ToastConfirm';
import ToastSuccess from './ToastSuccess';
import ToastError from './ToastError';
import AnnouncementModal from './AnnouncementModal';

function DashboardAccount() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ timezone: '' });
  const [timezones, setTimezones] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [visibility, setVisibility] = useState({
    name: false,
    email: false,
    username: false,
    organization: false,
    phone: false,
    discordAccount: false,
    pronouns: false,
    timezone: false,
  });
  const [editAnnouncement, setEditAnnouncement] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user_data'));
        if (!storedUser || !storedUser._id) {
          setError('User not logged in. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }

        const response = await fetch(buildPath(`api/user/${storedUser._id}`), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (response.ok) {
          setUser(result);
          setUpdatedUser(result);
        } else {
          setError(result.error || 'Failed to fetch user details.');
        }

        setEditAnnouncement(result.devMode ?? false);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An error occurred while fetching user details.');
      }
    };

    fetchUserData();

    const availableTimezones = Intl.supportedValuesOf('timeZone');
    setTimezones(availableTimezones);
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setUpdatedUser(user);
    setIsEditing(false); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value !== null && value !== undefined && value !== '') {
      setUpdatedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        ...user, 
        ...updatedUser, 
      };

      const response = await fetch(buildPath(`api/user/${user._id}`), {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result);
        setIsEditing(false);
        toast.success(ToastSuccess, {data: {title: "Account details updated successfully."},
          draggable: false, autoClose: 2000, ariaLabel: "Account details updated successfully.",
        });

      } else {
        const result = await response.json();
        toast.error(ToastError, {data: {title: result.error || 'Failed to update account details.'},
          draggable: false, closeButton: false, autoClose: 2000, ariaLabel: result.error || 'Failed to update account details.',
        });
      }
    } catch (err) {
      const errString = "Error updating account details: " + err;
      toast.error(ToastError, {data: {title: errString},
        draggable: false, closeButton: false, autoClose: 2000, ariaLabel: errString,
      });
    }
  };

  const handleDeleteAccount = () => {
    toast.warn(ToastConfirm, {
      data: {
        title: "Are you sure you want to delete your account?", 
        body: "You will receive a confirmation email to proceed."
      },  
      draggable: false, closeButton: false, position: "top-center", autoClose: false,
      ariaLabel: "Are you sure you want to delete your account? You will receive a confirmation email to proceed.",
      onClose(reason){
        switch (reason){
          case "confirm":
            setShowPasswordModal(true);
        }
      }
    });

  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError('Password is required to delete your account.');
      return;
    }

    try {
      const response = await fetch(buildPath(`api/user/request-delete/${user._id}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast.info(ToastNotify, {data: {title: "A confirmation email has been sent to your email address. Please follow the instructions to confirm account deletion."},
          draggable: false, closeButton: false, position: "top-center", ariaLabel: "A confirmation email has been sent to your email address. Please follow the instructions to confirm account deletion.",
        });
        window.location.href = '/';
      } else {
        const result = await response.json();
        setPasswordError(result.error || 'Failed to initiate account deletion.');
      }
    } catch (err) {
      console.error('Error sending account deletion email:', err);
      setPasswordError('An error occurred while initiating account deletion.');
    }
  };

  const handleResetPassword = () => {
    toast.warn(ToastConfirm, {
      data: {
        title: "Are you sure you want to reset your password?", 
      },  
      draggable: false, closeButton: false, position: "top-center", ariaLabel: "Are you sure you want to reset your password?", autoClose: false,
      onClose(reason){
        switch (reason){
          case "confirm":
            window.location.href = `/reset-password/${user._id}/:token`; 
        }
      }
    });
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getHiddenValue = (value) => {
    return '*'.repeat(value.length);
  };


  const handleEditAnnouncement = () => {
    setShowAnnouncementModal(true)
    localStorage.setItem('modalShown', 'false');
  }

  return (
    <div>
      <h1 class="title"></h1>
    <div class= "container position-relative d-inline-flex flex-row ">
    { showAnnouncementModal && (
        <AnnouncementModal showAnnouncementModal={showAnnouncementModal}
                          setShowAnnouncementModal={setShowAnnouncementModal}
                          editable={editAnnouncement}
        />

      )
      }
    <div className="dashboardAccountContainer">
      <h1 className="dashboardTitle">Account Information</h1>
      {user ? (
        <>
          <div className="accountDetails">
            <div className="detailItem">
              <label className="detailLabel">Full Name:</label>
              {isEditing ? (
                   <input
                   type="text"
                   name="name"
                   value={updatedUser.name || ''}
                   onChange={handleInputChange}
                   className="editInput"
                 />
               ) : (
                 <span className="detailValue">
                   {visibility.name ? user.name : getHiddenValue(user.name)}
                 </span>
               )}
               <i
                 className={`fas ${visibility.name ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('name')}
               ></i>
             </div>
             <div className="detailItem">
               <label className="detailLabel">Email:</label>
               <span className="detailValue">
                 {visibility.email ? user.email : getHiddenValue(user.email)}
               </span>
               <i
                 className={`fas ${visibility.email ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('email')}
               ></i>
             </div>
             <div className="detailItem">
               <label className="detailLabel">Username:</label>
               {isEditing ? (
                 <input
                   type="text"
                   name="username"
                   value={updatedUser.username || ''}
                   onChange={handleInputChange}
                   className="editInput"
                 />
               ) : (
                 <span className="detailValue">
                   {visibility.username ? user.username || 'N/A' : getHiddenValue(user.username || 'N/A')}
                 </span>
               )}
               <i
                 className={`fas ${visibility.username ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('username')}
               ></i>
             </div>
             <div className="detailItem">
               <label className="detailLabel">Organization:</label>
               {isEditing ? (
                 <input
                   type="text"
                   name="organization"
                   value={updatedUser.organization || ''}
                   onChange={handleInputChange}
                   className="editInput"
                 />
               ) : (
                 <span className="detailValue">
                   {visibility.organization ? user.organization || 'N/A' : getHiddenValue(user.organization || 'N/A')}
                 </span>
               )}
               <i
                 className={`fas ${visibility.organization ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('organization')}
               ></i>
             </div>
             <div className="detailItem">
               <label className="detailLabel">Phone Number:</label>
               {isEditing ? (
                 <input
                   type="text"
                   name="phone"
                   value={updatedUser.phone || ''}
                   onChange={handleInputChange}
                   className="editInput"
                 />
               ) : (
                 <span className="detailValue">
                   {visibility.phone ? user.phone || 'N/A' : getHiddenValue(user.phone || 'N/A')}
                 </span>
               )}
               <i
                 className={`fas ${visibility.phone ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('phone')}
               ></i>
             </div>
             <div className="detailItem">
               <label className="detailLabel">Discord Account:</label>
               {isEditing ? (
                 <input
                   type="text"
                   name="discordAccount"
                   value={updatedUser.discordAccount || ''}
                   onChange={handleInputChange}
                   className="editInput"
                 />
               ) : (
                 <span className="detailValue">
                   {visibility.discordAccount ? user.discordAccount || 'N/A' : getHiddenValue(user.discordAccount || 'N/A')}
                 </span>
               )}
               <i
                 className={`fas ${visibility.discordAccount ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('discordAccount')}
               ></i>
             </div>
             <div className="detailItem">
               <label className="detailLabel">Pronouns:</label>
               {isEditing ? (
                 <input
                   type="text"
                   name="pronouns"
                   value={updatedUser.pronouns || ''}
                   onChange={handleInputChange}
                   className="editInput"
                 />
               ) : (
                 <span className="detailValue">
                   {visibility.pronouns ? user.pronouns || 'N/A' : getHiddenValue(user.pronouns || 'N/A')}
                 </span>
               )}
               <i
                 className={`fas ${visibility.pronouns ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('pronouns')}
               ></i>
             </div>
             <div className="detailItem">
               <label className="detailLabel">Timezone: </label>
               {isEditing ? (
                 <select className="editSelect" name="timezone" value={updatedUser.timezone || ''} onChange={handleInputChange} >
                   <option value="" disabled>Select your timezone</option>
                   {timezones.map((zone, index) => (
                     <option key={index} value={zone}>
                       {zone}
                     </option>
                   ))}
                 </select>
               ) : (
                 <span className="detailValue">
                   {visibility.timezone ? user.timezone || 'N/A' : getHiddenValue(user.timezone || 'N/A')}
                 </span>
               )}
               <i
                 className={`fas ${visibility.timezone ? 'fa-eye-slash' : 'fa-eye'} detailIcon`}
                 onClick={() => toggleVisibility('timezone')}
               ></i>
             </div>
           </div>
           <div className="accountActions">
             <button className="btn resetPasswordBtn" onClick={handleResetPassword}>
               Reset Password
             </button>
             {isEditing ? (
               <button className="btn saveBtn" onClick={handleSave}>
                 Save
               </button>
             ) : (
               <button className="btn editBtn" onClick={handleEditToggle}>
                 Edit
               </button>
             )}
             {isEditing ? (
               <button className="btn deleteBtn" onClick={handleCancelEdit}>
                 Cancel
               </button>
             ) : (
               <button className="btn deleteBtn" onClick={handleDeleteAccount}>
                 Delete Account
               </button>
             )}
            {editAnnouncement ? (
                <button className="btn deleteBtn" onClick={handleEditAnnouncement}>
                  Edit Announcement
                </button>
              ) : (
                <></>
              )}
           </div>
         </>
       ) : (
         <p>{error || 'Loading your account details...'}</p>
       )}
       {showPasswordModal && (
        <div className="password-modal">
          <div className="modal-content">
            <h2>Confirm Account Deletion</h2>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="error">{passwordError}</p>}
            <button onClick={handlePasswordSubmit}>Confirm</button>
            <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>

    </div>
  </div>
  );
}

export default DashboardAccount;
