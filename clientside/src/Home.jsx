import { useNavigate,useLocation } from "react-router-dom"
import React from "react"
import { useState ,useEffect } from "react";
export default  function Home (){
    const navigate = useNavigate()
    let [userstate,setuser]=useState({});
   const location = useLocation()
   useEffect(()=>{

    if(!location.state)
    {
        // console.log("on location null running")
    
        if(!userstate.verify){
    // console.log("request send")
    fetchdata()}}
    else{
      //  console.log(location.state)
        localStorage.setItem("jsontoken",location.state.jsontoken)
        setuser(location.state)
    }
   },[])
   async function fetchdata (){if (localStorage.getItem("jsontoken"))
   {
        const options ={
            method:'POST',
            header:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({"jsontoken":localStorage.getItem("jsontoken")})
        }
       await fetch('http://127.0.0.1/verifyjwt',options).then(res=>res.json()).then(data=>{
       if(data.verify==="false"){
        localStorage.clear()
            navigate("/")
        }   
        else 
       setuser(data)
            
        })
   
    }
    else
    navigate("/")
}

if(userstate.userid)
    return <><h1>welcome {userstate.userid}</h1>
    <button onClick={()=>{
        localStorage.clear()
        navigate("/")
    }}>SignOut</button>
    </>
   }


