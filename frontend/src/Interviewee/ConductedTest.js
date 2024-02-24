import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './test.css';
import ProblemDetails from './ProblemDetails';
import Swal from 'sweetalert2';

const ConductedTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const redirectToScorePage = () => {
    // Redirect to the score page
    window.location.href = `/score/${testId}`;
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tests/${testId}`);
        setTest(response.data);
        // Retrieve the predefined time limit from the database (assuming it's in seconds)
        const timeLimitInSeconds = 10; // Replace with actual time limit from the database
        const storedStartTime = localStorage.getItem(`startTime_${testId}`);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (storedStartTime) {
          const elapsedTime = currentTime - parseInt(storedStartTime);
          const remainingTime = Math.max(timeLimitInSeconds - elapsedTime, 0);
          setStartTime(parseInt(storedStartTime));
          setRemainingTime(remainingTime);
        } else {
          setStartTime(currentTime);
          setRemainingTime(timeLimitInSeconds);
          localStorage.setItem(`startTime_${testId}`, currentTime.toString());
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    const checkFullScreen = () => {
      // Check if the document is in full screen mode
      const isInFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      // If not in full screen, prompt the user
      if (!isInFullScreen) {
        Swal.fire({
          title: 'Enter Full Screen',
          text: 'Do you want to enter full screen?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then(result => {
          if (result.isConfirmed) {
            // Enter full screen
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
              document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
              document.documentElement.msRequestFullscreen();
            }
          }
        });
      }
    };

    // Check full screen state every 5 seconds
    const interval = setInterval(checkFullScreen, 1500);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime !== null) {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const elapsedTime = currentTime - startTime;
        const timeLimitInSeconds = 10; // Replace with actual time limit from the database
        const remainingTime = Math.max(timeLimitInSeconds - elapsedTime, 0);
        setRemainingTime(remainingTime);
        if (remainingTime === 0) {
          clearInterval(timer);
          redirectToScorePage();
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleEndTest = () => {
    localStorage.removeItem(`startTime_${testId}`);
    redirectToScorePage();
  };

  return (
    <div className="test-container">
      {remainingTime !== null && (
        <div className="remaining-time">Remaining Time: {remainingTime} seconds</div>
      )}
      <h2>Problems</h2>
      <button onClick={handleEndTest}>End Test</button>
      <ul>
        {test && test.problems.map(problem => (
          <ProblemDetails key={problem.id} selectedProblem={problem} />
        ))}
      </ul>
    </div>
  );
};

export default ConductedTest;
