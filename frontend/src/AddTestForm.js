import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';

const AddTestForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/add-test', { // Updated endpoint
        title,
        description,
      });
      Swal.fire('Success', 'Test added successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'An error occurred while adding the test', 'error');
    }
  };

  return (
    <div className='Add-Problem'>
      <div className="container">
        <div className="form">
          <header>Add Test</header>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="input"
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="button" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTestForm;
