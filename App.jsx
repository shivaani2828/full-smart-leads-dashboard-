import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { GigProvider } from './context/GigContext';
import { BidProvider } from './context/BidContext';
import { Navbar } from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GigDetails from './pages/GigDetails.jsx';
import CreateGig from './pages/CreateGig.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/PrivateRoute.jsx';

function App() {

  return (
    <Router>
      <AuthProvider>
        <GigProvider>
          <BidProvider>
            <div className="min-h-screen ">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gigs/:id" element={<GigDetails />} />

                <Route path="/create-gig" element={
                    <ProtectedRoute>
                      <CreateGig />
                    </ProtectedRoute>
                  }/>
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }/>
                
              </Routes>
            </div>
            
            
          </BidProvider>
        </GigProvider>
      </AuthProvider>
      
    </Router>
    
  )
}

export default App
