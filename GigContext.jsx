import { createContext, useContext, useState } from "react";
import API from "../utils/api.js";

const GigContext = createContext();

export function GigProvider({ children }) {
  const [gigs, setGigs] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [currentGig, setCurrentGig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function getGigs(searchQuery = "") {
  setLoading(true);
  setError(null);
  try {
    const data = await API.get(`/gigs?search=${searchQuery}`);
    setGigs(data.gigs || []); 
    return data;
  } catch (err) {
    setError(err.message || "Failed to fetch gigs");
    throw err;
  } finally {
    setLoading(false);
  }
}

async function getGig(gigId) {
  setLoading(true);
  setError(null);
  try {
    const data = await API.get(`/gigs/${gigId}`);
    setCurrentGig(data.gig); 
    return data;
  } catch (err) {
    setError(err.message || "Failed to fetch gig");
    throw err;
  } finally {
    setLoading(false);
  }
}

async function createGig(gigData) {
  setLoading(true);
  setError(null);
  try {
    const res = await API.post("/gigs", gigData);
    const newGig = res.data; 
    setGigs(prev => [newGig, ...(prev || [])]);
    setMyGigs(prev => [newGig, ...(prev || [])]);
    setMessage("Gig created successfully");
    return res;
  } catch (err) {
    setError(err.response?.data?.message || "Failed to create gig");
    throw err;
  } finally {
    setLoading(false);
  }
}

async function getMyGigs() {
  setLoading(true);
  setError(null);
  try {
    const data = await API.get("/gigs/my");  
    setMyGigs(data.gigs || []); 
  } catch (err) {
    setError(err.message || "Failed to fetch your gigs");
    throw err;
  } finally {
    setLoading(false);
  }
}

  async function deleteGig(gigId) {
    setLoading(true);
    setError(null);
    try {
      await API.delete(`/gigs/${gigId}`);
      setMyGigs(prev => prev.filter(gig => gig._id !== gigId));
      setMessage("Gig deleted successfully");
    } catch (err) {
      setError(err.message || "Failed to delete gig");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function clearCurrentGig() {
    setCurrentGig(null);
  }

  return (
    <GigContext.Provider
      value={{
        gigs,
        myGigs,
        currentGig,
        loading,
        error,
        message,
        getGigs,
        getGig,
        createGig,
        getMyGigs,
        deleteGig,
        clearCurrentGig,
      }}
    >
      {children}
    </GigContext.Provider>
  );
}

export function useGig(){
    return useContext(GigContext);
} 
