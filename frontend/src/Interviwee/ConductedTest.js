import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './test.css';
import Compiler from './Compiler';

const ConductedTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [submissionResponse, setSubmissionResponse] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tests/${testId}`);
        setTest(response.data);
        // Select the first problem by default
        if (response.data && response.data.problems.length > 0) {
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
      setSubmissionResponse(null); // Clear previous submission response
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
      <div className="main-content">
        {selectedProblem && (
          <div className="problem-details">
            <h3>{selectedProblem.title}</h3>
            <p>{selectedProblem.description}</p>
            <h4>Sample Input</h4>
            <p>{selectedProblem.sampleInput}</p>
            <h4>Sample Output</h4>
            <p>{selectedProblem.sampleOutput}</p>
            <div className="compiler">
              <Compiler selectedProblemId={selectedProblem._id} />
            </div>
          </div>
        )}
        {!selectedProblem && <div className="placeholder">Click on a problem to view details</div>}
        {submissionResponse && (
          <div className="submission-response">
            <h3>Submission Response</h3>
            <ul>
              {Object.entries(submissionResponse).map(([testcase, result]) => (
                <li key={testcase}>{`${testcase}: ${result}`}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConductedTest;
