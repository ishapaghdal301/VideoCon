import React, { useEffect } from 'react';
import Compiler from './Compiler';

function ProblemDetails({ selectedProblem }) {
  useEffect(() => {
    console.log('Selected problem changed:', selectedProblem);
  }, [selectedProblem]);

  return (
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
    </div>
  );
}

export default ProblemDetails;
