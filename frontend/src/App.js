import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./DashBoard";
import VideoCall from "./VideoCall";
import JoinRoom from "./JoinRoom";
import Compiler from "./Compiler";
import Canvas from "./Canvas";
import AddTestForm from "./AddTestForm";
import AddProblemForm from "./AddProblemForm";
import TestList from "./TestList";
import Test from "./Test";
import UserPage from "./containers/UserPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meeting" element={<VideoCall />} />
          <Route path="/join_room" element={<JoinRoom />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/whiteBoard" element={<Canvas />} />
          <Route path="/add-problem/:testId" element={<AddProblemForm />} /> {/* Modified route */}
          <Route path="/add-test" element={<AddTestForm />} />
          <Route path="/tests" element={<TestList />} />
          <Route path="/test/:testId" element={<Test />} /> {/* Modified route */}
          <Route path="/github" element={<UserPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
