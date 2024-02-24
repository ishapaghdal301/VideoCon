import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './style.css'; // Import your CSS file

const Dashboard = ({ name }) => {
  return (
    <div className="dashboard">
      <h1>Welcome, {name}!</h1>
      <Link to="/host-meeting" className="button">Host Meeting</Link>
      <Link to="/meeting" className="button">New Meeting</Link>
      <Link to="/join_room" className="button">Join Meeting</Link>
      <Link to="/logout" className="button">Logout</Link>
    </div>
  );
};

export default Dashboard;
