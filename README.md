 # HireHub 🚀

> A full-stack job recruitment platform built with the MERN stack.

HireHub is a modern job recruitment platform designed to connect job seekers and recruiters through a simple, organized, and user-friendly application.

Job seekers can discover jobs, manage their profiles, save jobs, apply for opportunities, track applications, receive personalized job recommendations, and analyze their resumes against specific job requirements.

Recruiters can create and manage job openings, view applicants, and manage the hiring process from a dedicated recruiter dashboard.

---

## ✨ Features

### 🔐 Authentication & Security

- OTP-based user registration
- Secure login using JWT authentication
- Protected routes
- Role-based authorization
- Jobseeker and recruiter roles
- Persistent login sessions
- Secure password handling

### 👨‍💻 Jobseeker Features

- Jobseeker dashboard
- Browse available jobs
- Search jobs by keywords
- Filter jobs by:
  - Location
  - Employment type
  - Workplace type
  - Experience level
- View detailed job information
- Save and unsave jobs
- Apply for jobs
- Prevent duplicate applications
- Track submitted applications
- View application status
- Manage professional profile
- View personalized job recommendations
- Analyze resume against a specific job

### 🏢 Recruiter Features

- Recruiter dashboard
- Create job postings
- Edit job postings
- Delete job postings
- Manage job status
- View applicants for posted jobs
- Update applicant status
- Add recruiter notes
- Manage the hiring workflow

### 🤖 Intelligent Job Recommendations

HireHub includes a rule-based job recommendation system.

The system compares a jobseeker's profile with available jobs using:

- Skills
- Experience
- Previous job titles
- Job category
- Experience level

It generates a match percentage and identifies:

- Matched skills
- Missing skills

> The current recommendation system is rule-based and does not use a trained machine-learning model or external AI API.

### 📄 Resume Analyzer

HireHub includes a rule-based resume analyzer.

Job seekers can paste their resume content and analyze it against a selected job.

The analyzer provides:

- Resume match percentage
- Matched skills
- Missing skills
- Improvement suggestions

The analyzer also checks whether the resume contains useful sections such as:

- Projects
- Experience
- Education

> The current Resume Analyzer uses rule-based text and skill matching.

### 👤 Profile Management

Job seekers can manage:

- Name
- Phone
- Location
- Bio
- Skills
- Education
- Work experience
- Resume URL

Recruiters can manage company-related information.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- React Hook Form
- Lucide React
- Recharts
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Helmet
- CORS
- dotenv

## Development & Testing

- Git
- GitHub
- VS Code
- Postman

---

# 🏗️ Application Architecture

```text
                    HireHub
                       │
          ┌────────────┴────────────┐
          │                         │
      Frontend                  Backend
       React.js              Node.js + Express
          │                         │
          │       REST API          │
          └────────────┬────────────┘
                       │
                    MongoDB

The frontend communicates with the Express backend through REST APIs.

The backend handles:

Authentication
Authorization
Job management
Applications
Profiles
Saved jobs
Recommendations
Resume analysis

MongoDB is used for persistent data storage.


📁 Project Structure

HireHub/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Jobs/
│   │   │   ├── JobDetails/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── ForgotPassword/
│   │   │   ├── Profile/
│   │   │   ├── MyApplications/
│   │   │   ├── SavedJobs/
│   │   │   ├── RecommendedJobs/
│   │   │   ├── ResumeAnalyzer/
│   │   │   ├── JobseekerDashboard/
│   │   │   ├── RecruiterDashboard/
│   │   │   ├── RecruiterCreateJob/
│   │   │   ├── RecruiterEditJob/
│   │   │   └── RecruiterApplicants/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

🔐 Authentication Flow

HireHub uses JWT-based authentication combined with OTP verification during registration.

User Registration
       ↓
OTP Verification
       ↓
Account Creation
       ↓
Login
       ↓
JWT Token
       ↓
Protected Routes
       ↓
Role-based Authorization

The application supports two main roles:

Jobseeker
Recruiter

Protected backend APIs verify the JWT token before allowing access.

💼 Job Application Workflow

Jobseeker
Browse Jobs
     ↓
Search / Filter
     ↓
View Job Details
     ↓
Save Job / Apply
     ↓
Track Application
     ↓
Monitor Application Status

Recruiter
Create Job
     ↓
Publish Job
     ↓
Receive Applications
     ↓
View Applicants
     ↓
Update Applicant Status
     ↓
Manage Hiring Process

Application statuses include:

Applied
Shortlisted
Interview
Hired
Rejected


🔌 API Overview

Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

Jobs
GET    /api/jobs
GET    /api/jobs/:id
GET    /api/jobs/my
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

Applications
POST   /api/applications/:jobId
GET    /api/applications/my
GET    /api/applications/check/:jobId
GET    /api/applications/job/:jobId
PUT    /api/applications/:applicationId/status

Profile
GET    /api/profile/me
PUT    /api/profile/me

Saved Jobs
POST   /api/saved-jobs/:jobId
DELETE /api/saved-jobs/:jobId
GET    /api/saved-jobs/my
GET    /api/saved-jobs/check/:jobId

Job Recommendations
GET    /api/job-matching/recommended

Resume Analyzer
POST   /api/resume/analyze

⚙️ Installation & Setup

1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd HireHub

2. Install backend dependencies
cd server
npm install

3. Configure backend environment variables

Create:

server/.env

Add the required variables used by your backend.

Example:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_email_app_password

Never commit your .env file to GitHub.

4. Start the backend
npm start

The backend runs on:

http://localhost:5000

5. Install frontend dependencies

Open another terminal:

cd client
npm install

6. Configure frontend environment variables

Create:

client/.env

Add:

VITE_API_URL=http://localhost:5000/api

7. Start the frontend
npm run dev

The frontend normally runs on:

http://localhost:5173

🧪 API Testing

Backend APIs were tested using Postman.

Testing included:

User registration
OTP verification
Login
JWT authentication
Protected routes
Role-based authorization
Job creation
Job editing
Job deletion
Job search
Job applications
Duplicate application prevention
Saved jobs
Applicant management
Job recommendations
Resume analysis


🚀 Future Improvements

Possible future improvements include:

Real AI/LLM-powered resume analysis
Machine-learning-based job recommendations
Resume PDF upload and parsing
Cloud resume storage
Interview scheduling
Advanced recruiter analytics
Candidate ranking
Real-time notifications
Admin dashboard
Advanced candidate search
Job application timeline
Production deployment with a dedicated email API
🎯 What I Learned

Through this project, I gained practical experience in:

Building a full-stack MERN application
Designing REST APIs
React component architecture
React Router
Axios API integration
MongoDB database design
Mongoose models and queries
JWT authentication
OTP verification
Role-based authorization
Protected routes
CRUD operations
Form handling
Application workflows
Git and GitHub
API testing with Postman
Building responsive user interfaces
Implementing rule-based recommendation systems
Implementing resume analysis logic


👨‍💻 Author
Vishal Kapoor

Full-Stack Developer focused on building modern web applications using the MERN stack.

Technologies

React.js • Node.js • Express.js • MongoDB • JavaScript

⭐ If you like this project

Give the repository a ⭐ on GitHub.


### Before you save it

There are **2 things you need to change**:

**1. Repository URL**

Find:

```text
YOUR_GITHUB_REPOSITORY_URL

and replace it with your actual GitHub repository URL.