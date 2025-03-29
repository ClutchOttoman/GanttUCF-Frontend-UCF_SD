import React, { useEffect, useState } from 'react';
import './Register.css';
import {buildPath} from './buildPath';


function Register() {
  const [regName, setRegName] = useState('');
  const regUser = "username"
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordVerify, setRegPasswordVerify] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // For changing checkmark and x icons.
  const [isMinLength, setIsMinLength] = useState(false);
  const [doesContainLower, setDoesContainLower] = useState(false);
  const [doesContainUpper, setDoesContainUpper] = useState(false);
  const [doesContainDigit, setDoesContainDigit] = useState(false);
  const [doesContainSpecialChar, setDoesContainSpecialChar] = useState(false);


  const validPhone = /^[(]?\d{3}[)]?[ -]?\d{3}[ -]?\d{4}$/;
  const validPassLower = RegExp("[a-z]+");
  const validPassUpper = RegExp("[A-Z]+");
  const validPassSymbol = RegExp("[^a-zA-Z0-9\s]+");
  const validPassDigit = RegExp("[0-9]+");
  const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const msgTag = " *** ";

  const [message, setMessage] = useState('');
  const [disable, setDisable] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const togglePasswordVisibility = () => {
    let passwordField = document.getElementById("passwordForm");

    if (!isPasswordVisible){
      passwordField.type = "text";
      setPasswordVisible(true);
    } else {
      passwordField.type = "password";
      setPasswordVisible(false);
    }
  }

  const toggleConfirmPasswordVisibility = () => {
    let passwordField = document.getElementById("verifyPasswordForm");

    if (!isConfirmPasswordVisible){
      passwordField.type = "text";
      setConfirmPasswordVisible(true);
    } else {
      passwordField.type = "password";
      setConfirmPasswordVisible(false);
    }
  }

  const doRegister = async event => {
    event.preventDefault();
    setDisable(true);

    if (!validPhone.test(regPhone)) {
      setMessage("*** Please enter a valid 10 digit phone number ***");
      setDisable(false);
      return;
    }

    if (regPassword === null || regPassword.length < 8) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisable(false);
      return;
    }
    if (!validPassLower.test(regPassword)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisable(false);
      return;
    }
    if (!validPassUpper.test(regPassword)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisable(false);
      return;
    }
    if (!validPassDigit.test(regPassword)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisable(false);
      return;
    }
    if (!validPassSymbol.test(regPassword)) {
      setMessage("*** Your password does not meet the listed requirements. ***");
      setDisable(false);
      return;
    }

    if (regPassword !== regPasswordVerify) {
      setMessage("*** Passwords do not match ***");
      setDisable(false);
      return;
    }

    var obj = { email: regEmail.toLowerCase(), name: regName, phone: regPhone, password: regPassword, username: regUser };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath('api/register'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      var txt = await response.text();
      var res = JSON.parse(txt);

      if (res.error && res.error.length > 0) {
        setMessage(msgTag.concat(res.error, msgTag));
        setDisable(false);
      } else {
        setMessage("Email has been sent to " + regEmail);
        setFormVisible(false);
      }
    } catch (e) {
      alert(e.toString());
      setDisable(false);
      return;
    }
  }

  (function () {
    'use strict';
    window.addEventListener('load', function () {
      var forms = document.getElementsByClassName('needs-validation');
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
  function checkPhoneValidity(){
    if(regPhone.localeCompare("") === 0){
      setMessage("");
    }
    else if (!validPhone.test(regPhone)) {
      setMessage("*** Please enter a valid 10 digit phone number ***");
    }
    else{
      setMessage("");
    }
  };
  // Sends visual indicators.
  // Returns true if all fields are valid, false otherwise.
  function checkPasswordValidity(){

    if (regPassword.localeCompare("") === 0){
      setMessage("");
    } 

    // Enforce password length
    if (regPassword === null || regPassword.length < 8) {
      setIsMinLength(false);
    } else {
      setIsMinLength(true); // indicate visually.
    }

    // Enforce a lowercase letter in the password.
    if (!validPassLower.test(regPassword)) {
      setDoesContainLower(false);
    } else {
      setDoesContainLower(true); // indicate visually.
    }

    // Enforce a uppercase letter in the password.
    if (!validPassUpper.test(regPassword)) {
      setDoesContainUpper(false);
    } else {
      setDoesContainUpper(true);
    }

    // Enforce a digit in the password.
    if (!validPassDigit.test(regPassword)) {
      setDoesContainDigit(false);
    } else {
      setDoesContainDigit(true);
    }

    // Enfore a special character in the password.
    if (!validPassSymbol.test(regPassword)) {
      setDoesContainSpecialChar(false);
    } else {
      setDoesContainSpecialChar(true);
    }

    // If field is empty.
    if(regPasswordVerify.localeCompare("") === 0){
      setMessage("");
    }

    if (regPassword !== regPasswordVerify) {
      setMessage("*** Passwords do not match ***");
      return false;
    } else{
      setMessage("");
      return true;
    }
  }

  function checkEmailValidity(){
    if(regEmail.localeCompare("") === 0){
      setMessage("");
    }
    else if(!validEmail.test(regEmail)){
      setMessage("*** Please enter a valid email ***")
    }
    else{
      setMessage("");
    }
  }

  function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
  
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2]
        ? `(${match[1]}`
        : !match[3]
        ? `(${match[1]}) ${match[2]}`
        : `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  
    return value;
  }

  useEffect(()=>{checkPhoneValidity()},[regPhone])
  useEffect(()=>{checkPasswordValidity()},[regPassword,regPasswordVerify])
  useEffect(()=>{checkEmailValidity()},[regEmail]);
  return (
    <div>
      <div>
        {formVisible ? (
          <div class = "registerContainer background-tile-repeat">
                <div class ="registerForm mt-1">
                    <div class ="card-header registerFormHeader text-center">
                      <h1 class = "registerTitle">Create an Account</h1>
                    </div>
                    <div class = "card-body p-0">
                        <form onSubmit={doRegister}>

                            {/* Full name. */}
                            <div>
                              <label class = "formLabel" for="nameForm">Full name</label>
                              <div>
                                <input id="nameForm" type="text" class="formItem mx-0 mt-0" placeholder='Firstname Lastname' value={regName} onChange={(e) => setRegName(e.target.value)} required></input>
                              </div>
                            </div>

                            {/* Email address */}
                            <div>
                              <label class = "formLabel" for="emailForm">Email</label>
                              <div>
                                <input id="emailForm" type="email" class="formItem" placeholder='example@email.com' value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required></input>
                              </div>
                            </div>

                            {/* 10-diigt phone number. */}
                            <div>
                              <label class = "formLabel" for="telForm">10-digit phone number</label>
                              <div>
                                <input id="telForm" type="tel" class="formItem" placeholder='(###) ###-####' value={regPhone} onChange={(e) => setRegPhone(formatPhoneNumber(e.target.value))} required></input>
                              </div>
                            </div>

                            {/* Enter registered password */}
                            <div>
                              <label class = "formLabel" for="passwordForm">Password</label>

                              {/* Password requirements */}
                              <div>
                                <div className='indicate_valid_container'>
                                  <i className={`${isMinLength ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                                  <p>{isMinLength ? ('Your password is least 8 characters.') : ('Your password must be at least 8 characters.')}</p>
                                </div>
                                
                                <div className='indicate_valid_container'>
                                  <i className={`${doesContainLower ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                                  <p>{doesContainLower ? ('Your password has at least one lowercase letter.') : ('Your password must contain at least one lowercase letter.')}</p>
                                </div>

                                <div className='indicate_valid_container'>
                                  <i className={`${doesContainUpper ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                                  <p>{doesContainUpper ? ('Your password has at least one uppercase letter.') : ('Your password must contain at least one uppercase letter.')}</p>
                                </div>

                                <div className='indicate_valid_container'>
                                  <i className={`${doesContainDigit ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                                  <p>{doesContainDigit ? ('Your password has at least one digit.') : ('Your password must contain at least one digit.')}</p>
                                </div>

                                <div className='indicate_valid_container'>
                                  <i className={`${doesContainSpecialChar ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}`}></i>
                                  <p>{doesContainSpecialChar ? ('Your password has at least one special symbol.') : ('Your password must contain at least one special symbol.')}</p>
                                </div>

                              </div>
                              
                              {/* Password field. */}
                              <div style={{position: "relative", display: "inline-flex", width: "100%", boxSizing: "border-box"}}>
                                <input id="passwordForm" type="password" class="formItem mx-0 my-0 mt-0" placeholder='Enter password' value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required autoComplete='off'></input>
                                <i className={`fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} detailIcon`} onClick={togglePasswordVisibility} style={{fontSize: "30px", minWidth:"30px", position: "absolute", top: "8px", right: "10px", backgroundColor: "white"}}></i>                       
                              </div>
                            </div>
                            
                            {/* Confirm registered password */}
                            <div>
                              <label class = "formLabel" for="verifyPasswordForm">Re-enter password</label>
                              <div style={{position: "relative", display: "inline-flex", width: "100%", boxSizing: "border-box"}}>
                                <input id="verifyPasswordForm" type="password" class="formItem mx-0 my-0 mt-0" placeholder='Re-enter password'value={regPasswordVerify} onChange={(e) => setRegPasswordVerify(e.target.value)} required autoComplete='off'></input>
                                <i className={`fas ${isConfirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} detailIcon`} onClick={toggleConfirmPasswordVisibility} style={{fontSize: "30px", minWidth:"30px", position: "absolute", top: "8px", right: "10px", backgroundColor: "white"}}></i>
                              </div>
                            </div>

                            <div class = "row text-center mb-1"><span>{message}</span></div>
                            <div class = "row text center mb-2"><button type="submit" className="btn submitButton" disabled={disable}>{disable ? 'Submitting...' : 'Create Account'}</button></div>
                            <div class = "row text center mb-3">
                              <p>By registering, you consent to having notifications regarding your account sent to your registered email.</p>
                              <p>Please do not use GanttUCF to store NDA-protected, sensitive, or confidential information.</p>
                            </div>
                        </form>
                    </div> 
                </div>
          </div>
          
        ) : (
          <div>
            <div className="verify-email-container">
              <div className="verify-email-card">
                <h1 className="verify-email-title">Please Verify Your Email</h1>
                <p className="verify-email-description">An email has been sent to <span className="email-style">{regEmail}</span>. Follow the instructions in the email to verify your account.</p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Register;
