import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './test.css';
import ProblemDetails from './ProblemDetails';


const ConductedTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tests/${testId}`);
        setTest(response.data);
        if (response.data && response.data.problems.length > 0) {
          const problems = response.data.problems;
          problems.forEach(problem => {
            const problemData = {
              userInput: null,
              userOutput: null,
              userCode: null
            };
            localStorage.setItem(problem._id, JSON.stringify(problemData));
          });
          handleProblemClick(response.data.problems[0]._id);
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };
    fetchTest();
  }, [testId]);

  const handleProblemClick = async (problemId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/problems/${problemId}`);
      setSelectedProblem(response.data);
    } catch (error) {
      console.error('Error fetching problem:', error);
    }
  };

  return (
    <div className="test-container">
      <div className="sidebar">
        <h2>Problems</h2>
        <ul>
          {test && test.problems.map(problem => (
            <li key={problem._id} onClick={() => handleProblemClick(problem._id)}>
              {problem.title}
            </li>
          ))}
        </ul>
      </div>
      <ProblemDetails selectedProblem={selectedProblem} />
    </div>
  );
};

export default ConductedTest;
