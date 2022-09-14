import { useState } from "react";
import './App.css';
import { Link ,useNavigate} from "react-router-dom";
import show from './view.svg';
import hide from './hide.svg';
export default function Login(){
   const navigate = useNavigate()
   const [error,seterror]=useState("false")
    const [eye,seteye]=useState(hide);
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    const [type,settype]=useState("password");
    const emailchange=(event)=>{
      // console.log(event)
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
        const checkuser = async()=>{
          const body = JSON.stringify({username:email,password:password})
const options ={
  method:"POST",
  header:{
    'Content-Type':"application/json",
  },
  body:body
}

await fetch("http://127.0.0.1:80/login",options).then(res=>res.json()).then(data=>{
if(data.data==="false"){
seterror("true")
}
else  
navigate('/home',{state:data})})
        }
    return (
      
      <div className="App">
        <div className="App-div">
         <label style={{fontWeight: "bold",fontSize:"2.5em",marginBottom:"1em"}} >Login</label>
          <input type="text" name="email" value={email} onChange={emailchange}/>
          <label  style={{fontWeight:"bold",fontSize:"1.5em"}}>UserId</label>
          <input type={type} name="password" value={password} onChange={passchange}/>
          <label style={{fontWeight:"bold",fontSize:"1.5em"}}>Password</label>
          <img alt ="eye" src={eye} style={{height:"30px",marginTop:"3em"}} onClick={eyechange}/>
          <button onClick={checkuser}>Login</button>
          <label style={{marginTop:"1em",fontWeight:"bold",fontSize:"1.5em"}}>Sign Up?</label>
          <Link style={{fontWeight:"bold",fontSize:"1.5em",marginTop:"1em"}} to="/signup">Sign Up</Link>
          {(error==="true")?<h2>Wrong Data</h2>:<></>}
        </div>
      </div>
    );
  }
  