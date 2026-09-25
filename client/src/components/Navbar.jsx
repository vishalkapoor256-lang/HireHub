import React from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Search } from 'lucide-react'
import "./Navbar.css"

const Navbar = () => {
  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>

            <Link to="/" className='navbar-logo'>
            <BriefcaseBusiness size={28} />
            <span>HireHub</span>
            </Link>

            <div className='navbar-search'>
                <Search size={18} />
                <input type="text" placeholder='Search jobs...' />
            </div>

            <div className='navbar-links'>
                <Link to="/">Home</Link>
                <Link to="/jobs">Find Jobs</Link>
                <Link to="/login">Login</Link>
                <Link to="/register" className='navbar-register'>Get Started</Link>
            </div>

        </div>
      </nav>
    </>
  )
}

export default Navbar
