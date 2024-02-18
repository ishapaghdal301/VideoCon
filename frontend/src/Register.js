import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password1: '',
    password2: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [showOTPField, setShowOTPField] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    if (!formData.email || !formData.username || !formData.password1 || !formData.password2) {
      Swal.fire({
        icon: 'error',
        title: 'Empty Fields',
        text: 'Please fill in all fields before sending OTP',
        confirmButtonColor: '#d33',
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://127.0.0.1:5000/api/register', {
        email: formData.email,
        username: formData.username,
        password1: formData.password1,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      setShowOTPField(true);
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent',
        text: 'An OTP has been sent to your email',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      setError(error.response.data.error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response.data.error,
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/verify_otp', {
        email: formData.email,
        otp: formData.otp,
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        password1: formData.password1,
        password2: formData.password2,
      });
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have successfully registered!',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        window.location.href = '/login';
      });
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
        <form onSubmit={e => e.preventDefault()}>
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
            type="text"
            placeholder="Enter your username"
            name="username"
            value={formData.username}
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
          {showOTPField && (
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
            />
          )}
          <div className="button-container">
            <button className="button" onClick={handleSendOTP} disabled={loading}>
              {loading ? 'Sending OTP...' : showOTPField ? 'Resend OTP' : 'Send OTP'}
            </button>
            {showOTPField && (
              <input type="button" className="button small-button" value="Register" onClick={handleRegister} />
            )}
          </div>
        </form>
        <div className="signup">
          <span className="signup">
            Already have an account?{' '}
            <a href="/login">
              <label htmlFor="check">Signin</
              label>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
