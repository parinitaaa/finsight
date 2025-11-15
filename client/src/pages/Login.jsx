import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const Login = ({setUser}) => {
   const [form,setForm]=useState({
    email:"",
    password:"",
   })
   const [error,setError]=useState("")
   const navigate=useNavigate();


   const handleSubmit=async(e)=>{
    e.preventDefault();
      try{
        const res=await axios.post("http://localhost:5000/api/auth/login",form);
        setUser(res.data.user);
        navigate("/");
      }
      catch(err){
        setError("invalid credentials");
      }
   }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
        <form className="bg-white p-8 rounded-xl shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" placeholder="email" className="border p-2 w-full
        mb-3" value={form.email} onChange={(e)=>setForm({...  form,email:e.target.value})} /> <br />
        <input type="password" placeholder="password" className="border p-2 w-full
        mb-3" value={form.password} onChange={(e)=>setForm({... form,password:e.target.value})} /> <br />
        <button className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition
        w-full">Login</button>
          <br />
          </form>
     </div>
  )
}

export default Login