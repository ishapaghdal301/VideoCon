import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password1: '',
    password2: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (formData.password1 !== formData.password2) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure your passwords match',
        confirmButtonColor: '#d33',
      });
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register', formData);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have successfully registered!',
        confirmButtonColor: '#3085d6',
      });
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response.data.error,
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="container">
      <div className="registration form">
        <header>Signup</header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your first name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Enter your last name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Create a password"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm your password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
          />
          <input type="submit" className="button" value="Signup" />
          <center>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </center>
        </form>
        <div className="signup">
          <span className="signup">
            Already have an account?{' '}
            <a href="/login">
              <label htmlFor="check">Signin</label>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
