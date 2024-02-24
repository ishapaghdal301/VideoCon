import React from 'react';
import { styled } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Register from './Register';
import Login from './Login';
import Dashboard from './DashBoard';
import VideoCall from './Meeting/VideoCall';
import JoinRoom from './JoinRoom';
import ResponsiveAppBar from './SideBar';
import Compiler from './Meeting/CollabrativeCompiler/Compiler';
import Canvas from './Meeting/Whiteboard/WhiteBoard';
import AddTestForm from './Interviewer/AddTestForm';
import AddProblemForm from './Interviewer/AddProblemForm';
import TestList from './Interviewer/TestList';
import Test from './Interviewer/Test';
import UserPage from './Meeting/containers/UserPage';
import ConductedTest from './Interviewee/ConductedTest';
import HostMeeting from './Interviewer/HostMeeting';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Navbar from './Interviewee/Navbar/Navbar';
import Footer from './Footer'
import 'bootstrap/dist/css/bootstrap.min.css';

// const MainContainer = styled('div')({
//     marginLeft: 240, // Adjust this value according to the width of your Sidebar
//     flexGrow: 1,
// });

export const AppContext = createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true' || false);
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [userName, setUserName] = useState(localStorage.getItem('userName'));

    return (
        <PrimeReactProvider>
            <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, userName, setUserName }}>
        <div className="App">
            <BrowserRouter>
                {isLoggedIn && <ResponsiveAppBar />}
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
                        <Route path="/interviewee-navbar" element={<Navbar />} />
                        <Route path="/footer" element={<Footer />} />
                    </Routes>
                {/* </MainContainer> */}
            </BrowserRouter>
        </div>
        </AppContext.Provider>
        </PrimeReactProvider>
    );
}

export default App;
