import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';


const NavBar = ({user,setUser}) => {
 const navigate=useNavigate();
    const handleLogout = async () => 
        {
        await axios.post("http://localhost:5000/api/auth/logout");
        setUser(null);
        navigate('/')
    }


  return (
    <nav className="bg-gray-800 p-4 text-white">
        <Link to ="/" className="font-bold">
        Home Page
        </Link>
        <div>
            {user ? (<button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">logout</button>) :
             (<><Link to="/login" className="mx-2">Login</Link> 
                <Link to="/register" className="mx-2">Register</Link>
             </>)
            }
        </div>
    </nav>
  );
};

export default NavBar;