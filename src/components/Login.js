import React, { useState } from 'react';
import './login.css';
import {buildPath} from './buildPath';

function Login() {
  const [message, setMessage] = useState('');
  const [loginEmail,setLoginEmail] = useState('');
  const [loginPassword,setLoginPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

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

  const doLogin = async event => {
    event.preventDefault();

    var obj = { email: loginEmail.toLowerCase(), password: loginPassword };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/login'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      var res = JSON.parse(await response.text());

      if (res.error !== "") {
        setMessage(res.error);
      } else {

        // Load user information and ui settings.
        var user = {
            token: res.token,
            _id: res._id,
            email: res.email,
            name: res.name,
            username: res.username,
            phone: res.phone,
            showAnnouncement: res.showAnnouncement,
            uiOptions: res.uiOptions,
            test: res.test,
            error: res.error
        };
        console.log(JSON.stringify(user));
        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        window.location.href = '/dashboard';
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  return (
    <div className = "loginContainer background-tile-repeat">
      <div className ="loginForm mt-1">
          <div className ="card-header loginFormHeader text-center">
            <h1 className = "loginTitle">Login</h1>
          </div>
          <div className = "card-body p-0">
      
              <form onSubmit={doLogin}>

                  {/* Username */}
                  <div>
                    <label className = "formLabel" htmlFor="nameForm" style={{textAlign: "left"}}>Email</label>
                    <div>
                      <input id="nameForm" type="email" className="row formItem mx-0 mt-0" placeholder='Email' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required>
                      </input>
                    </div>
                  </div>

                  
                  {/* Password */}
                  <div>
                    <label className = "formLabel" htmlFor="passwordForm">Password</label>
                    <div style={{position: "relative", display: "inline-flex", width: "100%", boxSizing: "border-box"}}>
                      <input id="passwordForm" type="password" className="row formItem mx-0 my-0 mt-0" placeholder='Password' value ={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete='off'></input>
                      <i className={`fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} detailIcon`} onClick={togglePasswordVisibility} style={{fontSize: "30px", minWidth:"30px", position: "absolute", top: "8px", right: "10px", backgroundColor: "white"}}></i>
                    </div>
                  </div>
                  
                  <div className = "row text-center mb-1"><span>{message}</span></div>
                  <div className = "row text-center mb-2"><input id="submitLogin" className = "btn"type="submit" value="Login"/></div>
                  <div className ="row text-start mb-2"><a href="/forgot-password" className="forgot-password-link">Forgot your password?</a></div>
                  
              </form>
          </div> 
      </div>
    </div>
          
     
  );
};

export default Login;
