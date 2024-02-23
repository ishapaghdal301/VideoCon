import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './test.css';
import ProblemDetails from './ProblemDetails';


const ConductedTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tests/${testId}`);
        setTest(response.data);
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };
    fetchTest();
  }, [testId]);

  return (
    <div className="test-container">
        <h2>Problems</h2>
        <ul>
          {test && test.problems.map(problem => (
            <ProblemDetails selectedProblem={problem} />
          ))}
        </ul>
      
    </div>
  );
};

export default ConductedTest;
