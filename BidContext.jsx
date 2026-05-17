import { createContext, useContext, useState } from 'react';
import API from '../utils/api.js';

const BidContext = createContext();

export function BidProvider({ children }) {
  const [bids, setBids] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create bid
  async function createBid(bidData) {
    try {
      setLoading(true);
      setError(null);
      const res = await API.post('/bids', bidData);
      setBids([...bids, res.data]);
      return res;
    } catch (err) {
      setError(err.message || 'Failed to submit bid');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function getBidsForGig(gigId) {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/bids/${gigId}`);
      setBids(res.data || []);
      return res;
    } catch (err) {
      setError(err.message || 'Failed to fetch bids');
      setBids([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Get my bidS
  async function getMyBids() {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/bids/my-bids');
      setMyBids(res.data || []);
      return res;
    } catch (err) {
      setError(err.message || 'Failed to fetch your bids');
      setMyBids([]);
      throw err;
    }
    finally {
      setLoading(false);
    }
  }

  // Hire bid 
  async function hireBid(bidId) {
    try {
      setLoading(true);
      setError(null);
      const res = await API.patch(`/bids/${bidId}/hire`);
      setBids(bids.map(bid => {
        if (bid._id === bidId) {
          return { ...bid, status: 'hired' };
        } else if (bid.status === 'pending') {
          return { ...bid, status: 'rejected' };
        }
        return bid;
      }));

      return res;
    } catch (err) {
      setError(err.message || 'Failed to hire freelancer');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteBid(bidId) {
    try {
      await API.delete(`/bids/${bidId}`);
      setMyBids(myBids.filter(bid => bid._id !== bidId));
    } catch (err) {
      setError(err.message || 'Failed to delete bid');
      throw err;
    }
  }

  function clearBids() {
    setBids([]);
  }
  function clearError() {
    setError(null);
  }


  const value = {
    bids,
    myBids,
    loading,
    error,
    createBid,
    getBidsForGig,
    getMyBids,
    hireBid,
    deleteBid,
    clearBids,
    clearError,
  };

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
}

export function useBid() {
  return useContext(BidContext);
}