import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', { email, password });
      setSuccess(response.data.message);
      window.location.href = '/dashboard' ;
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="container">
      <div className="login form">
        <header>Login</header>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="submit" className="button" value="Login" />
          <center>
            {success && <p style={{ color: 'green' }}><b>{success}</b></p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </center>
        </form>
        <div className="signup">
          <span className="signup">Don't have an account?
            <a href="/"><label htmlFor="check">Signup</label></a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
