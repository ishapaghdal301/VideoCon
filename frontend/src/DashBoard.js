import React , {useContext} from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import './style.css';
import Sidebar from './SideBar';
import { AppContext } from './App';

const MainContainer = styled('div')({
    marginLeft: 240,
    flexGrow: 1,
});

const Dashboard = ({ name }) => {
  const { setIsLoggedIn, setRole, setUserName, isLoggedIn, userName } = useContext(AppContext);
  return (
    <>
      <Sidebar />
      <MainContainer>
        <div className="dashboard">
          <h1>Welcome, {userName}!</h1>
          <Link to="/host-meeting" className="button">Host Meeting</Link>
          <Link to="/meeting" className="button">New Meeting</Link>
          <Link to="/join_room" className="button">Join Meeting</Link>
          <Link to="/logout" className="button">Logout</Link>
        </div>
      </MainContainer>
    </>
  );
};

export default Dashboard;
