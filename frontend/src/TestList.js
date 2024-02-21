import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const TestList = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tests');
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="">
      <h1 className="mb-4">Test List</h1>
      <Link to="/add-test" className="btn btn-primary mb-4">Add Test</Link>
      <ul className="list-group">
        {tests.map(test => (
          <li key={test._id} className="list-group-item">
            <Link to={`/test/${test._id}`}>{test.title}</Link>
          </li>
        ))}
      </ul> 
    </div>
  );
};

export default TestList;
