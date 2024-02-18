import React, { useState } from 'react';
import axios from 'axios';
import './style.css'; // Make sure to import your custom CSS file

const JoinRoom = () => {
  const [roomID, setRoomID] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/joinroom', { roomID });
      setSuccess(response.data.message);
      window.location.href = '/meeting?roomID=' + roomID;
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="container">
      <div className="login form">
        <header>Join Room</header>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter room ID" value={roomID} onChange={(e) => setRoomID(e.target.value)} />
          <input type="submit" className="button" value="Join" />
          <center>
            {success && <p style={{ color: 'green' }}><b>{success}</b></p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </center>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
