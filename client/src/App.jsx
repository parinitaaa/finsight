import  {useState} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route,Navigate} from 'react-router-dom';
import Navbar from "./components/NavBar";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddExpense from './pages/AddExpense';
import ViewExpenses from './pages/ViewExpenses';  
import UpdateExpense from './pages/UpdateExpense';
import ViewOneExpense from "./pages/ViewOneExpense";
import { useEffect } from 'react';

axios.defaults.withCredentials=true;


function App() {
  const [user,setUser]=useState(null);
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    //check if user is logged in
    const fetchUser=async()=>{  
      try{
        const response=await axios.get("http://localhost:5000/api/auth/me")
        setUser(response.data);
      }catch(err){
        setUser(null);
      }finally{
        setLoading(false);
      }
    } 
    fetchUser();
  },[]);
  
  if(loading){
    return <div>Loading...</div>
  }
  console.log("user:", user, "loading:", loading);

  return (
    <Router>
      <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route path="/login" element={<Login setUser={setUser}  />} />
        <Route path="/register" element={<Register setUser={setUser}  />} />
        <Route path="/add-expense"  element={user ? <AddExpense user={user} /> : <Navigate to="/login" />}/>
        <Route path="/view-expenses" element={user ? <ViewExpenses user={user} /> : <Navigate to="/login" />}/>
        <Route path="/update-expense/:id" element={<UpdateExpense />} />
        <Route path="/view-expense/:id" element={<ViewOneExpense />} />

      </Routes>
    </Router>
  )
}

export default App;
