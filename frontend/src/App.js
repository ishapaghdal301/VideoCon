import React from 'react';
import { styled } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './SideBar';
import Register from './Register';
import Login from './Login';
import Dashboard from './DashBoard';
import VideoCall from './VideoCall';
import JoinRoom from './JoinRoom';
import Compiler from './Compiler';
import Canvas from './Canvas';
import AddTestForm from './Interviewer/AddTestForm';
import AddProblemForm from './Interviewer/AddProblemForm';
import TestList from './Interviewer/TestList';
import Test from './Interviewer/Test';
import UserPage from './containers/UserPage';
import ConductedTest from './Interviewee/ConductedTest';
import HostMeeting from './Interviewer/HostMeeting';

// const MainContainer = styled('div')({
//     marginLeft: 240, // Adjust this value according to the width of your Sidebar
//     flexGrow: 1,
// });

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                {/* <Sidebar /> */}
                {/* <MainContainer> */}
                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/meeting" element={<VideoCall />} />
                        <Route path="/join_room" element={<JoinRoom />} />
                        <Route path="/compiler" element={<Compiler />} />
                        <Route path="/whiteBoard" element={<Canvas />} />
                        <Route path="/add-problem/:testId" element={<AddProblemForm />} />
                        <Route path="/add-test" element={<AddTestForm />} />
                        <Route path="/tests" element={<TestList />} />
                        <Route path="/test/:testId" element={<Test />} />
                        <Route path="/github" element={<UserPage />} />
                        <Route path="/conductedtest/:testId" element={<ConductedTest />} />
                        <Route path="/host-meeting" element={<HostMeeting />} />
                    </Routes>
                {/* </MainContainer> */}
            </BrowserRouter>
        </div>
    );
}

export default App;
