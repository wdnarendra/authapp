import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
export default function App(){
    return (
      <Router>
         <Routes>
          <Route  path="/signup" element={<SignUp />}/>
          <Route path="/" element={<Login />}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>

      </Router>  
    );
}
