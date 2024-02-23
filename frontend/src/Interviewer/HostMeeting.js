import React, { useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import "../style.css";
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

const HostMeeting = () => {
    const [interviewerName, setInterviewerName] = useState('');
    const [interviewerEmail, setInterviewerEmail] = useState('');
    const [intervieweeName, setIntervieweeName] = useState('');
    const [intervieweeEmail, setIntervieweeEmail] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleHostMeeting = async () => {
        setLoading(true);

        try {
            const generatedMeetingLink = generateMeetingLink();

            await sendEmail(interviewerEmail, intervieweeEmail, generatedMeetingLink);

            setMeetingLink(generatedMeetingLink);

            Swal.fire({
                icon: "success",
                title: "Meeting Hosted",
                text: "The meeting has been successfully hosted!",
                confirmButtonColor: "#3085d6",
            });
        } catch (error) {
            console.error("Error hosting meeting:", error);

            Swal.fire({
                icon: "error",
                title: "Meeting Hosting Failed",
                text: "An unexpected error occurred while hosting the meeting",
                confirmButtonColor: "#d33",
            });
        } finally {
            setLoading(false);
        }
    };

    const sendEmail = async (interviewerEmail, intervieweeEmail, meetingLink) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/auth/send-email", {
                to: interviewerEmail,
                subject: "Meeting Invitation",
                text: `Hello ${interviewerName},\n\nYou are invited to a meeting. Here is the meeting link: ${meetingLink}\n\nBest regards,\nInterviewer`
            });

            await axios.post("http://127.0.0.1:8000/api/auth/send-email", {
                to: intervieweeEmail,
                subject: "Meeting Invitation",
                text: `Hello ${intervieweeName},\n\nYou are invited to a meeting. Here is the meeting link: ${meetingLink}\n\nBest regards,\nInterviewer`
            });
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
            <div className="form">
                <header>Host a Meeting</header>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Enter Interviewer's Name"
                        value={interviewerName}
                        onChange={(e) => setInterviewerName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Enter Interviewer's Email"
                        value={interviewerEmail}
                        onChange={(e) => setInterviewerEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter Interviewee's Name"
                        value={intervieweeName}
                        onChange={(e) => setIntervieweeName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Enter Interviewee's Email"
                        value={intervieweeEmail}
                        onChange={(e) => setIntervieweeEmail(e.target.value)}
                    />
                    <button className="button" onClick={handleHostMeeting} disabled={loading}>
                        {loading ? "Hosting Meeting..." : "Host Meeting"}
                    </button>
                    {meetingLink && <p>Meeting Link: {meetingLink}</p>}
                </form>
            </div>
        </div>
    );
};

export default HostMeeting;
