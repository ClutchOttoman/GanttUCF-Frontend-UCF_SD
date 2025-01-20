import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

import {buildPath} from './buildPath';


function ResetPassword() {
  const params = useParams();
  let { id } = params;

  const validPassLower = RegExp("[a-z]+");
  const validPassUpper = RegExp("[A-Z]+");
  const validPassSymbol = RegExp("[^a-zA-Z0-9]+");
  const validPassDigit = RegExp("[0-9]+");

  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const doResetPassword = async event => {
    event.preventDefault();

    setDisableButton(true);

    if (password === null || password.length < 8) {
      setMessage("*** Your password must be at least 8 characters ***");
      setDisableButton(false);
      return;
    }
    if (!validPassLower.test(password)) {
      setMessage("*** Your password must contain at least one lowercase letter ***");
      setDisableButton(false);
      return;
    }
    if (!validPassUpper.test(password)) {
      setMessage("*** Your password must contain at least one uppercase letter ***");
      setDisableButton(false);
      return;
    }
    if (!validPassDigit.test(password)) {
      setMessage("*** Your password must contain at least one digit ***");
      setDisableButton(false);
      return;
    }
    if (!validPassSymbol.test(password)) {
      setMessage("*** Your password must contain at least one special symbol ***");
      setDisableButton(false);
      return;
    }

    if (password !== verifiedPassword) {
      setMessage("*** Passwords do not match ***");
      setDisableButton(false);
      return;
    }
    var obj = { id: id, password: password };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath('api/reset-password'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      var txt = await response.text();
      var res = JSON.parse(txt);
      
      // Allows custom messages.
      if (!response.ok) {
        setMessage("***" + res.message + "***");
        setDisableButton(false);
      } else {
        setMessage("Password has been reset successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (e) {
      setMessage(e.toString());
      setDisableButton(false);
    }
    
  };

  function checkPasswordValidity() {

    
    if (password.localeCompare("") === 0) {
      setMessage("");
      return;
    }
    
    if (password === null || password.length < 8) {
      setMessage("*** Your password must be at least 8 characters ***");
      return;
    }
    
    if (!validPassLower.test(password)) {
      setMessage("*** Your password must contain at least one lowercase letter ***");
      return;
    }
    
    if (!validPassUpper.test(password)) {
      setMessage("*** Your password must contain at least one uppercase letter ***");
      return;
    }
    
    if (!validPassDigit.test(password)) {
      setMessage("*** Your password must contain at least one digit ***");
      return;
    }
    
    if (!validPassSymbol.test(password)) {
      setMessage("*** Your password must contain at least one special symbol ***");
      return;
    }
    
    if (verifiedPassword.localeCompare("") === 0) {
      setMessage("");
      return;
    }
    
    if (password !== verifiedPassword) {
      setMessage("*** Passwords do not match ***");
      return;
    } 
    
    else {
      setMessage("");
      return;
    }
  }

  useEffect(() => {
    checkPasswordValidity();
  }, [password, verifiedPassword]);

  useEffect(() => {
    if (!id || id.length !== 24) {
      setMessage("Invalid user ID. Please check your password reset link.");
      setDisableButton(true);
    }
  }, [id]);
  
  return (

    
    <div className="reset-password-container">
      <div className="reset-password-form text-center">

    
        <div className="card-header registerFormHeader">
          <h1 className="reset-password-title">Reset Password</h1>
        </div>

    
        <div className="card-body p-0">
    
          <form onSubmit={doResetPassword}>
    
            <div className="row text-start">
              <label className="formLabel mb-1" htmlFor="floatingPassword">New password</label>
            </div>
    
            <div className="row text-center mb-3">
              <input type="password" id="floatingPassword" className="formItem mx-0 mt-0" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
    
            <div className="row text-start">
              <label className="formLabel mb-1" htmlFor="floatingPassword2">Re-enter new password</label>
            </div>
    
            <div className="row text-center mb-3">
              <input type="password" id="floatingPassword2" className="formItem" placeholder="Password" value={verifiedPassword} onChange={e => setVerifiedPassword(e.target.value)} required />
            </div>
    
            <div className="row text-center mb-1">
              <span>{message}</span>
            </div>
    
            <div className="row text-center mb-2">
              <button className="btn btn-primary" type="submit" disabled={disableButton}>
                {disableButton ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
                
            <div className="row text-center mb-2">
              <a href="/login" className="forgot-password-link">Back to Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
