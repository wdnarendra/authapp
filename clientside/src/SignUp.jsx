import show from './view.svg';
import './App.css';
import hide from './hide.svg';
import {useState,} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function SignUp() {
  let userdata;
  const navigate = useNavigate()
  const [eye,seteye]=useState(hide);
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  const [type,settype]=useState("password");

  const emailchange=(event)=>{
    
    setemail(event.target.value);
   }
   const eyechange = ()=>{
    if(eye===show){
    seteye(hide);
    settype("password")
  }
    else{
    seteye(show)
    settype("text")
    }
   };
      const passchange = event =>{setpassword(event.target.value);}
const createuser = async()=>{
  const bodyitmes= JSON.stringify({username:email,password:password})

  const options = {
    method:'POST',
    header:{
      'Content-Type':'application/json'
    },
    body:bodyitmes
  }
   await fetch("http://127.0.0.1/jsoncreateuser",options).then(res=>res.json()).then(data=>{
    userdata = data
    
  })
 
  navigate("/home",{state:userdata})
}
  return (
    <div className="App">
      <div className="App-div">
       <label style={{fontWeight: "bold",fontSize:"2.5em",marginBottom:"1em"}} >Sign Up</label>
        <input type="text" name="email" value={email} onChange={emailchange}/>
        <label  style={{fontWeight:"bold",fontSize:"1.5em"}}>Email</label>
        <input type={type} name="password" value={password} onChange={passchange}/>
        <label style={{fontWeight:"bold",fontSize:"1.5em"}}>Password</label>
        <img alt="eye" src={eye} style={{height:"30px",marginTop:"3em"}} onClick={eyechange}/>
    <button onClick={()=>createuser()}  >SIGN UP</button>  
        <label style={{marginTop:"1em",fontWeight:"bold",fontSize:"1.5em"}}>Already a user?</label>
        <Link style={{fontWeight:"bold",fontSize:"1.5em",marginTop:"1em"}} to={"/"}  >LOGIN</Link>
      </div>
    </div>
  );
}

export default SignUp;
