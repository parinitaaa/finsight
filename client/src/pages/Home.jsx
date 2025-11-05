import React from 'react'
import { Link } from 'react-router-dom'

const Home = ({user,error}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div>
            {error && <p className='text-red-500'>{error}</p>  }
           {user ?(<div><h2 className='text-3xl font-bold mb-4 text-gray-800'>Welcome back, {user.name}!</h2>
           <p className='text-gray-600'>email:{user.email}</p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/add-expense"
                className="text-white bg-green-500 px-5 py-3 rounded-md hover:bg-green-600 transition"
              >
                ➕ Add an Expense
              </Link>

              <Link
                to="/view-expenses"
                className="text-white bg-blue-500 px-5 py-3 rounded-md hover:bg-blue-600 transition"
              >
                📋 View All Expenses
              </Link>
              </div>
           </div>) : 

           (<div><h2 className='text-3xl font-bold mb-6 text-gray-800'>Welcome to FinSight Dashboard 🎉</h2> 
           <div>
            <Link to= "/login" className="w-full text-white bg-blue-500 p-3 rounded-md hover:bg-blue-600">Login</Link>
            <Link to= "/register" className="w-full text-white bg-blue-500 p-3 rounded-md hover:bg-blue-600">Register</Link>
             </div>

           </div>
            
           )}
        </div>
    </div>
  )
}

export default Home
