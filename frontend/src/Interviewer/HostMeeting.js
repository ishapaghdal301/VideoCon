import React, { useState } from 'react';
import axios from "axios";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function randomID(len) {
    let result = '';
    if (result) return result;
    var chars =
        '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export function getUrlParams(url = window.location.href) {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

const App = () => {
    const [interviewerName, setInterviewerName] = useState('');
    const [interviewerEmail, setInterviewerEmail] = useState('');
    const [intervieweeName, setIntervieweeName] = useState('');
    const [intervieweeEmail, setIntervieweeEmail] = useState('');
    const [meetingLink, setMeetingLink] = useState('');

    const handleHostMeeting = async () => {
        const generatedMeetingLink = generateMeetingLink();

        sendEmail(interviewerEmail, intervieweeEmail, generatedMeetingLink);

        setMeetingLink(generatedMeetingLink);
    };

    const sendEmail = async (interviewerEmail, intervieweeEmail, meetingLink) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/auth/send-email", {
                to: interviewerEmail,
                subject: 'Meeting Invitation',
                text: `Hello ${interviewerName},\n\nYou are invited to a meeting. Here is the meeting link: ${meetingLink}\n\nBest regards,\nInterviewer`
            });

            await axios.post("http://127.0.0.1:8000/api/auth/send-email", {
                to: intervieweeEmail,
                subject: 'Meeting Invitation',
                text: `Hello ${intervieweeName},\n\nYou are invited to a meeting. Here is the meeting link: ${meetingLink}\n\nBest regards,\nInterviewer`
            });

            // console.log('Emails sent successfully');
        } catch (error) {
            console.error('Error sending emails:', error);
        }
    };

    const generateMeetingLink = () => {
        const roomID = getUrlParams().get('roomID') || randomID(5);
        const appID = 567250147;
        const serverSecret = "78ffffac092a0abd8511c4d4f5d27ec8";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: null,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
            },
        });

        return window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID;
    };

    return (
        <div className="container">
            <div className="login-form">
                <header>Host a Meeting</header>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input-field">
                        <label>Interviewer Name:</label>
                        <input
                            type="text"
                            value={interviewerName}
                            onChange={(e) => setInterviewerName(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <label>Interviewer Email:</label>
                        <input
                            type="email"
                            value={interviewerEmail}
                            onChange={(e) => setInterviewerEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <label>Interviewee Name:</label>
                        <input
                            type="text"
                            value={intervieweeName}
                            onChange={(e) => setIntervieweeName(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <label>Interviewee Email:</label>
                        <input
                            type="email"
                            value={intervieweeEmail}
                            onChange={(e) => setIntervieweeEmail(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={handleHostMeeting}>Host</button>
                    </div>
                    {meetingLink && <p>Meeting Link: {meetingLink}</p>}
                </form>
            </div>
        </div>
    );
};

export default App;
