 import React from 'react'
 import { Link } from "react-router-dom";
 import { Search, ArrowRight, Briefcase, Users, Building2 } from "lucide-react"
 
 const Home = () => {
   return (
     <>
     <main>

        <section className='hero'>
            <div className='hero-content'>
                <span className='hero-badge'>Find your next opportunity</span>

                <h1>Build yor career. <br /> Find your <span>dream job.</span> </h1>
                <p>Discover thousands of opportunities from companies looking for talented people like you.</p>

                <div className='hero-search'>
                    <div>
                        <Search size={20} />
                        <input type="text" placeholder='Job Title, skills or keywords' />
                    </div>

                    <div>
                        <input type="text" placeholder='Location' />
                    </div>

                    <Link to="/jobs">Search Jobs <ArrowRight size={18} /> </Link>
                </div>

            </div>
        </section>

        <section className='stats'>
            <div className='stat-card'> <Briefcase />
              <h2>10K+</h2>
              <p>Active Jobs</p> 
            </div>

            <div className='stat-card'> <Building2 />
              <h2>2K+</h2>
              <p>Companies</p> 
            </div>

            <div className='stat-card'> <Users />
              <h2>50K+</h2>
              <p>Job Seekers</p> 
            </div>

        </section>
     </main>
       
     </>
   )
 }
 
 export default Home
 