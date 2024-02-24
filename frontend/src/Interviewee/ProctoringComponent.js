import React, { useState, useEffect, useRef } from 'react';
import tracking from 'tracking'; // Import tracking.js library

const ProctoringComponent = () => {
  const [headMovementDetected, setHeadMovementDetected] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const detectHeadMovement = () => {
      const video = videoRef.current; // Get video element from ref

      // Start tracking on the video element
      tracking.track(video, tracker);

      // Set up tracker event listener
      tracker.on('track', event => {
        if (event.data.length === 0) {
          setHeadMovementDetected(true);
        } else {
          setHeadMovementDetected(false);
        }
      });
    };

    // Define the tracker
    const tracker = new tracking.ObjectTracker('head');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    detectHeadMovement();

    return () => {
      tracking.stop(videoRef.current); // Stop tracking when component unmounts
    };
  }, []);

  return (
    <div>
      {headMovementDetected ? (
        <p>Head movement detected! Potential cheating detected.</p>
      ) : (
        <p>No suspicious head movement detected.</p>
      )}
      <video ref={videoRef} width="640" height="480" preload="auto" loop autoPlay muted></video>
    </div>
  );
};

export default ProctoringComponent;
