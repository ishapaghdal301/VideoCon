import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        emailOrUsername: email,
        password,
      });
      setSuccess(response.data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/verify_otp_login",
        { email, otp }
      );
      setSuccess(response.data.message);
      localStorage.setItem("jwt_token", response.data.jwt_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const handleResendOTP = () => {
    Swal.fire({
      title: "Resend OTP?",
      text: "Are you sure you want to resend OTP?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, resend OTP!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await axios.post("http://127.0.0.1:5000/api/login", {
            emailOrUsername: email,
            password,
          });
          setSuccess(response.data.message);
          setOtpSent(true);
        } catch (err) {
          setError(err.response.data.error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="container">
      <div className="login form">
        <header>Login</header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!otpSent ? (
            <input type="submit" className="button" value="Send OTP" />
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="button-container">
                <button
                  className="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  {loading ? "Resending OTP..." : "Resend OTP"}
                </button>
                <input
                  type="button"
                  className="button small-button"
                  value="Login"
                  onClick={handleVerifyOTP}
                />
              </div>
            </>
          )}
        </form>
        <center>
          {success && (
            <p style={{ color: "green" }}>
              <b>{success}</b>
            </p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </center>
        <div className="signup">
          <span className="signup">
            Don't have an account?
            <a href="/">
              <label htmlFor="check">Signup</label>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
