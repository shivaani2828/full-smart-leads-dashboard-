# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace where clients can post gigs and freelancers can bid on them.


- **Frontend:** [Vercel URL](https://account-manager-vite.vercel.app/)
- **Backend API:** [Render URL](https://gigflow-qmpm.onrender.com/)




## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based auth with HttpOnly cookies
- ✅ **Gig Management** - Full CRUD operations for job postings
- ✅ **Search & Filter** - Search gigs by title
- ✅ **Bidding System** - Freelancers can submit bids with message and price
- ✅ **Hiring Workflow** - Atomic hiring logic with status updates

### Bonus Features
- ⭐ **MongoDB Transactions** - Race condition prevention during hiring
- ⭐ **Real-time Notifications** - Socket.io for instant updates when hired
- ⭐ **Responsive Design** - Mobile-friendly UI with Tailwind CSS

### User Roles
- **Client** - Post gigs, review bids, hire freelancers
- **Freelancer** - Browse gigs, submit bids
- **Fluid Roles** - Any user can be both client and freelancer

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **Routing:** React Router v6
- **HTTP Client:** Fetch API
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with HttpOnly cookies
- **Real-time:** Socket.io
- **Security:** bcryptjs, cookie-parser, CORS

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

