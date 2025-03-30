import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AcceptInvite.css';

import { buildPath } from './buildPath';


function AcceptInvite() {

  const headMessage = "Please enter the email used for your Ganttify account";
  const thankYouMessage = "Thank you, you have been added as a member of the team!";

  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [email, setEmail] = useState("");
  const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  // Compare the entered email to the valid email test
  function checkEmailValidity(){
    if(email.localeCompare("") === 0){
      setEmailMessage("");
    }
    else if(!validEmail.test(email)){
      setEmailMessage("*** Please enter a valid email ***")
    }
    else{
      setEmailMessage("");
      return true;
    }

    return false;
  }

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setMessage("");
    setEmailMessage("");
  };

  // After submit, check validity then accept the invite
  const handleSubmit = () => {
    if(checkEmailValidity()){
      doAcceptInvite();
    }
  };

  const doAcceptInvite = async () => {
    // Check email isnt empty, and is valid
    if(email !== "" && validEmail.test(email)){
      let isValidUser = false;

      // Find the user based on their email
      try{
        const response = await fetch(buildPath(`api/search-user/${email}`), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();
        if (res.error) {
          setMessage('That email is not associated with a Ganttify account\nPlease try again or create an account and try again.');
          return;
        }
        else{
          isValidUser = true;
        }

        // If the user has a valid GanttUCF account
        if(isValidUser){
          // Accept the invite
          try {
            const response = await fetch(buildPath(`api/accept-invite/${token}/${email}`), {
              method: 'GET',
              headers: { 'Content-Type': 'application/json'}
            });
  
          } catch (e) {
            console.error('Error accepting invite:', e);
            setMessage('There was an issue with accepting your invite.');
            return;
          }
        }

        // Display thank you message, and reroute to login page
        setMessage(thankYouMessage);

        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);

      }catch(error){
        setMessage('There was an issue with accepting your invite.');
        console.error('Error finding email:', error);
      }
    }
  };

  return (

    <div className="verify-email-container">

      <div className="verify-email-card">

        <h1 className="verify-email-title">Accept Invite</h1>

        <p className='verify-email-description'>{headMessage}</p>

        {message !== "" ? message : ""}
        {message === thankYouMessage && <p>Redirecting to Login Page...</p>}

        <input
          type="email"
          className="email-input"
          placeholder="Enter your email"
          value={email}
          onChange={handleInputChange}
        />

        {/* Displaying the email message and the forms depending on what the message currently is */}
        <div className="button-container d-grid gap-2">
          {emailMessage === "" ? (
            <div>
              <button className="btn btn-primary mt-2" onClick={handleSubmit}>
                Submit
              </button>
              <a href="/register" className="btn-2 btn-link mt-2">
                Create an Account
              </a>
            </div>
          ) : (
            <div>
              <p>{emailMessage}</p>
              <button className="btn btn-primary mt-2" onClick={handleSubmit}>
                Submit
              </button>
              <a href="/register" className="btn-2 btn-link mt-2">
                Create an Account
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AcceptInvite;