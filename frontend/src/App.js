import {
  BrowserRouter,Route,Routes
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./DashBoard";
import VideoCall from "./VideoCall";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meeting" element={<VideoCall/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
