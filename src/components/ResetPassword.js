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

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // For changing checkmark and x icons.
  const [isMinLength, setIsMinLength] = useState(false);
  const [doesContainLower, setDoesContainLower] = useState(false);
  const [doesContainUpper, setDoesContainUpper] = useState(false);
  const [doesContainDigit, setDoesContainDigit] = useState(false);
  const [doesContainSpecialChar, setDoesContainSpecialChar] = useState(false);

  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    let passwordField = document.getElementById("floatingPassword");

    if (!isPasswordVisible){
      passwordField.type = "text";
      setPasswordVisible(true);
    } else {
      passwordField.type = "password";
      setPasswordVisible(false);
    }
  }

  const toggleConfirmPasswordVisibility = () => {
    let passwordField = document.getElementById("floatingPassword2");

    if (!isConfirmPasswordVisible){
      passwordField.type = "text";
      setConfirmPasswordVisible(true);
    } else {
      passwordField.type = "password";
      setConfirmPasswordVisible(false);
    }
  }

  const doResetPassword = async event => {
    event.preventDefault();

    setDisableButton(true);

    if (password === null || password.length < 8) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisableButton(false);
      return;
    }
    if (!validPassLower.test(password)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisableButton(false);
      return;
    }
    if (!validPassUpper.test(password)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisableButton(false);
      return;
    }
    if (!validPassDigit.test(password)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisableButton(false);
      return;
    }
    if (!validPassSymbol.test(password)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
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

  // Sends visual indicators.
  // Returns true if all fields are valid, false otherwise.
  function checkPasswordValidity() {
    
    if (password.localeCompare("") === 0) {
      setMessage("");
    }
    
    if (password === null || password.length < 8) {
      setIsMinLength(false);
    } else {
      setIsMinLength(true); // indicate visually.
    }
    
    if (!validPassLower.test(password)) {
      setDoesContainLower(false);
    } else {
      setDoesContainLower(true); // indicate visually.
    }
    
    if (!validPassUpper.test(password)) {
      setDoesContainUpper(false);
    } else {
      setDoesContainUpper(true);
    }
    
    if (!validPassDigit.test(password)) {
      setDoesContainDigit(false);
    } else {
      setDoesContainDigit(true);
    }
    
    if (!validPassSymbol.test(password)) {
      setDoesContainSpecialChar(false);
    } else {
      setDoesContainSpecialChar(true);
    }
    
    // If field is empty.
    if (verifiedPassword.localeCompare("") === 0) {
      setMessage("");
    }
    
    if (password !== verifiedPassword) {
      setMessage("*** Passwords do not match ***");
      return false;
    } else {
      setMessage("");
      return true;
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

    <div className="reset-password-container background-tile-repeat">
      <div className="reset-password-form">

        <div className="card-header registerFormHeader text-center">
          <h1 className="reset-password-title">Reset Password</h1>
        </div>

        <div className="card-body p-0">
    
          <form onSubmit={doResetPassword}>

            {/* Password container */}
            <div>
              <label className="formLabel" htmlFor="floatingPassword">New password</label>
               
               {/* Password requirements */}
               <div>
                  <div className='indicate_valid_container'>
                    <i className={`${isMinLength ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                    <p>{isMinLength ? ('Your new password is least 8 characters.') : ('Your new password must be at least 8 characters.')}</p>
                  </div>
                  
                  <div className='indicate_valid_container'>
                    <i className={`${doesContainLower ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                    <p>{doesContainLower ? ('Your new password has at least one lowercase letter.') : ('Your new password must contain at least one lowercase letter.')}</p>
                  </div>

                  <div className='indicate_valid_container'>
                    <i className={`${doesContainUpper ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                    <p>{doesContainUpper ? ('Your new password has at least one uppercase letter.') : ('Your new password must contain at least one uppercase letter.')}</p>
                  </div>

                  <div className='indicate_valid_container'>
                    <i className={`${doesContainDigit ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                    <p>{doesContainDigit ? ('Your new password has at least one digit.') : ('Your new password must contain at least one digit.')}</p>
                  </div>

                  <div className='indicate_valid_container'>
                    <i className={`${doesContainSpecialChar ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                    <p>{doesContainSpecialChar ? ('Your new password has at least one special symbol.') : ('Your new password must contain at least one special symbol.')}</p>
                  </div>
              </div>

              {/* Password input */}
              <div style={{position: "relative", display: "inline-flex", width: "100%", boxSizing: "border-box"}}>
                <input type="password" id="floatingPassword" className="formItem mx-0 my-0 mt-0" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete='off'/>
                <i className={`fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} detailIcon`} onClick={togglePasswordVisibility} style={{fontSize: "30px", minWidth:"30px", position: "absolute", top: "8px", right: "10px", backgroundColor: "white"}}></i>                       
              </div>

            </div>
  
            {/* Confirm password. */}
            <div>
              <label className="formLabel" htmlFor="floatingPassword2">Re-enter new password</label>
              <div style={{position: "relative", display: "inline-flex", width: "100%", boxSizing: "border-box"}}>
                <input type="password" id="floatingPassword2" className="formItem mx-0 my-0 mt-0" placeholder="Password" value={verifiedPassword} onChange={e => setVerifiedPassword(e.target.value)} required autoComplete='off'/>
                <i className={`fas ${isConfirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} detailIcon`} onClick={toggleConfirmPasswordVisibility} style={{fontSize: "30px", minWidth:"30px", position: "absolute", top: "8px", right: "10px", backgroundColor: "white"}}></i>                       
              </div>
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
